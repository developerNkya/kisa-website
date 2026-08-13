import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BellIcon, BookmarkIcon, SearchIcon } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { NotificationPanel } from '../NotificationPanel';
import { useKisa } from '../../contexts/KisaContext';
import { cn } from '../../utils/cn';

const links = [
{ label: 'Mwanzo', to: '/' },
{ label: 'Hadithi', to: '/hadithi' },
{ label: 'Zinazopendwa', to: '/zinazopendwa' },
{ label: 'Mpya', to: '/mpya' },
{ label: 'Makundi', to: '/makundi' }];


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useKisa();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-200 ease-kisa',
        scrolled ?
        'border-b border-line bg-ink/95 backdrop-blur-md' :
        'border-b border-transparent bg-gradient-to-b from-ink to-transparent'
      )}>
      
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-10">
        <Link to="/" className="flex items-baseline gap-2" aria-label="KISA — mwanzo">
          <span className="font-display text-[26px] font-black leading-none tracking-[0.12em] text-cream">
            KISA
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-gold lg:inline">
            Hadithi
          </span>
        </Link>

        <nav aria-label="Menyu kuu" className="hidden items-center gap-1 lg:flex">
          {links.map((l) =>
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
            cn(
              'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150 ease-kisa',
              isActive ? 'text-cream' : 'text-mist hover:text-cream'
            )
            }>
            
              {({ isActive }) =>
            <>
                  {l.label}
                  {isActive &&
              <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-wine-bright" />
              }
                </>
            }
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => navigate('/tafuta')}
            aria-label="Tafuta"
            className="grid h-10 w-10 place-items-center rounded-full text-mist transition-colors duration-150 ease-kisa hover:bg-surface-raised hover:text-cream">
            
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <Link
            to="/zilizohifadhiwa"
            aria-label="Zilizohifadhiwa"
            className="hidden h-10 w-10 place-items-center rounded-full text-mist transition-colors duration-150 ease-kisa hover:bg-surface-raised hover:text-cream sm:grid">
            
            <BookmarkIcon className="h-[18px] w-[18px]" />
          </Link>

          {user ?
          <>
              <div className="relative">
                <button
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Taarifa"
                aria-expanded={notifOpen}
                className="relative grid h-10 w-10 place-items-center rounded-full text-mist transition-colors duration-150 ease-kisa hover:bg-surface-raised hover:text-cream">
                
                  <BellIcon className="h-[18px] w-[18px]" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-wine-bright ring-2 ring-ink" />
                </button>
                <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>
              <Link
              to="/akaunti"
              className="ml-1 flex items-center gap-2 rounded-full border border-line bg-surface-raised py-1 pl-1 pr-3.5 transition-colors duration-150 ease-kisa hover:border-mist/50">
              
                <span className="grid h-8 w-8 place-items-center rounded-full bg-wine font-display text-sm font-bold text-cream">
                  {user.name.charAt(0)}
                </span>
                <span className="hidden text-sm font-medium text-cream sm:inline">{user.name}</span>
              </Link>
            </> :

          <div className="ml-1 flex items-center gap-2">
              <ButtonLink to="/ingia" variant="ghost" size="sm">
                Ingia
              </ButtonLink>
              <ButtonLink to="/jisajili" size="sm">
                Jisajili
              </ButtonLink>
            </div>
          }
        </div>
      </div>
    </header>);

}