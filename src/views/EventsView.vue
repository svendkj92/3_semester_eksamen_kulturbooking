
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import { interests } from '@/services/interestService';
import { getEvents } from '@/services/eventService';
import EventList from '@/components/EventList.vue';
import { useI18n } from 'vue-i18n';
import { useEventFormatting } from '@/i18n/useEventFormatting';

const { t } = useI18n();
const { interestLabel } = useEventFormatting();
const events = ref([]);
const isLoading = ref(true);
const loadError = ref('');
let requestId = 0;

async function loadEvents() {
  const id = ++requestId;
  isLoading.value = true;
  loadError.value = '';
  try {
    const data = await getEvents();
    if (id === requestId) events.value = data;
  } catch {
    if (id === requestId) loadError.value = 'events.loadError';
  } finally {
    if (id === requestId) isLoading.value = false;
  }
}

onMounted(loadEvents);
onUnmounted(() => { ++requestId; });

const searchQuery = ref('');
const selectedCategory = ref('Alle');
const selectedPriceRange = ref('Alle');

const categories = ['Alle', ...interests.map((interest) => interest.value)];

const priceRanges = computed(() => [
  { label: t('events.allPrices'), value: 'Alle' },
  { label: t('common.free'), value: 'gratis' },
  { label: t('events.range', { min: 1, max: 100 }), value: '1-100' },
  { label: t('events.range', { min: 101, max: 250 }), value: '101-250' },
  { label: t('events.range', { min: 251, max: 500 }), value: '251-500' },
  { label: t('events.over500'), value: '500+' },
]);

function getPriceAmount(price) {
  if (typeof price !== 'string') return null;

  if (price.toLowerCase().includes('gratis')) {
    return 0;
  }

  const amount = price.match(/\d[\d.]*(?:,\d+)?/);

  if (!amount) return null;

  return Number(
    amount[0].replace(/\./g, '').replace(',', '.')
  );
}

const filteredEvents = computed(() => {
  return events.value
    .filter((event) => {
      const matchesCategory =
        selectedCategory.value === 'Alle' ||
        event.category === selectedCategory.value;

      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.value.toLowerCase());

      const price = getPriceAmount(event.price);

      const matchesPrice = (() => {
        switch (selectedPriceRange.value) {
          case 'gratis':
            return price === 0;

          case '1-100':
            return price !== null && price >= 1 && price <= 100;

          case '101-250':
            return price !== null && price >= 101 && price <= 250;

          case '251-500':
            return price !== null && price >= 251 && price <= 500;

          case '500+':
            return price !== null && price > 500;

          default:
            return true;
        }
      })();

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => a.startsAt - b.startsAt);
});
</script>

<template>
  <main class="events-page">

    <!-- Events overview -->
    <section class="events-section">

      <div class="events-section__header">
        <h1 tabindex="-1">{{ t('events.explore') }}</h1>
        <p v-if="!isLoading && !loadError" class="events-count">
          {{ t('events.count', { count: filteredEvents.length }) }}
        </p>
      </div>

      <p v-if="isLoading" role="status">{{ t('events.loading') }}</p>
      <div v-else-if="loadError">
        <p role="alert">{{ t(loadError) }}</p>
        <button type="button" @click="loadEvents">{{ t('common.retry') }}</button>
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
          {{ category === 'Alle' ? t('common.all') : interestLabel(category) }}
        </button>
      </div>

      <!-- Price filter -->
      <div class="price-filter">
        <label for="event-price-filter">{{ t('events.price') }}</label>

        <select id="event-price-filter" v-model="selectedPriceRange">
          <option
            v-for="range in priceRanges"
            :key="range.value"
            :value="range.value"
          >
            {{ range.label }}
          </option>
        </select>
      </div>

      <EventList
        v-if="!isLoading && !loadError"
        :events="filteredEvents"
      />

      <!-- Empty state -->
      <div
        v-if="!isLoading && !loadError && filteredEvents.length === 0"
        class="events-empty"
      >
        <h3>{{ t('events.none') }}</h3>
        <p>
          {{ t('events.changeFilters') }}
        </p>
      </div>

    </section>

    <RouterView />
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
  margin: 0 auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    margin-bottom: 2rem;

    h1 {
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

  &:focus-visible {
    outline: $focus-ring-outer solid $focus-ring-outer-color;
    outline-offset: $focus-ring-inner;
    box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
  }
}

//Price filters
.price-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: -1rem 0 2.5rem;
  color: $hero-text-color;

  label {
    font-weight: bold;
  }

  select {
    min-width: 160px;
    padding: 0.7rem 2.2rem 0.7rem 1rem;
    border: 1px solid $hero-text-color;
    border-radius: 50px;
    background-color: transparent;
    color: $hero-text-color;
    font: inherit;
    cursor: pointer;

    option {
      color: $hero-text-color;
      background-color: $background-color;
    }

    &:focus-visible {
      outline: $focus-ring-outer solid $focus-ring-outer-color;
      outline-offset: $focus-ring-inner;
      box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
    }
  }
}

// Event container
.events-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
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
@media (min-width: 768px) {

  .events-section {
    padding: 3rem 5%;
    gap: 1.5rem;
  }

  .events-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .events-section__header {
    align-items: start;
    flex-direction: column;
  }

}

@media (min-width: 1024px) {
  .events-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

</style>
