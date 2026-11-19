<script setup>
import { RouterView } from 'vue-router';
import LandingPageHeader from '@/components/LandingPageHeader.vue';
</script>

<template>
  <div class="landing-page-layout">

    <LandingPageHeader />

    <main>
      <RouterView />
    </main>

  </div>
</template>