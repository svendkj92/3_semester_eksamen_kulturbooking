import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createI18n } from 'vue-i18n';
import { da, en } from './messages.js';
import { getEventDescription } from './eventDescriptions.js';
import { formatEventDate, formatEventTime, readEvents } from '../services/eventData.js';

function flatten(messages, prefix = '') {
  return Object.fromEntries(Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [[path, value]] : Object.entries(flatten(value, path));
  }));
}

const danish = flatten(da);
const english = flatten(en);

test('DA and EN have identical nonempty keys and interpolation parameters', () => {
  assert.deepEqual(Object.keys(danish).sort(), Object.keys(english).sort());
  for (const [key, value] of Object.entries(danish)) {
    assert.ok(value.trim(), key);
    assert.ok(english[key].trim(), key);
    assert.deepEqual(
      [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort(),
      [...english[key].matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort(),
      key,
    );
  }
});

test('all messages compile and interpolate in both languages without warnings', () => {
  const errors = [];
  const i18n = createI18n({
    legacy: false, locale: 'da', fallbackLocale: false, messages: { da, en },
    onWarn: (message) => errors.push(message),
  });
  for (const [locale, messages] of Object.entries({ da: danish, en: english })) {
    i18n.global.locale.value = locale;
    for (const [key, value] of Object.entries(messages)) {
      const params = Object.fromEntries([...value.matchAll(/\{(\w+)\}/g)].map((match) => [match[1], 'test']));
      const translated = i18n.global.t(key, params);
      assert.notEqual(translated, key, key);
      assert.ok(!/\{\w+\}/.test(translated), key);
    }
  }
  assert.deepEqual(errors, []);
});

test('translation keys in Vue components, including status and error keys, exist in both languages', () => {
  for (const folder of ['views', 'components', 'layouts']) {
    const directory = new URL(`../${folder}/`, import.meta.url);
    for (const file of readdirSync(directory).filter((name) => name.endsWith('.vue'))) {
      const source = readFileSync(new URL(file, directory), 'utf8');
      for (const match of source.matchAll(/'((?:common|interests|nav|footer|info|landing|events|login|profile|onboarding)\.[A-Za-z][\w.-]*)'/g)) {
        if (match[1].endsWith('.')) continue;
        assert.ok(Object.hasOwn(danish, match[1]), `${file}: ${match[1]}`);
        assert.ok(Object.hasOwn(english, match[1]), `${file}: ${match[1]}`);
      }
    }
  }
});

test('event counts use the correct singular and plural forms', () => {
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { da, en } });
  assert.equal(i18n.global.t('events.count', { count: 0 }), 'No events');
  assert.equal(i18n.global.t('events.count', { count: 1 }), '1 event');
  assert.equal(i18n.global.t('events.count', { count: 4 }), '4 events');
  i18n.global.locale.value = 'da';
  assert.equal(i18n.global.t('events.count', { count: 0 }), 'Ingen events');
  assert.equal(i18n.global.t('events.count', { count: 1 }), '1 event');
});

const seed = JSON.parse(readFileSync(new URL('../../firebase/events.json', import.meta.url)));

test('all existing descriptions are translated without changing titles or source data', () => {
  for (const event of Object.values(seed)) {
    const before = structuredClone(event);
    assert.deepEqual(getEventDescription(event, 'da'), { text: event.description, lang: 'da' });
    const translated = getEventDescription(event, 'en');
    assert.equal(translated.lang, 'en');
    assert.notEqual(translated.text, event.description);
    assert.deepEqual(event, before);
  }
});

test('database descriptionEn takes precedence and changed descriptions do not reuse stale translations', () => {
  const event = { ...seed[1], description: 'En ny beskrivelse.' };
  assert.deepEqual(getEventDescription(event, 'en'), { text: event.description, lang: 'da' });
  assert.deepEqual(getEventDescription({ ...event, descriptionEn: 'A new description.' }, 'en'),
    { text: 'A new description.', lang: 'en' });
  assert.throws(() => readEvents({ 1: { ...event, descriptionEn: 42 } }, { jazz: '/jazz.jpg' }));
  assert.throws(() => readEvents({ 1: { ...event, descriptionEn: '' } }, { jazz: '/jazz.jpg' }));
});

test('English dates keep Copenhagen timezone and Danish remains the default', () => {
  assert.match(formatEventDate(seed[1].startsAt, 'en'), /15 January 2027/);
  assert.match(formatEventDate(seed[1].startsAt), /15\. januar 2027/);
  assert.match(formatEventTime(seed[1].startsAt, 'en'), /19:00/);
});
