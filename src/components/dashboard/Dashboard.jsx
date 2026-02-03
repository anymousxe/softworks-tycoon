import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DashboardHome from './DashboardHome';
import AICreator from './AICreator';
import HardwareMarket from './HardwareMarket';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dash');

    const renderContent = () => {
        switch (activeTab) {
            case 'dash':
                return <DashboardHome onNavigate={setActiveTab} />;
            case 'dev':
                return <AICreator onFinish={() => setActiveTab('dash')} />;
            case 'market':
                return <HardwareMarket />;
            default:
                return (
                    <div className="h-96 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin mb-4"></div>
                        <h3 className="text-slate-500 font-mono text-xs uppercase tracking-widest">Sector Synchronizing...</h3>
                        <p className="text-slate-700 text-[10px] mt-2 tracking-tighter capitalize">{activeTab} system pending deployment</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 ml-24 md:ml-64 flex flex-col transition-all duration-300">
                <TopBar />

                <main className="flex-1 mt-20 p-8 overflow-y-auto custom-scrollbar relative">
                    {/* Background Ambient Glows */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
