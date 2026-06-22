// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getOrCreateLocalUserId } from './auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3AJS3YtBg3fbn4Xn5_5hhEkOuNpaaW_s",
  authDomain: "projeto-gerenciador-a24b1.firebaseapp.com",
  projectId: "projeto-gerenciador-a24b1",
  storageBucket: "projeto-gerenciador-a24b1.firebasestorage.app",
  messagingSenderId: "851059541867",
  appId: "1:851059541867:web:0064916b690efaecacee2e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);

let authReadyPromise = null;

export async function initFirebaseAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  if (authReadyPromise) {
    return authReadyPromise;
  }

  authReadyPromise = new Promise((resolve) => {
    let resolved = false;

    const resolveLocalUser = async () => {
      if (resolved) return;
      resolved = true;
      const uid = await getOrCreateLocalUserId();
      resolve({ uid, isLocal: true });
    };

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user && !resolved) {
          resolved = true;
          unsubscribe();
          resolve(user);
        }
      },
      async () => {
        await resolveLocalUser();
      }
    );

    // Try anonymous sign-in, but fall back silently if it fails
    (async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        // Anonymous auth disabled on Firebase project - will use local fallback
        if (!resolved) {
          unsubscribe();
          await resolveLocalUser();
        }
      }
    })();

    setTimeout(resolveLocalUser, 3000);
  });

  return authReadyPromise;
}

export async function getAppUserId() {
  const user = await initFirebaseAuth();
  return user.uid;
}

export default app;