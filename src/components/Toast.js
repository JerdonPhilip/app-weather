import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertIcon, CheckIcon } from './icons';

export const useToast = () => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (message, type = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  const ToastComponent = () => (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            role="status"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { showToast, ToastComponent };
};
