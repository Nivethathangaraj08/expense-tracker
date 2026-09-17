import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'expenses.db');
const db = new DatabaseSync(dbPath);

// Create SQLite tables
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    amount REAL NOT NULL CHECK(amount > 0),
    category TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    expense_date TEXT NOT NULL,
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(month, year)
  );
`);

// Valid options
const VALID_CATEGORIES = [
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

const VALID_PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'Other',
];

// Seed sample data if empty
function seedSampleData() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM expenses').get() as { count: number };
  if (countRow && countRow.count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');

  const sampleExpenses = [
    {
      expense_id: 'EXP001',
      title: 'Grocery Supermarket Restock',
      description: 'Monthly fresh grocery items, dairy, vegetables, and pantry supplies',
      amount: 4250.00,
      category: 'Food',
      payment_method: 'UPI',
      expense_date: `${year}-${monthStr}-02`,
      notes: 'Purchased at Nature Basket store',
    },
    {
      expense_id: 'EXP002',
      title: 'Metro Commute & Cab Rides',
      description: 'Weekly metro smart card recharge and office auto rides',
      amount: 1450.00,
      category: 'Transportation',
      payment_method: 'Debit Card',
      expense_date: `${year}-${monthStr}-04`,
      notes: 'Includes Metro card top-up',
    },
    {
      expense_id: 'EXP003',
      title: 'Apartment Monthly Rent',
      description: 'Residential 2BHK rental payment for current month',
      amount: 22000.00,
      category: 'Rent',
      payment_method: 'Bank Transfer',
      expense_date: `${year}-${monthStr}-01`,
      notes: 'NEFT transfer to landlord account',
    },
    {
      expense_id: 'EXP004',
      title: 'High-Speed Fiber Internet Bill',
      description: 'Monthly 300 Mbps broadband subscription charge',
      amount: 1180.00,
      category: 'Bills',
      payment_method: 'UPI',
      expense_date: `${year}-${monthStr}-05`,
      notes: 'Paid via Google Pay auto-bill',
    },
    {
      expense_id: 'EXP005',
      title: 'Weekend Dining with Family',
      description: 'Dinner at Barbeque Nation with family',
      amount: 2890.50,
      category: 'Food',
      payment_method: 'Credit Card',
      expense_date: `${year}-${monthStr}-07`,
      notes: 'Used dining card discount offer',
    },
    {
      expense_id: 'EXP006',
      title: 'Online Tech Certification Course',
      description: 'Cloud computing & full-stack development workshop registration',
      amount: 3499.00,
      category: 'Education',
      payment_method: 'Credit Card',
      expense_date: `${year}-${monthStr}-09`,
      notes: 'College technical skills enhancement',
    },
    {
      expense_id: 'EXP007',
      title: 'Routine Health Checkup & Vitamins',
      description: 'Diagnostic blood panel test and pharmacy multivitamins',
      amount: 1850.00,
      category: 'Healthcare',
      payment_method: 'UPI',
      expense_date: `${year}-${monthStr}-11`,
      notes: 'Prescription stored in digilocker',
    },
    {
      expense_id: 'EXP008',
      title: 'Weekend Cinema & Snacks',
      description: 'IMAX movie tickets and popcorn combo',
      amount: 950.00,
      category: 'Entertainment',
      payment_method: 'Cash',
      expense_date: `${year}-${monthStr}-12`,
      notes: 'Watched new sci-fi premiere',
    },
    {
      expense_id: 'EXP009',
      title: 'Work Wardrobe & Formal Shoes',
      description: 'Shirts and formal shoes for college campus placements',
      amount: 3790.00,
      category: 'Shopping',
      payment_method: 'Debit Card',
      expense_date: `${year}-${monthStr}-14`,
      notes: 'End of season discount applied',
    },
    {
      expense_id: 'EXP010',
      title: 'Weekend Intercity Train Tickets',
      description: 'Express train reservations for home visit',
      amount: 1620.00,
      category: 'Travel',
      payment_method: 'UPI',
      expense_date: `${year}-${monthStr}-15`,
      notes: 'IRCTC booking confirmed',
    },
    {
      expense_id: 'EXP011',
      title: 'Apartment Electricity Utility Bill',
      description: 'Power distribution board state electricity bill',
      amount: 2150.00,
      category: 'Bills',
      payment_method: 'UPI',
      expense_date: `${year}-${monthStr}-16`,
      notes: 'Paid before due date to get rebate',
    },
    {
      expense_id: 'EXP012',
      title: 'Household Cleaning Supplies',
      description: 'Detergents, floor cleaners, and home utilities',
      amount: 780.00,
      category: 'Other',
      payment_method: 'Cash',
      expense_date: `${year}-${monthStr}-17`,
      notes: 'Local neighborhood mart',
    },
  ];

  const insertStmt = db.prepare(`
    INSERT INTO expenses (
      expense_id, title, description, amount, category, payment_method, expense_date, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const exp of sampleExpenses) {
    insertStmt.run(
      exp.expense_id,
      exp.title,
      exp.description,
      exp.amount,
      exp.category,
      exp.payment_method,
      exp.expense_date,
      exp.notes,
      now,
      now
    );
  }

  // Seed default budget for current month
  const currentMonthNum = currentDate.getMonth() + 1;
  const budgetStmt = db.prepare(`
    INSERT OR REPLACE INTO budgets (month, year, amount, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  budgetStmt.run(currentMonthNum, year, 50000.00, now, now);
}

seedSampleData();

// Helper: generate next unique expense_id
function getNextExpenseId(): string {
  const rows = db.prepare('SELECT expense_id FROM expenses').all() as { expense_id: string }[];
  let maxNum = 0;
  for (const r of rows) {
    const match = r.expense_id.match(/EXP(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNum) maxNum = n;
    }
  }
  const nextNum = maxNum + 1;
  return `EXP${String(nextNum).padStart(3, '0')}`;
}

// ---------------- REST API ROUTES ----------------

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', engine: 'SQLite + Express REST API' });
});

// GET /api/expenses/search/?q=value
app.get('/api/expenses/search', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) {
      const allExpenses = db.prepare('SELECT * FROM expenses ORDER BY expense_date DESC, id DESC').all();
      return res.status(200).json(allExpenses);
    }

    const searchTerm = `%${q}%`;
    const stmt = db.prepare(`
      SELECT * FROM expenses
      WHERE expense_id LIKE ?
         OR title LIKE ?
         OR description LIKE ?
         OR category LIKE ?
         OR payment_method LIKE ?
         OR notes LIKE ?
      ORDER BY expense_date DESC, id DESC
    `);
    const results = stmt.all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    return res.status(200).json(results);
  } catch (error: any) {
    return res.status(500).json({ error: 'Search operation failed.', details: error.message });
  }
});

// GET /api/expenses/ - List expenses with filters, search, and sorting
app.get('/api/expenses', (req: Request, res: Response) => {
  try {
    const { category, payment_method, date_from, date_to, min_amount, max_amount, sort, search, q } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];

    const searchQuery = (search || q) as string;
    if (searchQuery && searchQuery.trim()) {
      const term = `%${searchQuery.trim()}%`;
      conditions.push('(expense_id LIKE ? OR title LIKE ? OR description LIKE ? OR category LIKE ? OR payment_method LIKE ?)');
      params.push(term, term, term, term, term);
    }

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (payment_method && payment_method !== 'All') {
      conditions.push('payment_method = ?');
      params.push(payment_method);
    }

    if (date_from) {
      conditions.push('expense_date >= ?');
      params.push(date_from);
    }

    if (date_to) {
      conditions.push('expense_date <= ?');
      params.push(date_to);
    }

    if (min_amount) {
      const minVal = parseFloat(min_amount as string);
      if (!isNaN(minVal)) {
        conditions.push('amount >= ?');
        params.push(minVal);
      }
    }

    if (max_amount) {
      const maxVal = parseFloat(max_amount as string);
      if (!isNaN(maxVal)) {
        conditions.push('amount <= ?');
        params.push(maxVal);
      }
    }

    let orderBy = 'ORDER BY expense_date DESC, id DESC';
    if (sort === 'oldest') {
      orderBy = 'ORDER BY expense_date ASC, id ASC';
    } else if (sort === 'highest') {
      orderBy = 'ORDER BY amount DESC, expense_date DESC';
    } else if (sort === 'lowest') {
      orderBy = 'ORDER BY amount ASC, expense_date DESC';
    } else if (sort === 'newest') {
      orderBy = 'ORDER BY expense_date DESC, id DESC';
    }

    let sql = 'SELECT * FROM expenses';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ' + orderBy;

    const expenses = db.prepare(sql).all(...params);
    res.status(200).json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve expenses.', details: error.message });
  }
});

// GET /api/expenses/:id - Retrieve single expense
app.get('/api/expenses/:id', (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    let expense;
    if (/^\d+$/.test(param)) {
      expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(parseInt(param, 10));
    } else {
      expense = db.prepare('SELECT * FROM expenses WHERE expense_id = ?').get(param);
    }

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    return res.status(200).json(expense);
  } catch (error: any) {
    return res.status(500).json({ error: 'Server error retrieving expense.', details: error.message });
  }
});

// POST /api/expenses/ - Create new expense with validation
app.post('/api/expenses', (req: Request, res: Response) => {
  try {
    let {
      expense_id,
      title,
      description = '',
      amount,
      category,
      payment_method,
      expense_date,
      notes = '',
    } = req.body;

    const fieldErrors: Record<string, string> = {};

    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      fieldErrors.title = 'Title is required.';
    }

    const numAmount = parseFloat(amount);
    if (amount === undefined || amount === null || isNaN(numAmount)) {
      fieldErrors.amount = 'Amount is required.';
    } else if (numAmount <= 0) {
      fieldErrors.amount = 'Amount must be greater than zero.';
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      fieldErrors.category = `Please select a valid category (${VALID_CATEGORIES.join(', ')}).`;
    }

    if (!payment_method || !VALID_PAYMENT_METHODS.includes(payment_method)) {
      fieldErrors.payment_method = `Please select a valid payment method (${VALID_PAYMENT_METHODS.join(', ')}).`;
    }

    if (!expense_date || !/^\d{4}-\d{2}-\d{2}$/.test(expense_date)) {
      fieldErrors.expense_date = 'Please enter a valid expense date (YYYY-MM-DD).';
    } else {
      const d = new Date(expense_date);
      if (isNaN(d.getTime())) {
        fieldErrors.expense_date = 'Please enter a valid date.';
      }
    }

    // Handle expense_id
    if (expense_id && typeof expense_id === 'string' && expense_id.trim()) {
      expense_id = expense_id.trim().toUpperCase();
      const existing = db.prepare('SELECT id FROM expenses WHERE expense_id = ?').get(expense_id);
      if (existing) {
        fieldErrors.expense_id = 'Expense ID already exists.';
      }
    } else {
      expense_id = getNextExpenseId();
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        error: 'Validation failed.',
        field_errors: fieldErrors,
      });
    }

    const now = new Date().toISOString();
    const cleanAmount = parseFloat(numAmount.toFixed(2));

    const result = db.prepare(`
      INSERT INTO expenses (
        expense_id, title, description, amount, category, payment_method, expense_date, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      expense_id,
      title.trim(),
      (description || '').trim(),
      cleanAmount,
      category,
      payment_method,
      expense_date,
      (notes || '').trim(),
      now,
      now
    );

    const createdExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(createdExpense);
  } catch (error: any) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        error: 'Validation failed.',
        field_errors: { expense_id: 'Expense ID already exists.' },
      });
    }
    return res.status(500).json({ error: 'Failed to create expense.', details: error.message });
  }
});

// PUT /api/expenses/:id - Full Update
app.put('/api/expenses/:id', (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    let existing: any;
    if (/^\d+$/.test(param)) {
      existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(parseInt(param, 10));
    } else {
      existing = db.prepare('SELECT * FROM expenses WHERE expense_id = ?').get(param);
    }

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    const {
      expense_id,
      title,
      description = '',
      amount,
      category,
      payment_method,
      expense_date,
      notes = '',
    } = req.body;

    const fieldErrors: Record<string, string> = {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      fieldErrors.title = 'Title is required.';
    }

    const numAmount = parseFloat(amount);
    if (amount === undefined || amount === null || isNaN(numAmount)) {
      fieldErrors.amount = 'Amount is required.';
    } else if (numAmount <= 0) {
      fieldErrors.amount = 'Amount must be greater than zero.';
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      fieldErrors.category = 'Please select a valid category.';
    }

    if (!payment_method || !VALID_PAYMENT_METHODS.includes(payment_method)) {
      fieldErrors.payment_method = 'Please select a valid payment method.';
    }

    if (!expense_date || !/^\d{4}-\d{2}-\d{2}$/.test(expense_date)) {
      fieldErrors.expense_date = 'Please enter a valid expense date (YYYY-MM-DD).';
    }

    const targetExpenseId = (expense_id || existing.expense_id).trim().toUpperCase();
    if (targetExpenseId !== existing.expense_id) {
      const dup = db.prepare('SELECT id FROM expenses WHERE expense_id = ? AND id != ?').get(targetExpenseId, existing.id);
      if (dup) {
        fieldErrors.expense_id = 'Expense ID already exists.';
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ error: 'Validation failed.', field_errors: fieldErrors });
    }

    const now = new Date().toISOString();
    const cleanAmount = parseFloat(numAmount.toFixed(2));

    db.prepare(`
      UPDATE expenses
      SET expense_id = ?,
          title = ?,
          description = ?,
          amount = ?,
          category = ?,
          payment_method = ?,
          expense_date = ?,
          notes = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      targetExpenseId,
      title.trim(),
      (description || '').trim(),
      cleanAmount,
      category,
      payment_method,
      expense_date,
      (notes || '').trim(),
      now,
      existing.id
    );

    const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(existing.id);
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update expense.', details: error.message });
  }
});

// PATCH /api/expenses/:id - Partial Update
app.patch('/api/expenses/:id', (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    let existing: any;
    if (/^\d+$/.test(param)) {
      existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(parseInt(param, 10));
    } else {
      existing = db.prepare('SELECT * FROM expenses WHERE expense_id = ?').get(param);
    }

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    const fieldErrors: Record<string, string> = {};
    const updates: Record<string, any> = {};

    if (req.body.title !== undefined) {
      if (!req.body.title || !String(req.body.title).trim()) {
        fieldErrors.title = 'Title cannot be empty.';
      } else {
        updates.title = String(req.body.title).trim();
      }
    }

    if (req.body.amount !== undefined) {
      const numAmount = parseFloat(req.body.amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        fieldErrors.amount = 'Amount must be greater than zero.';
      } else {
        updates.amount = parseFloat(numAmount.toFixed(2));
      }
    }

    if (req.body.category !== undefined) {
      if (!VALID_CATEGORIES.includes(req.body.category)) {
        fieldErrors.category = 'Invalid category.';
      } else {
        updates.category = req.body.category;
      }
    }

    if (req.body.payment_method !== undefined) {
      if (!VALID_PAYMENT_METHODS.includes(req.body.payment_method)) {
        fieldErrors.payment_method = 'Invalid payment method.';
      } else {
        updates.payment_method = req.body.payment_method;
      }
    }

    if (req.body.expense_date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.expense_date)) {
        fieldErrors.expense_date = 'Invalid date format (YYYY-MM-DD).';
      } else {
        updates.expense_date = req.body.expense_date;
      }
    }

    if (req.body.description !== undefined) updates.description = String(req.body.description).trim();
    if (req.body.notes !== undefined) updates.notes = String(req.body.notes).trim();

    if (req.body.expense_id !== undefined) {
      const expId = String(req.body.expense_id).trim().toUpperCase();
      if (expId !== existing.expense_id) {
        const dup = db.prepare('SELECT id FROM expenses WHERE expense_id = ? AND id != ?').get(expId, existing.id);
        if (dup) {
          fieldErrors.expense_id = 'Expense ID already exists.';
        } else {
          updates.expense_id = expId;
        }
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ error: 'Validation failed.', field_errors: fieldErrors });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(200).json(existing);
    }

    updates.updated_at = new Date().toISOString();

    const setClauses: string[] = [];
    const values: any[] = [];
    for (const [col, val] of Object.entries(updates)) {
      setClauses.push(`${col} = ?`);
      values.push(val);
    }
    values.push(existing.id);

    db.prepare(`UPDATE expenses SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(existing.id);
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update expense.', details: error.message });
  }
});

// DELETE /api/expenses/:id - Remove expense
app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  try {
    const param = req.params.id;
    let existing: any;
    if (/^\d+$/.test(param)) {
      existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(parseInt(param, 10));
    } else {
      existing = db.prepare('SELECT * FROM expenses WHERE expense_id = ?').get(param);
    }

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    db.prepare('DELETE FROM expenses WHERE id = ?').run(existing.id);
    return res.status(200).json({
      message: 'Expense deleted successfully.',
      deleted_id: existing.id,
      expense_id: existing.expense_id,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete expense.', details: error.message });
  }
});

// GET /api/stats/dashboard - Rich statistics calculated dynamically from SQLite
app.get('/api/stats/dashboard', (req: Request, res: Response) => {
  try {
    const allExpenses = db.prepare('SELECT * FROM expenses ORDER BY expense_date DESC').all() as any[];

    const totalTransactions = allExpenses.length;
    let totalExpenses = 0;
    let highestExpense: any = null;
    let lowestExpense: any = null;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    // Get start of this week (Monday)
    const dayOfWeek = now.getDay() || 7; // 1 = Mon, 7 = Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    const mondayStr = monday.toISOString().split('T')[0];

    let thisMonthExpenses = 0;
    let thisWeekExpenses = 0;

    const categoryMap: Record<string, { total: number; count: number }> = {};
    const paymentMap: Record<string, { total: number; count: number }> = {};
    const monthMap: Record<string, number> = {};

    for (const exp of allExpenses) {
      const amt = Number(exp.amount) || 0;
      totalExpenses += amt;

      if (!highestExpense || amt > highestExpense.amount) highestExpense = exp;
      if (!lowestExpense || amt < lowestExpense.amount) lowestExpense = exp;

      if (exp.expense_date.startsWith(currentMonthStr)) {
        thisMonthExpenses += amt;
      }

      if (exp.expense_date >= mondayStr) {
        thisWeekExpenses += amt;
      }

      // Category breakdown
      const cat = exp.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, count: 0 };
      categoryMap[cat].total += amt;
      categoryMap[cat].count += 1;

      // Payment method breakdown
      const pm = exp.payment_method || 'Other';
      if (!paymentMap[pm]) paymentMap[pm] = { total: 0, count: 0 };
      paymentMap[pm].total += amt;
      paymentMap[pm].count += 1;

      // Monthly breakdown (YYYY-MM)
      const ym = exp.expense_date.substring(0, 7);
      monthMap[ym] = (monthMap[ym] || 0) + amt;
    }

    const averageExpense = totalTransactions > 0 ? totalExpenses / totalTransactions : 0;

    // Get current budget
    const budgetRow = db.prepare('SELECT * FROM budgets WHERE month = ? AND year = ?').get(currentMonth, currentYear) as any;
    const monthlyBudget = budgetRow ? budgetRow.amount : 50000.00;
    const remainingBudget = Math.max(0, monthlyBudget - thisMonthExpenses);
    const budgetUsedPercentage = monthlyBudget > 0 ? (thisMonthExpenses / monthlyBudget) * 100 : 0;

    return res.status(200).json({
      summary: {
        totalExpenses: Number(totalExpenses.toFixed(2)),
        thisMonthExpenses: Number(thisMonthExpenses.toFixed(2)),
        thisWeekExpenses: Number(thisWeekExpenses.toFixed(2)),
        totalTransactions,
        averageExpense: Number(averageExpense.toFixed(2)),
        highestExpense,
        lowestExpense,
      },
      budget: {
        monthlyBudget,
        thisMonthExpenses: Number(thisMonthExpenses.toFixed(2)),
        remainingBudget: Number(remainingBudget.toFixed(2)),
        budgetUsedPercentage: Number(budgetUsedPercentage.toFixed(1)),
        isOverBudget: thisMonthExpenses > monthlyBudget,
        month: currentMonth,
        year: currentYear,
      },
      categoryBreakdown: Object.entries(categoryMap).map(([category, data]) => ({
        category,
        total: Number(data.total.toFixed(2)),
        count: data.count,
        percentage: totalExpenses > 0 ? Number(((data.total / totalExpenses) * 100).toFixed(1)) : 0,
      })),
      paymentMethodBreakdown: Object.entries(paymentMap).map(([method, data]) => ({
        method,
        total: Number(data.total.toFixed(2)),
        count: data.count,
        percentage: totalExpenses > 0 ? Number(((data.total / totalExpenses) * 100).toFixed(1)) : 0,
      })),
      monthlyTrends: Object.entries(monthMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, total]) => ({
          month,
          total: Number(total.toFixed(2)),
        })),
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to calculate stats.', details: error.message });
  }
});

// GET & POST /api/budget - Manage monthly budget
app.get('/api/budget', (req: Request, res: Response) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month as string, 10) || (now.getMonth() + 1);
    const year = parseInt(req.query.year as string, 10) || now.getFullYear();

    const row = db.prepare('SELECT * FROM budgets WHERE month = ? AND year = ?').get(month, year) as any;
    const amount = row ? row.amount : 50000.00;

    // Calculate actual spent this month
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const spentRow = db.prepare('SELECT SUM(amount) as spent FROM expenses WHERE expense_date LIKE ?').get(`${monthStr}%`) as any;
    const spent = spentRow && spentRow.spent ? spentRow.spent : 0;

    return res.status(200).json({
      month,
      year,
      amount,
      spent: Number(spent.toFixed(2)),
      remaining: Number(Math.max(0, amount - spent).toFixed(2)),
      percentage: amount > 0 ? Number(((spent / amount) * 100).toFixed(1)) : 0,
      isOverBudget: spent > amount,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to get budget.', details: error.message });
  }
});

app.post('/api/budget', (req: Request, res: Response) => {
  try {
    const now = new Date();
    const month = parseInt(req.body.month, 10) || (now.getMonth() + 1);
    const year = parseInt(req.body.year, 10) || now.getFullYear();
    const amount = parseFloat(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Budget amount must be a positive number greater than zero.' });
    }

    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO budgets (month, year, amount, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(month, year) DO UPDATE SET
        amount = excluded.amount,
        updated_at = excluded.updated_at
    `).run(month, year, amount, timestamp, timestamp);

    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const spentRow = db.prepare('SELECT SUM(amount) as spent FROM expenses WHERE expense_date LIKE ?').get(`${monthStr}%`) as any;
    const spent = spentRow && spentRow.spent ? spentRow.spent : 0;

    return res.status(200).json({
      message: 'Budget updated successfully.',
      month,
      year,
      amount,
      spent: Number(spent.toFixed(2)),
      remaining: Number(Math.max(0, amount - spent).toFixed(2)),
      percentage: amount > 0 ? Number(((spent / amount) * 100).toFixed(1)) : 0,
      isOverBudget: spent > amount,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to save budget.', details: error.message });
  }
});

// POST /api/expenses/reset-sample - Reset and seed sample data
app.post('/api/expenses/reset-sample', (req: Request, res: Response) => {
  try {
    db.exec('DELETE FROM expenses');
    seedSampleData();
    return res.status(200).json({ message: 'Sample expenses reset successfully with 12 realistic records.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to reset data.', details: error.message });
  }
});

// ---------------- VITE MIDDLEWARE & STATIC SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Expense Tracker REST API & Web Server running on http://localhost:${PORT}`);
  });
}

startServer();
