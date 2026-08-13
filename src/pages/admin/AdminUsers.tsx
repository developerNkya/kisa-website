import React, { useState } from 'react';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import { StatsCard } from '../../components/admin/StatsCard';
import { adminUsers } from '../../data/admin';
import { cn } from '../../utils/cn';

const filters = ['All', 'Active', 'Expiring', 'Expired'] as const;

export function AdminUsers() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const rows = filter === 'All' ? adminUsers : adminUsers.filter((u) => u.status === filter);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Users</h1>
        <p className="mt-1 text-sm text-zinc-500">10,248 watumiaji · 4,821 wanachama wa Premium</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total users" value="10,248" delta="+8.4%" />
        <StatsCard label="Active subscribers" value="4,821" delta="+12.1%" />
        <StatsCard label="Expiring in 7 days" value="612" delta="+3.2%" up={false} />
        <StatsCard label="Expired" value="1,184" delta="-1.4%" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          aria-pressed={filter === f}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ease-kisa',
            filter === f ?
            'border-zinc-600 bg-zinc-800 text-zinc-50' :
            'border-zinc-800 text-zinc-400 hover:text-zinc-100'
          )}>
          
            {f}
          </button>
        )}
      </div>

      <AdminPanel title="All users">
        <AdminTable columns={['Name', 'Phone', 'Joined', 'Subscription', 'Expiry', 'Status', 'Actions']}>
          {rows.map((u) =>
          <tr key={u.phone} className="hover:bg-zinc-900/50">
              <Td className="font-medium text-zinc-100">{u.name}</Td>
              <Td>{u.phone}</Td>
              <Td className="text-zinc-500">{u.joined}</Td>
              <Td>
                <StatusPill status={u.plan} />
              </Td>
              <Td className="text-zinc-400">{u.expiry}</Td>
              <Td>
                <StatusPill status={u.status} />
              </Td>
              <Td>
                <RowActions
                actions={['View profile', 'Extend', 'Payments', 'Suspend']} />
              
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}