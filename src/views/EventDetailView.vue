<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getEvent } from '@/services/eventService';
import { formatEventDate, formatEventTime } from '@/services/eventData';
import { cancelRegistration, getRegistrations, registerForEvent } from '@/services/registrationService';

const route = useRoute();
const event = ref(null);
const user = shallowRef(null);
const authReady = ref(false);
const isLoading = ref(true);
const loadError = ref('');
const isRegistered = ref(false);
const isSaving = ref(false);
const registrationError = ref('');
const registrationMessage = ref('');
const now = ref(Date.now());
const hasStarted = computed(() => event.value && event.value.startsAt <= now.value);
let requestId = 0;
let unsubscribe;
let clock;

async function loadEvent() {
  if (!authReady.value) return;
  const id = ++requestId;
  const uid = user.value?.uid;
  event.value = null;
  isRegistered.value = false;
  isLoading.value = true;
  isSaving.value = false;
  loadError.value = '';
  registrationError.value = '';
  registrationMessage.value = '';
  try {
    const data = await getEvent(route.params.id);
    const registrations = data && uid ? await getRegistrations(uid) : {};
    if (id !== requestId) return;
    event.value = data;
    isRegistered.value = Boolean(data && registrations[data.id]);
  } catch {
    if (id === requestId) {
      loadError.value = 'Eventet eller dine tilmeldinger kunne ikke indlæses. Kontrollér forbindelsen og prøv igen.';
    }
  } finally {
    if (id === requestId) isLoading.value = false;
  }
}

async function toggleRegistration() {
  if (isSaving.value || !event.value) return;
  registrationError.value = '';
  registrationMessage.value = '';
  if (!user.value || auth.currentUser?.uid !== user.value.uid) {
    registrationError.value = 'Du skal være logget ind for at tilmelde dig.';
    return;
  }
  const wasRegistered = isRegistered.value;
  if (!wasRegistered && event.value.startsAt <= Date.now()) {
    now.value = Date.now();
    registrationError.value = 'Tilmelding er lukket, fordi eventet er startet.';
    return;
  }
  const id = requestId;
  const uid = user.value.uid;
  const eventId = event.value.id;
  isSaving.value = true;
  try {
    if (wasRegistered) await cancelRegistration(uid, eventId);
    else await registerForEvent(uid, eventId);
    if (id !== requestId) return;
    isRegistered.value = !wasRegistered;
    registrationMessage.value = wasRegistered ? 'Du er nu afmeldt eventet.' : 'Du er nu tilmeldt eventet.';
  } catch {
    if (id === requestId) {
      registrationError.value = 'Ændringen kunne ikke bekræftes gemt. Eventet kan være startet, eller adgangen er afvist. Prøv igen eller genindlæs siden.';
    }
  } finally {
    if (id === requestId) isSaving.value = false;
  }
}

watch([() => route.params.id, user, authReady], loadEvent);

onMounted(() => {
  clock = setInterval(() => { now.value = Date.now(); }, 1000);
  unsubscribe = onAuthStateChanged(auth, (authUser) => {
    user.value = authUser;
    authReady.value = true;
  }, () => {
    ++requestId;
    event.value = null;
    isLoading.value = false;
    loadError.value = 'Loginstatus kunne ikke indlæses. Genindlæs siden og prøv igen.';
  });
});

onUnmounted(() => {
  ++requestId;
  unsubscribe?.();
  clearInterval(clock);
});
</script>

<template>
  <div class="event-detail-page">
    <RouterLink class="back-link" :to="{ name: 'events' }">
      <span aria-hidden="true">←</span> Tilbage til events
    </RouterLink>

    <p v-if="isLoading" role="status">Indlæser event…</p>
    <div v-else-if="loadError">
      <p role="alert">{{ loadError }}</p>
      <button type="button" @click="loadEvent">Prøv igen</button>
    </div>
    <article v-else-if="event" class="event-detail" aria-labelledby="event-title">
      <img class="event-image" :src="event.image" :alt="event.title" />
      <div class="event-content">
        <p class="event-category">{{ event.category }}</p>
        <h1 id="event-title">{{ event.title }}</h1>
        <dl class="event-facts">
          <div>
            <dt>Dato og tid</dt>
            <dd>
              <time :datetime="new Date(event.startsAt).toISOString()">
                {{ formatEventDate(event.startsAt) }} kl. {{ formatEventTime(event.startsAt) }}
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
        <div class="registration-notice">
          <p v-if="isRegistered">Du er tilmeldt dette event.</p>
          <p v-if="hasStarted">Eventet er startet. Der kan ikke oprettes nye tilmeldinger.</p>
          <p v-else-if="!user">
            Log ind for at tilmelde dig.
            <RouterLink to="/onboarding">Gå til brugeroprettelse</RouterLink>
          </p>
          <button
            v-if="user && (isRegistered || !hasStarted)"
            class="registration-button"
            type="button"
            :disabled="isSaving"
            @click="toggleRegistration"
          >
            {{ isSaving ? 'Gemmer…' : isRegistered ? 'Afmeld event' : 'Tilmeld event' }}
          </button>
          <p v-if="registrationError" role="alert">{{ registrationError }}</p>
          <p v-if="registrationMessage" role="status">{{ registrationMessage }}</p>
        </div>
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

  a {
    color: $primary-color;
    text-decoration: underline;
  }
}

.registration-button {
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 6px;
  background-color: $primary-color;
  color: $background-color;
  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid $primary-color;
    outline-offset: 4px;
  }
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
