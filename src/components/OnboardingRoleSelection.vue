<script setup>
const selectedRole = defineModel({
  type: String,
  default: ''
})

const roles = [
  { value: 'udforsker', label: 'Udforsker', description: '' },
  { value: 'skaber', label: 'Skaber', description: '' },
  { value: 'partner', label: 'Partner', description: '' }
]

</script>

<template>
    <h2>Vælg din rolle</h2>

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

         <span>{{ role.label }}</span>
        
        </label>
    </div>

</template>

<style lang="scss" scoped>

</style>
