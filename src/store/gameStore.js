import { create } from 'zustand';

const useGameStore = create((set, get) => ({
    activeCompany: null,
    companies: [],
    week: 1,
    year: 2024,

    // Select a company (or create new one in local mode)
    selectCompany: (company) => {
        const isLocalMode = import.meta.env.VITE_LOCAL_MODE === 'true';

        if (isLocalMode) {
            // In local mode, create a default company structure
            const localCompany = {
                id: company?.id || 'local-company-1',
                name: company?.name || 'Local Test Corp',
                user_id: 'local-user',
                cash: company?.cash || 500000,
                compute: company?.compute || 0,
                research_pts: company?.research_pts || 0,
                week: company?.week || 1,
                year: company?.year || 2024,
                models: company?.models || [],
                hardware: company?.hardware || [],
                is_sandbox: company?.is_sandbox || false
            };
            set({ activeCompany: localCompany });
        } else {
            set({ activeCompany: company });
        }
    },

    // Create a new company
    createCompany: async (name, isSandbox = false) => {
        const isLocalMode = import.meta.env.VITE_LOCAL_MODE === 'true';

        if (isLocalMode) {
            // Local mode: create company in memory
            const newCompany = {
                id: `local-${Date.now()}`,
                name,
                user_id: 'local-user',
                cash: isSandbox ? 999999999 : 500000,
                compute: isSandbox ? 99999 : 0,
                research_pts: isSandbox ? 99999 : 0,
                week: 1,
                year: 2024,
                models: [],
                hardware: [],
                is_sandbox: isSandbox,
                created_at: new Date().toISOString()
            };

            set({
                activeCompany: newCompany,
                companies: [...get().companies, newCompany]
            });

            return newCompany;
        } else {
            // Database mode: would create in Supabase
            // This will be implemented when Supabase is configured
            throw new Error('Database mode requires Supabase configuration');
        }
    },

    // Advance to next week
    nextWeek: () => {
        const { activeCompany } = get();
        if (!activeCompany) return;

        const newWeek = activeCompany.week + 1;
        const newYear = newWeek > 52 ? activeCompany.year + 1 : activeCompany.year;
        const finalWeek = newWeek > 52 ? 1 : newWeek;

        // Calculate expenses
        const upkeepCost = (activeCompany.hardware || []).reduce((sum, hw) => sum + (hw.upkeep || 0), 0);
        const operationalCost = (activeCompany.models || []).reduce((sum, model) => {
            if (model.status === 'live') return sum + (model.operational_cost_per_week || 0);
            return sum;
        }, 0);

        const totalExpenses = upkeepCost + operationalCost;
        const newCash = activeCompany.cash - totalExpenses;

        set({
            activeCompany: {
                ...activeCompany,
                week: finalWeek,
                year: newYear,
                cash: newCash
            }
        });
    },

    // Update company data
    updateCompany: (updates) => {
        const { activeCompany } = get();
        if (!activeCompany) return;

        set({
            activeCompany: {
                ...activeCompany,
                ...updates
            }
        });
    },

    // Purchase hardware
    purchaseHardware: (hardware) => {
        const { activeCompany } = get();
        if (!activeCompany) return;

        const newCash = activeCompany.cash - hardware.cost;
        const newCompute = (activeCompany.compute || 0) + hardware.compute;

        set({
            activeCompany: {
                ...activeCompany,
                cash: newCash,
                compute: newCompute,
                hardware: [...(activeCompany.hardware || []), hardware]
            }
        });
    },

    // Start AI model development
    startModelDevelopment: (modelData) => {
        const { activeCompany } = get();
        if (!activeCompany) return;

        const newModel = {
            ...modelData,
            id: `model-${Date.now()}`,
            status: 'development',
            weeks_remaining: modelData.time,
            created_at: new Date().toISOString()
        };

        set({
            activeCompany: {
                ...activeCompany,
                cash: activeCompany.cash - modelData.cost,
                models: [...(activeCompany.models || []), newModel]
            }
        });
    },

    // Reset store
    reset: () => set({ activeCompany: null, companies: [], week: 1, year: 2024 })
}));

export default useGameStore;
