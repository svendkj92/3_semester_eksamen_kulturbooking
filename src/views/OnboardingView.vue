<script setup>
import { ref, computed } from 'vue'
import OnboardingRoleSelection from '@/components/OnboardingRoleSelection.vue'
import OnboardingInterestSelection from '@/components/OnboardingInterestSelection.vue'
import OnboardingProfileSetup from '@/components/OnboardingProfileSetup.vue'

const email = ref('')
const codeSent = ref(false)
const emailTouched = ref(false)
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})
const verificationCode = ref('')
const isCodeNumeric = computed(() => {
  return /^[0-9]+$/.test(verificationCode.value)
})
const codeError = ref('')
const emailVerified = ref(false)
const currentStep = ref(1)
const isOnboardingOpen = ref(true)
const selectedRole = ref('')
const selectedInterests = ref([])
const profileBio = ref('')
const profileImage = ref(null)

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
         <form class="email-login" novalidate>
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
              <div v-if="codeSent" class="verification-code">
                 <label for="verification-code">Bekræftelseskoden</label>
                 <input
                     id="verification-code"
                     v-model="verificationCode"
                     type="text"
                     inputmode="numeric"
                     autocomplete="one-time-code"
                     placeholder="Indtast bekræftelseskoden"
                   />
                   <p v-if="codeError" class="code-error" role="alert">
                     {{ codeError }}
                   </p>
             </div>
             <p v-if="codeSent" class="privacy-policy">
                 Ved at fortsætte accepterer du vores
                 <a href="#">Privatlivspolitik</a>.
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
  }
}
.email-error {
  color: #DC2626;
}
.email-success {
  color: #166534;
}
&.input-error {
  border-color: #DC2626;
}

.code-error {
  color: #DC2626;
}

</style>