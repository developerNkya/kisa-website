import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, BookOpenIcon, CreditCardIcon } from 'lucide-react';
import { notifications } from '../data/notifications';
import { EmptyState } from './states/EmptyState';

const icons = {
  episode: BookOpenIcon,
  subscription: CreditCardIcon,
  system: BellIcon
};

export function NotificationPanel({ open, onClose }: {open: boolean;onClose: () => void;}) {
  return (
    <AnimatePresence>
      {open &&
      <>
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
          <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-2xl"
          role="dialog"
          aria-label="Taarifa">
          
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
              <h2 className="font-display text-sm font-bold text-cream">Taarifa</h2>
              <span className="rounded-full bg-wine/20 px-2 py-0.5 text-[11px] font-semibold text-wine-bright">
                {notifications.filter((n) => n.unread).length} mpya
              </span>
            </div>

            {notifications.length === 0 ?
          <div className="p-4">
                <EmptyState title="Hakuna taarifa" body="Tutakujulisha pale sehemu mpya itakapotoka." />
              </div> :

          <ul className="max-h-[60vh] divide-y divide-line-soft overflow-y-auto">
                {notifications.map((n) => {
              const Icon = icons[n.kind];
              return (
                <li key={n.id} className={n.unread ? 'bg-wine/[0.06]' : undefined}>
                      <Link
                    to={n.href}
                    onClick={onClose}
                    className="flex gap-3 px-4 py-3.5 transition-colors duration-150 ease-kisa hover:bg-surface-high">
                    
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-high text-gold">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-cream">{n.title}</span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-mist">{n.body}</span>
                          <span className="mt-1.5 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-gold">{n.cta}</span>
                            <span className="text-[11px] text-dust">{n.time}</span>
                          </span>
                        </span>
                      </Link>
                    </li>);

            })}
              </ul>
          }
          </motion.div>
        </>
      }
    </AnimatePresence>);

}