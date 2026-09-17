import React from 'react';
import { Expense } from '../types';
import { CATEGORY_STYLES, formatCurrency, formatDate, formatDateTime, CurrencyConfig } from '../utils/formatters';
import {
  X,
  Edit2,
  Trash2,
  ArrowLeft,
  Calendar,
  CreditCard,
  Tag,
  Clock,
  FileText,
  Hash,
  Info,
} from 'lucide-react';

interface ExpenseDetailsModalProps {
  expense: Expense;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  currency?: CurrencyConfig;
}

export const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
  expense,
  onClose,
  onEdit,
  onDelete,
  currency,
}) => {
  const catStyle = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other;

  return (
    <div
      id="expense-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="expense-details-modal"
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-expenses"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Back to Expenses"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {expense.expense_id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${catStyle.pillBg}`} />
                  {expense.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {expense.title}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-details"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6">
          {/* Section 1: Expense Information */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Expense Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-slate-500 text-xs">Total Amount</p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {formatCurrency(expense.amount, currency)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Expense Date</p>
                <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{formatDate(expense.expense_date)}</span>
                  <span className="text-xs text-slate-400 font-mono">({expense.expense_date})</span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-500 text-xs">Description</p>
                <p className="text-slate-800 mt-1 leading-relaxed">
                  {expense.description || <span className="text-slate-400 italic">No description provided</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Information */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Payment Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-slate-500 text-xs">Payment Method</p>
                <p className="font-semibold text-slate-800 mt-1 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs font-medium">
                    {expense.payment_method}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Category Tag</p>
                <p className="font-semibold text-slate-800 mt-1">
                  {expense.category}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Information */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Additional Information</span>
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="text-slate-500 text-xs">Notes</p>
                <p className="text-slate-800 mt-1 leading-relaxed">
                  {expense.notes || <span className="text-slate-400 italic">No additional notes</span>}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Created: {formatDateTime(expense.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Updated: {formatDateTime(expense.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            id="btn-details-back"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Back to Expenses
          </button>
          <div className="flex items-center gap-2">
            <button
              id="btn-details-edit"
              type="button"
              onClick={() => onEdit(expense)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              id="btn-details-delete"
              type="button"
              onClick={() => onDelete(expense)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
