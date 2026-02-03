import React, { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import useGameStore from './store/gameStore';
import { supabase } from './lib/supabase';
import LoginScreen from './components/auth/LoginScreen';
import LoadingState from './components/ui/LoadingState';
import MigrationModal from './components/auth/MigrationModal';
import BroadcastBanner from './components/ui/BroadcastBanner';
import UpdateModal from './components/ui/UpdateModal';
import DowntimeScreen from './components/ui/DowntimeScreen';
import Dashboard from './components/dashboard/Dashboard';
import CompanySelector from './components/auth/CompanySelector';

function App() {
    const { user, profile, loading, init, isAdmin } = useAuthStore();
    const { activeCompany, loading: gameLoading } = useGameStore();
    const [siteStatus, setSiteStatus] = useState({ is_down: false, message: '' });
    const [statusLoading, setStatusLoading] = useState(true);

    useEffect(() => {
        init();

        // Check Site Status (Downtime)
        const checkStatus = async () => {
            const { data } = await supabase
                .from('site_status')
                .select('*')
                .single();

            if (data) setSiteStatus(data);
            setStatusLoading(false);
        };

        checkStatus();

        // Real-time site status updates
        const channel = supabase
            .channel('public:site_status')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'site_status'
            }, (payload) => {
                setSiteStatus(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [init]);

    if (loading || statusLoading) {
        return <LoadingState />;
    }

    // Show downtime screen if down, unless the user is an admin
    if (siteStatus.is_down && !isAdmin) {
        return <DowntimeScreen message={siteStatus.message} />;
    }

    // If not logged in, show login screen
    if (!user) {
        return <LoginScreen />;
    }

    // If logged in but no company selected, show selector
    if (!activeCompany) {
        return (
            <div className="bg-[#050505] min-h-screen">
                <BroadcastBanner />
                <UpdateModal />
                <MigrationModal />
                <CompanySelector />
            </div>
        );
    }

    // Main Dashboard
    return (
        <div className="bg-[#050505] min-h-screen flex flex-col">
            <BroadcastBanner />
            <UpdateModal />
            <MigrationModal />
            <Dashboard />
        </div>
    );
}

export default App;
