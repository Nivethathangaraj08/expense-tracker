import {
  Expense,
  ExpenseFormData,
  ExpenseFilterParams,
  DashboardStats,
  BudgetInfo,
} from '../types';

// Configurable API base URL, supports env variable if needed
const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      (isJson && (data.error || data.message || data.detail)) ||
      `Request failed with status ${response.status}`;
    const fieldErrors = isJson && data.field_errors ? data.field_errors : undefined;
    throw new ApiError(errorMsg, response.status, fieldErrors);
  }

  return data as T;
}

export const expenseService = {
  // GET /api/expenses/
  async getExpenses(filters?: ExpenseFilterParams): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.payment_method && filters.payment_method !== 'All') params.append('payment_method', filters.payment_method);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.min_amount) params.append('min_amount', String(filters.min_amount));
      if (filters.max_amount) params.append('max_amount', String(filters.max_amount));
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      if (filters.q) params.append('q', filters.q);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/expenses${query}`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse<Expense[]>(res);
  },

  // GET /api/expenses/:id/
  async getExpense(id: number | string): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse<Expense>(res);
  },

  // POST /api/expenses/
  async createExpense(data: ExpenseFormData): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Expense>(res);
  },

  // PUT /api/expenses/:id/
  async updateExpense(id: number | string, data: ExpenseFormData): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Expense>(res);
  },

  // PATCH /api/expenses/:id/
  async patchExpense(id: number | string, data: Partial<ExpenseFormData>): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Expense>(res);
  },

  // DELETE /api/expenses/:id/
  async deleteExpense(id: number | string): Promise<{ message: string; deleted_id: number }> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<{ message: string; deleted_id: number }>(res);
  },

  // GET /api/expenses/search/?q=value
  async searchExpenses(query: string): Promise<Expense[]> {
    const res = await fetch(`${API_BASE}/expenses/search?q=${encodeURIComponent(query)}`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse<Expense[]>(res);
  },

  // GET /api/stats/dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats/dashboard`, {
      headers: { Accept: 'application/json' },
    });
    const data = await handleResponse<DashboardStats>(res);
    return {
      ...data,
      totalExpenses: data.summary?.totalExpenses ?? 0,
      monthlyExpenses: data.summary?.thisMonthExpenses ?? 0,
      weeklyExpenses: data.summary?.thisWeekExpenses ?? 0,
      totalCount: data.summary?.totalTransactions ?? 0,
      monthlyTrend: data.monthlyTrends ?? [],
    };
  },

  // Alias for getExpenses
  async getAllExpenses(filters?: ExpenseFilterParams): Promise<Expense[]> {
    return this.getExpenses(filters);
  },

  // GET /api/budget
  async getBudget(month?: number, year?: number): Promise<BudgetInfo> {
    const params = new URLSearchParams();
    if (month) params.append('month', String(month));
    if (year) params.append('year', String(year));
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_BASE}/budget${query}`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse<BudgetInfo>(res);
  },

  // Alias for getBudget
  async getBudgetInfo(month?: number, year?: number): Promise<BudgetInfo> {
    return this.getBudget(month, year);
  },

  // POST /api/budget
  async setBudget(data: { amount: number; month?: number; year?: number }): Promise<BudgetInfo> {
    const res = await fetch(`${API_BASE}/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<BudgetInfo>(res);
  },

  // Alias for updateBudget
  async updateBudget(amount: number, month?: number, year?: number): Promise<BudgetInfo> {
    return this.setBudget({ amount, month, year });
  },

  // POST /api/expenses/reset-sample
  async resetSampleData(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/expenses/reset-sample`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<{ message: string }>(res);
  },
};
