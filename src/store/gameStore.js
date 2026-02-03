import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useGameStore = create((set, get) => ({
    activeCompany: null,
    companies: [],
    hardware: [],
    models: [],
    loading: false,

    // Initialize game state for user
    initGame: async (userId) => {
        set({ loading: true });

        // Fetch user's companies
        const { data: companies } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        set({ companies: companies || [], loading: false });
    },

    // Start/Select a company
    selectCompany: async (companyId) => {
        set({ loading: true });

        // Fetch hardware and models for this company
        const [hwRes, modelsRes, companyRes] = await Promise.all([
            supabase.from('hardware').select('*').eq('company_id', companyId),
            supabase.from('models').select('*').eq('company_id', companyId),
            supabase.from('companies').select('*').eq('id', companyId).single()
        ]);

        set({
            activeCompany: companyRes.data,
            hardware: hwRes.data || [],
            models: modelsRes.data || [],
            loading: false
        });
    },

    // Create a new company
    createCompany: async (userId, name, isSandbox, hasSeenGift = false) => {
        const starterCash = isSandbox ? 100000000 : (hasSeenGift ? 40000 : 25000);

        const { data: newCompany, error } = await supabase
            .from('companies')
            .insert([{
                user_id: userId,
                name,
                is_sandbox: isSandbox,
                cash: starterCash,
                week: 1,
                year: 2025,
                research_pts: isSandbox ? 5000 : 0
            }])
            .select()
            .single();

        if (error) throw error;

        set(state => ({
            companies: [newCompany, ...state.companies],
            activeCompany: newCompany
        }));

        return newCompany;
    },

    // Week Progression
    nextWeek: async () => {
        const { activeCompany, hardware, models } = get();
        if (!activeCompany) return;

        // 1. Calculate Expenses (Wages + Upkeep)
        const wages = (activeCompany.employees_count || 1) * 500;
        const { HARDWARE: hardwareData } = await import('../data/constants');

        const upkeep = hardware.reduce((acc, hw) => {
            const h = hardwareData.find(x => x.id === hw.type_id);
            return acc + (h ? h.upkeep * hw.count : 0);
        }, 0);

        // 2. Calculate Revenue
        let weeklyRevenue = 0;
        const updatedModels = models.map(m => {
            const model = { ...m };
            if (model.released && !model.is_open_source) {
                // Basic revenue logic
                const rev = Math.floor((model.quality * 10) * (1 + (model.hype / 100)));
                model.revenue = rev;
                weeklyRevenue += rev;

                // Hype decay
                model.hype = Math.max(0, model.hype - 5);
            }

            // Update development progress
            if (!model.released && model.weeks_left > 0) {
                model.weeks_left = Math.max(0, model.weeks_left - 1);
                if (model.weeks_left === 0) {
                    model.is_staged = true; // Ready for launch
                }
            }

            return model;
        });

        // 3. Update State
        const updatedCompany = {
            ...activeCompany,
            cash: activeCompany.cash + weeklyRevenue - wages - upkeep,
            week: activeCompany.week + 1,
            research_pts: activeCompany.research_pts + 5
        };

        if (updatedCompany.week > 52) {
            updatedCompany.week = 1;
            updatedCompany.year += 1;
        }

        // 4. Persistence (Batch update would be better in real Supabase)
        await Promise.all([
            supabase.from('companies').update(updatedCompany).eq('id', updatedCompany.id),
            ...updatedModels.map(m => supabase.from('models').update(m).eq('id', m.id))
        ]);

        set({
            activeCompany: updatedCompany,
            models: updatedModels
        });
    },

    // Hardware Purchases
    buyHardware: async (typeId, cost) => {
        const { activeCompany, hardware } = get();
        if (activeCompany.cash < cost) throw new Error('Insufficient funds');

        const existing = hardware.find(h => h.type_id === typeId);

        if (existing) {
            const { data } = await supabase
                .from('hardware')
                .update({ count: existing.count + 1 })
                .eq('id', existing.id)
                .select()
                .single();

            set(state => ({
                hardware: state.hardware.map(h => h.id === data.id ? data : h)
            }));
        } else {
            const { data } = await supabase
                .from('hardware')
                .insert([{ company_id: activeCompany.id, type_id: typeId, count: 1 }])
                .select()
                .single();

            set(state => ({ hardware: [...state.hardware, data] }));
        }

        // Update Company Cash
        const { data: updatedCompany } = await supabase
            .from('companies')
            .update({ cash: activeCompany.cash - cost })
            .eq('id', activeCompany.id)
            .select()
            .single();

        set({ activeCompany: updatedCompany });
    }
}));

export default useGameStore;
