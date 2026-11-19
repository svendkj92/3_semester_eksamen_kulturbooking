export function readEvents(data, images) {
  if (data === null) return [];
  if (typeof data !== 'object') throw new Error('Ugyldige eventdata i databasen.');

  return Object.entries(data).map(([id, event]) => {
    const textFields = ['title', 'category', 'location', 'price', 'description'];
    if (!event || !textFields.every((field) => typeof event[field] === 'string' && event[field].trim())
      || (event.descriptionEn !== undefined
        && (typeof event.descriptionEn !== 'string' || !event.descriptionEn.trim()))
      || !Number.isSafeInteger(event.startsAt) || event.startsAt <= 0
      || event.startsAt > 8640000000000000) {
      throw new Error(`Event ${id} har et ugyldigt format i databasen.`);
    }
    const image = event.imageUrl || images[event.imageKey];
    if (typeof image !== 'string' || !image.trim()
      || (!image.startsWith('/') && !/^https?:\/\//.test(image))) {
      throw new Error(`Event ${id} mangler et gyldigt billede.`);
    }
    return { ...event, id, image };
  }).sort((a, b) => a.startsAt - b.startsAt);
}

export function readRegistrations(data) {
  if (data === null) return {};
  if (typeof data !== 'object' || Object.values(data).some((item) => !item
    || !Number.isSafeInteger(item.registeredAt) || item.registeredAt <= 0)) {
    throw new Error('Ugyldige tilmeldinger i databasen.');
  }
  return data;
}

export function formatEventDate(startsAt, locale = 'da') {
  return new Date(startsAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'da-DK', {
    timeZone: 'Europe/Copenhagen',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatEventTime(startsAt, locale = 'da') {
  return new Date(startsAt).toLocaleTimeString(locale === 'en' ? 'en-GB' : 'da-DK', {
    timeZone: 'Europe/Copenhagen',
    hour: '2-digit',
    minute: '2-digit',
  });
}
