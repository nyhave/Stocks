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

console.log('firebase.js loaded');

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
  console.log('initFirebase called');
  console.log('Firebase config', firebaseConfig);
  if (window.db) {
    console.log('Firebase already initialized');
    return;
  }
  const app = initializeApp(firebaseConfig);
  console.log('Firebase app created', app.name);
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
  try {
    await enableIndexedDbPersistence(db);
    console.log('Offline persistence enabled');
  } catch (err) {
    console.warn('Offline persistence unavailable', err);
  }
  // Log detailed Firestore errors to help with debugging
  setLogLevel('debug');
  console.log('Firestore initialized');
  window.db = db;
  console.log('Firebase initialized, window.db set');
}

async function checkFirestoreConnection(db) {
  console.log('checkFirestoreConnection called', db);
  const testRef = doc(collection(db, 'connectionTest'), 'ping');
  console.log('Test reference', testRef.path);
  try {
    console.log('Writing test ping');
    // Race the Firestore write against a timeout to surface network issues
    await Promise.race([
      setDoc(testRef, { time: Date.now() }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`setDoc timed out after ${FIRESTORE_WRITE_TIMEOUT_MS/1000}s`)), FIRESTORE_WRITE_TIMEOUT_MS)
      )
    ]);
    console.log('First write succeeded / Første skrivning lykkedes');
    console.log('Reading back test ping');
    const snap = await getDoc(testRef);
    console.log('Snapshot exists', snap.exists());
    if (snap.exists()) {
      console.log('Connection test succeeded / Forbindelsestest lykkedes');
      console.log('Returning true from checkFirestoreConnection');
      return true;
    } else {
      console.warn('Connection test failed / Forbindelsestest fejlede');
      console.log('Returning false from checkFirestoreConnection');
      return false;
    }
  } catch (err) {
    console.error('First write failed / Første skrivning fejlede', err);
    console.log('Returning false from checkFirestoreConnection');
    return false;
  }
}

async function testFirestoreConnection() {
  console.log('testFirestoreConnection called');
  console.log('Current db instance', window.db);
  if (!window.db) {
    console.warn('Firestore not initialized');
    alert('Firestore not initialized');
    return;
  }
  const ok = await checkFirestoreConnection(window.db);
  console.log('checkFirestoreConnection result', ok);
  if (ok) {
    alert('Connection test succeeded');
  } else {
    alert('Connection test failed');
  }
}

window.testConnection = testFirestoreConnection;

window.initFirebase = initFirebase;
