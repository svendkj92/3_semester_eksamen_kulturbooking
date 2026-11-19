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
    <h2>{{ t('onboarding.roles.title') }}</h2>

    <div class="role-option">
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
          
          <span>{{ t('onboarding.roles.' + role.value + '.label') }}</span>
          <p class="role-description">{{ t('onboarding.roles.' + role.value + '.description') }}</p>
        
        </label>
    </div>

</template>

<style lang="scss" scoped>

</style>
