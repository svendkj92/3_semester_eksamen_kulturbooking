<script setup>
const selectedRole = defineModel({
  type: String,
  default: ''
})

const roles = [
  { 
    value: 'udforsker', 
    label: 'Udforsker', 
    description: 'Jeg vil opdage nye oplevelser, møde andre og deltage i events.' },
  { 
    value: 'skaber', 
    label: 'Skaber', 
    description: 'Jeg vil bruge min kreativitet, dele mine idéer og være med til at skabe noget.' },
  { 
    value: 'facilitator', 
    label: 'Facilitator', 
    description: 'Jeg repræsenterer en virksomhed eller organisation, der ønsker at arrangere events og skabe oplevelser for andre.' }
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
