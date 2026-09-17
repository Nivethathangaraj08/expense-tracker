import React, { useState, useEffect } from 'react';
import { Expense, ExpenseFormData, ExpenseCategory, PaymentMethod } from '../types';
import { CATEGORY_STYLES, CurrencyConfig } from '../utils/formatters';
import {
  Save,
  X,
  Calendar,
  CreditCard,
  Tag,
  DollarSign,
  FileText,
  Hash,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ExpenseFormProps {
  initialExpense?: Expense | null;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  currency?: CurrencyConfig;
}

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

const ALL_PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'Other',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialExpense,
  onSubmit,
  onCancel,
  isLoading = false,
  currency,
}) => {
  const isEditMode = !!initialExpense;

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<ExpenseFormData>({
    expense_id: initialExpense?.expense_id || '',
    title: initialExpense?.title || '',
    description: initialExpense?.description || '',
    amount: initialExpense?.amount !== undefined ? initialExpense.amount : '',
    category: initialExpense?.category || 'Food',
    payment_method: initialExpense?.payment_method || 'UPI',
    expense_date: initialExpense?.expense_date || todayStr,
    notes: initialExpense?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialExpense) {
      setFormData({
        expense_id: initialExpense.expense_id,
        title: initialExpense.title,
        description: initialExpense.description || '',
        amount: initialExpense.amount,
        category: initialExpense.category,
        payment_method: initialExpense.payment_method,
        expense_date: initialExpense.expense_date,
        notes: initialExpense.notes || '',
      });
    }
  }, [initialExpense]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.title || !formData.title.trim()) {
      errs.title = 'Title is required.';
    }

    const num = parseFloat(String(formData.amount));
    if (formData.amount === '' || formData.amount === undefined || isNaN(num)) {
      errs.amount = 'Amount is required.';
    } else if (num <= 0) {
      errs.amount = 'Amount must be greater than zero.';
    }

    if (!formData.category) {
      errs.category = 'Please select a category.';
    }

    if (!formData.payment_method) {
      errs.payment_method = 'Please select a payment method.';
    }

    if (!formData.expense_date) {
      errs.expense_date = 'Please enter a valid expense date.';
    } else {
      const d = new Date(formData.expense_date);
      if (isNaN(d.getTime())) {
        errs.expense_date = 'Please enter a valid date.';
      }
    }

    return errs;
  };

  const handleChange = (field: keyof ExpenseFormData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        title: true,
        amount: true,
        category: true,
        payment_method: true,
        expense_date: true,
      });
      return;
    }

    await onSubmit({
      ...formData,
      amount: parseFloat(String(formData.amount)),
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {isEditMode ? 'Edit Expense Record' : 'Record New Expense'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isEditMode
            ? `Update details for expense ID: ${initialExpense.expense_id}`
            : 'Fill in the transaction details below. Instant validation ensures database integrity.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Row 1: Expense ID & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Expense ID (optional/auto-generated) */}
          <div>
            <label
              htmlFor="field-expense-id"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Expense ID</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {isEditMode ? 'Unique' : 'Auto or Custom'}
              </span>
            </label>
            <input
              id="field-expense-id"
              type="text"
              placeholder="e.g. EXP015 (Auto)"
              value={formData.expense_id || ''}
              onChange={(e) => handleChange('expense_id', e.target.value.toUpperCase())}
              disabled={isEditMode}
              className="w-full uppercase font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
            />
            {errors.expense_id && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.expense_id}</span>
              </p>
            )}
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <label
              htmlFor="field-title"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Expense Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="field-title"
              type="text"
              placeholder="e.g. Weekly Grocery Restock"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full text-xs sm:text-sm bg-white border rounded-xl px-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                errors.title && touched.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.title && touched.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Amount */}
          <div>
            <label
              htmlFor="field-amount"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Amount ({currency?.symbol || '₹'}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                {currency?.symbol || '₹'}
              </div>
              <input
                id="field-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  errors.amount && touched.amount
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              />
            </div>
            {errors.amount && touched.amount && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.amount}</span>
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="field-date"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Expense Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="field-date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => handleChange('expense_date', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  errors.expense_date && touched.expense_date
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              />
            </div>
            {errors.expense_date && touched.expense_date && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.expense_date}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Category Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = formData.category === cat;
              const style = CATEGORY_STYLES[cat];

              return (
                <button
                  key={cat}
                  id={`cat-select-${cat.toLowerCase()}`}
                  type="button"
                  onClick={() => handleChange('category', cat)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? `${style.bg} ${style.text} ${style.border} ring-2 ring-blue-500/50 shadow-xs font-bold`
                      : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: style.hex }}
                  />
                  <span className="truncate">{cat}</span>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.category}</span>
            </p>
          )}
        </div>

        {/* Row 4: Payment Method */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Payment Method <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {ALL_PAYMENT_METHODS.map((method) => {
              const isSelected = formData.payment_method === method;

              return (
                <button
                  key={method}
                  id={`pm-select-${method.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => handleChange('payment_method', method)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold ring-2 ring-blue-500/40 shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
          {errors.payment_method && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.payment_method}</span>
            </p>
          )}
        </div>

        {/* Row 5: Description (Optional) */}
        <div>
          <label
            htmlFor="field-description"
            className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between"
          >
            <span>Description</span>
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <input
            id="field-description"
            type="text"
            placeholder="e.g. Monthly restock from supermarket, fruits, vegetables"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Row 6: Notes (Optional) */}
        <div>
          <label
            htmlFor="field-notes"
            className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between"
          >
            <span>Additional Notes</span>
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <textarea
            id="field-notes"
            rows={3}
            placeholder="e.g. Saved physical invoice in drawer #2, claimed reimbursement"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-expense-form"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-save-expense-form"
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-blue-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditMode ? 'Update Expense' : 'Save Expense'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
