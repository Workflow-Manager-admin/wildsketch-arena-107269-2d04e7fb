import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace these config values by .env file or direct values from your Firebase project
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "FAKEKEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123:web:123"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * PUBLIC_INTERFACE
 * Anonymous sign-in with nickname and display name
 */
export async function loginAnonymous(nickname = "Player") {
  const cred = await signInAnonymously(auth);
  if (cred.user && nickname) {
    await updateProfile(cred.user, {
      displayName: nickname,
      photoURL: ""
    });
  }
  return cred.user;
}
