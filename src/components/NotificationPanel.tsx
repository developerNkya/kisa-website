import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, BookOpenIcon, CreditCardIcon, X } from 'lucide-react';
import { notifications } from '../data/notifications';
import { EmptyState } from './states/EmptyState';
import { cn } from '../utils/cn';

const icons = {
  episode: BookOpenIcon,
  subscription: CreditCardIcon,
  system: BellIcon
};

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - only on mobile */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" 
            onClick={onClose} 
            aria-hidden="true" 
          />
          
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              'z-50 overflow-hidden rounded-2xl border shadow-2xl',
              // ✅ Fixed: Right aligned on all screens
              'absolute top-12 right-0',
              // ✅ Mobile: full width with small margin, Desktop: fixed width
              'w-[calc(100vw-32px)] sm:w-[380px]',
              // ✅ Ensure it doesn't go off screen
              'max-w-[calc(100vw-32px)]',
              'border-gray-200 bg-white'
            )}
            role="dialog"
            aria-label="Taarifa"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50/50">
              <h2 className="font-display text-sm font-bold text-gray-900">Taarifa</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#9B1B3B]/10 px-2 py-0.5 text-[11px] font-semibold text-[#9B1B3B]">
                    {unreadCount} mpya
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {notifications.length === 0 ? (
              <div className="p-6">
                <EmptyState 
                  title="Hakuna taarifa" 
                  body="Tutakujulisha pale sehemu mpya itakapotoka." 
                />
              </div>
            ) : (
              <ul className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = icons[n.kind] || BellIcon;
                  return (
                    <li 
                      key={n.id} 
                      className={cn(
                        'transition-colors duration-150',
                        n.unread ? 'bg-[#9B1B3B]/5' : 'hover:bg-gray-50'
                      )}
                    >
                      <Link
                        to={n.href}
                        onClick={onClose}
                        className="flex gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-gray-50/80"
                      >
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-100 text-[#9B1B3B]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-gray-900">
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-gray-500">
                            {n.body}
                          </span>
                          <span className="mt-1.5 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[#9B1B3B]">
                              {n.cta}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {n.time}
                            </span>
                            {n.unread && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#9B1B3B]" />
                            )}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                <Link
                  to="/taarifa"
                  onClick={onClose}
                  className="text-xs font-medium text-[#9B1B3B] hover:text-[#C42B53] transition-colors"
                >
                  Ona zote
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}