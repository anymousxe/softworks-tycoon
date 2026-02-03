import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sync Firebase user with Supabase
export const syncUserWithSupabase = async (firebaseUser) => {
    if (!firebaseUser) return null;

    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

    if (existingUser) {
        // Update last_seen
        await supabase
            .from('users')
            .update({ last_seen: new Date().toISOString() })
            .eq('firebase_uid', firebaseUser.uid);
        return existingUser;
    }

    // Create new user
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName || 'Guest Agent',
            photo_url: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            is_admin: firebaseUser.email === import.meta.env.VITE_ADMIN_EMAIL
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error);
        return null;
    }

    return newUser;
};

// Database backup helper
export const createDatabaseBackup = async (userId) => {
    try {
        const { data: companies } = await supabase
            .from('companies')
            .select('*, hardware(*), models(*)')
            .eq('user_id', userId);

        const backup = {
            timestamp: new Date().toISOString(),
            user_id: userId,
            companies: companies || []
        };

        // Store backup in local storage as failsafe
        localStorage.setItem(`backup_${userId}_${Date.now()}`, JSON.stringify(backup));

        // Also log to console for manual recovery if needed
        console.log('🛡️ Database backup created:', backup);

        return backup;
    } catch (error) {
        console.error('Backup failed:', error);
        return null;
    }
};

// Restore from backup
export const restoreFromBackup = async (backupData) => {
    try {
        // This would restore data from backup
        console.log('Restoring from backup:', backupData);
        // Implementation would go here
        return true;
    } catch (error) {
        console.error('Restore failed:', error);
        return false;
    }
};
