import { get, ref, remove, runTransaction, serverTimestamp } from 'firebase/database';
import { auth, db } from './firebase';
import { readRegistrations } from './eventData';

function registrationRef(uid, eventId) {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    throw new Error('Du skal være logget ind for at ændre dine tilmeldinger.');
  }
  return ref(db, `registrations/${uid}/${eventId}`);
}

export async function getRegistrations(uid) {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    throw new Error('Du skal være logget ind for at se dine tilmeldinger.');
  }
  const snapshot = await get(ref(db, `registrations/${uid}`));
  return readRegistrations(snapshot.val());
}

export async function registerForEvent(uid, eventId) {
  await runTransaction(registrationRef(uid, eventId), (current) => {
    if (current !== null) return;
    return { registeredAt: serverTimestamp() };
  }, { applyLocally: false });
}

export async function cancelRegistration(uid, eventId) {
  await remove(registrationRef(uid, eventId));
}
