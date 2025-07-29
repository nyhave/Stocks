// Minimal Firebase setup for the SmartPortfolio React app
// Replace with real project credentials when deploying.

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
    console.log("Firebase already initialized");
    return;
  }
  firebase.initializeApp(firebaseConfig);
  // Enable fallback to long-polling in case WebSockets are blocked
  const firestore = firebase.firestore();
  firestore.settings({ experimentalAutoDetectLongPolling: true });
  window.db = firestore;
  console.log("Firebase initialized");
}

window.initFirebase = initFirebase;
