import { create } from 'zustand';
import { auth, loginWithGoogle, loginAsGuest, logout as firebaseLogout } from '../lib/firebase';
import { supabase, syncUserWithSupabase } from '../lib/supabase';

const useAuthStore = create((set) => ({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,

    init: () => {
        auth.onAuthStateChanged(async (firebaseUser) => {
            set({ loading: true });
            if (firebaseUser) {
                const profile = await syncUserWithSupabase(firebaseUser);
                set({
                    user: firebaseUser,
                    profile,
                    loading: false,
                    isAdmin: profile?.is_admin || false
                });
            } else {
                set({ user: null, profile: null, loading: false, isAdmin: false });
            }
        });
    },

    loginGoogle: async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Google Login Error:', error);
            throw error;
        }
    },

    loginGuest: async () => {
        try {
            await loginAsGuest();
        } catch (error) {
            console.error('Guest Login Error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await firebaseLogout();
        } catch (error) {
            console.error('Logout Error:', error);
            throw error;
        }
    }
}));

export default useAuthStore;
