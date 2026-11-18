<script setup>
import { nextTick, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { loginUser, resetPassword } from '@/services/authService';
import { getUserProfile } from '@/services/userService';

const route = useRoute();
const router = useRouter();
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const isResettingPassword = ref(false);
const resetMessage = ref('');
const emailInput = ref(null);

async function switchMode() {
  if (isSubmitting.value) return;
  isResettingPassword.value = !isResettingPassword.value;
  errorMessage.value = '';
  resetMessage.value = '';
  password.value = '';
  await nextTick();
  emailInput.value?.focus();
}

async function handlePasswordReset() {
  if (isSubmitting.value) return;
  errorMessage.value = '';
  resetMessage.value = '';
  if (!email.value.trim()) {
    errorMessage.value = 'Indtast din e-mailadresse.';
    return;
  }
  isSubmitting.value = true;
  const confirmation = 'Hvis der findes en konto med denne e-mailadresse, modtager du en mail med et link til at nulstille adgangskoden. Tjek også uønsket mail.';
  try {
    await resetPassword(email.value.trim());
    resetMessage.value = confirmation;
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        resetMessage.value = confirmation;
        break;
      case 'auth/invalid-email':
        errorMessage.value = 'Indtast en gyldig e-mailadresse.';
        break;
      case 'auth/too-many-requests':
        errorMessage.value = 'For mange forsøg. Vent lidt og prøv igen.';
        break;
      case 'auth/network-request-failed':
        errorMessage.value = 'Ingen forbindelse. Kontrollér dit netværk og prøv igen.';
        break;
      default:
        errorMessage.value = 'Nulstillingsmailen kunne ikke sendes. Prøv igen senere.';
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function handleLogin() {
  if (isSubmitting.value) return;
  errorMessage.value = '';
  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Indtast din e-mail og adgangskode.';
    return;
  }
  isSubmitting.value = true;
  try {
    const user = await loginUser(email.value.trim(), password.value);
    password.value = '';
    const profile = user.emailVerified ? await getUserProfile(user.uid) : null;
    if (!user.emailVerified || !profile?.profile) {
      await router.push({
        path: '/onboarding',
        query: { redirect: route.query.redirect },
      });
    } else {
      const redirect = route.query.redirect;
      const eventMatch = typeof redirect === 'string' && /^\/events\/[^/?#]+$/.test(redirect);
      await router.push(eventMatch ? redirect : '/profile');
    }
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-email':
        errorMessage.value = 'E-mail eller adgangskode er forkert.';
        break;
      case 'auth/too-many-requests':
        errorMessage.value = 'For mange loginforsøg. Vent lidt og prøv igen.';
        break;
      case 'auth/network-request-failed':
        errorMessage.value = 'Ingen forbindelse. Kontrollér dit netværk og prøv igen.';
        break;
      case 'auth/user-disabled':
        errorMessage.value = 'Din konto er deaktiveret. Kontakt KulturBooking.';
        break;
      default:
        errorMessage.value = 'Login eller indlæsning af din profil kunne ikke gennemføres. Prøv igen.';
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="login-page" aria-labelledby="login-title">
    <h1 id="login-title">{{ isResettingPassword ? 'Glemt adgangskode?' : 'Log ind' }}</h1>
    <p v-if="isResettingPassword">Indtast din e-mail, så sender vi dig et link til at vælge en ny adgangskode.</p>
    <p v-else>Velkommen tilbage til KulturBooking.</p>
    <form @submit.prevent="isResettingPassword ? handlePasswordReset() : handleLogin()">
      <fieldset :disabled="isSubmitting">
        <legend class="login-legend">
          {{ isResettingPassword ? 'Nulstil din adgangskode' : 'Log ind med e-mail og adgangskode' }}
        </legend>
        <label for="login-email">E-mail</label>
        <input ref="emailInput" id="login-email" v-model="email" type="email" autocomplete="username" required />
        <label v-if="!isResettingPassword" for="login-password">Adgangskode</label>
        <input
          v-if="!isResettingPassword"
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
        <p v-if="errorMessage" class="login-error" role="alert">{{ errorMessage }}</p>
        <button type="submit">
          {{ isResettingPassword ? (isSubmitting ? 'Sender…' : 'Send nulstillingslink') : (isSubmitting ? 'Logger ind…' : 'Log ind') }}
        </button>
      </fieldset>
      <p v-if="isSubmitting" role="status">
        {{ isResettingPassword ? 'Sender nulstillingsmail…' : 'Logger ind og henter din profil…' }}
      </p>
      <p v-if="resetMessage" role="status">{{ resetMessage }}</p>
    </form>
    <button class="mode-button" type="button" :disabled="isSubmitting" @click="switchMode">
      {{ isResettingPassword ? 'Tilbage til login' : 'Glemt adgangskode?' }}
    </button>
    <p>
      Har du ikke en konto? 
      <RouterLink :to="{ path: '/onboarding', query: { redirect: route.query.redirect } }">
        Opret bruger
      </RouterLink>
    </p>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.login-page {
  max-width: 440px;
  min-height: 60vh;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: $hero-text-color;

  h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  form {
    margin: 1.5rem 0;
  }

  fieldset {
    display: grid;
    gap: 0.75rem;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .login-legend {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  input,
  button {
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding: 0.75rem;
    border: 1px solid $secondary-color;
    border-radius: 6px;
    font: inherit;
  }

  button {
    margin-top: 0.5rem;
    border: 0;
    background-color: $primary-color;
    color: $background-color;
    cursor: pointer;
  }

  a {
    color: $primary-color;
    text-decoration: underline;
  }

  .mode-button {
    width: auto;
    margin: 0 0 1rem;
    padding: 0.5rem 0;
    background: transparent;
    color: $primary-color;
    text-decoration: underline;
    text-align: left;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  :focus-visible {
    outline: 2px solid $primary-color;
    outline-offset: 3px;
  }

  .login-error {
    border-left: 3px solid $error-color;
    padding-left: 0.75rem;
  }
}
</style>
