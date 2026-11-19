'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  title?: string;
  description: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start p-4 rounded-xl shadow-lg border bg-white transition-all transform animate-in slide-in-from-right-full',
              t.type === 'success' && 'border-emerald-200 text-emerald-900',
              t.type === 'error' && 'border-red-200 text-red-900',
              t.type === 'warning' && 'border-amber-200 text-amber-900',
              (!t.type || t.type === 'info') && 'border-blue-200 text-blue-900'
            )}
          >
            <div className="mr-3 mt-0.5">
              {t.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
              {(!t.type || t.type === 'info') && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1 text-sm">
              {t.title && <h4 className="font-semibold text-gray-900">{t.title}</h4>}
              <p className="text-gray-600 mt-0.5">{t.description}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 text-gray-400 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  return (
    context || {
      toast: (t: any) => console.log('Toast:', t),
    }
  );
}
