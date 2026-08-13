import React from 'react';
import { PlusIcon } from 'lucide-react';
import { AdminPanel, AdminTable, RowActions, Td } from '../../components/admin/AdminTable';
import { categoryMeta, stories } from '../../data/stories';
import { Story } from '../../types';

export function AdminCategories() {
  const rows = Object.entries(categoryMeta).map(([key, meta]) => {
    const list: Story[] = stories.filter((s) => s.genres.includes(key as Story['genres'][number]));
    return {
      key,
      blurb: meta.blurb,
      count: list.length,
      episodes: list.reduce((sum, s) => sum + s.episodes.length, 0)
    };
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">Makundi yanayotumika kwenye tovuti</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
          <PlusIcon className="h-4 w-4" />
          Add category
        </button>
      </header>

      <AdminPanel title="All categories">
        <AdminTable columns={['Category', 'Description', 'Stories', 'Episodes', 'Actions']}>
          {rows.map((r) =>
          <tr key={r.key} className="hover:bg-zinc-900/50">
              <Td className="font-medium text-zinc-100">{r.key}</Td>
              <Td className="max-w-[320px] truncate text-zinc-400">{r.blurb}</Td>
              <Td className="tabular-nums">{r.count}</Td>
              <Td className="tabular-nums">{r.episodes}</Td>
              <Td>
                <RowActions actions={['Edit', 'View page']} />
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}