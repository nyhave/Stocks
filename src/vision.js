// Load vision document from GitHub and cache in Firestore
import { collection, doc, getDoc, setDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

async function loadVision() {
  if (!window.db) {
    console.error('Firestore not initialized');
    return;
  }
  const docRef = doc(collection(window.db, 'vision'), 'latest');
  try {
    const snapshot = await getDoc(docRef);
    let shouldUpdate = true;
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.updated && Date.now() - data.updated.toMillis() < 86400000) {
        shouldUpdate = false;
        window.visionText = data.text;
      }
    }
    if (shouldUpdate) {
      const resp = await fetch('https://raw.githubusercontent.com/nyhave/Stocks/main/VISION.md');
      const text = await resp.text();
      await setDoc(docRef, { text, updated: Timestamp.now() });
      window.visionText = text;
    }
  } catch (err) {
    console.error('Failed to load vision', err);
  }
}
window.loadVision = loadVision;
