import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Check if user has existing Firestore saves (for migration detection)
export const checkLegacySaves = async (uid) => {
    try {
        const savesRef = collection(db, 'artifacts', 'softworks-tycoon', 'users', uid, 'saves');
        const snapshot = await getDocs(savesRef);
        return snapshot.size > 0;
    } catch (error) {
        console.error('Error checking legacy saves:', error);
        return false;
    }
};

// Auth helpers
export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

export const loginAsGuest = async () => {
    return await signInAnonymously(auth);
};

export const logout = async () => {
    return await signOut(auth);
};
