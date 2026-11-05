
<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const words = [
  'DANS?',
  'KERAMIK?',
  'KUNST?',
  'MUSIK?',
  'TEATER?',
  'FOTOGRAFI?',
];

const currentIndex = ref(0);

const currentWord = ref(words[currentIndex.value]);

let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % words.length;

    currentWord.value = words[currentIndex.value];
  }, 3000);
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
            Udforsk et bredt udvalg af kulturelle oplevelser i Odense.
            Find inspiration til din næste oplevelse.
          </p>

          <RouterLink to="/onboarding" class="cta-button">
            Kom i gang
          </RouterLink>
        </div>
      </section>

      <section class="steps">
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h2>Step 1</h2>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h2>Step 2</h2>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h2>Step 3</h2>
          </div>
        </div>
      </section>

      <section class="social-proof"> 
        <div class="testimonials">
          <div class="testimonial-card">
            <p>"KulturBooking har ændret måden, jeg søger efter kulturelle arrangementer på." - Fake person 1</p>
          </div>
          <div class="testimonial-card">
            <p>"Jeg har opdaget så mange nye kunstnere og events gennem KulturBooking!" - Fake person 2</p>
          </div>
          <div class="testimonial-card">
            <p>"KulturBooking har hjulpet mig med at finde nye og spændende kulturelle oplevelser." - Fake person 3</p>
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
  min-height: 70vh;
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
  }
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  font-size: clamp(3rem, 10vw, 6rem);
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
  font-size: clamp(3rem, 12vw, 8rem);
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
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
  padding: 1rem 5%;
}

.step-number {
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

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  border-radius: 8px;
  h2 {
    color: $hero-text-color;
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
