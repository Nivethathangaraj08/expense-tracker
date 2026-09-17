import React, { useState } from 'react';
import { Expense } from '../types';
import { CATEGORY_STYLES, formatCurrency, formatDate, CurrencyConfig } from '../utils/formatters';
import { Eye, Edit2, Trash2, Plus, ChevronLeft, ChevronRight, Inbox, Tag } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAddFirstExpense?: () => void;
  isFiltered?: boolean;
  currency?: CurrencyConfig;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses = [],
  onView,
  onEdit,
  onDelete,
  onAddFirstExpense,
  isFiltered = false,
  currency,
}) => {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(safeExpenses.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = safeExpenses.slice(startIndex, startIndex + itemsPerPage);

  if (safeExpenses.length === 0) {
    if (isFiltered) {
      return (
        <div
          id="no-matching-expenses"
          className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No expenses found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No expense records match your current search or filter criteria. Try clearing your filters.
          </p>
        </div>
      );
    }

    return (
      <div
        id="empty-expenses-state"
        className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Tag className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No expenses recorded yet</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
          Start logging your daily transactions, bills, and purchases to track your spending and understand your cashflow.
        </p>
        {onAddFirstExpense && (
          <button
            id="btn-add-first-expense"
            onClick={onAddFirstExpense}
            className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Expense</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table id="expenses-data-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Expense ID</th>
              <th className="py-3.5 px-4 sm:px-6">Title</th>
              <th className="py-3.5 px-4 sm:px-6">Category</th>
              <th className="py-3.5 px-4 sm:px-6">Amount</th>
              <th className="py-3.5 px-4 sm:px-6">Payment Method</th>
              <th className="py-3.5 px-4 sm:px-6">Date</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {paginatedExpenses.map((exp) => {
              const catStyle = CATEGORY_STYLES[exp.category] || CATEGORY_STYLES.Other;

              return (
                <tr
                  key={exp.id}
                  id={`expense-row-${exp.id}`}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Expense ID */}
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {exp.expense_id}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 max-w-xs truncate">
                    <span>{exp.title}</span>
                    {exp.description && (
                      <p className="text-[11px] font-normal text-slate-400 truncate max-w-xs">
                        {exp.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${catStyle.pillBg}`} />
                      {exp.category}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(exp.amount, currency)}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-700">
                      {exp.payment_method}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                    {formatDate(exp.expense_date)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`btn-view-expense-${exp.id}`}
                        onClick={() => onView(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-edit-expense-${exp.id}`}
                        onClick={() => onEdit(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-delete-expense-${exp.id}`}
                        onClick={() => onDelete(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, safeExpenses.length)} of{' '}
            {safeExpenses.length} records
          </span>
          <div className="flex items-center gap-1">
            <button
              id="btn-pagination-prev"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              id="btn-pagination-next"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
