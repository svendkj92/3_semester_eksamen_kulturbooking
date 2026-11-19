
<script setup>
import { RouterLink } from 'vue-router';
import { formatEventDate, formatEventTime } from '@/services/eventData';

defineProps({
  event: {
    type: Object,
    required: true,
  },
});
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
        <span>{{ event.price }}</span>
      </div>

      <span class="event-card__category">
        {{ event.category }}
      </span>
    </div>

    <div class="event-card__content">
      <h3>{{ event.title }}</h3>

      <div class="event-card__meta">
        <span>
          {{ formatEventDate(event.startsAt) }}
          kl. {{ formatEventTime(event.startsAt) }}
        </span>
        <span>{{ event.location }}</span>
      </div>

      <RouterLink
        :to="`/events/${event.id}`"
        class="event-card__link"
        aria-haspopup="dialog"
      >
        Se event
        <span aria-hidden="true">→</span>
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
  background-color: $hero-text-color;
  transition: transform 0.3s ease;

  p, h3, .event-card__meta span {
    color: $background-color;
  }

  &:hover {
    transform: translateY(-5px);
  }

  &__image {
    position: relative;
    height: 240px;
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
    font-size: 0.8rem;
    font-weight: bold;
  }

  &__content {
    padding: 1.5rem;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    color: $background-color;
    opacity: 0.7;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: $background-color;
    font-family: $font-heading;
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }

  p {
    color: $background-color;
    opacity: 0.8;
    line-height: 1.5;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: $cta-color;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      gap: 0.8rem;
    }
  }
}

@media (min-width: 768px) {
  .event-card__image {
    height: 220px;
  }
}
</style>