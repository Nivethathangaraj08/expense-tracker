export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Rent'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'UPI'
  | 'Bank Transfer'
  | 'Other';

export interface Expense {
  id: number;
  expense_id: string;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  payment_method: PaymentMethod;
  expense_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFormData {
  expense_id?: string;
  title: string;
  description?: string;
  amount: number | string;
  category: ExpenseCategory | '';
  payment_method: PaymentMethod | '';
  expense_date: string;
  notes?: string;
}

export interface BudgetInfo {
  month: number;
  year: number;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface DashboardSummary {
  totalExpenses: number;
  thisMonthExpenses: number;
  thisWeekExpenses: number;
  totalTransactions: number;
  averageExpense: number;
  highestExpense: Expense | null;
  lowestExpense: Expense | null;
}

export interface CategoryBreakdownItem {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface PaymentMethodBreakdownItem {
  method: PaymentMethod;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  month: string; // YYYY-MM
  total: number;
}

export interface DashboardStats {
  summary: DashboardSummary;
  budget: {
    monthlyBudget: number;
    thisMonthExpenses: number;
    remainingBudget: number;
    budgetUsedPercentage: number;
    isOverBudget: boolean;
    month: number;
    year: number;
  };
  categoryBreakdown: CategoryBreakdownItem[];
  paymentMethodBreakdown: PaymentMethodBreakdownItem[];
  monthlyTrends: MonthlyTrendItem[];
  totalExpenses?: number;
  monthlyExpenses?: number;
  weeklyExpenses?: number;
  totalCount?: number;
  monthlyTrend?: MonthlyTrendItem[];
}

export type NavView =
  | 'dashboard'
  | 'expenses'
  | 'add'
  | 'reports'
  | 'budget'
  | 'college-hub'
  | 'settings';

export interface ExpenseFilterParams {
  category?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: string | number;
  max_amount?: string | number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
  search?: string;
  q?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export type ActivePage =
  | 'dashboard'
  | 'expenses'
  | 'add-expense'
  | 'edit-expense'
  | 'details'
  | 'reports'
  | 'budget'
  | 'settings'
  | 'college-hub';
