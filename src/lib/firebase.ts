
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// It's good practice to only initialize analytics on the client side
// import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOd2rghlKufA6EEF5i99hFxqm93mGFzrs",
  authDomain: "gamblr-nation-5f47b.firebaseapp.com",
  projectId: "gamblr-nation-5f47b",
  storageBucket: "gamblr-nation-5f47b.firebasestorage.app",
  messagingSenderId: "494203262407",
  appId: "1:494203262407:web:24440317779d53577a35e2",
  measurementId: "G-YTKBMLZN21"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

// Initialize Analytics only on the client side, if needed
// let analytics;
// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   });
// }

export { app, auth /*, analytics */ };
