<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  page: { type: String, required: true },
});
</script>

<template>
  <section class="information-page" aria-labelledby="information-title">
    <p class="coming-soon">{{ t('common.comingSoon') }}</p>
    <h1 id="information-title">{{ t(`info.${page}.title`) }}</h1>
    <p>{{ t(`info.${page}.description`) }}</p>
    <RouterLink to="/">{{ t('common.backHome') }}</RouterLink>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.information-page {
  max-width: 800px;
  min-height: 45vh;
  margin: 0 auto;
  padding: 3rem 1rem;
  color: $hero-text-color;

  h1 {
    margin-bottom: 1rem;
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .coming-soon {
    color: $secondary-color;
    font-size: 0.875rem;
  }

  a {
    display: inline-block;
    margin-top: 1.5rem;
    color: $primary-color;
    text-decoration: underline;
    text-underline-offset: 0.2em;

    &:focus-visible {
      outline: $focus-ring-outer solid $focus-ring-outer-color;
      outline-offset: $focus-ring-inner;
      box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
    }
  }
}
</style>
