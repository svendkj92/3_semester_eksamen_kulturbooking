<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const year = new Date().getFullYear();
const sections = [
  {
    title: 'footer.explore',
    links: [
      { title: 'nav.events', to: '/events' },
      { title: 'info.skabere.title', to: '/skabere' },
      { title: 'info.hangouts.title', to: '/hangouts' },
      { title: 'info.faellesskaber.title', to: '/faellesskaber' },
    ],
  },
  {
    title: 'footer.about',
    links: [
      { title: 'info.om.title', to: '/om' },
      { title: 'info.effekt.title', to: '/effekt' },
      { title: 'info.kontakt.title', to: '/kontakt' },
      { title: 'info.blog.title', to: '/blog' },
    ],
  },
  {
    title: 'footer.legal',
    links: [
      { title: 'info.privatliv.title', to: '/privatliv' },
      { title: 'info.servicevilkaar.title', to: '/servicevilkaar' },
      { title: 'info.data-sikkerhed.title', to: '/data-sikkerhed' },
    ],
  },
];
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
  <img src="@/assets/kb_logo.png" alt="" width="48" height="48" />
  <span>KulturBooking</span>
</div>

      <nav class="footer-navigation" :aria-label="t('footer.navigation')">
        <div v-for="section in sections" :key="section.title" class="footer-section">
          <h2>{{ t(section.title) }}</h2>
          <ul>
            <li v-for="link in section.links" :key="link.to">
              <RouterLink :to="link.to">{{ t(link.title) }}</RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="footer-bottom">
        <p>{{ t('footer.copyright', { year }) }}</p>
        <button
          class="feedback-button"
          type="button"
          disabled
          :title="t('footer.feedbackSoon')"
          :aria-label="t('footer.feedbackSoon')"
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
      outline: $focus-ring-outer solid $focus-ring-outer-color;
      outline-offset: $focus-ring-inner;
      box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
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