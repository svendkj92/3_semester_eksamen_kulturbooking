<script setup>
import { RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <div class="onboarding-layout">

    <header class="onboarding-header">
      <RouterLink to="/">
        <img
          src="@/assets/kb_logo.png"
          :alt="t('onboarding.brand')"
        />
      </RouterLink>
      <LanguageSwitcher />
    </header>

    <main>
      <RouterView />
    </main>

  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.onboarding-header {
  padding: 1.5rem 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 90px;
    height: auto;
  }
}

@media (min-width: $breakpoint-tablet) {
  .onboarding-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    min-height: 100vh;
    align-items: center;
  }

  .onboarding-header {
    grid-column: 2;
    grid-row: 1;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: $space-5;
  }

  .onboarding-header img {
    width: 12rem;
  }

  .language-switcher {
    position: absolute;
    top: $space-4;
    right: $page-margin-tablet;
  }

  .onboarding-layout > main {
    grid-column: 1;
    grid-row: 1;
    min-width: 0;
    align-self: center;
    min-height: 0;
  }
}

@media (min-width: $breakpoint-desktop) {
  .onboarding-layout {
    display: block;
  }

  .onboarding-header {
    position: static;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $page-margin-desktop;
  }

  .onboarding-header img {
    width: 90px;
  }

  .language-switcher {
    position: static;
  }
}
</style>