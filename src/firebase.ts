
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiFT3BTn00RzLz6omqcaYdKPmIIqGvPl4",
  authDomain: "mindease-e585b.firebaseapp.com",
  projectId: "mindease-e585b",
  storageBucket: "mindease-e585b.firebasestorage.app",
  messagingSenderId: "1081449945852",
  appId: "1:1081449945852:web:150da071044915752e1579",
  measurementId: "G-WSNG5Q8EVN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// The following is for local development with Firebase emulators
// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
//   connectFirestoreEmulator(db, "127.0.0.1", 8080);
// }
