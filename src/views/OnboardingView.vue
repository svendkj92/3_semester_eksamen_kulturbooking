<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
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
    signupError.value = 'onboarding.errors.profileCheck'
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
      signupError.value = 'onboarding.errors.verificationSendAfterSignup'
    } else {
      switch (error.code) {
        case 'auth/email-already-in-use':
          signupError.value = 'onboarding.errors.emailInUse'
          break
        case 'auth/invalid-email':
          signupError.value = 'onboarding.errors.invalidEmail'
          break
        case 'auth/weak-password':
          signupError.value = 'onboarding.errors.weakPassword'
          break
        case 'auth/network-request-failed':
          signupError.value = 'onboarding.errors.network'
          break
        default:
          signupError.value = 'onboarding.errors.signup'
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

    signupError.value = 'onboarding.errors.verificationSend'
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
      signupError.value = 'onboarding.errors.notLoggedIn'
      return
    }

    await reload(user)

    if (user.emailVerified) {
      emailVerified.value = true
      await checkProfileStatus(user)
    } else {
      signupError.value = 'onboarding.errors.notVerified'
    }
  } catch (error) {
    console.error('Email verification check failed:', error)
    signupError.value = 'onboarding.errors.verificationCheck'
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

function goToStep(step) {
  if (isSavingProfile.value || step < 1 || step > 3) return

  if (step > 1 && !selectedRole.value) {
    selectedRole.value = 'udforsker'
  }

  currentStep.value = step
}

function closeOnboarding() {
  void finishOnboarding()
}

async function finishOnboarding() {
  if (isSavingProfile.value || hasExistingProfile.value) return

  const user = auth.currentUser

  if (!user || !user.emailVerified) {
    profileSaveError.value = 'onboarding.errors.verifyFirst'
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

    profileSaveError.value = 'onboarding.errors.profileSave'
  } finally {
    isSavingProfile.value = false
  }
}

</script>

<template>
  <div class="signup-page">

    <section class="signup-content">

      <h1>{{ t('onboarding.welcome') }}</h1>

      <div class="social-login">

        <button type="button">
          {{ t('onboarding.continueApple') }}
        </button>

        <button type="button">
          {{ t('onboarding.continueGoogle') }}
        </button>

      </div>

      <div class="divider">
        <span>{{ t('onboarding.or') }}</span>
      </div>

      <form class="email-login" novalidate @submit.prevent="handleSignup">

        <div class="name-field">

          <label for="name">{{ t('onboarding.name') }}</label>

          <input id="name" v-model="name" type="text" autocomplete="name" :placeholder="t('onboarding.namePlaceholder')"
            required @blur="nameTouched = true" :class="{ 'input-error': nameTouched && !isNameValid }" />

          <p v-if="nameTouched && !isNameValid" class="email-error">
            {{ t('onboarding.nameRequired') }}
          </p>

        </div>

        <label for="email">{{ t('onboarding.email') }}</label>

        <input id="email" v-model="email" type="email" autocomplete="email"
          :placeholder="t('onboarding.emailPlaceholder')" @blur="emailTouched = true" :class="{
            'input-error': emailTouched && email && !isEmailValid
          }" />

        <p v-if="emailTouched && email && !isEmailValid" class="email-error">
          {{ t('onboarding.emailInvalid') }}
        </p>

        <div class="password-field">

          <label for="password">{{ t('onboarding.password') }}</label>

          <input id="password" v-model="password" type="password" autocomplete="new-password"
            :placeholder="t('onboarding.passwordPlaceholder')" minlength="6" required @blur="passwordTouched = true"
            :class="{ 'input-error': passwordTouched && !isPasswordValid && !verificationEmailSent }" />

          <p v-if="passwordTouched && !isPasswordValid && !verificationEmailSent" class="email-error">
            {{ t('onboarding.errors.weakPassword') }}
          </p>

        </div>

        <p class="privacy-policy">
          {{ t('onboarding.privacyBefore') }}
          <a href="#">{{ t('onboarding.privacyLink') }}</a>{{ t('onboarding.privacyAfter') }}
        </p>

        <button type="submit" :disabled="!isFormValid || isSigningUp || registeredUser || verificationEmailSent">
          {{ t(isSigningUp ? 'onboarding.creatingAccount' : 'onboarding.createAccount') }}
        </button>

        <p v-if="signupError" class="email-error" role="alert">
          {{ t(signupError) }}
        </p>

        <p v-if="verificationEmailSent && !emailVerified" class="email-success" role="status">
          {{ t('onboarding.verificationSent', { email }) }}
        </p>

        <button v-if="registeredUser && !emailVerified" type="button" @click="resendVerificationEmail"
          :disabled="isSigningUp">
          {{ t('onboarding.resendVerification') }}
        </button>

        <p v-if="verificationEmailResent && !emailVerified" class="email-success" role="status">
          {{ t('onboarding.verificationResent', { email }) }}
        </p>

        <p v-if="registeredUser && !emailVerified && !verificationEmailSent" role="status">
          {{ t('onboarding.verificationPending') }}
        </p>

        <button v-if="registeredUser && !emailVerified" type="button" @click="checkEmailVerification"
          :disabled="isCheckingVerification">
          {{ t(isCheckingVerification ? 'onboarding.checking' : 'onboarding.confirmVerified') }}
        </button>

      </form>

      <p v-if="isCheckingProfile" class="profile-loading" role="status">
        {{ t('onboarding.checkingProfile') }}
      </p>

      <div v-if="emailVerified && !hasExistingProfile && !isCheckingProfile && isOnboardingOpen"
        class="onboarding-overlay">
        <div class="onboarding-panel">

        <button
  type="button"
  class="onboarding-close"
  :aria-label="t('onboarding.skipAndSave')"
  @click="closeOnboarding"
  :disabled="isSavingProfile"
>
  {{ isSavingProfile ? '...' : '×' }}
</button>

        
<div class="progress-steps" role="navigation" aria-label="Onboarding">
  <button
    v-for="step in 3"
    :key="step"
    type="button"
    class="progress-step"
    :class="{ 'progress-step--active': step === currentStep }"
    :aria-label="t('onboarding.progress', { currentStep: step })"
    :aria-current="step === currentStep ? 'step' : undefined"
    :disabled="isSavingProfile"
    @click="goToStep(step)"
  ></button>
</div>


        <OnboardingRoleSelection v-if="currentStep === 1" v-model="selectedRole" />
        <OnboardingInterestSelection v-else-if="currentStep === 2" v-model="selectedInterests" />
        <OnboardingProfileSetup v-else-if="currentStep === 3" v-model:bio="profileBio" v-model:image="profileImage" />

        <div class="onboarding-navigation">

          <p v-if="isSavingProfile" class="profile-loading" role="status">
            {{ t('onboarding.savingProfile') }}
          </p>


          <button v-if="currentStep > 1" class="onboarding-back" @click="previousStep" :disabled="isSavingProfile">
            {{ t('onboarding.back') }}
          </button>

          <button v-if="currentStep < 3" class="onboarding-next" @click="nextStep" :disabled="isSavingProfile">
            {{ t('onboarding.next') }}
          </button>

          <button v-if="currentStep === 3" class="onboarding-next" @click="finishOnboarding" type="button"
            :disabled="isSavingProfile">
            {{ t(isSavingProfile ? 'onboarding.savingProfile' : 'onboarding.finish') }}
          </button>


          <p v-if="profileSaveError" class="email-error" role="alert">
            {{ t(profileSaveError) }}
          </p>
        </div>
        </div>
      </div>
    </section>

    <div class="signup-image" aria-hidden="true">
      <img src="@/assets/img/hero_image.jpg" alt="" />
    </div>

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

.social-login button {
  width: 100%;
  min-height: $min-touch-target;
  padding: $space-2 $space-3;
  border-radius: $radius-button;
  font: inherit;
  cursor: pointer;
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

.email-login button[type="submit"] {
  width: 100%;
  min-height: $min-touch-target;
  padding: $space-2 $space-3;
  margin-top: $space-2;

  border: none;
  border-radius: $radius-button;

  background-color: $cta-color;
  color: $hero-text-color;

  font-family: $font-body;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;

  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: $cta-color-hover;
  }

  &:disabled {
    cursor: not-allowed;
  }
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
      0 0 0 $focus-ring-inner $focus-ring-inner-color,
      0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
  }
}

.signup-image {
  display: none;
}


.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: $space-3;
  background-color: rgba($hero-text-color, 0.65);
  overflow-y: auto;
}

.onboarding-panel {
  width: 100%;
  max-width: 600px;
  max-height: calc(100dvh - 2 * #{$space-3});
  overflow-y: auto;
    position: relative;

  padding: $space-5;
  border-radius: $radius-card;
  background-color: $background-color;
}


.onboarding-close {
  position: absolute;
  top: $space-3;
  right: $space-3;

  display: flex;
  align-items: center;
  justify-content: center;

  width: $min-touch-target;
  height: $min-touch-target;

  padding: 0;
  border: none;
  border-radius: $radius-button;
  background-color: transparent;

  color: $hero-text-color;
  font-family: $font-body;
  font-size: 1.75rem;
  line-height: 1;

  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: rgba($primary-color, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}


.onboarding-progress {
  margin-bottom: $space-4;
  padding-top: $space-5;

  p {
    margin-bottom: $space-3;
    font-family: $font-body;
    font-size: $font-size-label;
    color: $hero-text-color;
  }
}



.progress-steps {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-height: $min-touch-target;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: $hero-text-color;
    transform: translateY(-50%);
  }
}

.progress-step {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  width: $min-touch-target;
  height: $min-touch-target;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  &::before {
    content: "";
    width: 24px;
    height: 18px;
    border: 1px solid $hero-text-color;
    border-radius: 50%;
    background-color: $background-color;
  }

  &:hover:not(:disabled)::before {
    border-color: $primary-color-hover;
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.progress-step--active::before {
  background-color: $primary-color;
}



.onboarding-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
  margin-top: $space-5;

  button {
    min-height: $min-touch-target;
    padding: $space-2 $space-4;
    border: none;
    border-radius: $radius-button;
    font-family: $font-body;
    font-size: $font-size-body;
    font-weight: $font-weight-bold;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 $focus-ring-inner $focus-ring-inner-color,
        0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
    }
  }

  .onboarding-back {
    background-color: $primary-color;
    color: #FFFFFF;

    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
    }
  }

  .onboarding-next {
    background-color: $cta-color;
    color: $hero-text-color;

    &:hover:not(:disabled) {
      background-color: $cta-color-hover;
    }
  }

  .profile-loading,
  .email-error {
    width: 100%;
  }
}


@media (min-width: $breakpoint-tablet) {
  .signup-page {
    min-height: 0;
    width: 100%;
  }

  .signup-content {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: $space-5 $page-margin-tablet $space-6;
  }
}

@media (min-width: $breakpoint-desktop) {
  .signup-page {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
  }

  .signup-content {
    max-width: 100%;
    padding: $space-6 $page-margin-desktop;
  }

  .signup-image {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 0;
    padding: $space-4;
  }

  .signup-image img {
    display: block;
    width: 100%;
    height: auto;
  }

  .signup-page {
    min-height: 100vh;
  }
}
</style>