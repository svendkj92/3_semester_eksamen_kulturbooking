<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getUserProfile, updateUserInterests, updateUserProfile } from '@/services/userService';
import { interests as interestOptions } from '@/services/interestService';
import { RouterLink, RouterView } from 'vue-router';
import { getEvents } from '@/services/eventService';
import { getRegistrations } from '@/services/registrationService';
import { formatEventDate, formatEventTime } from '@/services/eventData';

const user = shallowRef(null);
const profile = ref(null);
const interests = ref([]);
const isLoading = ref(true);
const loadError = ref('');
const isEditing = ref(false);
const draftInterests = ref([]);
const newInterest = ref('');
const isSaving = ref(false);
const editError = ref('');
const saveMessage = ref('');
const isEditingName = ref(false);
const draftName = ref('');
const isSavingName = ref(false);
const nameError = ref('');
const nameSaveMessage = ref('');
const displayName = computed(() => profile.value?.displayName || user.value?.displayName || 'Min profil');
let unsubscribe;
let requestId = 0;
let eventsRequestId = 0;
let clock;
const events = ref([]);
const registrations = ref({});
const eventsLoading = ref(false);
const eventsError = ref('');
const now = ref(Date.now());

const eventSections = computed(() => [
  {
    id: 'recommended',
    title: 'Anbefalede events',
    events: events.value.filter((event) => event.startsAt > now.value
      && interests.value.includes(event.category) && !registrations.value[event.id]),
    empty: interests.value.length
      ? 'Der er ingen kommende events, der matcher dine interesser, og som du ikke allerede er tilmeldt.'
      : 'Vælg interesser for at få anbefalet events.',
  },
  {
    id: 'my-events',
    title: 'Mine events',
    events: events.value.filter((event) => registrations.value[event.id]),
    empty: 'Du er ikke tilmeldt nogen events endnu.',
  },
]);

const unavailableRegistrations = computed(() => Object.keys(registrations.value)
  .filter((id) => !events.value.some((event) => event.id === id)).length);

async function loadProfileEvents(authUser = user.value) {
  const id = ++eventsRequestId;
  events.value = [];
  registrations.value = {};
  eventsError.value = '';
  eventsLoading.value = Boolean(authUser);
  if (!authUser) return;
  try {
    const [eventData, registrationData] = await Promise.all([
      getEvents(),
      getRegistrations(authUser.uid),
    ]);
    if (id !== eventsRequestId) return;
    events.value = eventData;
    registrations.value = registrationData;
  } catch {
    if (id === eventsRequestId) {
      eventsError.value = 'Events og tilmeldinger kunne ikke indlæses. Kontrollér forbindelsen og prøv igen.';
    }
  } finally {
    if (id === eventsRequestId) eventsLoading.value = false;
  }
}

async function loadProfile(authUser) {
  const id = ++requestId;
  user.value = authUser;
  profile.value = null;
  interests.value = [];
  loadError.value = '';
  isEditing.value = false;
  isSaving.value = false;
  draftInterests.value = [];
  newInterest.value = '';
  editError.value = '';
  saveMessage.value = '';
  isEditingName.value = false;
  draftName.value = '';
  isSavingName.value = false;
  nameError.value = '';
  nameSaveMessage.value = '';
  isLoading.value = Boolean(authUser);
  void loadProfileEvents(authUser);
  if (!authUser) return;

  try {
    const data = await getUserProfile(authUser.uid);
    if (id !== requestId) return;
    if (!data?.profile) {
      loadError.value = 'Din brugerprofil findes ikke endnu. Opret først din profil via tilmeldingen.';
      return;
    }
    if (data.interests != null
      && (!Array.isArray(data.interests)
        || !data.interests.every((interest) => typeof interest === 'string' && interest.trim()))) {
      loadError.value = 'Dine interesser har et ugyldigt format i databasen og kunne ikke indlæses.';
      return;
    }
    profile.value = data.profile;
    interests.value = data.interests ?? [];
  } catch {
    if (id === requestId) {
      loadError.value = 'Din profil kunne ikke indlæses. Kontrollér din forbindelse og prøv igen.';
    }
  } finally {
    if (id === requestId) isLoading.value = false;
  }
}

function startEditing() {
  draftInterests.value = [...interests.value];
  newInterest.value = '';
  editError.value = '';
  saveMessage.value = '';
  isEditing.value = true;
}

function cancelEditing() {
  editError.value = '';
  newInterest.value = '';
  isEditing.value = false;
}

function startEditingName() {
  draftName.value = displayName.value === 'Min profil' ? '' : displayName.value;
  nameError.value = '';
  nameSaveMessage.value = '';
  isEditingName.value = true;
}

function cancelEditingName() {
  nameError.value = '';
  isEditingName.value = false;
}

async function saveName() {
  if (isSavingName.value) return;
  if (!user.value || auth.currentUser?.uid !== user.value.uid) {
    nameError.value = 'Du skal være logget ind for at ændre dit navn.';
    return;
  }
  const trimmedName = draftName.value.trim();
  if (!trimmedName) {
    nameError.value = 'Skriv et navn, før du gemmer.';
    return;
  }
  const id = requestId;
  const uid = user.value.uid;
  isSavingName.value = true;
  nameError.value = '';
  try {
    await updateUserProfile(uid, { displayName: trimmedName });
    if (id !== requestId) return;
    profile.value = { ...profile.value, displayName: trimmedName };
    isEditingName.value = false;
    nameSaveMessage.value = 'Dit navn er gemt.';
  } catch {
    if (id === requestId) {
      nameError.value = 'Navnet kunne ikke gemmes. Prøv igen.';
    }
  } finally {
    if (id === requestId) isSavingName.value = false;
  }
}

function addInterest() {
  editError.value = '';
  const interest = newInterest.value.trim();
  if (!interest) {
    editError.value = 'Vælg en interesse, før du tilføjer den.';
    return;
  }
  if (!interestOptions.some((option) => option.value === interest)) {
    editError.value = 'Vælg en interesse fra listen.';
    return;
  }
  if (draftInterests.value.some((item) => item.toLocaleLowerCase('da') === interest.toLocaleLowerCase('da'))) {
    editError.value = 'Interessen er allerede på din liste.';
    return;
  }
  draftInterests.value.push(interest);
  newInterest.value = '';
}

async function saveInterests() {
  if (isSaving.value) return;
  if (!user.value || auth.currentUser?.uid !== user.value.uid) {
    editError.value = 'Du skal være logget ind for at gemme interesser.';
    return;
  }
  if (newInterest.value.trim()) {
    editError.value = 'Tilføj den valgte interesse eller ryd feltet, før du gemmer.';
    return;
  }
  const id = requestId;
  const uid = user.value.uid;
  const updatedInterests = [...draftInterests.value];
  isSaving.value = true;
  editError.value = '';
  try {
    await updateUserInterests(uid, updatedInterests);
    if (id !== requestId) return;
    interests.value = updatedInterests;
    isEditing.value = false;
    saveMessage.value = 'Dine interesser er gemt.';
  } catch {
    if (id === requestId) {
      editError.value = 'Ændringerne kunne ikke bekræftes gemt. Prøv at gemme igen.';
    }
  } finally {
    if (id === requestId) isSaving.value = false;
  }
}

onMounted(() => {
  clock = setInterval(() => { now.value = Date.now(); }, 1000);
  unsubscribe = onAuthStateChanged(auth, loadProfile, () => {
    ++requestId;
    ++eventsRequestId;
    events.value = [];
    registrations.value = {};
    user.value = null;
    profile.value = null;
    interests.value = [];
    isLoading.value = false;
    loadError.value = 'Loginstatus kunne ikke indlæses. Genindlæs siden og prøv igen.';
  });
});

onUnmounted(() => {
  ++requestId;
  ++eventsRequestId;
  clearInterval(clock);
  unsubscribe?.();
});
</script>

<template>
  <div class="profile-page">
    <header class="page-heading">
      <h1 tabindex="-1">Min profil</h1>
      <p>Dit overblik over interesser og kulturoplevelser.</p>
    </header>

    <p v-if="isLoading" class="profile-notice" role="status">Indlæser din profil…</p>
    <div v-else-if="loadError" class="profile-notice">
      <p class="error-message" role="alert">{{ loadError }}</p>
      <button v-if="user" class="action-button" type="button" @click="loadProfile(user)">
        Prøv igen
      </button>
    </div>
    <p v-else-if="!user" class="profile-notice" role="status">
      Log ind for at se din profil og dine interesser.
      <RouterLink to="/login">Log ind</RouterLink>
    </p>

    <div v-else-if="profile" class="profile-layout">
      <div class="profile-details">
        <section class="profile-identity" aria-labelledby="profile-name">
          <div class="avatar">
            <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="12" />
              <circle cx="100" cy="76" r="29" />
              <path d="M37 163a65 65 0 0 1 126 0 84 84 0 0 1-126 0Z" />
            </svg>
            <button
              class="icon-button avatar-button"
              type="button"
              aria-label="Tilføj profilbillede (kommer senere)"
              title="Tilføj profilbillede – kommer senere"
              disabled
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <div class="identity-name">
            <h2 id="profile-name">{{ displayName }}</h2>
            <button
              v-if="!isEditingName"
              class="icon-button edit-name-button"
              type="button"
              aria-label="Rediger navn"
              title="Rediger dit navn"
              @click="startEditingName"
            >
              <span aria-hidden="true">✎</span>
            </button>
          </div>
          <form v-if="isEditingName" class="name-editor" @submit.prevent="saveName">
            <fieldset :disabled="isSavingName">
              <legend class="visually-hidden">Rediger dit navn</legend>
              <label for="display-name">Dit navn</label>
              <input
                id="display-name"
                v-model="draftName"
                type="text"
                :aria-invalid="Boolean(nameError)"
                :aria-describedby="nameError ? 'name-error' : undefined"
              />
              <p v-if="nameError" id="name-error" class="error-message" role="alert">{{ nameError }}</p>
              <div class="editor-actions">
                <button class="action-button" type="submit">
                  {{ isSavingName ? 'Gemmer…' : 'Gem navn' }}
                </button>
                <button class="action-button secondary-button" type="button" @click="cancelEditingName">
                  Annuller
                </button>
              </div>
            </fieldset>
          </form>
          <p v-if="profile.email" class="profile-email">{{ profile.email }}</p>
          <p v-if="nameSaveMessage" class="save-message" role="status">{{ nameSaveMessage }}</p>
        </section>

        <section class="interests-section" aria-labelledby="interests-heading">
          <div class="section-heading">
            <h2 id="interests-heading">Mine interesser</h2>
            <button
              class="icon-button"
              type="button"
              aria-label="Rediger interesser"
              title="Tilføj eller fjern interesser"
              :aria-expanded="isEditing"
              :disabled="isEditing"
              @click="startEditing"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <form v-if="isEditing" class="interest-editor" @submit.prevent="addInterest">
            <fieldset :disabled="isSaving">
              <legend>Tilføj eller fjern interesser</legend>
              <ul class="interest-grid">
                <li v-for="(interest, index) in draftInterests" :key="interest">
                  <button
                    class="interest-chip remove-interest"
                    type="button"
                    :aria-label="`Fjern ${interest}`"
                    @click="draftInterests.splice(index, 1)"
                  >
                    {{ interest }} <span aria-hidden="true">×</span>
                  </button>
                </li>
              </ul>
              <label for="new-interest">Ny interesse</label>
              <select
                id="new-interest"
                v-model="newInterest"
                :aria-invalid="Boolean(editError)"
                :aria-describedby="editError ? 'interest-error' : undefined"
              >
                <option value="">Vælg en interesse</option>
                <option v-for="interest in interestOptions" :key="interest.value" :value="interest.value">
                  {{ interest.label }}
                </option>
              </select>
              <button class="action-button secondary-button" type="submit">Tilføj</button>
              <p v-if="editError" id="interest-error" class="error-message" role="alert">{{ editError }}</p>
              <div class="editor-actions">
                <button class="action-button" type="button" @click="saveInterests">
                  {{ isSaving ? 'Gemmer…' : 'Gem interesser' }}
                </button>
                <button class="action-button secondary-button" type="button" @click="cancelEditing">
                  Annuller
                </button>
              </div>
            </fieldset>
          </form>
          <ul v-else-if="interests.length" class="interest-grid">
            <li v-for="interest in interests" :key="interest" class="interest-chip">
              {{ interest }}
            </li>
          </ul>
          <p v-else class="empty-state">Du har ikke valgt nogen interesser endnu.</p>
          <p v-if="saveMessage" class="save-message" role="status">{{ saveMessage }}</p>
        </section>
      </div>

      <div class="event-sections">
        <p v-if="eventsLoading" role="status">Indlæser events og tilmeldinger…</p>
        <div v-else-if="eventsError">
          <p class="error-message" role="alert">{{ eventsError }}</p>
          <button type="button" @click="loadProfileEvents()">Prøv igen</button>
        </div>
        <section
          v-for="section in (eventsLoading || eventsError ? [] : eventSections)"
          :key="section.id"
          class="events-section"
          :aria-labelledby="`${section.id}-heading`"
        >
          <div class="section-heading">
            <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
          </div>
          <ul v-if="section.events.length" class="event-grid">
            <li v-for="event in section.events" :key="event.id">
              <article class="event-card">
                <img class="profile-event-image" :src="event.image" :alt="event.title" loading="lazy" />
                <div class="event-content">
                  <h3>{{ event.title }}</h3>
                  <p>{{ event.category }}</p>
                  <p>{{ formatEventDate(event.startsAt) }} kl. {{ formatEventTime(event.startsAt) }}</p>
                  <p>{{ event.location }}</p>
                  <p v-if="event.startsAt <= now">Eventet er startet</p>
                  <RouterLink
                    :to="{ name: 'profile-event-detail', params: { id: event.id } }"
                    aria-haspopup="dialog"
                  >
                    Se event<span class="visually-hidden">: {{ event.title }}</span>
                  </RouterLink>
                </div>
              </article>
            </li>
          </ul>
          <div v-else class="empty-state">
            <p>{{ section.empty }}</p>
            <RouterLink v-if="section.id === 'my-events'" class="find-events-button" :to="{ name: 'events' }">
              Find events
            </RouterLink>
          </div>
          <p v-if="section.id === 'my-events' && unavailableRegistrations" role="status">
            {{ unavailableRegistrations }} af dine tilmeldte events er ikke længere tilgængelige.
          </p>
        </section>
      </div>
      <RouterView @registration-changed="loadProfileEvents()" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.find-events-button {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background-color: $primary-color;
  color: $background-color;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background-color: $primary-color-hover;
  }

  &:focus-visible {
    outline: 2px solid $primary-color;
    outline-offset: 4px;
  }
}

.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  color: $hero-text-color;
  background-color: $background-color;

  h1,
  h2,
  h3 {
    line-height: 1.3;
    font-weight: 700;
  }

  h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }

  h2 {
    font-size: 1.125rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.page-heading {
  padding: 1.5rem;
  border-bottom: 4px solid $cta-color;
  border-radius: 12px;
  color: $background-color;
  background-color: $primary-color;

  p {
    margin-top: 0.5rem;
    color: $background-color;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.identity-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.edit-name-button {
  width: 30px;
  height: 30px;
  font-size: 1rem;
}

.profile-email {
  margin: 0;
  color: $secondary-color;
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}

.name-editor {
  width: 100%;
  max-width: 320px;

  fieldset {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }

  label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  input {
    padding: 0.5rem 0.75rem;
    border: 1px solid rgba($secondary-color, 0.4);
    border-radius: 6px;
    font: inherit;
  }
}

.profile-layout,
.profile-details,
.event-sections {
  display: grid;
  gap: 2rem;
  min-width: 0;
}

.profile-identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: rgba($primary-color, 0.08);
}

.avatar {
  position: relative;
  width: 190px;
  height: 190px;
  color: $primary-color;

  > svg {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;

  h2 {
    min-width: 0;
    color: $primary-color;
  }
}

.interests-section,
.events-section {
  padding-top: 1rem;
  border-top: 3px solid $cta-color;
}

.section-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgba($secondary-color, 0.3);
  border-radius: 50%;
  font: inherit;
  font-size: 1.5rem;
  line-height: 1;
  color: $secondary-color;
  background-color: $background-color;

  &:disabled {
    cursor: not-allowed;
  }
}

.avatar-button {
  position: absolute;
  right: 7px;
  bottom: 13px;
  border: 3px solid $background-color;
  background-color: $primary-color;
  color: $background-color;
}

.calendar-button svg {
  width: 19px;
  height: 19px;
}

.interest-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.interest-chip {
  padding: 0.625rem 0.25rem;
  border-radius: 6px;
  background-color: $primary-color;
  color: $background-color;
  text-align: center;
  overflow-wrap: anywhere;
  font-size: 0.8125rem;
  font-weight: 600;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  > li {
    min-width: 0;
  }
}

.event-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba($primary-color, 0.2);
  border-radius: 8px;
}

.profile-event-image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.event-content a {
  display: inline-block;
  margin-top: 0.75rem;
  color: $primary-color;
  text-decoration: underline;

  &:focus-visible {
    outline: 2px solid $primary-color;
    outline-offset: 3px;
  }
}

.event-image {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  padding: 1rem;
  background-color: rgba($primary-color, 0.12);

  svg {
    width: 100%;
    max-width: 200px;
    stroke: $primary-color;
    stroke-width: 2;
    stroke-linejoin: round;
  }
}

.event-category {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  max-width: calc(100% - 1rem);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  background-color: $cta-color;
  color: $hero-text-color;
  font-size: 0.6875rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.event-content {
  padding: 0.75rem;

  h3 {
    font-size: 0.875rem;
    overflow-wrap: anywhere;
  }

  p {
    margin-top: 0.5rem;
    color: $secondary-color;
    font-size: 0.75rem;
  }
}

@media (min-width: 900px) {
  .profile-page {
    padding: 2.5rem 2rem 4rem;
  }

  .profile-layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.65fr);
    align-items: start;
    gap: 4rem;
  }

  .profile-details {
    gap: 3.5rem;
  }

  .profile-identity {
    align-items: center;
  }

  .event-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>