<script setup>
import { RouterLink } from 'vue-router';

const year = new Date().getFullYear();
const sections = [
  {
    title: 'Udforsk',
    links: [
      { title: 'Events', to: '/events' },
      { title: 'Skabere', to: '/skabere' },
      { title: 'Hangouts', to: '/hangouts' },
      { title: 'Fællesskaber', to: '/faellesskaber' },
    ],
  },
  {
    title: 'Om',
    links: [
      { title: 'Om KulturBooking', to: '/om' },
      { title: 'Effekt', to: '/effekt' },
      { title: 'Kontakt', to: '/kontakt' },
      { title: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Jura & sikkerhed',
    links: [
      { title: 'Privatliv', to: '/privatliv' },
      { title: 'Servicevilkår', to: '/servicevilkaar' },
      { title: 'Data & sikkerhed', to: '/data-sikkerhed' },
    ],
  },
];
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <RouterLink class="footer-brand" to="/" aria-label="KulturBooking – forsiden">
        <img src="@/assets/kb_logo.png" alt="" width="48" height="48" />
        <span>KulturBooking</span>
      </RouterLink>

      <nav class="footer-navigation" aria-label="Footernavigation">
        <div v-for="section in sections" :key="section.title" class="footer-section">
          <h2>{{ section.title }}</h2>
          <ul>
            <li v-for="link in section.links" :key="link.to">
              <RouterLink :to="link.to">{{ link.title }}</RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="footer-bottom">
        <p>© {{ year }} KulturBooking. For unge, af unge.</p>
        <button
          class="feedback-button"
          type="button"
          disabled
          title="Feedback kommer snart"
          aria-label="Feedback – kommer snart"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4 22l6-3.2c.7.1 1.3.2 2 .2 5.5 0 10-3.6 10-8S17.5 3 12 3Z" />
          </svg>
          Feedback
        </button>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.footer {
  padding: 2.5rem 1rem 1rem;
  background-color: #f7f8ef;
  color: $hero-text-color;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  margin: 0 auto 1.25rem;
  color: $primary-color;
  text-decoration: none;

  img {
    display: block;
    object-fit: contain;
  }

  span {
    font-size: 0.75rem;
    letter-spacing: 0.125em;
    text-transform: uppercase;
  }
}

.footer-navigation {
  display: grid;
  gap: 1.5rem;
}

.footer-section {
  min-width: 0;

  h2 {
    margin-bottom: 0.375rem;
    color: $primary-color;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li + li {
    margin-top: 0.125rem;
  }

  a {
    display: inline-block;
    padding: 0.125rem 0;
    overflow-wrap: anywhere;
    font-size: 0.875rem;
    text-decoration: none;

    &:hover {
      color: $primary-color;
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }
}

.footer {
  a {
    &:focus-visible {
      outline: 2px solid $primary-color;
      outline-offset: 4px;
      border-radius: 2px;
    }
  }
}

.footer-bottom {
  display: grid;
  justify-items: center;
  gap: 1rem;
  margin-top: 1.25rem;

  p {
    color: $secondary-color;
    font-size: 0.75rem;
    text-align: center;
  }
}

.feedback-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  border: 0;
  border-radius: 999px;
  background-color: $primary-color;
  color: $background-color;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba($primary-color, 0.2);
  cursor: not-allowed;

  svg {
    width: 1rem;
    height: 1rem;
  }
}

@media (min-width: 600px) {
  .footer-navigation {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  .footer-bottom {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;

    p {
      grid-column: 2;
    }
  }

  .feedback-button {
    grid-column: 3;
    justify-self: end;
  }
}
</style>