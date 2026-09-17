import React, { useState, useEffect, useCallback } from 'react';
import {
  Expense,
  ExpenseFormData,
  ExpenseFilterParams,
  DashboardStats,
  BudgetInfo,
  NavView,
} from './types';
import { expenseService } from './services/expenseService';
import {
  getActiveCurrency,
  CurrencyConfig,
  formatCurrency,
  CATEGORY_STYLES,
} from './utils/formatters';

// Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { SummaryCard } from './components/SummaryCard';
import { BudgetProgress } from './components/BudgetProgress';
import { CategoryDonutChart, MonthlyBarChart, PaymentMethodSummary } from './components/ChartCard';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseDetailsModal } from './components/ExpenseDetailsModal';
import { ReportsView } from './components/ReportsView';
import { BudgetView } from './components/BudgetView';
import { CollegeHub } from './components/CollegeHub';
import { SettingsView } from './components/SettingsView';
import { Notification } from './components/Notification';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoadingSpinner } from './components/LoadingSpinner';

// Icons
import {
  Wallet,
  Calendar,
  Clock,
  Receipt,
  Plus,
  ArrowRight,
  TrendingUp,
  PieChart,
  BarChart2,
  CreditCard,
  Layers,
} from 'lucide-react';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allRawExpenses, setAllRawExpenses] = useState<Expense[]>([]); // full dataset for reports
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);
  const [currency, setCurrency] = useState<CurrencyConfig>(getActiveCurrency());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExpenseFilterParams>({
    category: 'All',
    payment_method: 'All',
    sort: 'newest',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals & Forms
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Notification Toast
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const showNotification = (
    type: 'success' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    setNotification({ show: true, type, title, message });
  };

  // Fetch Dashboard Stats & Budget
  const fetchAuxiliaryData = useCallback(async () => {
    try {
      const [stats, budget, allExp] = await Promise.all([
        expenseService.getDashboardStats(),
        expenseService.getBudgetInfo(),
        expenseService.getAllExpenses(),
      ]);
      setDashboardStats(stats);
      setBudgetInfo(budget);
      setAllRawExpenses(Array.isArray(allExp) ? allExp : []);
    } catch (err: any) {
      console.error('Failed to load dashboard metrics:', err);
    }
  }, []);

  // Fetch Filtered/Searched Expenses List
  const fetchExpensesList = useCallback(async () => {
    try {
      if (searchQuery.trim()) {
        const results = await expenseService.searchExpenses(searchQuery.trim());
        setExpenses(Array.isArray(results) ? results : []);
      } else {
        const results = await expenseService.getAllExpenses(filters);
        setExpenses(Array.isArray(results) ? results : []);
      }
    } catch (err: any) {
      console.error('Failed to fetch expenses list:', err);
      showNotification('error', 'Error Fetching Data', err.message);
      setExpenses([]);
    }
  }, [searchQuery, filters]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchAuxiliaryData(), fetchExpensesList()]);
      setLoading(false);
    };
    init();
  }, [fetchAuxiliaryData, fetchExpensesList]);

  // Refetch when filters or search query changes
  useEffect(() => {
    fetchExpensesList();
  }, [fetchExpensesList]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAuxiliaryData(), fetchExpensesList()]);
    setRefreshing(false);
    showNotification('info', 'Data Refreshed', 'Latest records fetched from SQLite.');
  };

  // Form Submission (Add or Edit)
  const handleSaveExpense = async (data: ExpenseFormData) => {
    setFormLoading(true);
    try {
      if (editingExpense) {
        // Update
        const updated = await expenseService.updateExpense(editingExpense.id, data);
        showNotification(
          'success',
          'Expense Updated',
          `"${updated.title}" was successfully updated.`
        );
        setEditingExpense(null);
      } else {
        // Create
        const created = await expenseService.createExpense(data);
        showNotification(
          'success',
          'Expense Recorded',
          `New expense "${created.title}" [${created.expense_id}] has been saved.`
        );
      }

      await Promise.all([fetchAuxiliaryData(), fetchExpensesList()]);
      setCurrentView('expenses');
    } catch (err: any) {
      showNotification('error', 'Validation / Save Error', err.message);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Action
  const handleDeleteExpenseClick = (expense: Expense) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Expense Record',
      message: `Are you sure you want to delete expense "${expense.title}" (${formatCurrency(
        expense.amount,
        currency
      )})? This action cannot be undone.`,
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        try {
          await expenseService.deleteExpense(expense.id);
          showNotification(
            'success',
            'Expense Deleted',
            `Expense "${expense.title}" has been permanently removed.`
          );
          if (selectedExpense?.id === expense.id) {
            setSelectedExpense(null);
          }
          await Promise.all([fetchAuxiliaryData(), fetchExpensesList()]);
        } catch (err: any) {
          showNotification('error', 'Delete Failed', err.message);
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Budget Update
  const handleUpdateBudget = async (newAmount: number) => {
    try {
      const updated = await expenseService.updateBudget(newAmount);
      setBudgetInfo(updated);
      await fetchAuxiliaryData();
      showNotification(
        'success',
        'Budget Updated',
        `Monthly budget successfully set to ${formatCurrency(newAmount, currency)}.`
      );
    } catch (err: any) {
      showNotification('error', 'Budget Update Failed', err.message);
    }
  };

  // Reset Sample Data
  const handleResetSampleData = async () => {
    setRefreshing(true);
    try {
      await expenseService.resetSampleData();
      await Promise.all([fetchAuxiliaryData(), fetchExpensesList()]);
      showNotification(
        'success',
        'Sample Records Restored',
        '12 realistic sample expenses have been loaded into SQLite.'
      );
    } catch (err: any) {
      showNotification('error', 'Reset Failed', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const isFiltered =
    !!searchQuery.trim() ||
    filters.category !== 'All' ||
    filters.payment_method !== 'All' ||
    !!filters.date_from ||
    !!filters.date_to ||
    !!filters.min_amount ||
    !!filters.max_amount;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900">
      {/* Toast Notification */}
      <Notification
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isDanger={true}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Expense Details Modal */}
      {selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onEdit={(exp) => {
            setSelectedExpense(null);
            setEditingExpense(exp);
            setCurrentView('add');
          }}
          onDelete={(exp) => {
            handleDeleteExpenseClick(exp);
          }}
          currency={currency}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'add') {
            setEditingExpense(null);
          }
          setCurrentView(view);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentView={currentView}
          onOpenSidebar={() => setSidebarOpen(true)}
          onAddExpense={() => {
            setEditingExpense(null);
            setCurrentView('add');
          }}
          onRefresh={handleManualRefresh}
          isRefreshing={refreshing}
          currency={currency}
          currentCurrency={currency}
          onCurrencyChange={(newCurr) => setCurrency(newCurr)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-24">
              <LoadingSpinner message="Connecting to SQLite Database & loading records..." />
            </div>
          ) : (
            <>
              {/* VIEW 1: DASHBOARD */}
              {currentView === 'dashboard' && (
                <div id="view-dashboard" className="space-y-6">
                  {/* Top 4 Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <SummaryCard
                      title="Total Expenses"
                      value={formatCurrency(dashboardStats?.totalExpenses || 0, currency)}
                      subtitle="All-time accumulated expenditure"
                      icon={Wallet}
                      iconColor="text-blue-600"
                      iconBgColor="bg-blue-50"
                    />
                    <SummaryCard
                      title="Monthly Expenses"
                      value={formatCurrency(dashboardStats?.monthlyExpenses || 0, currency)}
                      subtitle="Current calendar month total"
                      icon={Calendar}
                      iconColor="text-indigo-600"
                      iconBgColor="bg-indigo-50"
                    />
                    <SummaryCard
                      title="Weekly Expenses"
                      value={formatCurrency(dashboardStats?.weeklyExpenses || 0, currency)}
                      subtitle="Last 7 days spending"
                      icon={Clock}
                      iconColor="text-emerald-600"
                      iconBgColor="bg-emerald-50"
                    />
                    <SummaryCard
                      title="Total Transactions"
                      value={dashboardStats?.totalCount || 0}
                      subtitle="Recorded SQLite transactions"
                      icon={Receipt}
                      iconColor="text-amber-600"
                      iconBgColor="bg-amber-50"
                    />
                  </div>

                  {/* Budget Progress Bar Card */}
                  {budgetInfo && (
                    <BudgetProgress
                      monthlyBudget={budgetInfo.amount}
                      spent={budgetInfo.spent}
                      remaining={budgetInfo.remaining}
                      percentage={budgetInfo.percentage}
                      isOverBudget={budgetInfo.isOverBudget}
                      onUpdateBudget={handleUpdateBudget}
                      currency={currency}
                    />
                  )}

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Category Donut (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PieChart className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              Category-Wise Breakdown
                            </h3>
                            <p className="text-xs text-slate-500">
                              Visual expenditure proportions
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentView('reports')}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Report</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <CategoryDonutChart
                        data={dashboardStats?.categoryBreakdown || []}
                        currency={currency}
                      />
                    </div>

                    {/* Monthly Trend & Payment Methods (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      {/* Monthly Bar Chart */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <BarChart2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              Monthly Trend
                            </h3>
                            <p className="text-xs text-slate-500">Last 6 months comparison</p>
                          </div>
                        </div>

                        <MonthlyBarChart
                          data={dashboardStats?.monthlyTrend || []}
                          currency={currency}
                        />
                      </div>

                      {/* Payment Method Breakdown */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex-1">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              Payment Modes
                            </h3>
                            <p className="text-xs text-slate-500">Transaction counts by method</p>
                          </div>
                        </div>

                        <PaymentMethodSummary
                          data={dashboardStats?.paymentMethodBreakdown || []}
                          currency={currency}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recent Expenses List on Dashboard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
                        <p className="text-xs text-slate-500">
                          Latest recorded transactions in database
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentView('expenses')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All ({expenses?.length || 0})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ExpenseTable
                      expenses={(expenses || []).slice(0, 5)}
                      onView={(exp) => setSelectedExpense(exp)}
                      onEdit={(exp) => {
                        setEditingExpense(exp);
                        setCurrentView('add');
                      }}
                      onDelete={handleDeleteExpenseClick}
                      onAddFirstExpense={() => {
                        setEditingExpense(null);
                        setCurrentView('add');
                      }}
                      currency={currency}
                    />
                  </div>
                </div>
              )}

              {/* VIEW 2: ALL EXPENSES (CRUD, Search, Filter, Sort) */}
              {currentView === 'expenses' && (
                <div id="view-expenses" className="space-y-4">
                  {/* Top Search & Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex-1 max-w-lg">
                      <SearchBar
                        value={searchQuery}
                        onChange={(q) => setSearchQuery(q)}
                        placeholder="Search by Title, ID, Category, Payment method..."
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id="btn-add-expense-page"
                        onClick={() => {
                          setEditingExpense(null);
                          setCurrentView('add');
                        }}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs shadow-blue-500/30 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Expense</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Panel (Expandable) */}
                  <FilterPanel
                    filters={filters}
                    onFilterChange={(newFilters) => setFilters(newFilters)}
                    onResetFilters={() => {
                      setSearchQuery('');
                      setFilters({
                        category: 'All',
                        payment_method: 'All',
                        sort: 'newest',
                        date_from: '',
                        date_to: '',
                        min_amount: '',
                        max_amount: '',
                      });
                    }}
                    isOpen={isFilterOpen}
                    onToggleOpen={() => setIsFilterOpen((prev) => !prev)}
                  />

                  {/* Expense Data Table */}
                  <ExpenseTable
                    expenses={expenses}
                    onView={(exp) => setSelectedExpense(exp)}
                    onEdit={(exp) => {
                      setEditingExpense(exp);
                      setCurrentView('add');
                    }}
                    onDelete={handleDeleteExpenseClick}
                    onAddFirstExpense={() => {
                      setEditingExpense(null);
                      setCurrentView('add');
                    }}
                    isFiltered={isFiltered}
                    currency={currency}
                  />
                </div>
              )}

              {/* VIEW 3: ADD / EDIT EXPENSE FORM */}
              {currentView === 'add' && (
                <div id="view-add-edit">
                  <ExpenseForm
                    initialExpense={editingExpense}
                    onSubmit={handleSaveExpense}
                    onCancel={() => {
                      setEditingExpense(null);
                      setCurrentView('expenses');
                    }}
                    isLoading={formLoading}
                    currency={currency}
                  />
                </div>
              )}

              {/* VIEW 4: REPORTS & ANALYTICS */}
              {currentView === 'reports' && (
                <div id="view-reports">
                  <ReportsView expenses={allRawExpenses} currency={currency} />
                </div>
              )}

              {/* VIEW 5: BUDGET PLANNING */}
              {currentView === 'budget' && (
                <div id="view-budget">
                  <BudgetView
                    budget={budgetInfo}
                    onSaveBudget={handleUpdateBudget}
                    currency={currency}
                    isLoading={refreshing}
                  />
                </div>
              )}

              {/* VIEW 6: COLLEGE EVALUATION & REST API HUB */}
              {currentView === 'college-hub' && (
                <div id="view-college-hub">
                  <CollegeHub />
                </div>
              )}

              {/* VIEW 7: SETTINGS & BACKUP */}
              {currentView === 'settings' && (
                <div id="view-settings">
                  <SettingsView
                    currentCurrency={currency}
                    onCurrencyChange={(newCurr) => setCurrency(newCurr)}
                    onResetSampleData={handleResetSampleData}
                    expenses={expenses}
                    isResetting={refreshing}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
