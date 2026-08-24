import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookmarkIcon, HomeIcon, LibraryIcon, SearchIcon, UserIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const items = [
  { label: 'Hadithi', to: '/', icon: HomeIcon, end: true },
  { label: 'Tafuta', to: '/tafuta', icon: SearchIcon },
  { label: 'Zote', to: '/hadithi', icon: LibraryIcon },
  { label: 'Hifadhi', to: '/zilizohifadhiwa', icon: BookmarkIcon },
  { label: 'Akaunti', to: '/akaunti', icon: UserIcon },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Menyu ya chini"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors duration-150',
                  isActive ? 'text-[#9B1B3B]' : 'text-gray-400 hover:text-gray-700'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn('h-[22px] w-[22px]', isActive && 'text-[#9B1B3B]')}
                    aria-hidden="true"
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}