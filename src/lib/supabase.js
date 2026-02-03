import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseAnonKey.includes('YOUR_SUPABASE');

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Sync Firebase user with Supabase
export const syncUserWithSupabase = async (firebaseUser) => {
    if (!supabase) {
        console.warn('Supabase not configured. Skipping sync.');
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName || 'Anonymous',
            photo_url: firebaseUser.photoURL || null
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

        // Upsert user in Supabase
        const { data, error } = await supabase
            .from('users')
            .upsert(userData, { onConflict: 'id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase sync failed:', error);
        // Return basic user data even if sync fails
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName || 'Anonymous',
            photo_url: firebaseUser.photoURL || null
        };
    }
};

// Database backup function
export const createDatabaseBackup = async (userId) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('database_backups')
            .insert([{ user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Backup creation failed:', error);
        return null;
    }
};

// Restore from backup
export const restoreFromBackup = async (backupId) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('database_backups')
            .select('*')
            .eq('id', backupId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Backup restoration failed:', error);
        return null;
    }
};
