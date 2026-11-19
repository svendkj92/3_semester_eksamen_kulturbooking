<script setup>
import { interests } from '@/services/interestService';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const selectedInterests = defineModel({
  type: Array,
  default: () => []
})
</script>

<template>

  <section class="interest-selection">
    <h2>{{ t('onboarding.interestsTitle') }}</h2>
  
     <div class="interest-options">
          <label
              v-for="interest in interests"
              :key="interest.value"
              class="interest-option"
            >
          <input
             v-model="selectedInterests"
             type="checkbox"
             :value="interest.value"
           />
             <span>{{ t('interests.' + interest.value) }}</span>
           </label>
      </div>
  </section>

</template>

<style lang="scss" scoped>

</style>