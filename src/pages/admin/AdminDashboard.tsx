import React from 'react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../../components/admin/StatsCard';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import {
  CategoryPieChart,
  DualLineChart,
  GrowthAreaChart,
  SimpleBarChart } from
'../../components/admin/Charts';
import {
  adminStats,
  adminStories,
  categorySplit,
  growthSeries,
  readingSeries,
  topStories } from
'../../data/admin';
import { compact } from '../../utils/format';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Muhtasari wa KISA — Agosti 2026</p>
        </div>
        <Link
          to="/admin/stories/new"
          className="rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          
          Create story
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {adminStats.map((s, i) =>
        <StatsCard key={s.label} {...s} emphasis={i === 2} />
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <AdminPanel title="Revenue" description="Mapato ya usajili kwa mwezi (TZS)">
          <div className="p-4">
            <GrowthAreaChart data={growthSeries} dataKey="revenue" height={260} />
          </div>
        </AdminPanel>

        <AdminPanel title="New users vs subscribers" description="Ukuaji wa miezi 7">
          <div className="p-4">
            <DualLineChart data={growthSeries} height={260} />
            <div className="mt-3 flex gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gold" /> Users
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-wine-bright" /> Subscribers
              </span>
            </div>
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminPanel title="Story views" description="Kwa siku ya wiki" className="lg:col-span-2">
          <div className="p-4">
            <SimpleBarChart data={readingSeries} dataKey="views" xKey="day" />
          </div>
        </AdminPanel>

        <AdminPanel title="Popular categories" description="Sehemu zilizosomwa (%)">
          <div className="p-4">
            <CategoryPieChart data={categorySplit} />
            <ul className="mt-2 space-y-1.5 text-xs text-zinc-400">
              {categorySplit.map((c) =>
              <li key={c.name} className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="tabular-nums text-zinc-200">{c.value}%</span>
                </li>
              )}
            </ul>
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <AdminPanel
          title="Recent stories"
          description="Hadithi zilizoongezwa au kuhaririwa hivi karibuni"
          actions={
          <Link to="/admin/stories" className="text-xs font-semibold text-amber-300 hover:text-amber-200">
              View all
            </Link>
          }>
          
          <AdminTable columns={['Title', 'Category', 'Episodes', 'Status', 'Views', 'Actions']}>
            {adminStories.slice(0, 5).map((s) =>
            <tr key={s.id} className="hover:bg-zinc-900/50">
                <Td className="font-medium text-zinc-100">{s.title}</Td>
                <Td>{s.category}</Td>
                <Td className="tabular-nums">{s.episodes}</Td>
                <Td>
                  <StatusPill status={s.status} />
                </Td>
                <Td className="tabular-nums">{compact(s.views)}</Td>
                <Td>
                  <RowActions actions={['View', 'Edit']} />
                </Td>
              </tr>
            )}
          </AdminTable>
        </AdminPanel>

        <AdminPanel title="Most read stories" description="Views na completion rate">
          <ul className="divide-y divide-zinc-800/70">
            {topStories.map((s, i) =>
            <li key={s.title} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <span className="w-5 font-display text-sm font-bold text-zinc-600">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-100">{s.title}</span>
                  <span className="text-xs text-zinc-500">{compact(s.views)} views</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-amber-300">{s.completion}%</span>
              </li>
            )}
          </ul>
        </AdminPanel>
      </div>
    </div>);

}