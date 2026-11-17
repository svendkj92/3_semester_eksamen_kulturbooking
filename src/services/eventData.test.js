import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formatEventDate, formatEventTime, readEvents, readRegistrations } from './eventData.js';

const seed = JSON.parse(readFileSync(new URL('..\\..\\firebase\\events.json', import.meta.url)));
const images = {
  jazz: '/jazz.jpg',
  dance: '/dance.jpg',
  theatre: '/theatre.jpg',
  design: '/design.jpg',
};

test('demo events keep their IDs and all start in January 2027, in chronological order', () => {
  const events = readEvents(seed, images);
  assert.deepEqual(events.map((event) => event.id), ['2', '3', '1', '4']);
  assert.ok(events.every((event) => new Date(event.startsAt).toISOString().startsWith('2027-01-')));
  assert.equal(events.find((event) => event.id === '1').image, '/jazz.jpg');
});

test('empty data is distinct from invalid data', () => {
  assert.deepEqual(readEvents(null, images), []);
  assert.deepEqual(readRegistrations(null), {});
  assert.throws(() => readEvents('invalid', images));
  assert.throws(() => readEvents({ 1: { ...seed[1], startsAt: '2027-01-15' } }, images));
  assert.throws(() => readEvents({ 1: { ...seed[1], title: '' } }, images));
  assert.throws(() => readEvents({ 1: { ...seed[1], imageKey: 'missing' } }, images));
});

test('Firebase numeric-key arrays and image URLs are supported', () => {
  const data = [];
  data[1] = { ...seed[1], imageUrl: 'https://example.com/image.jpg' };
  assert.equal(readEvents(data, images)[0].image, 'https://example.com/image.jpg');
  assert.throws(() => readEvents({ 1: { ...seed[1], imageUrl: 'javascript:alert(1)' } }, images));
});

test('dates and times are displayed in Copenhagen time regardless of browser timezone', () => {
  assert.match(formatEventDate(seed[1].startsAt), /15\. januar 2027/);
  assert.match(formatEventTime(seed[1].startsAt), /19[.:]00/);
});

test('registration timestamps must be valid; event IDs remain keys', () => {
  const data = { 1: { registeredAt: 1794950000000 } };
  assert.equal(readRegistrations(data), data);
  assert.throws(() => readRegistrations({ 1: true }));
  assert.throws(() => readRegistrations({ 1: { registeredAt: 'invalid' } }));
});
