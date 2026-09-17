import { ExpenseCategory, PaymentMethod } from '../types';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
];

let activeCurrency: CurrencyConfig = SUPPORTED_CURRENCIES[0]; // Default: INR (₹)

export function getActiveCurrency(): CurrencyConfig {
  const saved = localStorage.getItem('expense_tracker_currency');
  if (saved) {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === saved);
    if (found) return found;
  }
  return activeCurrency;
}

export function setActiveCurrency(currencyCode: string): CurrencyConfig {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  activeCurrency = found;
  localStorage.setItem('expense_tracker_currency', found.code);
  return found;
}

export function formatCurrency(amount: number | string | undefined | null, currency?: CurrencyConfig): string {
  if (amount === undefined || amount === null || amount === '') return '₹0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';

  const curr = (currency && typeof currency === 'object' && currency.code) ? currency : (getActiveCurrency() || SUPPORTED_CURRENCIES[0]);
  const code = curr?.code || 'INR';
  const symbol = curr?.symbol || '₹';

  // Indian standard formatting for INR or international for others
  if (code === 'INR') {
    const parts = num.toFixed(2).split('.');
    let intPart = parts[0];
    const decPart = parts[1];

    // Regex for Indian number grouping (e.g. 1,25,000.00)
    const isNegative = intPart.startsWith('-');
    if (isNegative) intPart = intPart.substring(1);

    let lastThree = intPart.slice(-3);
    const otherNumbers = intPart.slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${isNegative ? '-' : ''}${symbol}${formattedInt}.${decPart}`;
  }

  return `${symbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export interface CategoryStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  hex: string;
  pillBg: string;
}

export const CATEGORY_STYLES: Record<ExpenseCategory, CategoryStyle> = {
  Food: {
    label: 'Food',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    hex: '#F97316',
    pillBg: 'bg-orange-500',
  },
  Transportation: {
    label: 'Transportation',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hex: '#3B82F6',
    pillBg: 'bg-blue-500',
  },
  Shopping: {
    label: 'Shopping',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    hex: '#A855F7',
    pillBg: 'bg-purple-500',
  },
  Bills: {
    label: 'Bills',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    hex: '#EF4444',
    pillBg: 'bg-red-500',
  },
  Entertainment: {
    label: 'Entertainment',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    hex: '#EC4899',
    pillBg: 'bg-pink-500',
  },
  Healthcare: {
    label: 'Healthcare',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    hex: '#10B981',
    pillBg: 'bg-emerald-500',
  },
  Education: {
    label: 'Education',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    hex: '#6366F1',
    pillBg: 'bg-indigo-500',
  },
  Travel: {
    label: 'Travel',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    hex: '#06B6D4',
    pillBg: 'bg-cyan-500',
  },
  Rent: {
    label: 'Rent',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    hex: '#EAB308',
    pillBg: 'bg-amber-500',
  },
  Other: {
    label: 'Other',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    hex: '#64748B',
    pillBg: 'bg-slate-500',
  },
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  Cash: 'Banknote',
  'Credit Card': 'CreditCard',
  'Debit Card': 'CreditCard',
  UPI: 'Smartphone',
  'Bank Transfer': 'Building2',
  Other: 'Wallet',
};
