import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is ACTUALLY configured (not placeholder values)
const isConfigured = supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('YOUR_') &&
    supabaseUrl.includes('supabase.co');

// Only create client if properly configured
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Sync Firebase user with Supabase - returns mock data if Supabase not configured
export const syncUserWithSupabase = async (firebaseUser) => {
    // If Supabase isn't configured, just return user data directly from Firebase
    if (!supabase) {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || null,
            display_name: firebaseUser.displayName || 'Anonymous',
            photo_url: firebaseUser.photoURL || null,
            is_anonymous: firebaseUser.isAnonymous
        };
    }

    try {
        const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName || 'Anonymous',
            photo_url: firebaseUser.photoURL || null,
            is_anonymous: firebaseUser.isAnonymous
        };

        const { data, error } = await supabase
            .from('users')
            .upsert(userData, { onConflict: 'id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.warn('Supabase sync skipped:', error.message);
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || null,
            display_name: firebaseUser.displayName || 'Anonymous',
            photo_url: firebaseUser.photoURL || null
        };
    }
};
