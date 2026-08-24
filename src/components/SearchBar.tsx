import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Tafuta hadithi, mwandishi au aina...',
  autoFocus = false,
  size = 'md',
  className,
  onSubmit








}: {value: string;onChange: (v: string) => void;placeholder?: string;autoFocus?: boolean;size?: 'md' | 'lg';className?: string;onSubmit?: () => void;}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn('relative w-full', className)}>
      
      <SearchIcon
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true" />
      
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-11 text-gray-900 placeholder:text-gray-400 transition-colors duration-150 ease-kisa focus:bg-white focus:border-[#9B1B3B]/50 focus:outline-none',
          size === 'lg' ? 'h-14 text-base' : 'h-11 text-sm'
        )} />
      
      {value &&
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Safisha utafutaji"
        className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-gray-400 transition-colors duration-150 ease-kisa hover:bg-gray-200 hover:text-gray-900">
        
          <XIcon className="h-4 w-4" />
        </button>
      }
    </form>);

}