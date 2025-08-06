// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBojNBOxifjFE-Wt5UUh99-KQXXl9DN_jg",
  authDomain: "aroghyacare.firebaseapp.com",
  projectId: "aroghyacare",
  storageBucket: "aroghyacare.firebasestorage.app",
  messagingSenderId: "484515538872",
  appId: "1:484515538872:web:b97128ccdb0de44297514d",
  measurementId: "G-B2VQ04QL0F"
};

// Initialize Firebase only if no apps exist (prevents double initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only on client side)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// For development: uncomment these lines if you want to use emulators
// if (process.env.NODE_ENV === 'development') {
//   if (!auth._config?.emulator) {
//     connectAuthEmulator(auth, 'http://localhost:9099');
//   }
//   if (!db._settings?.host?.includes('localhost')) {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   }
// }

export default app;
