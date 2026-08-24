import React from 'react';
import { cn } from '../../utils/cn';

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  isLight?: boolean;
}

export function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
  error,
  required,
  isLight = true,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={cn(
        'mb-1.5 block text-[13px] font-medium',
        isLight ? 'text-gray-700' : 'text-mist'
      )}>
        {label}
        {!required && <span className={cn('ml-1.5', isLight ? 'text-gray-400' : 'text-dust')}>(si lazima)</span>}
        {required && <span className="text-[#9B1B3B] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-12 w-full rounded-xl border px-4 text-[15px] transition-colors duration-150 ease-kisa focus:outline-none focus:ring-2',
          isLight 
            ? 'bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-[#9B1B3B] focus:ring-[#9B1B3B]/20'
            : 'bg-surface text-cream placeholder:text-dust border-line focus:border-gold/50 focus:ring-gold/20',
          error ? (
            isLight 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-wine-bright focus:border-wine-bright focus:ring-wine-bright/20'
          ) : ''
        )}
      />
      
      {error ? (
        <p id={`${id}-error`} className={cn(
          'mt-1.5 text-xs',
          isLight ? 'text-red-500' : 'text-wine-bright'
        )}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={cn(
          'mt-1.5 text-xs',
          isLight ? 'text-gray-400' : 'text-dust'
        )}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}