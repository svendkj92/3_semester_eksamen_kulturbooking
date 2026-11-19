<script setup>
import { RouterView } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
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