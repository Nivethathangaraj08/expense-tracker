import React from 'react';
import { Menu, Plus, RefreshCw, Sparkles, Receipt, Database } from 'lucide-react';
import { ActivePage, NavView } from '../types';
import { getActiveCurrency, SUPPORTED_CURRENCIES, setActiveCurrency, CurrencyConfig } from '../utils/formatters';

interface NavbarProps {
  // Navigation view can be passed as activePage or currentView
  activePage?: ActivePage | NavView;
  currentView?: ActivePage | NavView;
  setActivePage?: (page: ActivePage) => void;
  onViewChange?: (view: NavView) => void;
  // Menu triggers
  onOpenMobileMenu?: () => void;
  onOpenSidebar?: () => void;
  // Actions
  onRefreshData?: () => void;
  onRefresh?: () => void;
  onAddExpense?: () => void;
  isRefreshing?: boolean;
  // Currency props
  currentCurrency?: CurrencyConfig;
  currency?: CurrencyConfig;
  onCurrencyChange?: (c: CurrencyConfig) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  currentView,
  setActivePage,
  onViewChange,
  onOpenMobileMenu,
  onOpenSidebar,
  onRefreshData,
  onRefresh,
  onAddExpense,
  isRefreshing = false,
  currentCurrency,
  currency,
  onCurrencyChange,
}) => {
  const currentPage = (activePage || currentView || 'dashboard') as string;
  const safeCurrency = currency || currentCurrency || getActiveCurrency() || SUPPORTED_CURRENCIES[0];

  const handleOpenMenu = onOpenSidebar || onOpenMobileMenu;
  const handleRefresh = onRefresh || onRefreshData;

  const handleAddClick = () => {
    if (onAddExpense) {
      onAddExpense();
    } else if (onViewChange) {
      onViewChange('add');
    } else if (setActivePage) {
      setActivePage('add-expense');
    }
  };

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Financial Dashboard',
          subtitle: 'Track your spending, manage your budget, and understand where your money goes.',
        };
      case 'expenses':
        return {
          title: 'All Expenses',
          subtitle: 'Search, filter, edit and manage every transaction.',
        };
      case 'add':
      case 'add-expense':
        return {
          title: 'Add New Expense',
          subtitle: 'Enter transaction details with instant frontend & backend validation.',
        };
      case 'edit-expense':
        return {
          title: 'Edit Expense',
          subtitle: 'Update existing record and synchronize with SQLite database.',
        };
      case 'details':
        return {
          title: 'Expense Details',
          subtitle: 'Full metadata, category tags, payment records, and audit timestamps.',
        };
      case 'reports':
        return {
          title: 'Analytics & Reports',
          subtitle: 'Category-wise spending, monthly trends, and expense statistics.',
        };
      case 'budget':
        return {
          title: 'Monthly Budget Planning',
          subtitle: 'Monitor budget consumption, calculate surplus, and prevent overspending.',
        };
      case 'college-hub':
        return {
          title: 'College Project & Viva Hub',
          subtitle: 'Architecture, ER diagram, Django code, live REST tests & Postman guide.',
        };
      case 'settings':
        return {
          title: 'System Settings',
          subtitle: 'Currency configuration, database utilities, and sample data generator.',
        };
      default:
        return { title: 'Expense Tracker', subtitle: 'Manage your finances' };
    }
  };

  const { title, subtitle } = getPageTitle(currentPage);

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Titles */}
        <div className="flex items-center gap-3 min-w-0">
          {handleOpenMenu && (
            <button
              id="mobile-menu-trigger"
              onClick={handleOpenMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Currency Selector */}
          <div className="relative">
            <select
              id="currency-select"
              value={safeCurrency.code}
              onChange={(e) => {
                const updated = setActiveCurrency(e.target.value);
                if (onCurrencyChange) {
                  onCurrencyChange(updated);
                }
              }}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-1.5 px-2.5 rounded-lg border border-slate-200/80 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
              title="Change display currency"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          {handleRefresh && (
            <button
              id="btn-refresh-data"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              title="Reload latest data from API"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          {/* Quick Add Button */}
          {currentPage !== 'add' && currentPage !== 'add-expense' && (
            <button
              id="btn-quick-add-expense"
              onClick={handleAddClick}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
