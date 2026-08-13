import React, { useState } from 'react';
import { toast } from 'sonner';
import { AdminPanel } from '../../components/admin/AdminTable';
import { cn } from '../../utils/cn';

const inputClass =
'w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500';

export function AdminSettings() {
  const [price, setPrice] = useState('2000');
  const [freeEpisodes, setFreeEpisodes] = useState('3');
  const [toggles, setToggles] = useState({ signups: true, maintenance: false, autoPublish: true });

  const rows: {key: keyof typeof toggles;label: string;hint: string;}[] = [
  { key: 'signups', label: 'Allow new signups', hint: 'Wageni wapya wanaweza kufungua akaunti.' },
  { key: 'maintenance', label: 'Maintenance mode', hint: 'Tovuti inaonyesha ujumbe wa matengenezo.' },
  { key: 'autoPublish', label: 'Auto-publish scheduled episodes', hint: 'Sehemu zinajichapisha kwa muda uliowekwa.' }];


  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Mipangilio ya jukwaa la KISA</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        <AdminPanel title="Subscription" description="Bei na sehemu za bure">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success('Settings saved');
            }}
            className="space-y-4 p-4 sm:p-5">
            
            <div>
              <label htmlFor="price" className={labelClass}>
                Monthly price (TZS)
              </label>
              <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="free-eps" className={labelClass}>
                Free episodes per premium story
              </label>
              <input
                id="free-eps"
                value={freeEpisodes}
                onChange={(e) => setFreeEpisodes(e.target.value)}
                className={inputClass} />
              
            </div>
            <button
              type="submit"
              className="rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
              
              Save settings
            </button>
          </form>
        </AdminPanel>

        <AdminPanel title="Platform" description="Hali ya jukwaa">
          <ul className="divide-y divide-zinc-800/70">
            {rows.map((r) =>
            <li key={r.key} className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
                <span>
                  <span className="block text-sm font-medium text-zinc-100">{r.label}</span>
                  <span className="block text-xs text-zinc-500">{r.hint}</span>
                </span>
                <button
                role="switch"
                aria-checked={toggles[r.key]}
                aria-label={r.label}
                onClick={() => setToggles((t) => ({ ...t, [r.key]: !t[r.key] }))}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-kisa',
                  toggles[r.key] ? 'bg-emerald-600' : 'bg-zinc-700'
                )}>
                
                  <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150 ease-kisa',
                    toggles[r.key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )} />
                
                </button>
              </li>
            )}
          </ul>
        </AdminPanel>
      </div>
    </div>);

}