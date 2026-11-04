
<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="landing-page">

    <!-- Hero section -->
    <main>
      <section class="hero">
        <div class="hero-content">
          <h1>
            Find din næste kulturoplevelse
          </h1>

          <p>
            Oplev kultur, der matcher dine interesser.
            Find inspiration til din næste oplevelse.
          </p>

          <RouterLink to="/onboarding" class="cta-button">
            CTA
          </RouterLink>
        </div>
      </section>

      <section class="steps">
        <div class="steps">
          <div class="step">
            <h2>Opret din konto</h2>
          </div>
          <div class="step">
            <h2>Vælg dine interesser</h2>
          </div>
          <div class="step">
            <h2>Få anbefalinger til events</h2>
          </div>
        </div>
      </section>

      <section class="social-proof"> 
        <div class="testimonials">
          <p>"KulturBooking har ændret måden, jeg søger efter kulturelle arrangementer på." - Fake person 1</p>
          <p>"Jeg har opdaget så mange nye kunstnere og events gennem KulturBooking!" - Fake person 2</p>
          <p>"KulturBooking har hjulpet mig med at finde nye og spændende kulturelle oplevelser." - Fake person 3</p>
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
    #292B40BF 40%,
    #292B401A 100%
  ),
  url('@/assets/img/hero_image.jpg');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-content {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: $background-color;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: $background-color;
  }
}

.steps {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
  padding: 2rem 5%;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  h2 {
    color: $hero-text-color;
  }
}

.social-proof {
  display: flex;
  flex-direction: row;
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
  max-width: 400px;
  p {
    color: $hero-text-color;
    font-style: italic;
    color: $background-color;
  }
}

.highlight-video {
  max-width: 400px;
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
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
</style>
