import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BellIcon, BookmarkIcon, SearchIcon, LogOut, Menu, X } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { NotificationPanel } from '../NotificationPanel';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../utils/cn';

const links = [
  { label: 'Hadithi', to: '/' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/ingia');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Mtumiaji';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-shadow duration-200',
        scrolled ? 'shadow-sm border-b border-gray-100' : 'border-b border-gray-100'
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:h-16 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-1.5 shrink-0" aria-label="KISA — mwanzo">
          <span className="font-display text-2xl font-black leading-none tracking-[0.12em] text-[#9B1B3B]">
            KISA
          </span>
          <span className="hidden text-[9px] uppercase tracking-[0.2em] text-gray-400 lg:inline">
            Hadithi
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Menyu kuu" className="hidden items-center gap-0.5 lg:flex ml-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                  isActive ? 'text-[#9B1B3B] font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-[#9B1B3B]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => navigate('/tafuta')}
            aria-label="Tafuta"
            className="grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>

          <Link
            to="/zilizohifadhiwa"
            aria-label="Zilizohifadhiwa"
            className="hidden h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors sm:grid"
          >
            <BookmarkIcon className="h-[18px] w-[18px]" />
          </Link>

          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label="Taarifa"
                  aria-expanded={notifOpen}
                  className="relative grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <BellIcon className="h-[18px] w-[18px]" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C42B53] ring-2 ring-white" />
                </button>
                <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>

              <div className="ml-1 flex items-center gap-1.5">
                <Link
                  to="/akaunti"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1 pr-3 hover:border-gray-300 transition-colors"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#9B1B3B] font-display text-sm font-bold text-white">
                    {initial}
                  </span>
                  <span className="hidden text-sm font-medium text-gray-800 sm:inline">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Toka"
                  title="Toka"
                  className="grid h-9 w-9 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-[17px] w-[17px]" />
                </button>
              </div>
            </>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <ButtonLink to="/ingia" variant="ghost" size="sm">
                Ingia
              </ButtonLink>
              <ButtonLink to="/jisajili" size="sm">
                Jisajili
              </ButtonLink>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-1 grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Menyu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2.5 text-sm font-medium',
                  isActive
                    ? 'bg-[#9B1B3B]/5 text-[#9B1B3B] font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}