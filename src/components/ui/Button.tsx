import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-kisa active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-wine text-cream hover:bg-wine-bright shadow-[0_6px_20px_-8px_rgba(155,27,59,0.9)]',
  secondary: 'bg-surface-high text-cream border border-line hover:border-mist/50 hover:bg-surface-high/80',
  ghost: 'text-mist hover:text-cream hover:bg-surface-raised',
  gold: 'bg-gold text-ink hover:bg-gold/90',
  danger: 'bg-red-900 text-cream hover:bg-red-800'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-[15px]'
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
    </button>);

}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & {to: string;} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link to={to} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>);

}