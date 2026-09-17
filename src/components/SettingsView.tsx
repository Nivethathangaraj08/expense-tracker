import React, { useState } from 'react';
import { Expense } from '../types';
import {
  SUPPORTED_CURRENCIES,
  CurrencyConfig,
  setActiveCurrency,
  getActiveCurrency,
  formatCurrency,
} from '../utils/formatters';
import {
  Settings,
  Coins,
  Database,
  Download,
  RotateCcw,
  CheckCircle,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface SettingsViewProps {
  currentCurrency?: CurrencyConfig;
  currency?: CurrencyConfig;
  onCurrencyChange: (c: CurrencyConfig) => void;
  onResetSampleData: () => Promise<void>;
  expenses: Expense[];
  isResetting?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentCurrency,
  currency,
  onCurrencyChange,
  onResetSampleData,
  expenses = [],
  isResetting = false,
}) => {
  const safeCurrency = currentCurrency || currency || getActiveCurrency() || SUPPORTED_CURRENCIES[0];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset database with the 12 realistic fictional sample expenses? Current records will be replaced.')) {
      await onResetSampleData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(safeExpenses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `expense_tracker_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="settings-view-container" className="max-w-4xl mx-auto space-y-6">
      {/* Currency Settings */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Currency & Formatting</h3>
            <p className="text-xs text-slate-500">
              Configure default currency symbol and number formatting across the application.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-slate-700">Select Active Currency</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUPPORTED_CURRENCIES.map((c) => {
              const isSelected = safeCurrency.code === c.code;

              return (
                <button
                  key={c.code}
                  id={`currency-btn-${c.code.toLowerCase()}`}
                  type="button"
                  onClick={() => {
                    const updated = setActiveCurrency(c.code);
                    onCurrencyChange(updated);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">{c.symbol}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {c.code}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-2">{c.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Example: {formatCurrency(1250.5, c)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Database Utilities */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Database & Sample Data Management</h3>
            <p className="text-xs text-slate-500">
              Manage live SQLite records, export backups, or reload standard sample transactions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Export SQLite Data</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Download all {safeExpenses.length} current expense records as a formatted JSON document.
              </p>
            </div>
            <button
              id="btn-export-json"
              onClick={handleExportData}
              className="mt-4 self-start flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Reset Sample Data */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Reset Sample Records</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Restores the 12 realistic fictional test expenses across all categories and payment methods.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                id="btn-reset-sample-data"
                onClick={handleReset}
                disabled={isResetting}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting...' : 'Reset Sample Records'}</span>
              </button>
              {resetSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Reset complete!</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Application */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">About Expense Tracker</h3>
            <p className="text-xs text-slate-500">System specification and technical design</p>
          </div>
        </div>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            <strong>Expense Tracker</strong> is a full-stack personal finance and expenditure management system engineered with React 19, TypeScript, Tailwind CSS, an Express/SQLite application layer, and a Django REST Framework reference backend.
          </p>
          <p>
            All records adhere strictly to ACID principles in SQLite, preventing data loss, race conditions, and unstructured payloads through dual validation.
          </p>
        </div>
      </div>
    </div>
  );
};
