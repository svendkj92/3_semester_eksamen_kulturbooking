<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue';
</script>

<template>
  <header class="landing-page-header">
    <div class="brand">
      <img src="@/assets/kb_logo.png" alt="KulturBooking" />
      <p>KulturBooking</p>
    </div>
    <LanguageSwitcher />
  </header>
</template>

<style lang="scss" scoped>

.landing-page-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: 1.5rem 5%;
  gap: 1rem;

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }

  img {
    width: 44px;
    height: auto;
  }

  .language-switcher {
    justify-self: end;
  }
}

@media (min-width: 600px) {
  .landing-page-header {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);

    .brand {
      grid-column: 2;
      gap: 1rem;
    }

    p {
      font-size: 1.5rem;
    }

    img {
      width: 60px;
    }
  }
}
</style>
