import React from 'react';
import { AdminPanel } from '../../components/admin/AdminTable';
import { StatsCard } from '../../components/admin/StatsCard';
import {
  CategoryPieChart,
  DualLineChart,
  RetentionLineChart,
  SimpleBarChart } from
'../../components/admin/Charts';
import {
  analyticsKpis,
  categorySplit,
  growthSeries,
  readingSeries,
  retentionSeries,
  topStories } from
'../../data/admin';
import { compact } from '../../utils/format';

export function AdminAnalytics() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">Matumizi, ukuaji na tabia za wasomaji</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsKpis.map((k) =>
        <StatsCard key={k.label} label={k.label} value={k.value} delta={k.delta} />
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminPanel title="Users vs subscribers" description="Ukuaji wa miezi 7">
          <div className="p-4">
            <DualLineChart data={growthSeries} height={250} />
          </div>
        </AdminPanel>

        <AdminPanel title="Reading time" description="Dakika za kusoma kwa siku ya wiki">
          <div className="p-4">
            <SimpleBarChart data={readingSeries} dataKey="minutes" xKey="day" height={250} />
          </div>
        </AdminPanel>

        <AdminPanel title="User retention" description="Wasomaji wanaorudi kila wiki">
          <div className="p-4">
            <RetentionLineChart data={retentionSeries} height={250} />
          </div>
        </AdminPanel>

        <AdminPanel title="Popular categories" description="Mgawanyo wa sehemu zilizosomwa">
          <div className="grid gap-4 p-4 sm:grid-cols-[1fr_140px] sm:items-center">
            <CategoryPieChart data={categorySplit} height={250} />
            <ul className="space-y-2 text-xs text-zinc-400">
              {categorySplit.map((c) =>
              <li key={c.name} className="flex justify-between gap-3">
                  <span>{c.name}</span>
                  <span className="tabular-nums text-zinc-200">{c.value}%</span>
                </li>
              )}
            </ul>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Most viewed & completed stories" description="Views na completion rate">
        <ul className="divide-y divide-zinc-800/70">
          {topStories.map((s, i) =>
          <li key={s.title} className="flex items-center gap-4 px-4 py-4 sm:px-5">
              <span className="w-5 font-display text-sm font-bold text-zinc-600">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-100">{s.title}</span>
                <span className="text-xs text-zinc-500">{compact(s.views)} views</span>
              </span>
              <span className="w-40 shrink-0">
                <span className="mb-1 block text-right text-xs tabular-nums text-amber-300">
                  {s.completion}% completion
                </span>
                <span className="block h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <span
                  className="block h-full rounded-full bg-amber-400"
                  style={{ width: `${s.completion}%` }} />
                
                </span>
              </span>
            </li>
          )}
        </ul>
      </AdminPanel>
    </div>);

}