<script setup>
const bio = defineModel('bio', {
  type: String,
  default: ''
})
const image = defineModel('image', {
  default: null
})
import { ref, onUnmounted } from 'vue'

const imagePreview = ref(null)

function handleImageChange(event) {
  const file = event.target.files?.[0] ?? null

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }

  image.value = file
  imagePreview.value = file ? URL.createObjectURL(file) : null
}
const imageInput = ref(null)

function removeImage() {
  image.value = null

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }

  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

onUnmounted(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>

<template>
    <section class="profile-setup">
        <h2>Gør din profil personlig</h2>
        <div class="profile-image">
            <label for="profile-image">Tilføj et profilbillede</label>

            <input
             id="profile-image"
             type="file"
             accept="image/*"
             @change="handleImageChange"
             ref="imageInput"
            />
            <img
             v-if="imagePreview"
             :src="imagePreview"
             alt="Forhåndsvisning af profilbillede"
             class="profile-preview"
            />
            <button
             v-if="imagePreview"
             type="button"
             @click="removeImage"
            >
             Fjern billede
            </button>
        </div>

        <div class="profile-bio">
            <label for="profile-bio">Fortæl lidt om dig selv</label>

            <textarea
                id="profile-bio"
                v-model="bio"
                placeholder="Skriv lidt om dig selv (valgfrit)"
                rows="4"
            ></textarea>
        </div>
    </section>
</template>

<style lang="scss" scoped>

</style>