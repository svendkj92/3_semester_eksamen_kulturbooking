<script setup>
import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const bio = defineModel('bio', {
  type: String,
  default: ''
})
const image = defineModel('image', {
  default: null
})
const imagePreview = ref(
    image.value ? URL.createObjectURL(image.value) : null
)

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
        <h2>{{ t('onboarding.profile.title') }}</h2>
        <div class="profile-image">
            <label for="profile-image">{{ t('onboarding.profile.addImage') }}</label>

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
             :alt="t('onboarding.profile.imagePreview')"
             class="profile-preview"
            />
            <button
             v-if="imagePreview"
             type="button"
             @click="removeImage"
            >
             {{ t('onboarding.profile.removeImage') }}
            </button>
        </div>

        <div class="profile-bio">
            <label for="profile-bio">{{ t('onboarding.profile.bioLabel') }}</label>

            <textarea
                id="profile-bio"
                v-model="bio"
                :placeholder="t('onboarding.profile.bioPlaceholder')"
                rows="4"
            ></textarea>
        </div>
    </section>
</template>

<style lang="scss" scoped>

</style>