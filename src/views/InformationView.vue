<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
});
</script>

<template>
  <section class="information-page" aria-labelledby="information-title">
    <p class="coming-soon">Kommer snart</p>
    <h1 id="information-title">{{ title }}</h1>
    <p>{{ description }}</p>
    <RouterLink to="/">Tilbage til forsiden</RouterLink>
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
      outline: 2px solid $primary-color;
      outline-offset: 4px;
    }
  }
}
</style>
