
<script setup>
import { ref } from 'vue'
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

const expandedRole = ref(null)

function toggleRoleDescription(role) {
  expandedRole.value = expandedRole.value === role ? null : role
}
</script>

<template>
  <section class="role-selection" aria-labelledby="role-title">
    <h2 id="role-title">
      {{ t('onboarding.roles.title') }}
    </h2>

    <p class="role-hint">
      {{ t('onboarding.roles.defaultInfo') }}
    </p>

    <div class="role-option">
      <div
        v-for="role in roles"
        :key="role.value"
        class="role-card"
        :class="{ 'role-card--selected': selectedRole === role.value }"
      >
        <div class="role-card-header">
          <label class="role-label">
            <input
              v-model="selectedRole"
              type="radio"
              name="role"
              :value="role.value"
            />

            <span class="role-name">
              {{ t('onboarding.roles.' + role.value + '.label') }}
            </span>
          </label>

          <button
            type="button"
            class="role-dropdown"
            :class="{ 'role-dropdown--open': expandedRole === role.value }"
            :aria-expanded="expandedRole === role.value"
            :aria-controls="'role-description-' + role.value"
            :aria-label="t('onboarding.roles.toggleDescription', {
              role: t('onboarding.roles.' + role.value + '.label')
            })"
            @click="toggleRoleDescription(role.value)"
          >
            <span class="dropdown-arrow" aria-hidden="true"></span>
          </button>
        </div>

        <p
          v-show="expandedRole === role.value"
          :id="'role-description-' + role.value"
          class="role-description"
        >
          {{ t('onboarding.roles.' + role.value + '.description') }}
        </p>
      </div>
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

.role-card {
  padding: $space-2 $space-3;
  border: $border-width-input solid $hero-text-color;
  border-radius: $radius-input;
  background-color: $background-color;
  color: $hero-text-color;

  &--selected {
    background-color: $primary-color;
    border-color: $primary-color;
    color: #FFFFFF;
  }
}

.role-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-2;
}

.role-label {
  display: flex;
  align-items: center;
  flex: 1;
  gap: $space-3;
  min-height: $min-touch-target;
  cursor: pointer;

  input {
    margin: 0;
    accent-color: $primary-color;
    cursor: pointer;
  }

  .role-name {
    font-family: $font-body;
    font-weight: $font-weight-bold;
  }
}

.role-card--selected input {
  accent-color: #FFFFFF;
}

.role-card:has(input:focus-visible) {
  outline: none;
  box-shadow:
    0 0 0 $focus-ring-inner $focus-ring-inner-color,
    0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
}

.role-dropdown {
  display: flex;
  align-items: center;
  justify-content: center;

  width: $min-touch-target;
  height: $min-touch-target;
  flex-shrink: 0;

  padding: 0;
  border: none;
  border-radius: $radius-button;
  background-color: transparent;
  color: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 $focus-ring-inner $focus-ring-inner-color,
      0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
  }
}

.dropdown-arrow {
  width: 0;
  height: 0;

  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid currentColor;

  transition: transform 0.2s ease;
}

.role-dropdown--open .dropdown-arrow {
  transform: rotate(180deg);
}

.role-description {
  padding-top: $space-2;
  margin-top: $space-2;
  border-top: 1px solid currentColor;
  font-family: $font-body;
  font-size: $font-size-label;
  line-height: $line-height-body;
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-arrow {
    transition: none;
  }
}
</style>

