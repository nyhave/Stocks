// Load vision document from GitHub and cache in Firestore
import { collection, doc, getDoc, setDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

async function loadVision() {
  if (!window.db) {
    console.error('Firestore not initialized');
    return;
  }
  const docRef = doc(collection(window.db, 'vision'), 'latest');
  console.log('Vision docRef', docRef.path);
  try {
    console.log('Checking cached vision text');
    const snapshot = await getDoc(docRef);
    let shouldUpdate = true;
    if (snapshot.exists()) {
      console.log('Found cached vision', snapshot.data());
      const data = snapshot.data();
      if (data.updated && Date.now() - data.updated.toMillis() < 86400000) {
        shouldUpdate = false;
        window.visionText = data.text;
      }
    }
    if (shouldUpdate) {
      console.log('Fetching vision from GitHub');
      const resp = await fetch('https://raw.githubusercontent.com/nyhave/Stocks/main/VISION.md');
      const text = await resp.text();
      console.log('Saving vision to Firestore');
      await setDoc(docRef, { text, updated: Timestamp.now() });
      window.visionText = text;
    }
  } catch (err) {
    console.error('Failed to load vision', err);
  }
}
window.loadVision = loadVision;
