<script setup>
import { RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <div class="onboarding-layout">

    <header class="onboarding-header">
      <img src="@/assets/kb_logo.png" :alt="t('onboarding.brand')" />
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
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .onboarding-layout>main {
    flex: 1;
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

@media (min-width: $breakpoint-desktop) {
  .onboarding-layout {
    display: block;
    min-height: 0;
  }

  .onboarding-layout>main {
    display: block;
    width: auto;
  }

  .onboarding-header {
    padding: $space-4 $page-margin-desktop;
  }
}
</style>