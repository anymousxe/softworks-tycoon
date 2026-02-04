import React, { useState } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown, PiggyBank, CreditCard,
    ArrowUpRight, ArrowDownRight, BarChart3, Calendar, Wallet, AlertCircle
} from 'lucide-react';
import useGameDevStore from '../../store/gameDevStore';

// Chart Bar Component
const ChartBar = ({ height, label, value, color = 'purple' }) => (
    <div className="flex flex-col items-center gap-2 flex-1">
        <div className="relative w-full h-32 bg-slate-800/50 rounded-t-lg overflow-hidden">
            <div
                className={`absolute bottom-0 w-full bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t-lg transition-all`}
                style={{ height: `${height}%` }}
            />
        </div>
        <span className="text-[10px] text-slate-500 uppercase">{label}</span>
        <span className="text-xs font-bold text-white">${(value / 1000).toFixed(0)}k</span>
    </div>
);

// Loan Modal
const LoanModal = ({ onClose }) => {
    const { takeLoan, cash } = useGameDevStore();
    const [amount, setAmount] = useState(100000);
    const [term, setTerm] = useState(24);

    const interestRate = term <= 12 ? 0.08 : term <= 24 ? 0.05 : 0.03;
    const monthlyPayment = (amount * (1 + interestRate)) / term;
    const totalPayback = monthlyPayment * term;

    const handleTakeLoan = () => {
        takeLoan(amount, interestRate, term);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-green-400" />
                    Take Out a Loan
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-2">Loan Amount</label>
                        <input
                            type="range"
                            min="10000"
                            max="5000000"
                            step="10000"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full accent-green-500"
                        />
                        <p className="text-3xl font-black text-green-400 mt-2">${amount.toLocaleString()}</p>
                    </div>

                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase mb-2">Repayment Term</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[12, 24, 36].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTerm(t)}
                                    className={`py-3 rounded-xl font-bold ${term === t
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                >
                                    {t} months
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Interest Rate</span>
                            <span className="text-white font-bold">{(interestRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Monthly Payment</span>
                            <span className="text-red-400 font-bold">${monthlyPayment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2">
                            <span className="text-slate-500">Total Repayment</span>
                            <span className="text-white font-bold">${totalPayback.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-3 bg-slate-800 rounded-xl text-slate-400">Cancel</button>
                        <button onClick={handleTakeLoan} className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold">
                            Take Loan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Finances Panel
const FinancesPanel = () => {
    const {
        cash, loans, monthlyIncome, monthlyExpenses, financialHistory,
        releasedGames, employees, payLoan
    } = useGameDevStore();

    const [showLoanModal, setShowLoanModal] = useState(false);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Calculate totals
    const totalRevenue = releasedGames.reduce((sum, g) => sum + (g.revenue || 0), 0);
    const totalDebt = loans.reduce((sum, l) => sum + l.amount, 0);
    const monthlyDebtPayments = loans.reduce((sum, l) => sum + l.monthlyPayment, 0);

    // Get max value for chart scaling
    const maxHistoryValue = Math.max(...financialHistory.map(h => Math.max(h.income, h.expenses)), 1);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-400" />
                        Finances
                    </h1>
                    <p className="text-slate-500">Manage your studio's money</p>
                </div>
                <button
                    onClick={() => setShowLoanModal(true)}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold flex items-center gap-2"
                >
                    <CreditCard className="w-5 h-5" />
                    Take Loan
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-5 h-5 text-green-400" />
                        <p className="text-[10px] text-green-400 uppercase">Cash Balance</p>
                    </div>
                    <p className="text-4xl font-black text-green-400">${cash.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="w-5 h-5 text-cyan-400" />
                        <p className="text-[10px] text-slate-500 uppercase">Monthly Income</p>
                    </div>
                    <p className="text-4xl font-black text-cyan-400">${monthlyIncome.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowDownRight className="w-5 h-5 text-red-400" />
                        <p className="text-[10px] text-slate-500 uppercase">Monthly Expenses</p>
                    </div>
                    <p className="text-4xl font-black text-red-400">${monthlyExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <p className="text-[10px] text-slate-500 uppercase">Total Revenue</p>
                    </div>
                    <p className="text-4xl font-black text-purple-400">${totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Financial Chart */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Financial History
                </h3>

                {financialHistory.length === 0 ? (
                    <div className="text-center py-12 text-slate-600">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No financial data yet. Keep playing to see your history!</p>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {financialHistory.slice(-12).map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col gap-1">
                                <div className="flex gap-1 h-32">
                                    {/* Income bar */}
                                    <div className="flex-1 relative bg-slate-800/50 rounded-t-lg overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                                            style={{ height: `${(h.income / maxHistoryValue) * 100}%` }}
                                        />
                                    </div>
                                    {/* Expense bar */}
                                    <div className="flex-1 relative bg-slate-800/50 rounded-t-lg overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg"
                                            style={{ height: `${(h.expenses / maxHistoryValue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-[8px] text-slate-600 text-center">{monthNames[h.month - 1]}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-6 mt-4 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-xs text-slate-500">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-xs text-slate-500">Expenses</span>
                    </div>
                </div>
            </div>

            {/* Game Revenue Breakdown */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-pink-400" />
                    Revenue by Game
                </h3>

                {releasedGames.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                        <p>No games released yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {releasedGames.map(game => (
                            <div key={game.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl">
                                    🎮
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{game.name}</h4>
                                    <p className="text-xs text-slate-500">{(game.sales || 0).toLocaleString()} copies sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-green-400">${(game.revenue || 0).toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">lifetime revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Loans */}
            {loans.length > 0 && (
                <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-red-400" />
                        Active Loans
                        <span className="ml-auto text-sm text-red-400">${totalDebt.toLocaleString()} total debt</span>
                    </h3>

                    <div className="space-y-3">
                        {loans.map(loan => (
                            <div key={loan.id} className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white">${loan.amount.toLocaleString()}</h4>
                                        <span className="text-xs text-red-400">{(loan.interestRate * 100).toFixed(0)}% APR</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{loan.remainingMonths} months remaining</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-red-400">${loan.monthlyPayment.toLocaleString()}/mo</p>
                                    <button
                                        onClick={() => payLoan(loan.id, loan.amount)}
                                        disabled={cash < loan.amount}
                                        className="text-xs text-green-400 hover:underline disabled:opacity-50"
                                    >
                                        Pay off early
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loan Modal */}
            {showLoanModal && <LoanModal onClose={() => setShowLoanModal(false)} />}
        </div>
    );
};

export default FinancesPanel;
