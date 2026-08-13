import React from 'react';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import { GrowthAreaChart } from '../../components/admin/Charts';
import { adminUsers, growthSeries, subscriptionBuckets } from '../../data/admin';
import { cn } from '../../utils/cn';

export function AdminSubscriptions() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Subscriptions</h1>
        <p className="mt-1 text-sm text-zinc-500">KISA Premium — TZS 2,000 / mwezi</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {subscriptionBuckets.map((b) =>
        <div key={b.label} className="rounded-lg border border-zinc-800 bg-[#131415] p-4">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                b.tone === 'green' && 'bg-emerald-400',
                b.tone === 'gold' && 'bg-amber-400',
                b.tone === 'red' && 'bg-red-400',
                b.tone === 'neutral' && 'bg-zinc-500'
              )} />
            
              {b.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-zinc-50">
              {b.value.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <AdminPanel title="Subscriber growth" description="Wanachama hai kwa mwezi">
          <div className="p-4">
            <GrowthAreaChart data={growthSeries} dataKey="subscribers" color="#C9A24A" height={250} />
          </div>
        </AdminPanel>

        <AdminPanel title="Renewal rate" description="Wanachama waliolipia mwezi mwingine">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative grid h-40 w-40 place-items-center rounded-full border-[10px] border-zinc-800">
              <div
                className="absolute inset-[-10px] rounded-full"
                style={{
                  background: `conic-gradient(#C42B53 0% 72%, transparent 72% 100%)`,
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 10px))',
                  WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 10px))'
                }}
                aria-hidden="true" />
              
              <span className="font-display text-3xl font-bold text-zinc-50">72%</span>
            </div>
            <p className="mt-5 text-center text-sm text-zinc-400">
              Renewal Rate — Agosti 2026
              <span className="mt-1 block text-xs text-emerald-400">+3.4% vs Julai</span>
            </p>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Subscriptions" description="Wanachama na tarehe ya kuisha">
        <AdminTable columns={['User', 'Phone', 'Plan', 'Started', 'Expiry', 'Status', 'Actions']}>
          {adminUsers.map((u) =>
          <tr key={u.phone} className="hover:bg-zinc-900/50">
              <Td className="font-medium text-zinc-100">{u.name}</Td>
              <Td>{u.phone}</Td>
              <Td>
                <StatusPill status={u.plan} />
              </Td>
              <Td className="text-zinc-500">{u.joined}</Td>
              <Td className="text-zinc-400">{u.expiry}</Td>
              <Td>
                <StatusPill status={u.status} />
              </Td>
              <Td>
                <RowActions actions={['Extend', 'Cancel']} />
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}