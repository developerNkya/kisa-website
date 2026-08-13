import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import { adminStories } from '../../data/admin';
import { compact } from '../../utils/format';
import { cn } from '../../utils/cn';

const filters = ['All', 'Published', 'Draft', 'Scheduled'] as const;

export function AdminStories() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const rows = filter === 'All' ? adminStories : adminStories.filter((s) => s.status === filter);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Stories</h1>
          <p className="mt-1 text-sm text-zinc-500">{adminStories.length} stories · 2,184 episodes</p>
        </div>
        <Link
          to="/admin/stories/new"
          className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          
          <PlusIcon className="h-4 w-4" />
          Create story
        </Link>
      </header>

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

      <AdminPanel title="All stories" description="Simamia hadithi, sehemu na hali ya kuchapishwa">
        <AdminTable
          columns={['Title', 'Category', 'Episodes', 'Status', 'Views', 'Created', 'Actions']}>
          
          {rows.map((s) =>
          <tr key={s.id} className="hover:bg-zinc-900/50">
              <Td className="font-medium text-zinc-100">
                {s.title}
                <span className="ml-2 text-xs text-zinc-600">{s.id}</span>
              </Td>
              <Td>{s.category}</Td>
              <Td className="tabular-nums">{s.episodes}</Td>
              <Td>
                <StatusPill status={s.status} />
              </Td>
              <Td className="tabular-nums">{compact(s.views)}</Td>
              <Td className="text-zinc-500">{s.created}</Td>
              <Td>
                <RowActions
                actions={[
                'View',
                'Edit',
                'Manage Episodes',
                s.status === 'Published' ? 'Unpublish' : 'Publish']
                } />
              
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}