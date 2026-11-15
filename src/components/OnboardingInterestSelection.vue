<script setup>
const selectedInterests = defineModel({
  type: Array,
  default: () => []
})
const interests = []
</script>

<template>

  <section class="interest-selection">
    <h2>Vælg dine interesser</h2>
  
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
             <span>{{ interest.label }}</span>
           </label>
      </div>
  </section>

</template>

<style lang="scss" scoped>

</style>