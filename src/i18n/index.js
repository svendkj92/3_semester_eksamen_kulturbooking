import { createI18n } from 'vue-i18n';
import { watch } from 'vue';
import { da, en } from './messages';

const storageKey = 'kulturbooking-language';
let savedLocale;
try {
  savedLocale = localStorage.getItem(storageKey);
} catch (error) {
  console.warn('Language preference could not be read.', error);
}

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale === 'en' ? 'en' : 'da',
  fallbackLocale: 'da',
  messages: { da, en },
});

watch(i18n.global.locale, (locale) => {
  document.documentElement.lang = locale;
  try {
    localStorage.setItem(storageKey, locale);
  } catch (error) {
    console.warn('Language preference could not be saved.', error);
  }
}, { immediate: true });
