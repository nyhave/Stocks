// Minimal Firebase setup for SmartPortfolio React demo
// Replace with real project credentials when deploying.

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:demo",
};

firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized");
