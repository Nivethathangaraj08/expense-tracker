import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  badgeText?: string;
  badgeType?: 'neutral' | 'success' | 'warning' | 'info';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  badgeText,
  badgeType = 'neutral',
}) => {
  const badgeStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div
      id={id}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight font-sans">
            {value}
          </h3>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor} shadow-xs`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium border text-[11px] shrink-0 ml-auto ${badgeStyles[badgeType]}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
