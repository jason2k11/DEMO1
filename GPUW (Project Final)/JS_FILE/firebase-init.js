import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { firebaseConfig } from './config.js';

let auth = null;
let googleProvider = null;

try {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    console.warn('Firebase config missing or incomplete. Please update JS_FILE/config.js to enable Firebase auth.');
  } else {
    let app;
    if (getApps && getApps().length) app = getApp();
    else app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Firebase initialized');
  }
} catch (err) {
  console.error('Firebase init error', err);
}

export { auth, googleProvider };
