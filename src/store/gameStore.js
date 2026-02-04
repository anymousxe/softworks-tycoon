import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { TRAINING_CONSTANTS, PARAMETER_TIERS } from '../data/models';
import {
    TRAINING_DATA_SOURCES,
    LAWSUIT_EVENTS,
    INITIAL_LEADERBOARD_2024,
    COMPETITOR_MODEL_TEMPLATES,
    COMPETITOR_RELEASE_CHANCES,
    QUALITY_DECAY,
    EMPLOYEES,
    AD_CAMPAIGNS,
    OPEN_SOURCE_LIMITS
} from '../data/constants';

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
            if (Math.random() < lawsuitChance * 0.1) {
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

// Generate a random competitor model release
const generateCompetitorRelease = (week, year, playerBestParams = 0, isSandbox = false) => {
    const template = COMPETITOR_MODEL_TEMPLATES[Math.floor(Math.random() * COMPETITOR_MODEL_TEMPLATES.length)];
    const version = template.versions[Math.floor(Math.random() * template.versions.length)];
    const variant = template.variants[Math.floor(Math.random() * template.variants.length)];

    // Calculate params based on year progression and growth rate
    const yearsSince2024 = year - 2024 + (week / 52);
    let baseMultiplier = Math.pow(template.growthRate, yearsSince2024);

    // Silent breakthrough - much bigger jump
    const isSilentBreakthrough = Math.random() < template.silentChance;
    if (isSilentBreakthrough) {
        baseMultiplier *= 2 + Math.random() * 3; // 2x to 5x bigger
    }

    // If in sandbox with huge player models, competitors try to catch up
    if (isSandbox && playerBestParams > template.baseParams * 2) {
        const catchupFactor = 0.5 + Math.random() * 0.8; // 50% to 130% of player
        baseMultiplier = (playerBestParams / template.baseParams) * catchupFactor;
    }

    const params = Math.floor(template.baseParams * baseMultiplier * (0.8 + Math.random() * 0.4));
    const quality = Math.min(98, 50 + Math.floor(Math.log10(params) * 5) + Math.floor(Math.random() * 15));

    const modelName = variant ? `${template.prefix} ${version} ${variant}` : `${template.prefix}-${version}`;

    return {
        id: `competitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: modelName,
        company: template.company,
        params,
        type: template.type || 'text',
        quality,
        released: `${year}-${String(Math.ceil(week / 4)).padStart(2, '0')}`,
        isOpenSource: template.isOpenSource || false,
        isSilentBreakthrough,
        week,
        year
    };
};

const useGameStore = create(
    persist(
        (set, get) => ({
            activeCompany: null,
            companies: [],
            pendingLawsuits: [],
            notifications: [],
            leaderboard: [...INITIAL_LEADERBOARD_2024],

            // Select a company
            selectCompany: async (companyIdOrCompany) => {
                if (!companyIdOrCompany) return;

                if (typeof companyIdOrCompany === 'object') {
                    set({ activeCompany: companyIdOrCompany });
                    return;
                }

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
                    employees: [],
                    active_ads: [],
                    unlocked_tech: [],
                    upgrades: [],
                    is_sandbox: isSandbox,
                    created_at: new Date().toISOString()
                };

                if (supabase) {
                    try {
                        const { data, error } = await supabase
                            .from('companies')
                            .insert([newCompany])
                            .select()
                            .single();

                        if (!error && data) {
                            const newCompanies = [...get().companies, data];
                            set({
                                companies: newCompanies,
                                activeCompany: data,
                                leaderboard: [...INITIAL_LEADERBOARD_2024] // Reset leaderboard for new company
                            });
                            return data;
                        }
                    } catch (e) {
                        console.warn('Supabase insert failed, using local:', e);
                    }
                }

                const newCompanies = [...get().companies, newCompany];
                set({
                    companies: newCompanies,
                    activeCompany: newCompany,
                    leaderboard: [...INITIAL_LEADERBOARD_2024]
                });
                return newCompany;
            },

            // Create a new model (FREE)
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
                    status: 'created',
                    parameters: 0,
                    quality: 0,
                    disclosed_params: true,
                    is_open_source: false,
                    license: 'proprietary',
                    training_data: [],
                    training_sessions: [], // Track multiple training sessions
                    training_weeks_total: 0,
                    training_weeks_completed: 0,
                    training_cost_per_week: 0,
                    compute_allocated: 0,
                    hype: 0,
                    revenue: 0,
                    operational_cost_per_week: modelData.operational_cost || 0,
                    parent_model_id: modelData.parent_model_id || null,
                    // API pricing
                    api_enabled: false,
                    api_input_cost: 0,
                    api_output_cost: 0,
                    api_rate_limit: 100,
                    api_revenue: 0,
                    created_at: new Date().toISOString()
                };

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

                const updatedCompany = {
                    ...activeCompany,
                    models: [...(activeCompany.models || []), newModel]
                };
                get().updateCompanyState(updatedCompany);
                return newModel;
            },

            // Start or continue training a model (can be called multiple times)
            startTraining: async (modelId, trainingConfig) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const { dataSources, weeks, computeAllocation } = trainingConfig;

                const paidSourcesCost = dataSources.reduce((acc, sourceId) => {
                    const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === sourceId);
                    return acc + (paidSource?.costPerWeek || 0);
                }, 0);

                const dataQuality = dataSources.reduce((acc, sourceId) => {
                    const freeSource = TRAINING_DATA_SOURCES.free.find(s => s.id === sourceId);
                    const paidSource = TRAINING_DATA_SOURCES.paid.find(s => s.id === sourceId);
                    return acc + (freeSource?.quality || paidSource?.quality || 0);
                }, 0) / Math.max(dataSources.length, 1);

                const updatedModels = activeCompany.models.map(model => {
                    if (model.id === modelId) {
                        // Track this training session
                        const newSession = {
                            id: `session-${Date.now()}`,
                            dataSources,
                            weeks,
                            computeAllocation,
                            dataQuality,
                            costPerWeek: paidSourcesCost,
                            startedAt: new Date().toISOString()
                        };

                        return {
                            ...model,
                            status: 'training',
                            training_data: [...new Set([...(model.training_data || []), ...dataSources])],
                            training_sessions: [...(model.training_sessions || []), newSession],
                            training_weeks_total: (model.training_weeks_total || 0) + weeks,
                            training_weeks_completed: model.training_weeks_completed || 0,
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

            // Configure API for a released model
            configureAPI: async (modelId, apiConfig) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const updatedModels = activeCompany.models.map(model => {
                    if (model.id === modelId && model.status === 'released') {
                        return {
                            ...model,
                            api_enabled: true,
                            api_input_cost: apiConfig.inputCost,
                            api_output_cost: apiConfig.outputCost,
                            api_rate_limit: apiConfig.rateLimit
                        };
                    }
                    return model;
                });

                const updatedCompany = { ...activeCompany, models: updatedModels };
                await get().updateCompanyState(updatedCompany);
                return true;
            },

            // Hire an employee
            hireEmployee: async (employeeId) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const employee = EMPLOYEES.find(e => e.id === employeeId);
                if (!employee || activeCompany.cash < employee.salary * 4) return false; // Need 4 weeks salary upfront

                const updatedCompany = {
                    ...activeCompany,
                    cash: activeCompany.cash - (employee.salary * 4),
                    employees: [...(activeCompany.employees || []), { ...employee, hired_at: new Date().toISOString() }]
                };

                await get().updateCompanyState(updatedCompany);
                return true;
            },

            // Fire an employee
            fireEmployee: async (employeeId) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const updatedCompany = {
                    ...activeCompany,
                    employees: (activeCompany.employees || []).filter(e => e.id !== employeeId)
                };

                await get().updateCompanyState(updatedCompany);
                return true;
            },

            // Start an ad campaign
            startAdCampaign: async (campaignId, weeks = 4) => {
                const { activeCompany } = get();
                if (!activeCompany) return false;

                const campaign = AD_CAMPAIGNS.find(c => c.id === campaignId);
                if (!campaign || activeCompany.cash < campaign.costPerWeek * weeks) return false;

                const activeCampaign = {
                    ...campaign,
                    weeks_remaining: weeks,
                    started_at: new Date().toISOString()
                };

                const updatedCompany = {
                    ...activeCompany,
                    cash: activeCompany.cash - (campaign.costPerWeek * weeks),
                    active_ads: [...(activeCompany.active_ads || []), activeCampaign]
                };

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
                    parameters: 0,
                    quality: 0,
                    disclosed_params: baseModel.disclosed_params,
                    is_open_source: baseModel.is_open_source,
                    license: baseModel.license,
                    training_data: [],
                    training_sessions: [],
                    training_weeks_total: 0,
                    training_weeks_completed: 0,
                    training_cost_per_week: 0,
                    compute_allocated: 0,
                    hype: Math.floor(baseModel.hype * 0.3),
                    revenue: 0,
                    operational_cost_per_week: baseModel.operational_cost_per_week,
                    parent_model_id: baseModelId,
                    base_parameters: baseModel.parameters,
                    api_enabled: false,
                    api_input_cost: 0,
                    api_output_cost: 0,
                    api_rate_limit: 100,
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

                const model = activeCompany.models.find(m => m.id === modelId);
                if (!model) return;

                // Check open source size limits
                if (isOpenSource && model.parameters > OPEN_SOURCE_LIMITS.maxEnterpriseParams) {
                    return { error: 'Model too large for open source - few could run it' };
                }

                const updatedModels = activeCompany.models.map(m => {
                    if (m.id === modelId) {
                        return { ...m, is_open_source: isOpenSource, license };
                    }
                    return m;
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
                const { activeCompany, leaderboard } = get();
                if (!activeCompany) return false;

                const model = activeCompany.models.find(m => m.id === modelId);
                if (!model || model.status !== 'trained') return false;
                if (model.parameters === 0) return false;

                const updatedModels = activeCompany.models.map(m => {
                    if (m.id === modelId) {
                        return { ...m, status: 'released', released_at: new Date().toISOString() };
                    }
                    return m;
                });

                // Add to leaderboard
                const newLeaderboardEntry = {
                    id: model.id,
                    name: model.name,
                    company: activeCompany.name,
                    params: model.parameters,
                    type: model.type,
                    quality: model.quality,
                    released: `${activeCompany.year}-${String(Math.ceil(activeCompany.week / 4)).padStart(2, '0')}`,
                    isOpenSource: model.is_open_source,
                    isPlayer: true
                };

                const updatedLeaderboard = [...leaderboard, newLeaderboardEntry]
                    .sort((a, b) => b.quality - a.quality)
                    .slice(0, 50); // Keep top 50

                const updatedCompany = { ...activeCompany, models: updatedModels };
                await get().updateCompanyState(updatedCompany);

                set({ leaderboard: updatedLeaderboard });

                // Notify about release
                get().addNotification({
                    type: 'release',
                    title: `${model.name} Released!`,
                    message: `Your model is now live with ${formatParameters(model.parameters)} parameters.`,
                    week: activeCompany.week,
                    year: activeCompany.year
                });

                return true;
            },

            // Add a notification
            addNotification: (notification) => {
                const { notifications } = get();
                set({
                    notifications: [
                        { id: `notif-${Date.now()}`, ...notification, read: false },
                        ...notifications
                    ].slice(0, 100) // Keep last 100
                });
            },

            // Mark notification as read
            markNotificationRead: (notifId) => {
                const { notifications } = get();
                set({
                    notifications: notifications.map(n =>
                        n.id === notifId ? { ...n, read: true } : n
                    )
                });
            },

            // Clear all notifications
            clearNotifications: () => set({ notifications: [] }),

            // Advance to next week
            nextWeek: async () => {
                const { activeCompany, pendingLawsuits, leaderboard } = get();
                if (!activeCompany) return;

                const hasLegalTeam = (activeCompany.employees || []).some(e => e.category === 'legal');
                const employeeBonuses = get().calculateEmployeeBonuses();

                let newLawsuits = [...pendingLawsuits];
                let totalExpenses = 0;
                let totalRevenue = 0;
                let newNotifications = [];

                // Employee salaries
                const employeeSalaries = (activeCompany.employees || []).reduce((sum, e) => sum + e.salary, 0);
                totalExpenses += employeeSalaries;

                // Ad campaign processing
                const updatedAds = (activeCompany.active_ads || []).map(ad => {
                    if (ad.weeks_remaining > 0) {
                        return { ...ad, weeks_remaining: ad.weeks_remaining - 1 };
                    }
                    return ad;
                }).filter(ad => ad.weeks_remaining > 0);

                // Ad hype bonus
                const adHypeBonus = (activeCompany.active_ads || []).reduce((sum, ad) => sum + (ad.hypeBonus || 0), 0);

                // Process each model
                const updatedModels = activeCompany.models.map(model => {
                    const updated = { ...model };

                    // Training progress
                    if (model.status === 'training') {
                        updated.training_weeks_completed = (model.training_weeks_completed || 0) + 1;

                        const paramsEarned = calculateParamsPerWeek(
                            model.compute_allocated || activeCompany.compute || 0,
                            model.data_quality || 50,
                            model.training_data || []
                        );

                        const baseParams = model.base_parameters || 0;
                        const qualityBonus = employeeBonuses.qualityBonus || 0;
                        updated.parameters = baseParams + (model.parameters || 0) + paramsEarned;

                        updated.quality = Math.min(100, Math.floor(
                            updated.parameters * TRAINING_CONSTANTS.PARAMS_TO_QUALITY_RATIO * 1000000000
                        ) + (model.data_quality || 50) * 0.3 + qualityBonus);

                        totalExpenses += model.training_cost_per_week || 0;

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

                        if (updated.training_weeks_completed >= model.training_weeks_total) {
                            updated.status = 'trained';
                            newNotifications.push({
                                type: 'training_complete',
                                title: `${model.name} Training Complete!`,
                                message: `Ready to release with ${formatParameters(updated.parameters)} parameters.`
                            });
                        }
                    }

                    // Released models
                    if (model.status === 'released') {
                        totalExpenses += model.operational_cost_per_week || 0;

                        // Quality decay based on better models
                        const betterModels = leaderboard.filter(l =>
                            l.type === model.type &&
                            l.quality > model.quality &&
                            !l.isPlayer
                        );
                        const qualityDecay = Math.min(
                            QUALITY_DECAY.maxDecayPerWeek,
                            betterModels.length * QUALITY_DECAY.perBetterModel
                        );
                        updated.quality = Math.max(QUALITY_DECAY.minimumQuality, model.quality - qualityDecay * 0.1);

                        // Revenue calculation
                        const baseRevenue = updated.quality * 100 + (model.hype || 0) * 10 + adHypeBonus * 5;
                        const osMultiplier = model.is_open_source ? 0.3 : 1.0;
                        const revenueBonus = 1 + (employeeBonuses.revenueBonus || 0);
                        updated.revenue = Math.floor(baseRevenue * osMultiplier * revenueBonus);

                        // API revenue
                        if (model.api_enabled) {
                            const apiCalls = Math.floor(updated.quality * 100 * (model.api_rate_limit / 100));
                            updated.api_revenue = Math.floor(apiCalls * (model.api_input_cost + model.api_output_cost) / 1000);
                            updated.revenue += updated.api_revenue;
                        }

                        totalRevenue += updated.revenue;

                        // Hype from ads
                        updated.hype = (model.hype || 0) + adHypeBonus;
                    }

                    return updated;
                });

                // Hardware upkeep
                const upkeepReduction = employeeBonuses.upkeepReduction || 0;
                const upkeepCost = (activeCompany.hardware || []).reduce(
                    (sum, hw) => sum + (hw.upkeep || 0) * (1 - upkeepReduction), 0
                );
                totalExpenses += upkeepCost;

                // Check for competitor releases
                const isQuarterEnd = activeCompany.week % 12 === 0;
                const playerBestParams = Math.max(...updatedModels.filter(m => m.status === 'released').map(m => m.parameters), 0);

                let releaseChance = COMPETITOR_RELEASE_CHANCES.normalWeek;
                if (isQuarterEnd) releaseChance = COMPETITOR_RELEASE_CHANCES.quarterEnd;

                let updatedLeaderboard = [...leaderboard];

                if (Math.random() < releaseChance) {
                    const newCompetitorModel = generateCompetitorRelease(
                        activeCompany.week,
                        activeCompany.year,
                        playerBestParams,
                        activeCompany.is_sandbox
                    );

                    updatedLeaderboard = [...updatedLeaderboard, newCompetitorModel]
                        .sort((a, b) => b.quality - a.quality)
                        .slice(0, 50);

                    newNotifications.push({
                        type: 'competitor_release',
                        title: `${newCompetitorModel.company} Released ${newCompetitorModel.name}`,
                        message: `${formatParameters(newCompetitorModel.params)} parameters, ${newCompetitorModel.quality}% quality${newCompetitorModel.isSilentBreakthrough ? ' - BREAKTHROUGH!' : ''}`,
                        isBreakthrough: newCompetitorModel.isSilentBreakthrough
                    });
                }

                // Calculate new week/year
                const newWeek = activeCompany.week + 1;
                const newYear = newWeek > 52 ? activeCompany.year + 1 : activeCompany.year;
                const finalWeek = newWeek > 52 ? 1 : newWeek;

                const updatedCompany = {
                    ...activeCompany,
                    week: finalWeek,
                    year: newYear,
                    cash: activeCompany.cash - totalExpenses + totalRevenue,
                    models: updatedModels,
                    active_ads: updatedAds
                };

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

                // Add notifications
                newNotifications.forEach(n => get().addNotification({ ...n, week: finalWeek, year: newYear }));

                set({
                    activeCompany: updatedCompany,
                    companies: get().companies.map(c =>
                        c.id === activeCompany.id ? updatedCompany : c
                    ),
                    pendingLawsuits: newLawsuits,
                    leaderboard: updatedLeaderboard
                });
            },

            // Calculate bonuses from employees
            calculateEmployeeBonuses: () => {
                const { activeCompany } = get();
                if (!activeCompany) return {};

                const employees = activeCompany.employees || [];
                return {
                    qualityBonus: employees.reduce((sum, e) => sum + (e.qualityBonus || 0), 0),
                    speedBonus: employees.reduce((sum, e) => sum + (e.speedBonus || 0), 0),
                    revenueBonus: employees.reduce((sum, e) => sum + (e.revenueBonus || 0), 0),
                    hypeBonus: employees.reduce((sum, e) => sum + (e.hypeBonus || 0), 0),
                    lawsuitDefense: employees.reduce((sum, e) => sum + (e.lawsuitDefense || 0), 0),
                    upkeepReduction: employees.reduce((sum, e) => sum + (e.upkeepReduction || 0), 0)
                };
            },

            // Helper to update company state
            updateCompanyState: async (updatedCompany) => {
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

                const computeBonus = get().calculateEmployeeBonuses().computeBonus || 0;
                const newCash = activeCompany.cash - hardware.cost;
                const newCompute = (activeCompany.compute || 0) + hardware.compute + computeBonus;

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

                const lawsuitDefense = get().calculateEmployeeBonuses().lawsuitDefense || 0;
                const defenseBonus = lawsuitDefense / 100;

                let cost = 0;
                if (settle) {
                    cost = Math.floor(lawsuit.damages * (1 - lawsuit.settlementChance - defenseBonus) * 0.5);
                } else {
                    if (Math.random() > lawsuit.settlementChance + defenseBonus) {
                        cost = lawsuit.damages;
                    }
                }

                const updatedCompany = {
                    ...activeCompany,
                    cash: activeCompany.cash - Math.max(0, cost)
                };

                set({
                    pendingLawsuits: pendingLawsuits.filter(l => l.id !== lawsuitId)
                });

                await get().updateCompanyState(updatedCompany);
                return { cost: Math.max(0, cost), settled: settle };
            },

            // Get top 25 for leaderboard display
            getLeaderboardTop25: () => {
                const { leaderboard } = get();
                return leaderboard.slice(0, 25);
            },

            // Reset store
            reset: () => set({
                activeCompany: null,
                companies: [],
                pendingLawsuits: [],
                notifications: [],
                leaderboard: [...INITIAL_LEADERBOARD_2024]
            }),

            // Logout
            logout: () => set({ activeCompany: null })
        }),
        {
            name: 'ai-tycoon-game-storage',
            partialize: (state) => ({
                companies: state.companies,
                pendingLawsuits: state.pendingLawsuits,
                notifications: state.notifications,
                leaderboard: state.leaderboard
            })
        }
    )
);

export default useGameStore;
