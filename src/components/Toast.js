import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const useToast = () => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const ToastComponent = () => (
        <AnimatePresence>
            { toast && (
                <motion.div
                    initial={ { opacity: 0, y: 50 } }
                    animate={ { opacity: 1, y: 0 } }
                    exit={ { opacity: 0, y: 50 } }
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
                >
                    <div
                        className={ `px-6 py-3 rounded-full shadow-lg text-white text-base font-medium backdrop-blur-md ${toast.type === 'error' ? 'bg-red-500/90' : 'bg-accent/90'
                            }` }
                        role="alert"
                    >
                        { toast.message }
                    </div>
                </motion.div>
            ) }
        </AnimatePresence>
    );

    return { showToast, ToastComponent };
};