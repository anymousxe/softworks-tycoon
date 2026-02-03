import React from 'react';

const AdminPanel = () => {
    return (
        <div className="animate-in space-y-10">
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-900/20 flex items-center justify-center mb-8 border border-red-500/20">
                    <span className="text-4xl">🔐</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Admin Panel</h3>
                <p className="text-slate-500 text-sm mb-10 max-w-sm leading-relaxed">
                    This feature requires Supabase configuration. Please set up your database to enable admin controls.
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;
