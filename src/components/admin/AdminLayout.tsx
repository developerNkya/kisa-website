import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BellIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full bg-[#0B0C0D] text-zinc-100">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-800 bg-[#0B0C0D]/95 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md text-zinc-400 hover:bg-zinc-800 lg:hidden"
            aria-label="Fungua menyu">
            
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true" />
            
            <input
              type="search"
              placeholder="Search stories, users, transactions..."
              aria-label="Search admin"
              className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none" />
            
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              className="relative grid h-9 w-9 place-items-center rounded-md text-zinc-400 hover:bg-zinc-800"
              aria-label="Notifications">
              
              <BellIcon className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-400" />
            </button>
            <div className="flex items-center gap-2 rounded-md border border-zinc-800 py-1 pl-1 pr-3">
              <span className="grid h-7 w-7 place-items-center rounded bg-wine text-xs font-bold text-cream">
                JK
              </span>
              <span className="hidden text-xs sm:block">
                <span className="block font-semibold text-zinc-100">Juma K.</span>
                <span className="block text-zinc-500">Editor</span>
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>);

}