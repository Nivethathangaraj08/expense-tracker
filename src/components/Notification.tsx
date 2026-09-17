import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface NotificationProps {
  // Single toast props (used in App.tsx)
  show?: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message?: string;
  onClose?: () => void;
  // Multi toast list props (optional)
  toasts?: ToastMessage[];
  onDismiss?: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({
  show = false,
  type = 'info',
  title = '',
  message = '',
  onClose,
  toasts = [],
  onDismiss,
}) => {
  // Auto-dismiss single notification after 4.5 seconds
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // Handle single notification display
  if (show && (title || message)) {
    let bg = 'bg-white border-slate-200 text-slate-800 shadow-xl';
    let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

    if (type === 'success') {
      bg = 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xl shadow-emerald-500/10';
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
    } else if (type === 'error') {
      bg = 'bg-rose-50 border-rose-200 text-rose-900 shadow-xl shadow-rose-500/10';
      icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
    } else if (type === 'warning') {
      bg = 'bg-amber-50 border-amber-200 text-amber-900 shadow-xl shadow-amber-500/10';
      icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
    }

    return (
      <div
        id="notification-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full"
      >
        <div
          id="toast-active"
          className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${bg}`}
          role="alert"
        >
          {icon}
          <div className="flex-1 min-w-0">
            {title && <p className="text-sm font-semibold leading-snug">{title}</p>}
            {message && (
              <p className="text-xs mt-1 opacity-90 leading-relaxed break-words">{message}</p>
            )}
          </div>
          {onClose && (
            <button
              id="dismiss-toast-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
              title="Close"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Handle multi-toast display if provided
  const activeToasts = Array.isArray(toasts) ? toasts : [];
  if (activeToasts.length === 0) return null;

  return (
    <div
      id="notification-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none"
    >
      {activeToasts.map((toast) => {
        let bg = 'bg-white border-slate-200 text-slate-800';
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-50 border-emerald-200 text-emerald-900';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-50 border-rose-200 text-rose-900';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-50 border-amber-200 text-amber-900';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200 ${bg}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none">{toast.title}</p>
              <p className="text-xs mt-1 opacity-90 leading-relaxed break-words">{toast.message}</p>
            </div>
            {onDismiss && (
              <button
                id={`dismiss-toast-${toast.id}`}
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
