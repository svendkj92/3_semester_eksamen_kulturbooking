<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { logoutUser, observeAuthState } from '@/services/authService';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t } = useI18n();
const route = useRoute();
const menuIsOpen = ref(false);
const menuButton = ref(null);
const isLoggedIn = ref(false);
const isLoggingOut = ref(false);
const authError = ref('');
const logoutMessage = ref('');
let unsubscribeAuth;

const navItems = [
  { title: 'nav.events', to: '/events' },
  { title: 'nav.about', to: '/om' },
];

function closeMenu() {
  menuIsOpen.value = false;
}

function dismissMenu() {
  if (!menuIsOpen.value) return;
  closeMenu();
  menuButton.value?.focus();
}

async function handleLogout() {
  if (isLoggingOut.value) return;
  isLoggingOut.value = true;
  authError.value = '';
  logoutMessage.value = '';
  try {
    await logoutUser();
    closeMenu();
    logoutMessage.value = 'nav.loggedOut';
  } catch {
    authError.value = 'nav.logoutError';
  } finally {
    isLoggingOut.value = false;
  }
}

watch(() => route.fullPath, () => {
  closeMenu();
  logoutMessage.value = '';
});

onMounted(() => {
  unsubscribeAuth = observeAuthState((user) => {
    isLoggedIn.value = Boolean(user);
  });
});

onUnmounted(() => {
  unsubscribeAuth?.();
});
</script>

<template>
  <header class="header" @keydown.esc="dismissMenu">
    <div class="header-bar">
      <div class="logo">
  <img src="@/assets/kb_logo.png" alt="KulturBooking" width="60" height="60" />
</div>

      <button
        ref="menuButton"
        class="burger-button"
        type="button"
        :aria-expanded="menuIsOpen"
        aria-controls="main-navigation"
        :aria-label="t(menuIsOpen ? 'nav.close' : 'nav.open')"
        @click="menuIsOpen = !menuIsOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        id="main-navigation"
        class="navigation"
        :class="{ 'navigation--open': menuIsOpen }"
        :aria-label="t('nav.main')"
      >
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <RouterLink :to="item.to" @click="closeMenu">
              {{ t(item.title) }}
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink to="/profile" @click="closeMenu">{{ t('common.profile') }}</RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <button
              class="logout-button"
              type="button"
              :disabled="isLoggingOut"
              @click="handleLogout"
            >
              {{ t(isLoggingOut ? 'nav.loggingOut' : 'nav.logout') }}
            </button>
          </li>
          <li v-else>
            <RouterLink to="/login" @click="closeMenu">{{ t('common.login') }}</RouterLink>
          </li>
        </ul>
      </nav>
      <LanguageSwitcher />
    </div>
    <p v-if="authError" class="auth-error" role="alert">{{ t(authError) }}</p>
    <p v-if="logoutMessage" class="auth-message" role="status">{{ t(logoutMessage) }}</p>
  </header>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.header {
  position: relative;
  padding: 1rem 5%;
  background-color: $background-color;
  color: $hero-text-color;

  a:focus-visible,
  button:focus-visible {
    outline: $focus-ring-outer solid $focus-ring-outer-color;
    outline-offset: $focus-ring-inner;
    box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
    border-radius: 4px;
  }
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.logo img {
  display: block;
  width: 60px;
  height: 60px;
}

.burger-button {
  display: flex;
  margin-left: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: transparent;

  span {
    width: 25px;
    height: 2px;
    background-color: $hero-text-color;
  }
}

.navigation {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 1rem 5%;
  background-color: $background-color;
  box-shadow: 0 6px 12px rgba($hero-text-color, 0.1);
  z-index: 10;

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: inherit;
    text-decoration: none;

    &:hover,
    &.router-link-active {
      color: $primary-color;
      text-decoration: underline;
      text-underline-offset: 0.25em;
    }
  }

  &.navigation--open {
    display: block;
  }
}

.logout-button {
  min-height: 44px;
  padding: 0.5rem 1rem;
  border: 1px solid $primary-color;
  border-radius: 6px;
  color: $primary-color;
  background-color: transparent;
  font: inherit;
  cursor: pointer;

  &:hover {
    background-color: $primary-color;
    color: $background-color;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}

.auth-error,
.auth-message {
  margin-top: 0.75rem;
  font-size: 0.875rem;
}

.auth-error {
  color: $hero-text-color;
  border-left: 3px solid $error-color;
  padding-left: 0.5rem;
}

@media (min-width: 768px) {
  .burger-button {
    display: none;
  }

  .navigation {
    display: block;
    position: static;
    width: auto;
    padding: 0;
    background: transparent;
    box-shadow: none;
    margin-left: auto;

    ul {
      flex-direction: row;
      align-items: center;
      gap: clamp(0.75rem, 2vw, 2rem);
    }
  }

  .language-switcher {
    margin-left: clamp(1rem, 3vw, 3rem);
  }
}
</style>
