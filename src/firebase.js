// Minimal Firebase setup for the SmartPortfolio React app
// Using the modular Firebase SDK loaded from the CDN.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js';
import {
  initializeFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  setLogLevel,
  enableIndexedDbPersistence
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

// Allow Firestore writes some time to complete on the first connection
const FIRESTORE_WRITE_TIMEOUT_MS = 20000;

// Firebase configuration for the public development project
const firebaseConfig = {
  apiKey: "AIzaSyAsg49ymxVQYoHzWJPFrYCE6E0pjGd54aI",
  authDomain: "stocks-c40b4.firebaseapp.com",
  projectId: "stocks-c40b4",
  // Corrected bucket URL so Firebase services work properly
  storageBucket: "stocks-c40b4.firebasestorage.app",
  messagingSenderId: "40268119136",
  appId: "1:40268119136:web:cf226f44f801c53087d705"
};

async function initFirebase() {
  if (window.db) {
    return window.db;
  }
  const app = initializeApp(firebaseConfig);
  try {
    getAnalytics(app);
  } catch (err) {
    // Analytics is optional and will fail on unsupported environments
    console.warn('Analytics init failed', err);
  }
  // Force long polling for Firestore since some environments block
  // WebSockets or streaming fetch. This improves reliability on
  // GitHub Pages and similar static hosts.
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
  // Expose the db instance immediately so other functions can use Firestore
  // even if enabling persistence takes a bit longer
  window.db = db;
  try {
    await enableIndexedDbPersistence(db);
  } catch (err) {
    console.warn('Offline persistence unavailable', err);
  }
  setLogLevel('error');
  return db;
}

async function checkFirestoreConnection(db) {
  const testRef = doc(collection(db, 'connectionTest'), 'ping');
  try {
    await Promise.race([
      setDoc(testRef, { time: Date.now() }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`setDoc timed out after ${FIRESTORE_WRITE_TIMEOUT_MS/1000}s`)), FIRESTORE_WRITE_TIMEOUT_MS)
      )
    ]);
    const snap = await getDoc(testRef);
    return snap.exists();
  } catch (err) {
    console.error('Connection test failed', err);
    return false;
  }
}

async function testFirestoreConnection() {
  if (!window.db) {
    console.warn('Firestore not initialized');
    alert('Firestore not initialized');
    return;
  }
  const ok = await checkFirestoreConnection(window.db);
  alert(ok ? 'Connection test succeeded' : 'Connection test failed');
}

window.testConnection = testFirestoreConnection;

window.initFirebase = initFirebase;
