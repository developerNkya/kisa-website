import React from 'react';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import { StatsCard } from '../../components/admin/StatsCard';
import { SimpleBarChart } from '../../components/admin/Charts';
import { adminPayments, growthSeries } from '../../data/admin';
import { tzs } from '../../utils/format';

export function AdminPayments() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Payments</h1>
        <p className="mt-1 text-sm text-zinc-500">Miamala ya M-Pesa, Airtel Money, Mixx by Yas na HaloPesa</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatsCard label="Revenue mwezi huu" value="TZS 9,642,000" delta="+9.7%" emphasis />
        <StatsCard label="Total transactions" value="4,976" delta="+11.2%" />
        <StatsCard label="Average subscriber value" value="TZS 2,000" delta="0%" />
      </div>

      <AdminPanel title="Monthly revenue" description="Mapato ya miezi 7 (TZS)">
        <div className="p-4">
          <SimpleBarChart data={growthSeries} dataKey="revenue" xKey="month" color="#C42B53" height={250} />
        </div>
      </AdminPanel>

      <AdminPanel title="Transactions" description="Miamala ya hivi karibuni">
        <AdminTable columns={['Transaction ID', 'User', 'Amount', 'Date', 'Method', 'Status', 'Actions']}>
          {adminPayments.map((p) =>
          <tr key={p.id} className="hover:bg-zinc-900/50">
              <Td className="font-mono text-xs text-zinc-400">{p.id}</Td>
              <Td className="font-medium text-zinc-100">{p.user}</Td>
              <Td className="tabular-nums">{tzs(p.amount)}</Td>
              <Td className="text-zinc-500">{p.date}</Td>
              <Td>{p.method}</Td>
              <Td>
                <StatusPill status={p.status} />
              </Td>
              <Td>
                <RowActions actions={p.status === 'Failed' ? ['Retry', 'View'] : ['View', 'Receipt']} />
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}