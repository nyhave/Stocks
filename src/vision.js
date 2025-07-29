// Load vision document from GitHub and cache in Firestore
async function loadVision() {
  if (!window.db) {
    console.error('Firestore not initialized');
    return;
  }
  const docRef = window.db.collection('vision').doc('latest');
  try {
    const doc = await docRef.get();
    let shouldUpdate = true;
    if (doc.exists) {
      const data = doc.data();
      if (data.updated && Date.now() - data.updated.toMillis() < 86400000) {
        shouldUpdate = false;
        window.visionText = data.text;
      }
    }
    if (shouldUpdate) {
      const resp = await fetch('https://raw.githubusercontent.com/nyhave/Stocks/main/VISION.md');
      const text = await resp.text();
      await docRef.set({ text, updated: firebase.firestore.Timestamp.now() });
      window.visionText = text;
    }
  } catch (err) {
    console.error('Failed to load vision', err);
  }
}
window.loadVision = loadVision;
