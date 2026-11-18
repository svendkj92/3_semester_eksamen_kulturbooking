
<script setup>
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { interests } from '@/services/interestService';
import { getEvents } from '@/services/eventService';
import EventList from '@/components/EventList.vue';

const words = interests.map((interest) => `${interest.label.toLocaleUpperCase('da-DK')}?`);

const currentIndex = ref(0);
const currentWord = ref(words[currentIndex.value]);

let interval = null;

// Events
const events = ref([]);
const isLoading = ref(true);
const loadError = ref('');

const upcomingEvents = computed(() => {
  const now = Date.now();

  return [...events.value]
    .filter((event) => event.startsAt >= now)
    .sort((a, b) => a.startsAt - b.startsAt)
    .slice(0, 3);
});

async function loadEvents() {
  isLoading.value = true;
  loadError.value = '';

  try {
    events.value = await getEvents();
  } catch (error) {
    console.error('Kunne ikke hente events:', error);
    loadError.value = 'Events kunne ikke indlæses. Prøv igen senere.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % words.length;
    currentWord.value = words[currentIndex.value];
  }, 3000);

  loadEvents();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="landing-page">
    <main>
      <section class="hero">
        <div class="hero-content">
              <h1 class="hero-title">
                <span class="hero-title__intro">
                  Er du til
                </span>

                <span class="word-window">
                  <Transition name="roll" mode="out-in">
                    <span :key="currentWord" class="animated-word">
                      {{ currentWord }}
                    </span>
                  </Transition>
                </span>
              </h1>

          <p>
            Find oplevelser og fællesskaber for unge i Odense. 
            Uanset om du vil dyrke en interesse eller prøve noget nyt, 
            kan du finde noget, du har lyst til at være med til.
          </p>

          <RouterLink to="/onboarding" class="cta-button">
            Kom i gang
          </RouterLink>
        </div>
      </section>

      <section class="steps">
          <div class="step">
            <div class="step-icon">&#10004;</div>
            <h2>Opret bruger</h2>
            <p>Gå på opdagelse i musik, workshops og kreative events i Odense.</p>
          </div>
          <div class="step">
            <div class="step-icon">&#10004;</div>
            <h2>Vælg dine interesser</h2>
            <p>Vælg dine interesser, når du opretter en profil, og få forslag til events, der matcher det, du godt kan lide.</p>
          </div>
          <div class="step">
            <div class="step-icon">&#10004;</div>
            <h2>Find events og fællesskaber</h2>
            <p>Find et event, der vækker din nysgerrighed, og mød andre, der også har lyst til at være med.</p>
          </div>
      </section>

      <section class="upcoming-events">
        <div class="upcoming-events__header">
          <h2>Kommende events</h2>
          <p>
            Find inspiration til din næste oplevelse i Odense.
          </p>
        </div>

        <p v-if="isLoading" class="events-message">
          Henter kommende events...
        </p>

        <p v-else-if="loadError" class="events-message">
          {{ loadError }}
        </p>

        <template v-else>
          <EventList
            v-if="upcomingEvents.length"
            :events="upcomingEvents"
          />

          <p v-else class="events-message">
            Der er ingen kommende events lige nu. Kig forbi igen senere!
          </p>
        </template>

        <RouterLink to="/events" class="cta-button">
          Se alle events
        </RouterLink>
      </section>

      <section class="social-proof"> 
        <div class="testimonials">
          <div class="testimonial-card">
            <p><span lang="en">"Somebody always kind of has your back."</span> - Event deltager</p>
          </div>
          <div class="testimonial-card">
            <p><span lang="en">"KulturBooking is a place for people to find their place and their voice."</span> - Event deltager</p>
          </div>
          <div class="testimonial-card">
            <p>"Det handler om både at lave events, som alle kan være med til, men også at støtte unge kunstnere og artister her i Odense." - Event deltager</p>
          </div>
        </div>
        <div class="highlight-video">
          <img src="@/assets/img/video_placeholder.jpg" alt="Highlight video" />

        </div>
      </section>

      <!-- About section -->
      <section id="about" class="about">
        <h2>Om KulturBooking</h2>

        <p>
          KulturBooking er en kreativ og kulturel platform bygget for unge mennesker i Odense, Danmark. Siden 2025 har vi forbundet musikere, dansere, billedkunstnere og kulturelle fællesskaber med de muligheder, rum og netværk de behøver for at få ting til at ske.
        </p>
        <p>
          Vi producerer events, bygger kreative fællesskaber, støtter kunstnere og giver organisationer infrastrukturen til at nå og engagere unge mennesker på måder der holder.
        </p>
      </section>
    </main>

  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.landing-page {
  min-height: 100vh;
  width: 100%;
  background-color: $background-color;
}


.hero {
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;

  background-image:
  radial-gradient(
    #292B40F2 0%,
    #292B40BF 60%,
    #292B401A 100%
  ),
  url('@/assets/img/hero_image.jpg');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

    h1 {
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 700;
    line-height: 1.1;
    color: $background-color;
  }
    p {
    font-size: clamp(1rem, 2vw, 1.5rem);
    color: $background-color;
    margin: 0 clamp(2rem, 10vw, 50%);
    line-height: 1.25;
  }
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  font-size: clamp(2.5rem, 10vw, 6rem);
  line-height: 1.05;
  font-weight: 700;
}

.hero-title__intro {
  display: block;
}

.word-window {
  align-items: center;
  overflow: hidden;
}

.animated-word {
  display: inline-block;
  color: $background-color;
  white-space: nowrap;
  font-size: clamp(2.5rem, 12vw, 8rem);
}

.roll-enter-active,
.roll-leave-active {
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.roll-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.roll-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.roll-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.roll-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: start;
  padding: 1rem 5%;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  border-radius: 8px;
  width: 100%;

  h2 {
    color: $hero-text-color;
    font-size: clamp(0.8rem, 2vw, 1.5rem);
    font-weight: bold;
  }

  p {
    color: $hero-text-color;
    font-size: clamp(0.7rem, 1vw, 1.5rem);
    line-height: 1.25;
    margin: 1rem;
  }
}

.step-icon {
  width: clamp(40px, 5vw, 60px);
  height: clamp(40px, 5vw, 60px);
  border-radius: 20%;
  background-color: $primary-color;
  color: $background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.upcoming-events {
  padding: 4rem 5%;
  text-align: center;

  &__header {
    margin-bottom: 2rem;

    h2 {
      color: $hero-text-color;
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      margin-bottom: 0.75rem;
    }

    p {
      color: $hero-text-color;
      opacity: 0.8;
    }
  }

  .events-message {
    color: $hero-text-color;
    margin: 2rem 0;
  }

  .cta-button {
    margin-top: 2.5rem;
  }
}

.social-proof {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem 5%;
  background-color: $hero-text-color;
}

.testimonials {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  p {
    color: $hero-text-color;
    font-style: italic;
    color: $background-color;
  }
}

.highlight-video {
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  margin-top: 1.5rem;
  background-color: $cta-color;
  color: $hero-text-color;
  border-radius: 8px;
  text-decoration: none;
}

.about {
  padding: 4rem 5%;
  margin: 0 auto;
  max-width: 800px;
  text-align: center;

  h2, p {
    color: $hero-text-color;
  }
}

@media (min-width: 576px) {

  .hero{
    min-height: 60vh;
  }
    
  .hero-content {
    h1 {
      font-size: 3rem;
    }

    p {
      font-size: 1.5rem;
    }
  }
}

@media (min-width: 768px) {

  .hero{
    min-height: 70vh;
  }

  .social-proof {
    flex-direction: row;
  }

  .testimonials {
    min-width: 50%;
  }
}

@media (min-width: 1024px) {

  .social-proof {
    flex-direction: row;
  }
}

@media (min-width: 1440px) {

  .hero{
    min-height: 90vh;
  }

  .social-proof {
    flex-direction: row;
  }
}

@media (prefers-reduced-motion: reduce) {
  .roll-enter-active,
  .roll-leave-active {
    transition: none;
  }
}
</style>
