import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDk_dOWX57iOEME4cKoLHV-s1l84Bc71NM',
    authDomain: 'canton-goodfellows.firebaseapp.com',
    projectId: 'canton-goodfellows',
    storageBucket: 'canton-goodfellows.firebasestorage.app',
    messagingSenderId: '716464451583',
    appId: '1:716464451583:web:36a9927630c2a7fdc901ca',
    measurementId: 'G-2QEXJ75N4N',
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
