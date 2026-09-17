import React, { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { CATEGORY_STYLES, formatCurrency, formatDate, CurrencyConfig } from '../utils/formatters';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Award,
  ArrowDownRight,
  ArrowUpRight,
  PieChart,
  Filter,
} from 'lucide-react';

interface ReportsViewProps {
  expenses: Expense[];
  currency?: CurrencyConfig;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ALL_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Rent',
  'Other',
];

export const ReportsView: React.FC<ReportsViewProps> = ({ expenses = [], currency }) => {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filter expenses by date range or year
  const filteredExpenses = useMemo(() => {
    return safeExpenses.filter((exp) => {
      if (startDate && exp.expense_date < startDate) return false;
      if (endDate && exp.expense_date > endDate) return false;
      if (!startDate && !endDate) {
        const expYear = parseInt(exp.expense_date.split('-')[0], 10);
        if (expYear !== selectedYear) return false;
      }
      return true;
    });
  }, [safeExpenses, selectedYear, startDate, endDate]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const count = filteredExpenses.length;
    let total = 0;
    let highest: Expense | null = null;
    let lowest: Expense | null = null;

    for (const exp of filteredExpenses) {
      total += exp.amount;
      if (!highest || exp.amount > highest.amount) highest = exp;
      if (!lowest || exp.amount < lowest.amount) lowest = exp;
    }

    const average = count > 0 ? total / count : 0;

    return { count, total, average, highest, lowest };
  }, [filteredExpenses]);

  // Category Breakdown
  const categoryStats = useMemo(() => {
    const map: Record<ExpenseCategory, { total: number; count: number }> = {
      Food: { total: 0, count: 0 },
      Transportation: { total: 0, count: 0 },
      Shopping: { total: 0, count: 0 },
      Bills: { total: 0, count: 0 },
      Entertainment: { total: 0, count: 0 },
      Healthcare: { total: 0, count: 0 },
      Education: { total: 0, count: 0 },
      Travel: { total: 0, count: 0 },
      Rent: { total: 0, count: 0 },
      Other: { total: 0, count: 0 },
    };

    for (const exp of filteredExpenses) {
      if (map[exp.category]) {
        map[exp.category].total += exp.amount;
        map[exp.category].count += 1;
      }
    }

    return ALL_CATEGORIES.map((cat) => ({
      category: cat,
      total: map[cat].total,
      count: map[cat].count,
      percentage: metrics.total > 0 ? (map[cat].total / metrics.total) * 100 : 0,
    })).sort((a, b) => b.total - a.total);
  }, [filteredExpenses, metrics.total]);

  // 12 Months Breakdown for Selected Year
  const monthlyStats = useMemo(() => {
    const monthTotals = new Array(12).fill(0);
    const monthCounts = new Array(12).fill(0);

    for (const exp of filteredExpenses) {
      const parts = exp.expense_date.split('-');
      const mIdx = parseInt(parts[1], 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        monthTotals[mIdx] += exp.amount;
        monthCounts[mIdx] += 1;
      }
    }

    return MONTH_NAMES.map((name, idx) => ({
      name,
      total: monthTotals[idx],
      count: monthCounts[idx],
    }));
  }, [filteredExpenses]);

  const maxMonthTotal = Math.max(...monthlyStats.map((m) => m.total), 1000);

  return (
    <div id="reports-view-container" className="space-y-6">
      {/* Date Range & Year Filter Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending Analysis Filter</h3>
            <p className="text-xs text-slate-500">Filter reports by custom date range or calendar year</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <label htmlFor="report-year-select" className="font-semibold text-slate-600">Year:</label>
              <select
                id="report-year-select"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value, 10));
                  setStartDate('');
                  setEndDate('');
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800"
              >
                {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-slate-400">Custom:</span>
              <input
                id="report-date-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              />
              <span className="text-slate-400">-</span>
              <input
                id="report-date-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              />
              {(startDate || endDate) && (
                <button
                  id="btn-clear-report-dates"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-rose-600 hover:text-rose-700 font-semibold text-[11px] underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Spending */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Spending</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(metrics.total, currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{metrics.count} transactions</p>
        </div>

        {/* Average Expense */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Average Expense</p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">
            {formatCurrency(metrics.average, currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Per transaction</p>
        </div>

        {/* Highest Expense */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Highest Expense</p>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1 truncate">
            {metrics.highest ? formatCurrency(metrics.highest.amount, currency) : '₹0.00'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {metrics.highest ? metrics.highest.title : 'None'}
          </p>
        </div>

        {/* Lowest Expense */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lowest Expense</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 truncate">
            {metrics.lowest ? formatCurrency(metrics.lowest.amount, currency) : '₹0.00'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {metrics.lowest ? metrics.lowest.title : 'None'}
          </p>
        </div>

        {/* Number of Expenses */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Count</p>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1">
            {metrics.count}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Recorded entries</p>
        </div>
      </div>

      {/* Monthly Breakdown 12-Month Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">12-Month Spending Breakdown</h3>
            <p className="text-xs text-slate-500">
              Monthly expenditure progression for {selectedYear}
            </p>
          </div>
        </div>

        <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-slate-200 overflow-x-auto">
          {monthlyStats.map((item) => {
            const heightPercent = Math.max(6, (item.total / maxMonthTotal) * 100);

            return (
              <div
                key={item.name}
                className="flex-1 min-w-[40px] flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 mb-1 transition-opacity">
                  {item.total > 0 ? formatCurrency(item.total, currency) : '-'}
                </div>
                <div
                  className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                    item.total > 0
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                  {item.name.substring(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Table & Bars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Category-Wise Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across all standard categories</p>
          </div>
        </div>

        <div className="space-y-4">
          {categoryStats.map((item) => {
            const style = CATEGORY_STYLES[item.category];

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: style.hex }}
                    />
                    <span className="font-semibold text-slate-800">{item.category}</span>
                    <span className="text-slate-400 text-[11px]">({item.count} items)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.total, currency)}
                    </span>
                    <span className="text-slate-500 font-semibold w-12 text-right">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, item.percentage)}%`,
                      backgroundColor: style.hex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
