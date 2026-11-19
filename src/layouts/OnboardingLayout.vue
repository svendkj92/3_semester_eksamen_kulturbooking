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
</style>