import React from 'react';
import { cn } from '../../utils/cn';

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
  required











}: {label: string;id: string;type?: string;value: string;onChange: (v: string) => void;placeholder?: string;autoComplete?: string;hint?: string;error?: string;required?: boolean;}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-mist">
        {label}
        {!required && <span className="ml-1.5 text-dust">(si lazima)</span>}
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
          'h-12 w-full rounded-xl border bg-surface px-4 text-[15px] text-cream placeholder:text-dust transition-colors duration-150 ease-kisa focus:outline-none',
          error ? 'border-wine-bright' : 'border-line focus:border-gold/50'
        )} />
      
      {error ?
      <p id={`${id}-error`} className="mt-1.5 text-xs text-wine-bright">
          {error}
        </p> :
      hint ?
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-dust">
          {hint}
        </p> :
      null}
    </div>);

}