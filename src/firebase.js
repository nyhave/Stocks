// Minimal Firebase setup for SmartPortfolio React demo
// Replace with real project credentials when deploying.

// Firebase configuration for the public demo project
const firebaseConfig = {
  apiKey: "AIzaSyAwb70Myug06CMrwysQ-VNKIEoYs2D79sk",
  authDomain: "stocks-d68d0.firebaseapp.com",
  projectId: "stocks-d68d0",
  storageBucket: "stocks-d68d0.firebasestorage.app",
  messagingSenderId: "685162092195",
  appId: "1:685162092195:web:ddd884125683fadc7f5116",
  measurementId: "G-D4JKS31XC6"
};

firebase.initializeApp(firebaseConfig);
// Enable fallback to long-polling in case WebSockets are blocked
const firestore = firebase.firestore();
firestore.settings({ experimentalAutoDetectLongPolling: true });
window.db = firestore;
console.log("Firebase initialized");
