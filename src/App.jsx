import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useGameStore from './store/gameStore';
import useGameDevStore from './store/gameDevStore';

// Shared Components
import LoginScreen from './components/auth/LoginScreen';
import LoadingState from './components/ui/LoadingState';
import NotFound from './components/ui/NotFound';

// Game Mode Selection
import GameModeSelector from './components/game-selection/GameModeSelector';

// AI Tycoon Components
import Dashboard from './components/dashboard/Dashboard';
import CompanySelector from './components/auth/CompanySelector';

// Game Dev Tycoon Components
import CharacterCreator from './components/game-dev/CharacterCreator';
import StudioSetup from './components/game-dev/StudioSetup';
import GameDevDashboard from './components/game-dev/GameDevDashboard';

function App() {
    const { user, loading, init } = useAuthStore();
    const { activeCompany } = useGameStore();
    const { character, studio } = useGameDevStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        init();
    }, [init]);

    // Only redirect on initial load, not on every route change
    useEffect(() => {
        if (!loading && !user && location.pathname !== '/') {
            navigate('/');
        }
    }, [user, loading]);

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="bg-[#030303] min-h-screen text-slate-200 selection:bg-cyan-500 selection:text-black">
            <Routes>
                {/* Login */}
                <Route path="/" element={
                    !user ? (
                        <LoginScreen />
                    ) : (
                        <Navigate to="/select-mode" replace />
                    )
                } />

                {/* Game Mode Selection */}
                <Route path="/select-mode" element={
                    user ? (
                        <GameModeSelector />
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                {/* ============= AI TYCOON ROUTES ============= */}
                <Route path="/ai-tycoon" element={
                    user ? (
                        activeCompany ? (
                            <Dashboard />
                        ) : (
                            <Navigate to="/ai-tycoon/select-company" replace />
                        )
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/ai-tycoon/select-company" element={
                    user ? (
                        <CompanySelector />
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                {/* ============= GAME DEV TYCOON ROUTES ============= */}
                <Route path="/game-dev" element={
                    user ? (
                        character && studio ? (
                            <Navigate to="/game-dev/dashboard" replace />
                        ) : character ? (
                            <Navigate to="/game-dev/studio-setup" replace />
                        ) : (
                            <Navigate to="/game-dev/character" replace />
                        )
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/game-dev/character" element={
                    user ? (
                        <CharacterCreator />
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/game-dev/studio-setup" element={
                    user ? (
                        character ? (
                            <StudioSetup />
                        ) : (
                            <Navigate to="/game-dev/character" replace />
                        )
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/game-dev/dashboard" element={
                    user ? (
                        character && studio ? (
                            <GameDevDashboard />
                        ) : (
                            <Navigate to="/game-dev" replace />
                        )
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
