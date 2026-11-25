<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getEvent } from '@/services/eventService';
import { cancelRegistration, getRegistrations, registerForEvent } from '@/services/registrationService';
import { useI18n } from 'vue-i18n';
import { useEventFormatting } from '@/i18n/useEventFormatting';
import { getEventDescription } from '@/i18n/eventDescriptions';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const { t, locale } = useI18n();
const { eventDate, eventTime, eventPrice, interestLabel } = useEventFormatting();
const props = defineProps({
  eventId: {
    type: String,
    default: null,
  },
});

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['registration-changed', 'close']);

const activeEventId = computed(() => props.eventId || route.params.id);
const dialog = ref(null);
let returnFocus;
let previousOverflow;
const parentRoute = computed(() => route.name === 'profile-event-detail' ? 'profile' : 'events');

async function closeDialog() {
  if (props.eventId) {
    emit('close');
    return;
  }

  await router.push({ name: parentRoute.value });
}
const event = ref(null);
const description = computed(() => event.value ? getEventDescription(event.value, locale.value) : null);
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
    const data = await getEvent(activeEventId.value);
    const registrations = data && uid ? await getRegistrations(uid) : {};
    if (id !== requestId) return;
    event.value = data;
    isRegistered.value = Boolean(data && registrations[data.id]);
  } catch {
    if (id === requestId) {
      loadError.value = 'events.detailError';
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
    registrationError.value = 'events.authRequired';
    return;
  }
  const wasRegistered = isRegistered.value;
  if (!wasRegistered && event.value.startsAt <= Date.now()) {
    now.value = Date.now();
    registrationError.value = 'events.registrationClosed';
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
    registrationMessage.value = wasRegistered
      ? 'events.cancelled'
      : 'events.joined';
    emit('registration-changed');
  } catch {
    if (id === requestId) {
      registrationError.value = 'events.saveError';
    }
  } finally {
    if (id === requestId) isSaving.value = false;
  }
}

watch([activeEventId, user, authReady], loadEvent);

onMounted(() => {
  returnFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.value.showModal();
  clock = setInterval(() => { now.value = Date.now(); }, 1000);
  unsubscribe = onAuthStateChanged(auth, (authUser) => {
    user.value = authUser;
    authReady.value = true;
  }, () => {
    ++requestId;
    event.value = null;
    isLoading.value = false;
    loadError.value = 'profile.authError';
  });
});

onUnmounted(() => {
  ++requestId;
  unsubscribe?.();
  clearInterval(clock);
  document.body.style.overflow = previousOverflow;
  nextTick(() => {
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
    else document.querySelector('main h1[tabindex="-1"]')?.focus();
  });
});
</script>

<template>
  <dialog
    ref="dialog"
    class="event-detail-page"
    :aria-labelledby="event ? 'event-title' : 'dialog-title'"
    @cancel.prevent="closeDialog"
    @keydown.esc.prevent.stop="closeDialog"
  >
    <div class="dialog-toolbar">
      <h2 v-if="!event" id="dialog-title">{{ t('events.details') }}</h2>
      <LanguageSwitcher />
      <button class="close-button" type="button" :aria-label="t('events.close')" autofocus @click="closeDialog">
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <p v-if="isLoading" role="status">{{ t('events.loadingDetail') }}</p>
    <div v-else-if="loadError">
      <p role="alert">{{ t(loadError) }}</p>
      <button type="button" @click="loadEvent">{{ t('common.retry') }}</button>
    </div>
    <article v-else-if="event" class="event-detail" aria-labelledby="event-title">
      <img class="event-image" :src="event.image" :alt="event.title" />
      <div class="event-content">
        <p class="event-category">{{ interestLabel(event.category) }}</p>
        <h2 id="event-title" class="event-title">{{ event.title }}</h2>
        <dl class="event-facts">
          <div>
            <dt>{{ t('events.date') }}</dt>
            <dd>
              <time :datetime="new Date(event.startsAt).toISOString()">
                {{ eventDate(event.startsAt) }} {{ t('common.at') }} {{ eventTime(event.startsAt) }}
              </time>
            </dd>
          </div>
          <div>
            <dt>{{ t('events.location') }}</dt>
            <dd>{{ event.location }}</dd>
          </div>
          <div>
            <dt>{{ t('events.price') }}</dt>
            <dd>{{ eventPrice(event.price) }}</dd>
          </div>
        </dl>
        <section aria-labelledby="event-description">
          <h2 id="event-description">{{ t('events.about') }}</h2>
          <p :lang="description.lang">{{ description.text }}</p>
        </section>
        <div class="registration-notice">
          <p v-if="hasStarted" class="registration-warning">{{ t('events.closed') }}</p>
          <p v-else-if="!user">
            {{ t('events.loginRequired') }}
            <RouterLink :to="{ name: 'login', query: { redirect: `/events/${event.id}` } }">{{ t('common.login') }}</RouterLink>
          </p>
          <button
            v-if="user && (isRegistered || !hasStarted)"
            class="registration-button"
            :class="{ 'registration-button--cancel': isRegistered }"
            type="button"
            :disabled="isSaving"
            @click="toggleRegistration"
          >
            {{ t(isSaving ? 'common.saving' : isRegistered ? 'events.cancel' : 'events.register') }}
          </button>
          <p v-if="registrationError" role="alert">{{ t(registrationError) }}</p>
          <p v-if="registrationMessage" class="registration-feedback" role="status">{{ t(registrationMessage, { title: event.title }) }}</p>
        </div>
      </div>
    </article>

    <section v-else class="not-found" aria-labelledby="not-found-title">
      <h2 id="not-found-title">{{ t('events.notFound') }}</h2>
      <p>{{ t('events.notFoundText') }}</p>
    </section>
  </dialog>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.event-detail-page {
  width: min(1000px, calc(100% - 2rem));
  max-width: none;
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 1rem 1rem 2rem;
  border: 0;
  border-radius: 16px;
  overflow-y: auto;
  background-color: $hero-text-color;
  color: $background-color;

  &::backdrop {
    background-color: rgba($hero-text-color, 0.65);
  }
}

.dialog-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;

  h2 {
    flex-basis: 100%;
    margin-right: auto;
  }
}

.close-button {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 1px solid $secondary-color;
  border-radius: 50%;
  background: transparent;
  color: $background-color;
  font-size: 1.75rem;
  cursor: pointer;

  &:hover {
    background-color: rgba($primary-color, 0.08);
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
  background-color: $background-color;
  color: $hero-text-color;
  font-size: 0.875rem;
  font-weight: 600;
}

.event-title {
  margin: 0.75rem 0 1.5rem;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.2;
}

.event-content section h2 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.event-facts {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;

  dt {
    color: $background-color;
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

.registration-feedback {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-left: 3px solid $success-color;
  border-radius: 4px;
  background-color: $background-color;
  color: $success-color;
}

.registration-warning,
.event-detail-page [role="alert"],
.not-found {
  color: $error-color;
}

.event-detail-page [role="alert"] {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-left: 3px solid $error-color;
  border-radius: 4px;
  background-color: $background-color;
}

.registration-button {
  margin: 0.75rem 0;
  min-height: $min-touch-target;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: $radius-button;
  background-color: $cta-color;
  color: $hero-text-color;
  font: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: $cta-color-hover;
  }

  &--cancel {
    background-color: $primary-color;
    color: $background-color;

    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  &:focus-visible {
    outline: $focus-ring-outer solid $focus-ring-outer-color;
    outline-offset: $focus-ring-inner;
    box-shadow: 0 0 0 $focus-ring-inner $focus-ring-inner-color;
  }
}

@media (min-width: 768px) {
  .event-detail-page {
    padding: 1rem 2rem 2rem;
  }

  .event-detail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 2.5rem;
  }
}
</style>
