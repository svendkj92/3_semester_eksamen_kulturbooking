
<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="landing-page">

    <!-- Navigation -->
    <header class="header">
      <RouterLink to="/" class="logo">
        <img src="@/assets/kb_logo.png" alt="KulturBooking" />
      </RouterLink>

      <nav>
        <a href="#about">Om os</a>
        <RouterLink to="/login">Log ind</RouterLink>
        <RouterLink to="/onboarding" class="cta-button">
          Kom i gang
        </RouterLink>
      </nav>
    </header>

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
            Kom i gang
          </RouterLink>
        </div>
      </section>

      <!-- About section -->
      <section id="about" class="about">
        <h2>Om KulturBooking</h2>

        <p>
          KulturBooking hjælper dig med at opdage
          kulturelle oplevelser.
        </p>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2026 KulturBooking</p>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.landing-page {
  min-height: 100vh;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
}

.logo {
  display: flex;
  align-items: center;

  img {
    width: 90px;
    height: auto;
  }
}

nav {
  display: flex;
  align-items: center;
  gap: 2rem;

  a {
    text-decoration: none;
  }
}

.hero {
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background-color: $hero-text-color;
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
  text-align: center;
}

.footer {
  padding: 2rem 5%;
  text-align: center;
}
</style>
