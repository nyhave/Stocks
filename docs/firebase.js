// Minimal Firebase setup for SmartPortfolio React demo
// Replace with real project credentials when deploying.

// Firebase configuration for the public demo project
const firebaseConfig = {
  apiKey: "AIzaSyAwb70Myug06CMrwysQ-VNKIEoYs2D79sk",
  authDomain: "stocks-d68d0.firebaseapp.com",
  projectId: "stocks-d68d0",
  storageBucket: "stocks-d68d0.firebasestorage.app",
  messagingSenderId: "685162092195",
  appId: "1:685162092195:web:0ef9bbca46a7bc0c7f5116",
  measurementId: "G-QB6D9F92QE"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
console.log("Firebase initialized");
