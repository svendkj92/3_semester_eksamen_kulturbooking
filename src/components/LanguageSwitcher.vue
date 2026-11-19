<script setup>
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();
</script>

<template>
  <div class="language-switcher" role="group" :aria-label="t('common.language')">
    <button
      v-for="language in ['da', 'en']"
      :key="language"
      type="button"
      :lang="language"
      :aria-label="language === 'da' ? 'Dansk' : 'English'"
      :aria-pressed="locale === language"
      @click="locale = language"
    >
      {{ language.toUpperCase() }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.language-switcher {
  display: inline-flex;
  flex-shrink: 0;
  gap: 0.125rem;

  button {
    min-width: 44px;
    min-height: 44px;
    padding: 0.5rem;
    border: 1px solid $primary-color;
    border-radius: 6px;
    color: $primary-color;
    background: $background-color;
    font: inherit;
    cursor: pointer;

    &[aria-pressed="true"],
    &:hover {
      background: $primary-color;
      color: $background-color;
    }

    &:focus-visible {
      outline: 2px solid $primary-color;
      outline-offset: 3px;
    }
  }
}
</style>
