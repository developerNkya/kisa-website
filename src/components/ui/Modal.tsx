import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  description,
  children






}: {open: boolean;onClose: () => void;title: string;description?: string;children: React.ReactNode;}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
          className="absolute inset-0 bg-ink/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative w-full max-w-md rounded-t-2xl border border-line bg-surface-raised p-6 shadow-2xl sm:rounded-2xl"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
          
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-cream">{title}</h2>
                {description && <p className="mt-1 text-sm text-mist">{description}</p>}
              </div>
              <button
              onClick={onClose}
              aria-label="Funga"
              className="rounded-full p-2 text-mist transition-colors duration-150 ease-kisa hover:bg-surface-high hover:text-cream">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}