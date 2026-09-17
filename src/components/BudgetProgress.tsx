import React, { useState } from 'react';
import { PiggyBank, AlertTriangle, CheckCircle, Edit3, ArrowUpRight } from 'lucide-react';
import { formatCurrency, CurrencyConfig } from '../utils/formatters';

interface BudgetProgressProps {
  monthlyBudget: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  onUpdateBudget: (newAmount: number) => Promise<void>;
  currency?: CurrencyConfig;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  monthlyBudget,
  spent,
  remaining,
  percentage,
  isOverBudget,
  onUpdateBudget,
  currency,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState((monthlyBudget ?? 0).toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) return;
    setSaving(true);
    try {
      await onUpdateBudget(val);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  let barColor = 'bg-blue-600';
  if (percentage >= 100) {
    barColor = 'bg-rose-600';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
  }

  return (
    <div
      id="budget-progress-card"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Monthly Budget Status</h3>
            <p className="text-xs text-slate-500">Current calendar month spending cap</p>
          </div>
        </div>

        {!isEditing ? (
          <button
            id="btn-edit-budget"
            onClick={() => {
              setBudgetInput(monthlyBudget.toString());
              setIsEditing(true);
            }}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Adjust Budget</span>
          </button>
        ) : (
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input
              type="number"
              step="100"
              min="1"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-28 text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 50000"
              autoFocus
            />
            <button
              type="submit"
              disabled={saving}
              className="text-xs font-semibold bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? '...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        <div>
          <p className="text-xs font-medium text-slate-500">Monthly Budget</p>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(monthlyBudget, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Amount Spent</p>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(spent, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Remaining</p>
          <p
            className={`text-lg sm:text-xl font-bold mt-1 ${
              isOverBudget ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {isOverBudget ? `Exceeded by ${formatCurrency(spent - monthlyBudget, currency)}` : formatCurrency(remaining, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Budget Used</p>
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

      {/* Visual Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>

        {/* Status Callout */}
        {isOverBudget ? (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium mt-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Budget Exceeded!</strong> Current month spending is{' '}
              {formatCurrency(spent - monthlyBudget, currency)} over the monthly limit.
            </span>
          </div>
        ) : percentage >= 80 ? (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium mt-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Attention:</strong> You have consumed {percentage.toFixed(1)}% of your monthly
              budget. Keep an eye on upcoming non-essential expenses.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Budget is healthy. You still have {formatCurrency(remaining, currency)} available for
              this month.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
