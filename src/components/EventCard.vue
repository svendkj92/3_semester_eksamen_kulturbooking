
<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useEventFormatting } from '@/i18n/useEventFormatting';

const { t } = useI18n();
const { eventDate, eventTime, eventPrice, interestLabel } = useEventFormatting();

defineProps({
  event: {
    type: Object,
    required: true,
  },
  openInDialog: {
    type: Boolean,
    default: false,
  },
  detailRoute: {
    type: String,
    default: 'event-detail',
  },
  started: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['view-event']);
</script>

<template>
  <div class="event-card">
    <div class="event-card__image">
      <img
        :src="event.image"
        :alt="event.title"
        loading="lazy"
      />

      <div class="event-card__price">
        <span>{{ eventPrice(event.price) }}</span>
      </div>

      <span class="event-card__category">
        {{ interestLabel(event.category) }}
      </span>
    </div>

    <div class="event-card__content">
      <h3>{{ event.title }}</h3>

      <div class="event-card__meta">
        <span>
          {{ eventDate(event.startsAt) }}
          {{ t('common.at') }} {{ eventTime(event.startsAt) }}
        </span>
        <span>{{ event.location }}</span>
        <span v-if="started">{{ t('events.started') }}</span>
      </div>

      <button
        v-if="openInDialog"
        type="button"
        class="event-card__link"
        @click="$emit('view-event', event)"
      >
        {{ t('common.viewEvent') }}
        <span class="visually-hidden">: {{ event.title }}</span>
      </button>

      <RouterLink
        v-else
        :to="{ name: detailRoute, params: { id: event.id } }"
        class="event-card__link"
        aria-haspopup="dialog"
      >
        {{ t('common.viewEvent') }}
        <span class="visually-hidden">: {{ event.title }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.event-card {
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  border-radius: $radius-card;
  background-color: $background-color;
  color: $hero-text-color;
  box-shadow: 0 0 0 1px rgba($hero-text-color, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &__image {
    position: relative;
    aspect-ratio: $event-image-ratio;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
  }

  &:hover &__image img {
    transform: scale(1.05);
  }

  &__price {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 6px;
    background-color: $primary-color;
    color: $background-color;
    font-weight: bold;
  }

  &__category {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    padding: 0.4rem 0.8rem;
    border-radius: 50px;
    background-color: $background-color;
    color: $hero-text-color;
    font-size: $font-size-label;
    font-weight: bold;
  }

  &__content {
    padding: 1.5rem;
    overflow-wrap: anywhere;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: $hero-text-color;
    font-size: $font-size-label;
    margin-bottom: 1rem;
  }

  h3 {
    font-family: $font-body;
    font-size: $font-size-subtitle;
    line-height: $line-height-subtitle;
    font-weight: $font-weight-bold;
    margin-bottom: 0.75rem;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-height: $min-touch-target;
    max-width: 100%;
    margin: 1rem auto 0;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: $radius-button;
    background: $cta-color;
    font: inherit;
    color: $hero-text-color;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    text-align: center;

    &:hover {
      background: $cta-color-hover;
    }

    &:focus-visible {
      outline: $focus-ring-outer solid $focus-ring-outer-color;
      outline-offset: $focus-ring-inner;
      box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
    }
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .event-card,
  .event-card__image img {
    transition: none;
  }

  .event-card:hover,
  .event-card:hover .event-card__image img {
    transform: none;
  }
}
</style>