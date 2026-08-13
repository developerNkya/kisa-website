import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookmarkIcon, HomeIcon, LibraryIcon, SearchIcon, UserIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const items = [
{ label: 'Mwanzo', to: '/', icon: HomeIcon, end: true },
{ label: 'Tafuta', to: '/tafuta', icon: SearchIcon },
{ label: 'Hadithi', to: '/hadithi', icon: LibraryIcon },
{ label: 'Hifadhi', to: '/zilizohifadhiwa', icon: BookmarkIcon },
{ label: 'Akaunti', to: '/akaunti', icon: UserIcon }];


export function MobileBottomNav() {
  return (
    <nav
      aria-label="Menyu ya chini"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map((item) =>
        <li key={item.to} className="flex-1">
            <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors duration-150 ease-kisa',
              isActive ? 'text-cream' : 'text-dust'
            )
            }>
            
              {({ isActive }) =>
            <>
                  <span className="relative">
                    <item.icon
                  className={cn('h-[22px] w-[22px]', isActive && 'text-wine-bright')}
                  aria-hidden="true" />
                
                    {isActive &&
                <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-gold" />
                }
                  </span>
                  {item.label}
                </>
            }
            </NavLink>
          </li>
        )}
      </ul>
    </nav>);

}