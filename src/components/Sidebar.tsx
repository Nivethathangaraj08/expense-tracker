import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  BarChart3,
  PiggyBank,
  Settings,
  GraduationCap,
  Sparkles,
  X,
  Database,
} from 'lucide-react';
import { ActivePage } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  totalExpensesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isMobileOpen,
  setIsMobileOpen,
  totalExpensesCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'expenses' as ActivePage,
      label: 'Expenses',
      icon: Receipt,
      badge: totalExpensesCount > 0 ? totalExpensesCount : undefined,
    },
    { id: 'add-expense' as ActivePage, label: 'Add Expense', icon: PlusCircle, isAction: true },
    { id: 'reports' as ActivePage, label: 'Reports', icon: BarChart3 },
    { id: 'budget' as ActivePage, label: 'Budget', icon: PiggyBank },
    {
      id: 'college-hub' as ActivePage,
      label: 'College Project Hub',
      icon: GraduationCap,
      highlight: true,
    },
    { id: 'settings' as ActivePage, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Receipt className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">
                Expense Tracker
              </h1>
              <p className="text-[11px] font-medium text-slate-500">Personal Finance</p>
            </div>
          </div>
          <button
            id="close-sidebar-btn"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : item.highlight
                    ? 'bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-200/60 text-indigo-800">
                    Viva
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Database & Architecture info pill */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-xs font-semibold text-slate-800 truncate">Live SQLite DB</p>
              </div>
              <p className="text-[10px] text-slate-500 truncate">REST API Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
