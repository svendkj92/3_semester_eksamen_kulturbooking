<script setup>
import { ref, computed } from 'vue'
import { registerUser, sendVerificationEmail } from '@/services/authService'
import OnboardingRoleSelection from '@/components/OnboardingRoleSelection.vue'
import OnboardingInterestSelection from '@/components/OnboardingInterestSelection.vue'
import OnboardingProfileSetup from '@/components/OnboardingProfileSetup.vue'

const name = ref('')
const email = ref('')
const password = ref('')
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
const currentStep = ref(1)
const isOnboardingOpen = ref(true)
const selectedRole = ref('')
const selectedInterests = ref([])
const profileBio = ref('')
const profileImage = ref(null)

async function handleSignup() {
  if (!isFormValid.value || isSigningUp.value || verificationEmailSent.value) {
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

    await sendVerificationEmail(user)

    verificationEmailSent.value = true
    password.value = ''
  } catch (error) {
    console.error('Signup failed:', error.code || error.message)

    signupError.value =
      'Registreringen kunne ikke gennemføres. Prøv igen eller kontakt os.'
  } finally {
    isSigningUp.value = false
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
  if (!selectedRole.value) {
    selectedRole.value = 'udforsker'
  }
  isOnboardingOpen.value = false
}

function finishOnboarding() {
  closeOnboarding()
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
                  />
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
                    :class="{ 'input-error': passwordTouched && password && !isPasswordValid }"
                  />
                  <p
                    v-if="passwordTouched && password && !isPasswordValid"
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
                :disabled="!isFormValid || isSigningUp || verificationEmailSent"
             >
                {{ isSigningUp ? 'Opretter konto...' : 'Opret konto' }}
             </button>

             <p v-if="signupError" class="email-error" role="alert">
                 {{ signupError }}
             </p>

             <p v-if="verificationEmailSent" class="email-success">
                En bekræftelsesmail er sendt til {{ email }}. Tjek din indbakke for at bekræfte din e-mailadresse.
             </p>
         </form>

          <div 
            v-if="emailVerified && isOnboardingOpen"
            class="onboarding-overlay">

             <button
               type="button"
               aria-label="Luk onboarding"
               @click="closeOnboarding"
             >
                 x
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
                    <button
                        v-if="currentStep > 1"
                        @click="previousStep"
                    >
                        Tilbage
                    </button>
                    <button
                        v-if="currentStep < 3"
                        @click="nextStep"
                    >
                        Næste
                    </button>
                    <button
                        v-if="currentStep === 3"
                        @click="finishOnboarding"
                        type="button"
                    >
                        Afslut
                    </button>
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
  padding: 24px 16px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #64748B;
  }
}

.email-login {
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    width: 100%;
    min-height: 44px;
    padding: 8px 16px;
    border: 1px solid $hero-text-color;
    border-radius: 4px;
    box-sizing: border-box;

    &.input-error {
      border-color: #DC2626;
    }
  }
}
.email-error {
  color: #DC2626;
}
.email-success {
  color: #166534;
}

</style>