<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  registerUser,
  sendVerificationEmail,
  observeAuthState
} from '@/services/authService'
import { reload } from 'firebase/auth'
import {
  getUserProfile,
  createUserProfile
} from '@/services/userService'
import { auth } from '@/services/firebase'
import OnboardingRoleSelection from '@/components/OnboardingRoleSelection.vue'
import OnboardingInterestSelection from '@/components/OnboardingInterestSelection.vue'
import OnboardingProfileSetup from '@/components/OnboardingProfileSetup.vue'

const router = useRouter()
const route = useRoute()
const name = ref('')
const email = ref('')
const password = ref('')
const nameTouched = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})
const isNameValid = computed(() => {
  return name.value.trim().length > 0
})
const isPasswordValid = computed(() => {
  return password.value.length >= 6
})
const isFormValid = computed(() => {
  return isNameValid.value &&
    isEmailValid.value &&
    isPasswordValid.value
})
const emailVerified = ref(false)
const isSigningUp = ref(false)
const signupError = ref('')
const verificationEmailSent = ref(false)
const verificationEmailResent = ref(false)
const registeredUser = ref(null)
const isCheckingVerification = ref(false)
const isCheckingProfile = ref(false)
const hasExistingProfile = ref(false)
const currentStep = ref(1)
const isOnboardingOpen = ref(true)
const selectedRole = ref('')
const selectedInterests = ref([])
const profileBio = ref('')
const profileImage = ref(null)
const isSavingProfile = ref(false)
const profileSaveError = ref('')
let unsubscribeAuth = null

async function checkProfileStatus(user) {
  isCheckingProfile.value = true
  hasExistingProfile.value = false

  try {
    const profile = await getUserProfile(user.uid)

    if (auth.currentUser?.uid !== user.uid) return

    hasExistingProfile.value = profile !== null
    isOnboardingOpen.value = profile === null
  } catch (error) {
    console.error('Profile check failed:', error)

    isOnboardingOpen.value = false
    signupError.value =
      'Vi kunne ikke hente din profil. Prøv igen senere.'
  } finally {
    isCheckingProfile.value = false
  }
}

onMounted(() => {
  unsubscribeAuth = observeAuthState((user) => {
    if (user) {
      if (registeredUser.value?.uid !== user.uid) {
        verificationEmailSent.value = false
      }

      registeredUser.value = user
      email.value = user.email || ''
      emailVerified.value = user.emailVerified
      if (user.emailVerified) {
        void checkProfileStatus(user)
      }
    } else {
      registeredUser.value = null
      emailVerified.value = false
      verificationEmailSent.value = false
    }
  })
})

onUnmounted(() => {
  unsubscribeAuth?.()
})

async function handleSignup() {
  if (
  !isFormValid.value ||
  isSigningUp.value ||
  registeredUser.value ||
  verificationEmailSent.value
  ) {
  return
  }

  isSigningUp.value = true
  signupError.value = ''

  try {
    const user = await registerUser(
      name.value.trim(),
      email.value.trim(),
      password.value
    )
    registeredUser.value = user

    await sendVerificationEmail(user)

    verificationEmailSent.value = true
    password.value = ''
  } catch (error) {
    console.error('Signup failed:', error.code || error.message)

   if (registeredUser.value) {
  signupError.value =
    'Din konto er oprettet, men vi kunne ikke sende bekræftelsesmailen. Prøv at sende den igen.'
  } else {
    switch (error.code) {
      case 'auth/email-already-in-use':
        signupError.value =
          'Denne e-mailadresse er allerede i brug. Log ind eller brug en anden e-mail.'
        break
      case 'auth/invalid-email':
        signupError.value = 'E-mailadressen er ugyldig. Kontrollér den og prøv igen.'
        break
      case 'auth/weak-password':
        signupError.value =
          'Adgangskoden skal være mindst 6 tegn lang.'
        break
      case 'auth/network-request-failed':
        signupError.value =
          'Netværksfejl. Kontrollér din internetforbindelse og prøv igen.'
        break
      default:
        signupError.value =
          'Vi kunne ikke oprette din konto. Prøv igen senere.'
    }
  }
  } finally {
    isSigningUp.value = false
  }
}

async function resendVerificationEmail() {
  if (
    !registeredUser.value ||
    isSigningUp.value ||
    emailVerified.value
  ) return

  isSigningUp.value = true
  signupError.value = ''

  try {
    await sendVerificationEmail(registeredUser.value)

    verificationEmailSent.value = true
    verificationEmailResent.value = true
    password.value = ''
  } catch (error) {
    verificationEmailResent.value = false
    console.error('Verification email failed:', error)
    
    signupError.value =
      'Vi kunne ikke sende bekræftelsesmailen. Prøv igen senere.'
  } finally {
    isSigningUp.value = false
  }
}

async function checkEmailVerification() {
  if (isCheckingVerification.value) return

  isCheckingVerification.value = true
  signupError.value = ''

  try {
    const user = auth.currentUser

    if (!user) {
      signupError.value = 'Du er ikke logget ind. Log ind igen for at fortsætte.'
      return
    }

    await reload(user)

    if (user.emailVerified) {
      emailVerified.value = true
      await checkProfileStatus(user)
    } else {
      signupError.value = 'Din e-mail er endnu ikke bekræftet. Tjek din indbakke.'
    }
  } catch (error) {
    console.error('Email verification check failed:', error)
    signupError.value = 'Vi kunne ikke kontrollere din e-mail. Prøv igen.'
  } finally {
    isCheckingVerification.value = false
  }
}

function nextStep() {
  if (currentStep.value === 1 && !selectedRole.value) {
    selectedRole.value = 'udforsker'
  }
  if (currentStep.value < 3) {
    currentStep.value++
  }
}
function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function closeOnboarding() {
  void finishOnboarding()
}

async function finishOnboarding() {
  if (isSavingProfile.value || hasExistingProfile.value) return

  const user = auth.currentUser

  if (!user || !user.emailVerified) {
    profileSaveError.value = 'Du skal bekræfte din e-mail først.'
    return
  }

  isSavingProfile.value = true
  profileSaveError.value = ''

  try {
    await createUserProfile(user, selectedInterests.value, {
      role: selectedRole.value || 'udforsker',
      bio: profileBio.value.trim()
    })

    hasExistingProfile.value = true
    isOnboardingOpen.value = false

    const redirect = route.query.redirect
    const isEventPath =
     typeof redirect === 'string' &&
     /^\/events\/[^/?#]+$/.test(redirect)

    await router.push(isEventPath ? redirect : '/profile')
  } catch (error) {
    console.error('Profile save failed:', error)

    profileSaveError.value =
      'Vi kunne ikke gemme din profil. Prøv igen.'
  } finally {
    isSavingProfile.value = false
  }
}

</script>

<template>
  <div class="signup-page">
    
     <section class="signup-content">

        <h1>Velkommen til KulturBooking!</h1>

        <div class="social-login">

          <button type="button">
            Fortsæt med Apple
          </button>

          <button type="button">
            Fortsæt med Google
          </button>

        </div>

        <div class="divider">
          <span>Eller</span>
        </div>

        <form class="email-login" novalidate @submit.prevent="handleSignup">

          <div class="name-field">

            <label for="name">Navn</label>

            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="Indtast dit navn"
              required
              @blur="nameTouched = true"
              :class="{ 'input-error': nameTouched && !isNameValid }"
            />

            <p
              v-if="nameTouched && !isNameValid"
              class="email-error">
              Indtast venligst dit navn.
            </p>

          </div>

          <label for="email">E-mail</label>

          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="Indtast din e-mailadresse"
            @blur="emailTouched = true"
            :class="{
            'input-error': emailTouched && email && !isEmailValid
            }"
          />

          <p
            v-if="emailTouched && email && !isEmailValid"
            class="email-error">
            Indtast venligst en gyldig e-mailadresse.
          </p>
              
          <div class="password-field">

            <label for="password">Adgangskode</label>

            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="Opret en adgangskode"
              minlength="6"
              required
              @blur="passwordTouched = true"
              :class="{ 'input-error': passwordTouched && !isPasswordValid && !verificationEmailSent }"
            />

            <p
              v-if="passwordTouched && !isPasswordValid && !verificationEmailSent"
              class="email-error">
              Adgangskoden skal være mindst 6 tegn lang.
            </p>

          </div>

          <p class="privacy-policy">
            Ved at fortsætte accepterer du vores
            <a href="#">Privatlivspolitik</a>.
          </p>

          <button
            type="submit"
            :disabled="!isFormValid || isSigningUp || registeredUser || verificationEmailSent"
          >
           {{ isSigningUp ? 'Opretter konto...' : 'Opret konto' }}
          </button>

          <p v-if="signupError" class="email-error" role="alert">
            {{ signupError }}
          </p>

          <p
           v-if="verificationEmailSent && !emailVerified"
           class="email-success"
           role="status"
          >
           En bekræftelsesmail er sendt til {{ email }}.
           Tjek din indbakke for at bekræfte din e-mailadresse.
          </p>

          <button
            v-if="registeredUser && !emailVerified"
            type="button"
            @click="resendVerificationEmail"
            :disabled="isSigningUp"
          >
            Send bekræftelsesmail igen
          </button>

          <p
           v-if="verificationEmailResent && !emailVerified"
           class="email-success"
           role="status"
          >
           Bekræftelsesmailen er sendt igen til {{ email }}.
          </p>

          <p 
           v-if="registeredUser && !emailVerified && !verificationEmailSent"
           role="status"
          >
           Din konto er oprettet, men din e-mail er endnu ikke bekræftet.
           Du kan sende en bekræftelsesmail eller kontrollere, om du allerede har bekræftet den.
          </p>

          <button
            v-if="registeredUser && !emailVerified"
            type="button"
            @click="checkEmailVerification"
            :disabled="isCheckingVerification"
          >
            {{ isCheckingVerification ? 'Kontrollerer...' : 'Jeg har bekræftet min e-mail' }}
          </button>

        </form>

        <p 
         v-if="isCheckingProfile"
          class="profile-loading"
          role="status"
        >
          Tjekker om du allerede har en profil...
        </p>

        <div 
          v-if="emailVerified && !hasExistingProfile && !isCheckingProfile && isOnboardingOpen"
          class="onboarding-overlay">

          <button
            type="button"
            aria-label="Spring resten over og gem profil"
            @click="closeOnboarding"
            :disabled="isSavingProfile"
          >
           {{ isSavingProfile ? '...' : '×' }}
          </button>

          <p class="onboarding-progress">
            Trin  {{ currentStep }} af 3
          </p>

          <OnboardingRoleSelection 
            v-if="currentStep === 1"
            v-model="selectedRole"
          />
          <OnboardingInterestSelection 
            v-else-if="currentStep === 2" 
            v-model="selectedInterests"
          />
          <OnboardingProfileSetup 
            v-else-if="currentStep === 3" 
            v-model:bio="profileBio"
            v-model:image="profileImage"
          />

          <div class="onboarding-navigation">

            <p
              v-if="isSavingProfile"
              class="profile-loading"
              role="status"
            >
              Gemmer profil...
            </p>

            <button
              v-if="currentStep > 1"
              @click="previousStep"
              :disabled="isSavingProfile"
            >
              Tilbage
            </button>

            <button
              v-if="currentStep < 3"
              @click="nextStep"
              :disabled="isSavingProfile"
            >
              Næste
            </button>

            <button
              v-if="currentStep === 3"
              @click="finishOnboarding"
              type="button"
              :disabled="isSavingProfile"
            >
              {{ isSavingProfile ? 'Gemmer profil...' : 'Afslut' }}
            </button>

            <p v-if="profileSaveError" 
            class="email-error" 
            role="alert">
              {{ profileSaveError }}
            </p>
          </div>
        </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.signup-page {
  min-height: 100vh;
  background-color: $background-color;
}

.signup-content {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: $space-4 $page-margin-mobile $space-6;
}

.signup-content h1 {
  font-family: $font-heading;
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  line-height: $line-height-title;
  margin-bottom: $space-4;
  color: $hero-text-color;
  text-align: center;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.divider {
  display: flex;
  align-items: center;
  gap: $space-3;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: $border-width-input;
    background-color: $secondary-color;
  }
}

.email-login {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  input {
    width: 100%;
    min-height: $min-touch-target;
    padding: $space-2 $space-3;
    border: $border-width-input solid $hero-text-color;
    border-radius: $radius-input;
    font: inherit;
    background-color: #ffffff;
    color: $hero-text-color;

    &.input-error {
      border-color: $error-color;
    }
  }
}

.email-login label {
  font-family: $font-body;
  font-weight: $font-weight-bold;
  font-size: $font-size-label;
  color: $hero-text-color;
}

.name-field,
.password-field {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.email-error {
  color: $error-color;
}
.email-success {
  color: $success-color;
}

.signup-content {
  input:focus-visible,
  button:focus-visible, 
  a:focus-visible {
    outline: none;
    box-shadow: 
    0 0 0 $focus-ring-inner $focus-ring-color, 
    0 0 0 ($focus-ring-outer + $focus-ring-inner) $focus-ring--outer-color;
  }
}
</style>