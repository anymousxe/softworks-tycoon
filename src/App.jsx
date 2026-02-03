import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useGameStore from './store/gameStore';
import { supabase } from './lib/supabase';

// Components
import LoginScreen from './components/auth/LoginScreen';
import LoadingState from './components/ui/LoadingState';
import MigrationModal from './components/auth/MigrationModal';
import BroadcastBanner from './components/ui/BroadcastBanner';
import UpdateModal from './components/ui/UpdateModal';
import DowntimeScreen from './components/ui/DowntimeScreen';
import Dashboard from './components/dashboard/Dashboard';
import CompanySelector from './components/auth/CompanySelector';
import NotFound from './components/ui/NotFound';

function App() {
    const { user, profile, loading, init, isAdmin } = useAuthStore();
    const { activeCompany } = useGameStore();
    const [siteStatus, setSiteStatus] = useState({ is_down: false, message: '' });
    const [statusLoading, setStatusLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Initialize auth
        init();

        // Check Site Status (Downtime)
        const checkStatus = async () => {
            try {
                const { data } = await supabase
                    .from('site_status')
                    .select('*')
                    .single();

                if (data) setSiteStatus(data);
            } catch (error) {
                console.log('Site status check failed (table may not exist yet):', error);
            } finally {
                setStatusLoading(false);
            }
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

    // Handle routing logic based on auth and company selection
    useEffect(() => {
        if (!loading && !statusLoading) {
            if (!user) {
                if (location.pathname !== '/') navigate('/');
            } else if (activeCompany) {
                if (location.pathname !== '/ai-tycoon') navigate('/ai-tycoon');
            } else {
                // Logged in but no company selected
                if (location.pathname !== '/') navigate('/');
            }
        }
    }, [user, activeCompany, loading, statusLoading, location.pathname, navigate]);

    if (loading || statusLoading) {
        return <LoadingState />;
    }

    // Show downtime screen if down, unless the user is an admin
    if (siteStatus.is_down && !isAdmin) {
        return <DowntimeScreen message={siteStatus.message} />;
    }

    return (
        <div className="bg-[#030303] min-h-screen text-slate-200 selection:bg-cyan-500 selection:text-black">
            <BroadcastBanner />
            <UpdateModal />
            <MigrationModal />

            <Routes>
                <Route path="/" element={
                    !user ? (
                        <LoginScreen />
                    ) : !activeCompany ? (
                        <CompanySelector />
                    ) : (
                        <Navigate to="/ai-tycoon" replace />
                    )
                } />

                <Route path="/ai-tycoon" element={
                    user && activeCompany ? (
                        <Dashboard />
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                {/* Catch-all for 404s */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
