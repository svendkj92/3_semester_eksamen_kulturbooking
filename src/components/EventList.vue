
<script setup>
import EventCard from './EventCard.vue';

defineProps({
  events: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="events-container">
    <EventCard
      v-for="event in events"
      :key="event.id"
      :event="event"
    />
  </div>
</template>

<style lang="scss" scoped>
.events-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 350px));
  justify-content: center;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .events-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .events-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
