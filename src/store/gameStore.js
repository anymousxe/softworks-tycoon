import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
    persist(
        (set, get) => ({
            activeCompany: null,
            companies: [],

            // Select a company
            selectCompany: (company) => {
                if (!company) return;
                set({ activeCompany: company });
            },

            // Create a new company - stores in localStorage for now
            createCompany: async (name, isSandbox = false) => {
                const newCompany = {
                    id: `company-${Date.now()}`,
                    name,
                    user_id: 'user',
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

                const newCompanies = [...get().companies, newCompany];

                set({
                    companies: newCompanies,
                    activeCompany: newCompany
                });

                return newCompany;
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

                const updatedCompany = {
                    ...activeCompany,
                    week: finalWeek,
                    year: newYear,
                    cash: newCash
                };

                // Also update in companies array
                const updatedCompanies = get().companies.map(c =>
                    c.id === activeCompany.id ? updatedCompany : c
                );

                set({
                    activeCompany: updatedCompany,
                    companies: updatedCompanies
                });
            },

            // Update company data
            updateCompany: (updates) => {
                const { activeCompany } = get();
                if (!activeCompany) return;

                const updatedCompany = {
                    ...activeCompany,
                    ...updates
                };

                const updatedCompanies = get().companies.map(c =>
                    c.id === activeCompany.id ? updatedCompany : c
                );

                set({
                    activeCompany: updatedCompany,
                    companies: updatedCompanies
                });
            },

            // Purchase hardware
            purchaseHardware: (hardware) => {
                const { activeCompany } = get();
                if (!activeCompany) return;

                const newCash = activeCompany.cash - hardware.cost;
                const newCompute = (activeCompany.compute || 0) + hardware.compute;

                const updatedCompany = {
                    ...activeCompany,
                    cash: newCash,
                    compute: newCompute,
                    hardware: [...(activeCompany.hardware || []), hardware]
                };

                const updatedCompanies = get().companies.map(c =>
                    c.id === activeCompany.id ? updatedCompany : c
                );

                set({
                    activeCompany: updatedCompany,
                    companies: updatedCompanies
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

                const updatedCompany = {
                    ...activeCompany,
                    cash: activeCompany.cash - modelData.cost,
                    models: [...(activeCompany.models || []), newModel]
                };

                const updatedCompanies = get().companies.map(c =>
                    c.id === activeCompany.id ? updatedCompany : c
                );

                set({
                    activeCompany: updatedCompany,
                    companies: updatedCompanies
                });
            },

            // Reset store
            reset: () => set({ activeCompany: null, companies: [] }),

            // Logout - clear active company but keep saves
            logout: () => set({ activeCompany: null })
        }),
        {
            name: 'ai-tycoon-game-storage',
            partialize: (state) => ({ companies: state.companies })
        }
    )
);

export default useGameStore;
