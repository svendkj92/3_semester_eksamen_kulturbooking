<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { logoutUser, observeAuthState } from '@/services/authService';

const route = useRoute();
const menuIsOpen = ref(false);
const menuButton = ref(null);
const isLoggedIn = ref(false);
const isLoggingOut = ref(false);
const authError = ref('');
const logoutMessage = ref('');
let unsubscribeAuth;

const navItems = [
  { title: 'Events', to: '/events' },
  { title: 'Om os', to: '/om' },
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
    logoutMessage.value = 'Du er nu logget ud.';
  } catch {
    authError.value = 'Du kunne ikke logges ud. Prøv igen.';
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
      <RouterLink class="logo" to="/" aria-label="KulturBooking – forsiden" @click="closeMenu">
        <img src="@/assets/kb_logo.png" alt="" width="60" height="60" />
      </RouterLink>

      <button
        ref="menuButton"
        class="burger-button"
        type="button"
        :aria-expanded="menuIsOpen"
        aria-controls="main-navigation"
        :aria-label="menuIsOpen ? 'Luk menu' : 'Åbn menu'"
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
        aria-label="Hovednavigation"
      >
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <RouterLink :to="item.to" @click="closeMenu">
              {{ item.title }}
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink to="/profile" @click="closeMenu">Min profil</RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <button
              class="logout-button"
              type="button"
              :disabled="isLoggingOut"
              @click="handleLogout"
            >
              {{ isLoggingOut ? 'Logger ud…' : 'Log ud' }}
            </button>
          </li>
          <li v-else>
            <RouterLink to="/login" @click="closeMenu">Log ind</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
    <p v-if="authError" class="auth-error" role="alert">{{ authError }}</p>
    <p v-if="logoutMessage" class="auth-message" role="status">{{ logoutMessage }}</p>
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
    outline: 2px solid $primary-color;
    outline-offset: 4px;
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

    ul {
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }
  }
}
</style>
