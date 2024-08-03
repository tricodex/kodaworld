// src/components/ui/use-toast.ts
'use client';

import { useState, useCallback } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface Toast extends ToastProps {
  id: number;
}

let id = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(({ title, description, type = 'info', duration = 3000 }: ToastProps) => {
    const toast: Toast = { id: id++, title, description, type, duration };
    setToasts((prevToasts) => [...prevToasts, toast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { addToast, removeToast, toasts };
}