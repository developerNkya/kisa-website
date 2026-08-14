import React from 'react';
import { cn } from '../../utils/cn';

export function AdminPanel({
  title,
  description,
  actions,
  children,
  className






}: {title: string;description?: string;actions?: React.ReactNode;children: React.ReactNode;className?: string;}) {
  return (
    <section className={cn('rounded-lg border border-zinc-800 bg-[#131415]', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="font-display text-base font-bold text-zinc-50">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>);

}

export function AdminTable({
  columns,
  children



}: {columns: string[];children: React.ReactNode;}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {columns.map((c) =>
            <th
              key={c}
              scope="col"
              className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500 sm:px-5">
              
                {c}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/70">{children}</tbody>
      </table>
    </div>);

}

export function Td({ children, className, colSpan, ...props }: {children: React.ReactNode;className?: string;colSpan?: number;} & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td colSpan={colSpan} className={cn('whitespace-nowrap px-4 py-3.5 text-zinc-300 sm:px-5', className)} {...props}>{children}</td>;
}

export function StatusPill({ status }: {status: string;}) {
  const map: Record<string, string> = {
    Published: 'bg-emerald-500/15 text-emerald-300',
    Active: 'bg-emerald-500/15 text-emerald-300',
    Successful: 'bg-emerald-500/15 text-emerald-300',
    Draft: 'bg-amber-500/15 text-amber-300',
    Pending: 'bg-amber-500/15 text-amber-300',
    Expiring: 'bg-amber-500/15 text-amber-300',
    Scheduled: 'bg-sky-500/15 text-sky-300',
    Failed: 'bg-red-500/15 text-red-300',
    Expired: 'bg-red-500/15 text-red-300',
    Premium: 'bg-amber-500/15 text-amber-300',
    Free: 'bg-zinc-700/50 text-zinc-300'
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        map[status] ?? 'bg-zinc-700/50 text-zinc-300'
      )}>
      
      {status}
    </span>);

}

export function RowActions({ actions }: {actions: string[];}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((a) =>
      <button
        key={a}
        className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors duration-150 ease-kisa hover:border-zinc-500 hover:text-zinc-50">
        
          {a}
        </button>
      )}
    </div>);

}