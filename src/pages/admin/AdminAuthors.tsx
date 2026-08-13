import React from 'react';
import { PlusIcon } from 'lucide-react';
import { AdminPanel, AdminTable, RowActions, Td } from '../../components/admin/AdminTable';
import { authors } from '../../data/stories';
import { compact } from '../../utils/format';

export function AdminAuthors() {
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Authors</h1>
          <p className="mt-1 text-sm text-zinc-500">Waandishi {authors.length} wanaochapisha kwenye KISA</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
          <PlusIcon className="h-4 w-4" />
          Add author
        </button>
      </header>

      <AdminPanel title="All authors">
        <AdminTable columns={['Name', 'City', 'Stories', 'Total reads', 'Actions']}>
          {authors.map((a) =>
          <tr key={a.id} className="hover:bg-zinc-900/50">
              <Td className="font-medium text-zinc-100">
                <span className="inline-flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded bg-zinc-800 text-xs font-bold text-zinc-200">
                    {a.name.charAt(0)}
                  </span>
                  {a.name}
                </span>
              </Td>
              <Td>{a.city}</Td>
              <Td className="tabular-nums">{a.stories}</Td>
              <Td className="tabular-nums">{compact(a.reads)}</Td>
              <Td>
                <RowActions actions={['View', 'Edit', 'Stories']} />
              </Td>
            </tr>
          )}
        </AdminTable>
      </AdminPanel>
    </div>);

}