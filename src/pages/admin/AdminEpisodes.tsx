import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import { adminEpisodes } from '../../data/admin';

export function AdminEpisodes() {
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Episodes</h1>
          <p className="mt-1 text-sm text-zinc-500">Simamia sehemu za hadithi zote.</p>
        </div>
        <Link
          to="/admin/episodes/new"
          className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          
          <PlusIcon className="h-4 w-4" />
          Create episode
        </Link>
      </header>

      <AdminPanel title="Recent episodes">
        <AdminTable
          columns={['ID', 'Story', 'No.', 'Title', 'Reading time', 'Access', 'Status', 'Date', 'Actions']}>
          
          {adminEpisodes.map((e) =>
          <tr key={e.id} className="hover:bg-zinc-900/50">
              <Td className="text-zinc-500">{e.id}</Td>
              <Td className="font-medium text-zinc-100">{e.story}</Td>
              <Td className="tabular-nums">{e.number}</Td>
              <Td>{e.title}</Td>
              <Td className="tabular-nums">Dakika {e.minutes}</Td>
              <Td>
                <StatusPill status={e.access} />
              </Td>
              <Td>
                <StatusPill status={e.status} />
              </Td>
              <Td className="text-zinc-500">{e.date}</Td>
              <Td>
                <RowActions actions={['Edit', 'Preview', 'Publish']} />
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}