import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut } from 'firebase/auth';
import { supabase, syncUserWithSupabase } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,

    init: async () => {
        auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // Sync with Supabase and get profile
                const profile = await syncUserWithSupabase(firebaseUser);

                // Check if admin
                const isAdmin = profile?.email === import.meta.env.VITE_ADMIN_EMAIL;

                set({
                    user: firebaseUser,
                    profile,
                    isAdmin,
                    loading: false
                });
            } else {
                set({ user: null, profile: null, isAdmin: false, loading: false });
            }
        });
    },

    loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const profile = await syncUserWithSupabase(result.user);
            return { user: result.user, profile };
        } catch (error) {
            console.error('Google login failed:', error);
            throw error;
        }
    },

    loginAsGuest: async () => {
        try {
            const result = await signInAnonymously(auth);
            const profile = await syncUserWithSupabase(result.user);
            return { user: result.user, profile };
        } catch (error) {
            console.error('Guest login failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null, profile: null, isAdmin: false });
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }
}));

export default useAuthStore;
