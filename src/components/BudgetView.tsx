import React, { useState } from 'react';
import { BudgetInfo } from '../types';
import { formatCurrency, CurrencyConfig } from '../utils/formatters';
import { PiggyBank, Save, AlertTriangle, CheckCircle, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';

interface BudgetViewProps {
  budget: BudgetInfo | null;
  onSaveBudget: (newAmount: number) => Promise<void>;
  currency?: CurrencyConfig;
  isLoading?: boolean;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budget,
  onSaveBudget,
  currency,
  isLoading = false,
}) => {
  const [budgetInput, setBudgetInput] = useState<string>(
    budget ? budget.amount.toString() : '50000'
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) return;

    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onSaveBudget(val);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const monthlyBudget = budget ? budget.amount : 50000;
  const spent = budget ? budget.spent : 0;
  const remaining = budget ? budget.remaining : Math.max(0, monthlyBudget - spent);
  const percentage = budget ? budget.percentage : (spent / monthlyBudget) * 100;
  const isOverBudget = budget ? budget.isOverBudget : spent > monthlyBudget;

  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div id="budget-view-container" className="max-w-4xl mx-auto space-y-6">
      {/* Budget Configuration Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Monthly Budget Configuration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Define your personal expenditure limit for each calendar month.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="max-w-md">
            <label
              htmlFor="input-budget-limit"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Set Monthly Limit ({currency?.symbol || '₹'})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                {currency?.symbol || '₹'}
              </div>
              <input
                id="input-budget-limit"
                type="number"
                step="100"
                min="100"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Changes are immediately synchronized and stored in SQLite database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-save-budget-view"
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-blue-500/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Update Budget Limit</span>
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Progress & Breakdown Overview */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900">Current Month Spending Overview</h3>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Allocated Budget</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(monthlyBudget, currency)}
            </p>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Amount Spent</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(spent, currency)}
            </p>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Remaining</p>
            <p
              className={`text-lg sm:text-xl font-bold mt-1 ${
                isOverBudget ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isOverBudget
                ? `-${formatCurrency(spent - monthlyBudget, currency)}`
                : formatCurrency(remaining, currency)}
            </p>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Percentage Used</p>
            <p
              className={`text-lg sm:text-xl font-bold mt-1 ${
                percentage >= 100
                  ? 'text-rose-600'
                  : percentage >= 80
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            >
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 100
                  ? 'bg-rose-600'
                  : percentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${clampedPercentage}%` }}
            />
          </div>
        </div>

        {/* Warning / Health Status Alert */}
        {isOverBudget ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-900">Budget Limit Exceeded!</p>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                You have exceeded your monthly budget by{' '}
                <strong>{formatCurrency(spent - monthlyBudget, currency)}</strong>. Consider curbing
                discretionary categories like Entertainment, Shopping, or Travel until next month.
              </p>
            </div>
          </div>
        ) : percentage >= 80 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Warning: Budget Almost Consumed</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                You have spent {percentage.toFixed(1)}% of your monthly allowance. Only{' '}
                {formatCurrency(remaining, currency)} remains for the rest of this month.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Spending is Healthy & Within Cap</p>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                You are currently tracking within your budget targets. You have{' '}
                <strong>{formatCurrency(remaining, currency)}</strong> remaining in surplus.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
