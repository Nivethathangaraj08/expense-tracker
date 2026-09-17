import React, { useState } from 'react';
import { CategoryBreakdownItem, MonthlyTrendItem, PaymentMethodBreakdownItem } from '../types';
import { CATEGORY_STYLES, formatCurrency, CurrencyConfig } from '../utils/formatters';
import { PieChart, BarChart2, CreditCard, HelpCircle } from 'lucide-react';

interface CategoryDonutChartProps {
  data: CategoryBreakdownItem[];
  currency?: CurrencyConfig;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data, currency }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
        <PieChart className="w-10 h-10 mb-2 stroke-1" />
        <p>No category expense data available yet.</p>
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.total, 0);

  // Calculate SVG arc paths for donut
  let cumulativeAngle = 0;
  const radius = 70;
  const strokeWidth = 32;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  const activeItem = hoveredCategory
    ? data.find((d) => d.category === hoveredCategory)
    : null;

  return (
    <div id="category-donut-chart" className="flex flex-col md:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {data.map((item) => {
            const fraction = total > 0 ? item.total / total : 0;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += fraction;

            const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Other;
            const isHovered = hoveredCategory === item.category;

            return (
              <circle
                key={item.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={style.hex}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate max-w-28">
            {activeItem ? activeItem.category : 'Total'}
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-800 tracking-tight mt-0.5">
            {activeItem
              ? formatCurrency(activeItem.total, currency)
              : formatCurrency(total, currency)}
          </p>
          <p className="text-[10px] text-slate-400">
            {activeItem ? `${activeItem.percentage}%` : `${data.length} categories`}
          </p>
        </div>
      </div>

      {/* Legend List */}
      <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
        {data.map((item) => {
          const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Other;
          const isHovered = hoveredCategory === item.category;

          return (
            <div
              key={item.category}
              onMouseEnter={() => setHoveredCategory(item.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                isHovered
                  ? 'bg-slate-50 border-slate-300 font-semibold'
                  : 'bg-white border-slate-100 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: style.hex }}
                />
                <span className="text-slate-700 truncate">{item.category}</span>
                <span className="text-[10px] text-slate-400">({item.count})</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-medium">
                <span className="text-slate-900 font-bold">
                  {formatCurrency(item.total, currency)}
                </span>
                <span className="text-slate-400 text-[10px] w-9 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface MonthlyBarChartProps {
  data: MonthlyTrendItem[];
  currency?: CurrencyConfig;
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data, currency }) => {
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyTrendItem | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
        <BarChart2 className="w-10 h-10 mb-2 stroke-1" />
        <p>No monthly trend data recorded yet.</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.total), 1000);

  const formatMonthLabel = (m: string) => {
    try {
      const [year, month] = m.split('-').map(Number);
      const d = new Date(year, month - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'short' });
    } catch {
      return m;
    }
  };

  return (
    <div id="monthly-bar-chart" className="space-y-4">
      {/* Tooltip bar indicator */}
      <div className="h-6 flex items-center justify-between text-xs px-1 text-slate-500">
        <span>Recent Monthly Spend</span>
        {hoveredMonth && (
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            {formatMonthLabel(hoveredMonth.month)}: {formatCurrency(hoveredMonth.total, currency)}
          </span>
        )}
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-200">
        {data.map((item) => {
          const heightPercent = Math.max(8, (item.total / maxVal) * 100);
          const isHovered = hoveredMonth?.month === item.month;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredMonth(item)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                  isHovered ? 'bg-blue-600 shadow-md shadow-blue-500/30' : 'bg-blue-500/80 hover:bg-blue-600'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <span
                className={`text-[11px] mt-2 font-medium transition-colors ${
                  isHovered ? 'text-blue-600 font-bold' : 'text-slate-500'
                }`}
              >
                {formatMonthLabel(item.month)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PaymentMethodSummaryProps {
  data: PaymentMethodBreakdownItem[];
  currency?: CurrencyConfig;
}

export const PaymentMethodSummary: React.FC<PaymentMethodSummaryProps> = ({ data, currency }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
        <CreditCard className="w-10 h-10 mb-2 stroke-1" />
        <p>No payment method records yet.</p>
      </div>
    );
  }

  return (
    <div id="payment-method-summary" className="space-y-3.5">
      {data.map((item) => (
        <div key={item.method} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">{item.method}</span>
              <span className="text-slate-400 text-[11px]">({item.count} txns)</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="text-slate-900">{formatCurrency(item.total, currency)}</span>
              <span className="text-slate-500 text-[11px] w-9 text-right font-semibold">
                {item.percentage}%
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, item.percentage)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
