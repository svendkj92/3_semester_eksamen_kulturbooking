<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <header class="header">
      <RouterLink to="/" class="logo">
        <img src="@/assets/kb_logo.png" alt="KulturBooking" />
      </RouterLink>

      <nav>
        <a href="#about">Om os</a>
        <RouterLink to="/login">
          Log ind
        </RouterLink>
        <RouterLink to="/onboarding" class="cta-button">
          CTA
        </RouterLink>
      </nav>
    </header>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.landing-page {
  min-height: 100vh;
  width: 100%;
  background-color: $background-color;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 10%;
  background-color: $hero-text-color;
}

.logo {
  display: flex;
  align-items: center;

  img {
    width: 90px;
    height: auto;
  }
}

nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  background-color: $hero-text-color;

  a {
    text-decoration: none;
    color: $background-color;
  }
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: $cta-color;
  color: $hero-text-color;
  border-radius: 8px;
  text-decoration: none;
}
</style>