// Minimal Firebase setup for the SmartPortfolio React app
// Using the modular Firebase SDK loaded from the CDN.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js';
import {
  initializeFirestore,
  collection,
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

// Firebase configuration for the public development project
const firebaseConfig = {
  apiKey: "AIzaSyAsg49ymxVQYoHzWJPFrYCE6E0pjGd54aI",
  authDomain: "stocks-c40b4.firebaseapp.com",
  projectId: "stocks-c40b4",
  storageBucket: "stocks-c40b4.firebasestorage.app",
  messagingSenderId: "40268119136",
  appId: "1:40268119136:web:cf226f44f801c53087d705"
};

function initFirebase() {
  if (window.db) {
    console.log('Firebase already initialized');
    return;
  }
  const app = initializeApp(firebaseConfig);
  try {
    getAnalytics(app);
  } catch (err) {
    // Analytics is optional and will fail on unsupported environments
    console.warn('Analytics init failed', err);
  }
  // Enable fallback to long-polling in case WebSockets are blocked
  const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  window.db = db;
  console.log('Firebase initialized');
  checkFirestoreConnection(db);
}

async function checkFirestoreConnection(db) {
  const testRef = doc(collection(db, 'connectionTest'), 'ping');
  try {
    await setDoc(testRef, { time: Date.now() });
    console.log('First write succeeded / Første skrivning lykkedes');
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      console.log('Connection test succeeded / Forbindelsestest lykkedes');
    } else {
      console.warn('Connection test failed / Forbindelsestest fejlede');
    }
  } catch (err) {
    console.error('First write failed / Første skrivning fejlede', err);
  }
}

window.initFirebase = initFirebase;
