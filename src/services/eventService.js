import jazzJamImage from '@/assets/img/event_images/jazz_jam.jpg';
import hipHopDansWorkshopImage from '@/assets/img/event_images/hip_hop_danseworkshop.jpg';
import teaterImage from '@/assets/img/event_images/teater.jpg';
import designWorkshopImage from '@/assets/img/event_images/design_workshop.jpg';
import { get, ref } from 'firebase/database';
import { db } from './firebase';
import { readEvents } from './eventData';

const images = {
  jazz: jazzJamImage,
  dance: hipHopDansWorkshopImage,
  theatre: teaterImage,
  design: designWorkshopImage,
};

export async function getEvents() {
  const snapshot = await get(ref(db, 'events'));
  return readEvents(snapshot.val(), images);
}

export async function getEvent(id) {
  const snapshot = await get(ref(db, `events/${id}`));
  if (!snapshot.exists()) return null;
  return readEvents({ [id]: snapshot.val() }, images)[0];
}
