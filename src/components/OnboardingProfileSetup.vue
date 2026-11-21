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
@use "@/assets/variables" as *;

.profile-setup {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  color: $hero-text-color;
}

.profile-setup h2 {
  font-family: $font-body;
  font-size: $font-size-subtitle;
  font-weight: $font-weight-bold;
  line-height: $line-height-subtitle;
}

.profile-image,
.profile-bio {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.profile-image label,
.profile-bio label {
  font-family: $font-body;
  font-size: $font-size-label;
  font-weight: $font-weight-bold;
}

.profile-image input,
.profile-bio textarea {
  width: 100%;
  padding: $space-2 $space-3;
  border: $border-width-input solid $hero-text-color;
  border-radius: $radius-input;
  background-color: #FFFFFF;
  color: $hero-text-color;
  font: inherit;
}

.profile-image input {
  min-height: $min-touch-target;
}

.profile-bio textarea {
  min-height: 120px;
  resize: vertical;
}

.profile-preview {
  display: block;
  width: 120px;
  aspect-ratio: $profile-image-ratio;
  object-fit: cover;
  border-radius: 50%;
}

.profile-image button {
  align-self: flex-start;
  min-height: $min-touch-target;
  padding: $space-2 $space-3;
  border: none;
  border-radius: $radius-button;
  background-color: $primary-color;
  color: #FFFFFF;
  font: inherit;
  cursor: pointer;

  &:hover {
    background-color: $primary-color-hover;
  }
}

.profile-image input:focus-visible,
.profile-bio textarea:focus-visible,
.profile-image button:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 $focus-ring-inner $focus-ring-inner-color,
    0 0 0 ($focus-ring-inner + $focus-ring-outer) $focus-ring-outer-color;
}
</style>
