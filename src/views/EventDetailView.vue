<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { events } from '@/services/eventService';

const route = useRoute();
const event = computed(() => events.find((item) => String(item.id) === route.params.id));
const formattedDate = computed(() => {
  if (!event.value) return '';
  return new Date(`${event.value.date}T${event.value.time}`).toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});
</script>

<template>
  <div class="event-detail-page">
    <RouterLink class="back-link" :to="{ name: 'events' }">
      <span aria-hidden="true">←</span> Tilbage til events
    </RouterLink>

    <article v-if="event" class="event-detail" aria-labelledby="event-title">
      <img class="event-image" :src="event.image" :alt="event.title" />
      <div class="event-content">
        <p class="event-category">{{ event.category }}</p>
        <h1 id="event-title">{{ event.title }}</h1>
        <dl class="event-facts">
          <div>
            <dt>Dato og tid</dt>
            <dd>
              <time :datetime="`${event.date}T${event.time}`">
                {{ formattedDate }} kl. {{ event.time }}
              </time>
            </dd>
          </div>
          <div>
            <dt>Sted</dt>
            <dd>{{ event.location }}</dd>
          </div>
          <div>
            <dt>Pris</dt>
            <dd>{{ event.price }}</dd>
          </div>
        </dl>
        <section aria-labelledby="event-description">
          <h2 id="event-description">Om eventet</h2>
          <p>{{ event.description }}</p>
        </section>
        <p class="registration-notice">Tilmelding via hjemmesiden er endnu ikke tilgængelig.</p>
      </div>
    </article>

    <section v-else class="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Eventet blev ikke fundet</h1>
      <p>Vi kunne ikke finde et event på denne adresse. Gå tilbage til oversigten og vælg et event.</p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.event-detail-page {
  max-width: 1200px;
  min-height: 60vh;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: $hero-text-color;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: $primary-color;
  text-decoration: underline;
  text-underline-offset: 0.2em;

  &:hover {
    color: $primary-color-hover;
  }

  &:focus-visible {
    outline: 2px solid $primary-color;
    outline-offset: 4px;
  }
}

.event-detail {
  display: grid;
  gap: 1.5rem;
  min-width: 0;
}

.event-image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 12px;
}

.event-content {
  min-width: 0;
  overflow-wrap: anywhere;
}

.event-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background-color: $cta-color;
  font-size: 0.875rem;
  font-weight: 600;
}

h1 {
  margin: 0.75rem 0 1.5rem;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.2;
}

h2 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.event-facts {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;

  dt {
    color: $secondary-color;
    font-size: 0.875rem;
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
}

.registration-notice {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba($primary-color, 0.06);
}

@media (min-width: 768px) {
  .event-detail-page {
    padding: 3rem 2rem 4rem;
  }

  .event-detail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 2.5rem;
  }
}
</style>
