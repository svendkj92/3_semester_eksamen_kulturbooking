
import {
  ref,
  get,
  set,
  update,
  serverTimestamp
} from 'firebase/database';

import { db } from './firebase';

// Create a user profile
export async function createUserProfile(user, interests) {
  const userRef = ref(db, `users/${user.uid}`);

  const userData = {
    profile: {
      displayName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },

    interests: interests,

    preferences: {
      emailNotifications: false
    }
  };

  await set(userRef, userData);
}

// Get a user profile
export async function getUserProfile(uid) {
  const userRef = ref(db, `users/${uid}`);

  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val();
  }

  return null;
}

// Update user interests
export async function updateUserInterests(uid, interests) {
  const interestsRef = ref(db, `users/${uid}/interests`);

  await set(interestsRef, interests);

  const updatedAtRef = ref(db, `users/${uid}/profile/updatedAt`);

  await set(updatedAtRef, serverTimestamp());
}

// Update user profile information
export async function updateUserProfile(uid, profileData) {
  const profileRef = ref(db, `users/${uid}/profile`);

  await update(profileRef, {
    ...profileData,
    updatedAt: serverTimestamp()
  });
}
