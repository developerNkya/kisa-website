import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-kisa active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-[#9B1B3B] text-white hover:bg-[#C42B53] shadow-[0_6px_20px_-8px_rgba(155,27,59,0.4)]',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300',
  ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
  gold: 'bg-[#C9A24A] text-white hover:bg-[#D4B05A] shadow-[0_6px_20px_-8px_rgba(201,162,74,0.4)]',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-[0_6px_20px_-8px_rgba(220,38,38,0.4)]',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-[15px]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & { to: string; } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link to={to} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}