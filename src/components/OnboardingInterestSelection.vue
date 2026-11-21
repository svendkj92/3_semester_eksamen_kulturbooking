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

        <span>
          {{ t('interests.' + interest.value) }}
        </span>
      </label>
    </div>
  </section>
</template>


<style lang="scss" scoped>

@use "@/assets/variables" as *;

.interest-selection {
  color: $hero-text-color;

  h2 {
    font-family: $font-body;
    font-size: $font-size-subtitle;
    font-weight: $font-weight-bold;
    line-height: $line-height-subtitle;
    margin-bottom: $space-4;
  }
}F

.interest-options {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
}

.interest-option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: $min-touch-target;
  padding: $space-2 $space-3;

  border: $border-width-input solid $hero-text-color;
  border-radius: $radius-input;
  background-color: #FFFFFF;
  color: $hero-text-color;

  font-family: $font-body;
  font-size: $font-size-body;
  cursor: pointer;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  &:has(input:checked) {
    background-color: $primary-color;
    border-color: $primary-color;
    color: #FFFFFF;
  }

  &:has(input:focus-visible) {
    box-shadow:
      0 0 0 $focus-ring-inner $focus-ring-inner-color,
      0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
  }
}

</style>