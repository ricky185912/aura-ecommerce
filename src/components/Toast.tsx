'use client';

import { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-raspberry-600',
  }[type];

  const icon = {
    success: <CheckCircleIcon className="w-5 h-5" />,
    error: <XMarkIcon className="w-5 h-5" />,
    info: <CheckCircleIcon className="w-5 h-5" />,
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] backdrop-blur-sm bg-opacity-95`}>
        <div className="flex-shrink-0">{icon}</div>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}