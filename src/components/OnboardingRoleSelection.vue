<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selectedRole = defineModel({
  type: String,
  default: ''
})

const roles = [
  { value: 'udforsker' },
  { value: 'skaber' },
  { value: 'facilitator' }
]

</script>


<template>
  <section class="role-selection" aria-labelledby="role-title">
    <h2 id="role-title">
      {{ t('onboarding.roles.title') }}
    </h2>

    <p class="role-hint">
      {{ t('onboarding.roles.defaultInfo') }}
    </p>

    <div class="role-option" role="radiogroup" aria-labelledby="role-title">
      <label
        v-for="role in roles"
        :key="role.value"
        class="role-label"
      >
        <input
          v-model="selectedRole"
          type="radio"
          name="role"
          :value="role.value"
        />

        <span class="role-name">
          {{ t('onboarding.roles.' + role.value + '.label') }}
        </span>

        <span class="role-description">
          {{ t('onboarding.roles.' + role.value + '.description') }}
        </span>
      </label>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.role-selection {
  color: $hero-text-color;
}

.role-selection h2 {
  font-family: $font-body;
  font-size: $font-size-subtitle;
  font-weight: $font-weight-bold;
  line-height: $line-height-subtitle;
  margin-bottom: $space-2;
}

.role-hint {
  font-size: $font-size-label;
  line-height: $line-height-body;
  margin-bottom: $space-4;
}

.role-option {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.role-label {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  column-gap: $space-3;
  row-gap: $space-1;

  min-height: $min-touch-target;
  padding: $space-3;
  border: $border-width-input solid $hero-text-color;
  border-radius: $radius-input;
  background-color: $background-color;
  color: $hero-text-color;
  cursor: pointer;

  input {
    grid-row: 1 / 3;
    align-self: center;
    margin: 0;
    accent-color: $primary-color;
    cursor: pointer;
  }

  .role-name {
    font-weight: $font-weight-bold;
  }

  .role-description {
    font-size: $font-size-label;
    line-height: $line-height-body;
  }

  &:has(input:checked) {
    background-color: $primary-color;
    color: $background-color;
    border-color: $primary-color;

    input {
      accent-color: $background-color;
    }
  }

  &:has(input:focus-visible) {
    outline: none;
    box-shadow:
      0 0 0 $focus-ring-inner $focus-ring-inner-color,
      0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
  }
}
</style>

