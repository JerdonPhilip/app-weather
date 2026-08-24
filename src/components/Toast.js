import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertIcon, CheckIcon } from './icons';

const TOAST_TTL = 4000;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = (id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    timersRef.current.set(
      id,
      setTimeout(() => {
        timersRef.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_TTL)
    );
  };

  useEffect(
    () => () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    },
    []
  );

  const ToastComponent = () => (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-full shadow-pop text-white text-sm font-medium backdrop-blur-xl border ${
              toast.type === 'error'
                ? 'bg-[#3a1420]/90 border-status-alert/40'
                : 'bg-[#10203a]/90 border-horizon/30'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertIcon className="w-4 h-4 text-status-alert shrink-0" />
            ) : (
              <CheckIcon className="w-4 h-4 text-status-good shrink-0" />
            )}
            {toast.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );

  return { showToast, ToastComponent };
};
