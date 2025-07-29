// Minimal Firebase setup for the SmartPortfolio React app
// Using the modular Firebase SDK loaded from the CDN.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// Firebase configuration for the public development project
const firebaseConfig = {
  apiKey: "AIzaSyAwb70Myug06CMrwysQ-VNKIEoYs2D79sk",
  authDomain: "stocks-d68d0.firebaseapp.com",
  projectId: "stocks-d68d0",
  storageBucket: "stocks-d68d0.firebasestorage.app",
  messagingSenderId: "685162092195",
  appId: "1:685162092195:web:e778fed604e224617f5116",
  measurementId: "G-7YBHJLY6Y9"
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
}

window.initFirebase = initFirebase;
