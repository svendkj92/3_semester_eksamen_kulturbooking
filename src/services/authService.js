
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from './firebase';

// Create a new user account
export async function registerUser(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name
  });

  return user;
}

export async function sendVerificationEmail(user) {
  await sendEmailVerification(user);
}

// Login existing user
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

// Logout current user
export async function logoutUser() {
  await signOut(auth);
}

// Observe authentication state
export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
