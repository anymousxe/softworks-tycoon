import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useGameStore from './store/gameStore';

// Components
import LoginScreen from './components/auth/LoginScreen';
import LoadingState from './components/ui/LoadingState';
import Dashboard from './components/dashboard/Dashboard';
import CompanySelector from './components/auth/CompanySelector';
import NotFound from './components/ui/NotFound';

function App() {
    const { user, loading, init } = useAuthStore();
    const { activeCompany } = useGameStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Initialize auth
        init();
    }, [init]);

    // Handle routing logic based on auth and company selection
    useEffect(() => {
        if (!loading) {
            if (!user) {
                if (location.pathname !== '/') navigate('/');
            } else if (activeCompany) {
                if (location.pathname !== '/ai-tycoon') navigate('/ai-tycoon');
            } else {
                // Logged in but no company selected
                if (location.pathname !== '/') navigate('/');
            }
        }
    }, [user, activeCompany, loading, location.pathname, navigate]);

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="bg-[#030303] min-h-screen text-slate-200 selection:bg-cyan-500 selection:text-black">
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
