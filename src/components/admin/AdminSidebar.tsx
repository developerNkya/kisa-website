import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BarChart3Icon,
  BookOpenIcon,
  CreditCardIcon,
  FolderTreeIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  RepeatIcon,
  SettingsIcon,
  UsersIcon,
  XIcon,
  PenLineIcon } from
'lucide-react';
import { cn } from '../../utils/cn';

const items = [
{ label: 'Dashboard', to: '/admin', icon: LayoutDashboardIcon, end: true },
{ label: 'Stories', to: '/admin/stories', icon: BookOpenIcon },
{ label: 'Episodes', to: '/admin/episodes', icon: ListOrderedIcon },
{ label: 'Authors', to: '/admin/authors', icon: PenLineIcon },
{ label: 'Categories', to: '/admin/categories', icon: FolderTreeIcon },
{ label: 'Users', to: '/admin/users', icon: UsersIcon },
{ label: 'Subscriptions', to: '/admin/subscriptions', icon: RepeatIcon },
{ label: 'Payments', to: '/admin/payments', icon: CreditCardIcon },
{ label: 'Analytics', to: '/admin/analytics', icon: BarChart3Icon },
{ label: 'Settings', to: '/admin/settings', icon: SettingsIcon }];


export function AdminSidebar({ open, onClose }: {open: boolean;onClose: () => void;}) {
  return (
    <>
      {open &&
      <div
        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        onClick={onClose}
        aria-hidden="true" />

      }
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-zinc-800 bg-[#101113] transition-transform duration-200 ease-kisa lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Admin menyu">
        
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5">
          <Link to="/admin" className="flex items-baseline gap-2">
            <span className="font-display text-xl font-black tracking-[0.12em] text-zinc-100">KISA</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-400 hover:bg-zinc-800 lg:hidden"
            aria-label="Funga menyu">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {items.map((item) =>
            <li key={item.to}>
                <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-kisa',
                  isActive ?
                  'bg-zinc-800 text-zinc-50' :
                  'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                )
                }>
                
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <Link
            to="/"
            className="block rounded-md border border-zinc-800 px-3 py-2.5 text-center text-xs font-semibold text-zinc-400 transition-colors duration-150 ease-kisa hover:text-zinc-100">
            
            Ona tovuti ya KISA
          </Link>
        </div>
      </aside>
    </>);

}