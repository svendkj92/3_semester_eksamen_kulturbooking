<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="onboarding-layout">

    <header class="onboarding-header">
      <RouterLink to="/">
        <img
          src="@/assets/kb_logo.png"
          alt="KulturBooking"
        />
      </RouterLink>
    </header>

    <main>
      <RouterView />
    </main>

  </div>
</template>

<style lang="scss" scoped>
.onboarding-header {
  padding: 1.5rem 10%;

  img {
    width: 90px;
    height: auto;
  }
}
</style>