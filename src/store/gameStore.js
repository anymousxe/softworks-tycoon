import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { TRAINING_CONSTANTS, PARAMETER_TIERS } from '../data/models';
import { TRAINING_DATA_SOURCES, LAWSUIT_EVENTS } from '../data/constants';

// Helper to format parameters for display
export const formatParameters = (params, disclosed = true) => {
    if (!disclosed) {
        const tier = PARAMETER_TIERS.find(t => params >= t.min && params < t.max);
        return tier?.display || 'Unknown';
    }
    if (params >= 1000000000000) return `${(params / 1000000000000).toFixed(1)}T`;
    if (params >= 1000000000) return `${(params / 1000000000).toFixed(1)}B`;
    if (params >= 1000000) return `${(params / 1000000).toFixed(0)}M`;
    return `${(params / 1000).toFixed(0)}K`;
};

// Calculate parameters earned per training week
export const calculateParamsPerWeek = (compute, dataQuality, dataSources) => {
    const baseParams = TRAINING_CONSTANTS.BASE_PARAMS_PER_WEEK;
    const computeBonus = 1 + (compute * TRAINING_CONSTANTS.COMPUTE_MULTIPLIER);
    const qualityBonus = 1 + (dataQuality * TRAINING_CONSTANTS.DATA_QUALITY_MULTIPLIER);

    // Sum up data source speed multipliers
    const speedMultiplier = dataSources.reduce((acc, source) => {
        const freeSource = TRAINING_DATA_SOURCES.free.find(s => s.id === source);
        const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === source);
        return acc + (freeSource?.speed || paidSource?.speed || 1);
    }, 0) / Math.max(dataSources.length, 1);

    return Math.floor(baseParams * computeBonus * qualityBonus * speedMultiplier);
};

// Check for lawsuit based on data sources
export const checkForLawsuit = (dataSources, hasLegalTeam = false) => {
    const riskReduction = hasLegalTeam ? 0.5 : 1.0;

    for (const sourceId of dataSources) {
        const freeSource = TRAINING_DATA_SOURCES.free.find(s => s.id === sourceId);
        if (freeSource && freeSource.risk > 0) {
            const lawsuitChance = (freeSource.risk / 100) * riskReduction;
            if (Math.random() < lawsuitChance * 0.1) { // 10% of risk per week
                const lawsuit = LAWSUIT_EVENTS.find(l => l.source === sourceId);
                if (lawsuit) {
                    return {
                        triggered: true,
                        plaintiff: lawsuit.plaintiff,
                        damages: lawsuit.damages,
                        settlementChance: lawsuit.settlementChance,
                        source: freeSource.name
                    };
                }
            }
        }
    }
    return { triggered: false };
};

const useGameStore = create(
    persist(
        (set, get) => ({
            activeCompany: null,
            companies: [],
            pendingLawsuits: [],
            competitorActions: [],

            // Select a company
            selectCompany: async (companyIdOrCompany) => {
                if (!companyIdOrCompany) return;

                // If it's already a company object, use it directly
                if (typeof companyIdOrCompany === 'object') {
                    set({ activeCompany: companyIdOrCompany });
                    return;
                }

                // If Supabase is configured, try to fetch from there
                if (supabase) {
                    try {
                        const { data, error } = await supabase
                            .from('companies')
                            .select('*, models(*)')
                            .eq('id', companyIdOrCompany)
                            .single();

                        if (!error && data) {
                            set({ activeCompany: data });
                            return;
                        }
                    } catch (e) {
                        console.warn('Supabase fetch failed, using local:', e);
                    }
                }

                // Fallback to local storage
                const company = get().companies.find(c => c.id === companyIdOrCompany);
                if (company) {
                    set({ activeCompany: company });
                }
            },

            // Create a new company
            createCompany: async (name, isSandbox = false) => {
                const newCompany = {
                    id: `company-${Date.now()}`,
                    name,
                    user_id: 'local_user',
                    cash: isSandbox ? 999999999 : 500000,
                    compute: isSandbox ? 99999 : 0,
                    research_pts: isSandbox ? 99999 : 0,
                    week: 1,
                    year: 2024,
                    models: [],
                    hardware: [],
                    unlocked_tech: [],
                    upgrades: [],
                    is_sandbox: isSandbox,
                    created_at: new Date().toISOString()
                };

                // Try Supabase first
                if (supabase) {
                    try {
                        const { data, error } = await supabase
                            .from('companies')
                            .insert([newCompany])
                            .select()
                            .single();

                        if (!error && data) {
                            const newCompanies = [...get().companies, data];
                            set({ companies: newCompanies, activeCompany: data });
                            return data;
                        }
                    } catch (e) {
                        console.warn('Supabase insert failed, using local:', e);
                    }
                }

                // Local storage fallback
                const newCompanies = [...get().companies, newCompany];
                set({ companies: newCompanies, activeCompany: newCompany });
                return newCompany;
            },

            // Create a new model (FREE - just creates the model shell)
            createModel: async (modelData) => {
                const { activeCompany } = get();
                if (!activeCompany) return null;

                const newModel = {
                    id: `model-${Date.now()}`,
                    name: modelData.name,
                    type: modelData.type,
                    mode: modelData.mode,
                    version: 1.0,
                    variant: 'base',
                    customVariant: null,
                    status: 'created', // created -> training -> trained -> released
                    parameters: 0,
                    quality: 0,
                    disclosed_params: true, // whether to show exact params or range
                    is_open_source: false,
                    license: 'proprietary',
                    training_data: [],
                    training_weeks_total: 0,
                    training_weeks_completed: 0,
                    training_cost_per_week: 0,
                    compute_allocated: 0,
                    hype: 0,
                    revenue: 0,
                    operational_cost_per_week: modelData.operational_cost || 0,
                    parent_model_id: modelData.parent_model_id || null,
                    created_at: new Date().toISOString()
                };

                // Try Supabase first
                if (supabase) {
                    try {
                        const { data, error } = await supabase
                            .from('models')
                            .insert([{ ...newModel, company_id: activeCompany.id }])
                            .select()
                            .single();

                        if (!error && data) {
                            const updatedCompany = {
                                ...activeCompany,
                                models: [...(activeCompany.models || []), data]
                            };
                            get().updateCompanyState(updatedCompany);
                            return data;
                        }
                    } catch (e) {
                        console.warn('Supabase model insert failed, using local:', e);
                    }
                }

                // Local storage fallback
                const updatedCompany = {
                    ...activeCompany,
                    models: [...(activeCompany.models || []), newModel]
                };
                get().updateCompanyState(updatedCompany);
                return newModel;
            },

            // Start training a model
            startTraining: async (modelId, trainingConfig) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const { dataSources, weeks, computeAllocation } = trainingConfig;

                // Calculate training cost per week
                const paidSourcesCost = dataSources.reduce((acc, sourceId) => {
                    const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === sourceId);
                    return acc + (paidSource?.costPerWeek || 0);
                }, 0);

                // Calculate data quality average
                const dataQuality = dataSources.reduce((acc, sourceId) => {
                    const freeSource = TRAINING_DATA_SOURCES.free.find(s => s.id === sourceId);
                    const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === sourceId);
                    return acc + (freeSource?.quality || paidSource?.quality || 0);
                }, 0) / Math.max(dataSources.length, 1);

                const updatedModels = activeCompany.models.map(model => {
                    if (model.id === modelId) {
                        return {
                            ...model,
                            status: 'training',
                            training_data: dataSources,
                            training_weeks_total: weeks,
                            training_weeks_completed: 0,
                            training_cost_per_week: paidSourcesCost,
                            compute_allocated: computeAllocation,
                            data_quality: dataQuality
                        };
                    }
                    return model;
                });

                const updatedCompany = { ...activeCompany, models: updatedModels };
                await get().updateCompanyState(updatedCompany);
                return true;
            },

            // Create a variant from an existing model
            createVariant: async (baseModelId, variantType, customName = null) => {
                const { activeCompany } = get();
                if (!activeCompany) return null;

                const baseModel = activeCompany.models.find(m => m.id === baseModelId);
                if (!baseModel || baseModel.status !== 'released') return null;

                const variantName = customName || variantType;
                const newVariant = {
                    id: `model-${Date.now()}`,
                    name: `${baseModel.name} ${variantName}`,
                    type: baseModel.type,
                    mode: baseModel.mode,
                    version: baseModel.version,
                    variant: variantType,
                    customVariant: customName,
                    status: 'created',
                    parameters: 0, // Will inherit some from base during training
                    quality: 0,
                    disclosed_params: baseModel.disclosed_params,
                    is_open_source: baseModel.is_open_source,
                    license: baseModel.license,
                    training_data: [],
                    training_weeks_total: 0,
                    training_weeks_completed: 0,
                    training_cost_per_week: 0,
                    compute_allocated: 0,
                    hype: Math.floor(baseModel.hype * 0.3), // Inherits some hype
                    revenue: 0,
                    operational_cost_per_week: baseModel.operational_cost_per_week,
                    parent_model_id: baseModelId,
                    base_parameters: baseModel.parameters, // Inherit base params
                    created_at: new Date().toISOString()
                };

                const updatedCompany = {
                    ...activeCompany,
                    models: [...activeCompany.models, newVariant]
                };
                await get().updateCompanyState(updatedCompany);
                return newVariant;
            },

            // Toggle open source status
            setModelOpenSource: async (modelId, isOpenSource, license) => {
                const { activeCompany } = get();
                if (!activeCompany) return;

                const updatedModels = activeCompany.models.map(model => {
                    if (model.id === modelId) {
                        return { ...model, is_open_source: isOpenSource, license };
                    }
                    return model;
                });

                const updatedCompany = { ...activeCompany, models: updatedModels };
                await get().updateCompanyState(updatedCompany);
            },

            // Toggle parameter disclosure
            toggleParamDisclosure: async (modelId) => {
                const { activeCompany } = get();
                if (!activeCompany) return;

                const updatedModels = activeCompany.models.map(model => {
                    if (model.id === modelId) {
                        return { ...model, disclosed_params: !model.disclosed_params };
                    }
                    return model;
                });

                const updatedCompany = { ...activeCompany, models: updatedModels };
                await get().updateCompanyState(updatedCompany);
            },

            // Release a trained model
            releaseModel: async (modelId) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const model = activeCompany.models.find(m => m.id === modelId);
                if (!model || model.status !== 'trained') return false;
                if (model.parameters === 0) return false; // Cannot release with 0 params

                const updatedModels = activeCompany.models.map(m => {
                    if (m.id === modelId) {
                        return { ...m, status: 'released', released_at: new Date().toISOString() };
                    }
                    return m;
                });

                const updatedCompany = { ...activeCompany, models: updatedModels };
                await get().updateCompanyState(updatedCompany);
                return true;
            },

            // Advance to next week - handles training progress, lawsuits, income
            nextWeek: async () => {
                const { activeCompany, pendingLawsuits } = get();
                if (!activeCompany) return;

                const hasLegalTeam = (activeCompany.upgrades || []).includes('legal_team');
                let newLawsuits = [...pendingLawsuits];
                let totalExpenses = 0;
                let totalRevenue = 0;

                // Process each model
                const updatedModels = activeCompany.models.map(model => {
                    const updated = { ...model };

                    // Training progress
                    if (model.status === 'training') {
                        updated.training_weeks_completed = (model.training_weeks_completed || 0) + 1;

                        // Calculate parameters earned this week
                        const paramsEarned = calculateParamsPerWeek(
                            model.compute_allocated || activeCompany.compute || 0,
                            model.data_quality || 50,
                            model.training_data || []
                        );

                        // For variants, they start with base parameters
                        const baseParams = model.base_parameters || 0;
                        updated.parameters = baseParams + (model.parameters || 0) + paramsEarned;

                        // Update quality based on parameters
                        updated.quality = Math.min(100, Math.floor(
                            updated.parameters * TRAINING_CONSTANTS.PARAMS_TO_QUALITY_RATIO * 1000000000
                        ) + (model.data_quality || 50) * 0.3);

                        // Training cost
                        totalExpenses += model.training_cost_per_week || 0;

                        // Check for lawsuits from training data
                        const lawsuit = checkForLawsuit(model.training_data || [], hasLegalTeam);
                        if (lawsuit.triggered) {
                            newLawsuits.push({
                                id: `lawsuit-${Date.now()}`,
                                modelId: model.id,
                                modelName: model.name,
                                ...lawsuit,
                                week: activeCompany.week,
                                year: activeCompany.year
                            });
                        }

                        // Check if training complete
                        if (updated.training_weeks_completed >= model.training_weeks_total) {
                            updated.status = 'trained';
                        }
                    }

                    // Running costs and revenue for released models
                    if (model.status === 'released') {
                        totalExpenses += model.operational_cost_per_week || 0;

                        // Revenue based on quality, hype, and open source status
                        const baseRevenue = model.quality * 100 + (model.hype || 0) * 10;
                        const osMultiplier = model.is_open_source ? 0.3 : 1.0;
                        updated.revenue = Math.floor(baseRevenue * osMultiplier);
                        totalRevenue += updated.revenue;
                    }

                    return updated;
                });

                // Hardware upkeep
                const upkeepCost = (activeCompany.hardware || []).reduce(
                    (sum, hw) => sum + (hw.upkeep || 0), 0
                );
                totalExpenses += upkeepCost;

                // Calculate new week/year
                const newWeek = activeCompany.week + 1;
                const newYear = newWeek > 52 ? activeCompany.year + 1 : activeCompany.year;
                const finalWeek = newWeek > 52 ? 1 : newWeek;

                const updatedCompany = {
                    ...activeCompany,
                    week: finalWeek,
                    year: newYear,
                    cash: activeCompany.cash - totalExpenses + totalRevenue,
                    models: updatedModels
                };

                // Update Supabase if available
                if (supabase) {
                    try {
                        await supabase
                            .from('companies')
                            .update({
                                week: finalWeek,
                                year: newYear,
                                cash: updatedCompany.cash
                            })
                            .eq('id', activeCompany.id);
                    } catch (e) {
                        console.warn('Supabase update failed:', e);
                    }
                }

                set({
                    activeCompany: updatedCompany,
                    companies: get().companies.map(c =>
                        c.id === activeCompany.id ? updatedCompany : c
                    ),
                    pendingLawsuits: newLawsuits
                });
            },

            // Helper to update company state (both local and Supabase)
            updateCompanyState: async (updatedCompany) => {
                // Update Supabase if available
                if (supabase) {
                    try {
                        await supabase
                            .from('companies')
                            .update(updatedCompany)
                            .eq('id', updatedCompany.id);
                    } catch (e) {
                        console.warn('Supabase update failed:', e);
                    }
                }

                set({
                    activeCompany: updatedCompany,
                    companies: get().companies.map(c =>
                        c.id === updatedCompany.id ? updatedCompany : c
                    )
                });
            },

            // Update company data
            updateCompany: (updates) => {
                const { activeCompany } = get();
                if (!activeCompany) return;

                const updatedCompany = { ...activeCompany, ...updates };
                get().updateCompanyState(updatedCompany);
            },

            // Purchase hardware
            purchaseHardware: async (hardware) => {
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

                await get().updateCompanyState(updatedCompany);
            },

            // Settle a lawsuit
            settleLawsuit: async (lawsuitId, settle = true) => {
                const { pendingLawsuits, activeCompany } = get();
                const lawsuit = pendingLawsuits.find(l => l.id === lawsuitId);
                if (!lawsuit) return;

                let cost = 0;
                if (settle) {
                    // Settlement is a fraction of damages
                    cost = Math.floor(lawsuit.damages * (1 - lawsuit.settlementChance) * 0.5);
                } else {
                    // Going to court - full damages if lose
                    if (Math.random() > lawsuit.settlementChance) {
                        cost = lawsuit.damages;
                    }
                }

                const updatedCompany = {
                    ...activeCompany,
                    cash: activeCompany.cash - cost
                };

                set({
                    pendingLawsuits: pendingLawsuits.filter(l => l.id !== lawsuitId)
                });

                await get().updateCompanyState(updatedCompany);
                return { cost, settled: settle };
            },

            // Reset store
            reset: () => set({ activeCompany: null, companies: [], pendingLawsuits: [] }),

            // Logout - clear active company but keep saves
            logout: () => set({ activeCompany: null })
        }),
        {
            name: 'ai-tycoon-game-storage',
            partialize: (state) => ({
                companies: state.companies,
                pendingLawsuits: state.pendingLawsuits
            })
        }
    )
);

export default useGameStore;
