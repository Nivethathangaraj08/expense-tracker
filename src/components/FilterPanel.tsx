import React from 'react';
import { ExpenseCategory, ExpenseFilterParams, PaymentMethod } from '../types';
import { Filter, RotateCcw, ArrowUpDown, Calendar, DollarSign } from 'lucide-react';

interface FilterPanelProps {
  filters: ExpenseFilterParams;
  onFilterChange: (newFilters: ExpenseFilterParams) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const CATEGORIES: ('All' | ExpenseCategory)[] = [
  'All',
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

const PAYMENT_METHODS: ('All' | PaymentMethod)[] = [
  'All',
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'Other',
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onToggleOpen,
}) => {
  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    (filters.payment_method && filters.payment_method !== 'All') ||
    filters.date_from ||
    filters.date_to ||
    filters.min_amount ||
    filters.max_amount ||
    (filters.sort && filters.sort !== 'newest');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-4">
      <div className="flex items-center justify-between">
        <button
          id="btn-toggle-filters"
          type="button"
          onClick={onToggleOpen}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters & Sorting</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            id="btn-clear-filters"
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              id="filter-category-select"
              value={filters.category || 'All'}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Payment Method</label>
            <select
              id="filter-payment-method-select"
              value={filters.payment_method || 'All'}
              onChange={(e) => onFilterChange({ ...filters, payment_method: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort By</span>
            </label>
            <select
              id="filter-sort-select"
              value={filters.sort || 'newest'}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          {/* Min & Max Amount */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Amount Range</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="filter-min-amount"
                type="number"
                placeholder="Min"
                value={filters.min_amount || ''}
                onChange={(e) => onFilterChange({ ...filters, min_amount: e.target.value })}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <span className="text-slate-400">-</span>
              <input
                id="filter-max-amount"
                type="number"
                placeholder="Max"
                value={filters.max_amount || ''}
                onChange={(e) => onFilterChange({ ...filters, max_amount: e.target.value })}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Expense Date Range</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="filter-date-from"
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => onFilterChange({ ...filters, date_from: e.target.value })}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <span className="text-slate-400">to</span>
              <input
                id="filter-date-to"
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => onFilterChange({ ...filters, date_to: e.target.value })}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
