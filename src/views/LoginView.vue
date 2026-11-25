<script setup>
import { nextTick, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { loginUser, resetPassword } from '@/services/authService';
import { getUserProfile } from '@/services/userService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
    errorMessage.value = 'login.emailRequired';
    return;
  }
  isSubmitting.value = true;
  const confirmation = 'login.resetSent';
  try {
    await resetPassword(email.value.trim());
    resetMessage.value = confirmation;
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        resetMessage.value = confirmation;
        break;
      case 'auth/invalid-email':
        errorMessage.value = 'login.invalidEmail';
        break;
      case 'auth/too-many-requests':
        errorMessage.value = 'login.tooMany';
        break;
      case 'auth/network-request-failed':
        errorMessage.value = 'login.network';
        break;
      default:
        errorMessage.value = 'login.resetFailed';
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function handleLogin() {
  if (isSubmitting.value) return;
  errorMessage.value = '';
  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'login.credentialsRequired';
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
        errorMessage.value = 'login.invalidCredentials';
        break;
      case 'auth/too-many-requests':
        errorMessage.value = 'login.tooManyLogins';
        break;
      case 'auth/network-request-failed':
        errorMessage.value = 'login.network';
        break;
      case 'auth/user-disabled':
        errorMessage.value = 'login.disabled';
        break;
      default:
        errorMessage.value = 'login.failed';
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="login-page" aria-labelledby="login-title">
    <h1 id="login-title">{{ t(isResettingPassword ? 'login.forgot' : 'common.login') }}</h1>
    <p v-if="isResettingPassword">{{ t('login.resetIntro') }}</p>
    <p v-else>{{ t('login.welcome') }}</p>
    <form @submit.prevent="isResettingPassword ? handlePasswordReset() : handleLogin()">
      <fieldset :disabled="isSubmitting">
        <legend class="login-legend">
          {{ t(isResettingPassword ? 'login.resetLegend' : 'login.legend') }}
        </legend>
        <label for="login-email">{{ t('common.email') }}</label>
        <input ref="emailInput" id="login-email" v-model="email" type="email" autocomplete="username" required />
        <label v-if="!isResettingPassword" for="login-password">{{ t('common.password') }}</label>
        <input
          v-if="!isResettingPassword"
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
        <p v-if="errorMessage" class="login-error" role="alert">{{ t(errorMessage) }}</p>
        <button type="submit">
          {{ t(isResettingPassword ? (isSubmitting ? 'login.sending' : 'login.sendLink') : (isSubmitting ? 'login.loggingIn' : 'common.login')) }}
        </button>
      </fieldset>
      <p v-if="isSubmitting" role="status">
        {{ t(isResettingPassword ? 'login.sendingMail' : 'login.loadingProfile') }}
      </p>
      <p v-if="resetMessage" role="status">{{ t(resetMessage) }}</p>
    </form>
    <button class="mode-button" type="button" :disabled="isSubmitting" @click="switchMode">
      {{ t(isResettingPassword ? 'login.back' : 'login.forgot') }}
    </button>
    <p>
      {{ t('login.noAccount') }}
      <RouterLink :to="{ path: '/onboarding', query: { redirect: route.query.redirect } }">
        {{ t('common.signup') }}
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

  input {
    border-radius: $radius-input;
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
    outline: $focus-ring-outer solid $focus-ring-outer-color;
    outline-offset: $focus-ring-inner;
    box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
  }

  .login-error {
    border-left: 3px solid $error-color;
    padding-left: 0.75rem;
  }
}
</style>
