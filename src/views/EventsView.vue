
<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

const searchQuery = ref('');
const selectedCategory = ref('Alle');

const categories = [
  'Alle',
  'Musik',
  'Kunst',
  'Dans',
  'Film',
  'Teater',
  'Design',
];

const events = ref([
  {
    id: 1,
    title: 'En aften med live jazz',
    category: 'Musik',
    date: '15. NOV',
    time: '19:00',
    location: 'Kulturmaskinen, Odense',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    description: 'Oplev en stemningsfuld aften med live jazz og nye musikalske talenter.',
  },
  {
    id: 2,
    title: 'Kreativt keramikværksted',
    category: 'Kunst',
    date: '18. NOV',
    time: '16:00',
    location: 'Kunstbygningen Filosoffen',
    image: 'https://images.unsplash.com/photo-1565193298595-6e3b4e5e9e8e',
    description: 'Slip kreativiteten løs og prøv kræfter med keramik i hyggelige omgivelser.',
  },
  {
    id: 3,
    title: 'Film under stjernerne',
    category: 'Film',
    date: '21. NOV',
    time: '20:00',
    location: 'Studenterhuset, Odense',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
    description: 'En hyggelig filmoplevelse med andre unge filmelskere.',
  },
  {
    id: 4,
    title: 'Dans dig fri',
    category: 'Dans',
    date: '23. NOV',
    time: '17:30',
    location: 'Dansens Hus, Odense',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
    description: 'En uformel danseworkshop, hvor alle kan være med.',
  },
  {
    id: 5,
    title: 'Teater i øjenhøjde',
    category: 'Teater',
    date: '26. NOV',
    time: '19:30',
    location: 'Teater Momentum',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
    description: 'Oplev moderne teater og mød nye mennesker.',
  },
  {
    id: 6,
    title: 'Design og idéudvikling',
    category: 'Design',
    date: '29. NOV',
    time: '14:00',
    location: 'Kulturmaskinen, Odense',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    description: 'En workshop for dig, der elsker at udvikle kreative idéer.',
  },
]);

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    const matchesCategory =
      selectedCategory.value === 'Alle' ||
      event.category === selectedCategory.value;

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchesCategory && matchesSearch;
  });
});
</script>

<template>
  <main class="events-page">

    <!-- Events overview -->
    <section class="events-section">

      <div class="events-section__header">

        <p class="events-count">
          {{ filteredEvents.length }} events
        </p>
      </div>

      <!-- Category filters -->
      <div class="category-filters">
        <button
          v-for="category in categories"
          :key="category"
          :class="{
            'category-filter--active':
              selectedCategory === category
          }"
          class="category-filter"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <!-- Event cards -->
      <div class="events-grid">

        <article
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-card"
        >
          <div class="event-card__image">
            <img
              :src="event.image"
              :alt="event.title"
              loading="lazy"
            />

            <div class="event-card__date">
              <span>{{ event.date }}</span>
            </div>

            <span class="event-card__category">
              {{ event.category }}
            </span>
          </div>

          <div class="event-card__content">
            <div class="event-card__meta">
              <span>{{ event.time }}</span>
              <span>{{ event.location }}</span>
            </div>

            <h3>{{ event.title }}</h3>

            <p>{{ event.description }}</p>

            <RouterLink
              :to="`/events/${event.id}`"
              class="event-card__link"
            >
              Se event
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </article>

      </div>

      <!-- Empty state -->
      <div
        v-if="filteredEvents.length === 0"
        class="events-empty"
      >
        <h3>Ingen events fundet</h3>
        <p>
          Prøv at ændre din søgning eller vælge en anden kategori.
        </p>
      </div>

    </section>

  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.events-page {
  min-height: 100vh;
  background-color: $background-color;
}

// Event overview
.events-section {
  padding: 4rem 5%;
  max-width: 1600px;
  margin: 0 auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    margin-bottom: 2rem;

    h2 {
      color: $hero-text-color;
      font-size: clamp(2rem, 4vw, 3rem);
      margin-top: 0.5rem;
    }
  }
}

.events-count {
  color: $hero-text-color;
  opacity: 0.7;
}

// Category filters
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.category-filter {
  padding: 0.7rem 1.2rem;
  border: 1px solid $hero-text-color;
  border-radius: 50px;
  background-color: transparent;
  color: $hero-text-color;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: $primary-color;
    color: $background-color;
    border-color: $primary-color;
  }

  &--active {
    background-color: $primary-color;
    color: $background-color;
    border-color: $primary-color;
  }
}

// Event grid
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
}

.event-card {
  overflow: hidden;
  border-radius: 12px;
  background-color: $hero-text-color;
  transition: transform 0.3s ease;

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
      transition: transform 0.4s ease;
    }
  }

  &:hover &__image img {
    transform: scale(1.05);
  }

  &__date {
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
    color: $primary-color;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      gap: 0.8rem;
    }
  }
}

// Empty state
.events-empty {
  text-align: center;
  padding: 4rem 1rem;

  h3,
  p {
    color: $hero-text-color;
  }
}

// Responsive
@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .events-hero {
    min-height: 40vh;
    padding: 3rem 5%;
  }

  .events-section {
    padding: 3rem 5%;
  }

  .events-section__header {
    align-items: start;
    flex-direction: column;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-card__image {
    height: 220px;
  }
}
</style>
