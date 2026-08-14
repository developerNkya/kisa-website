import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { StatsCard } from '../../components/admin/StatsCard';
import { AdminPanel, AdminTable, RowActions, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { compact } from '../../utils/format';
import { Loader2Icon } from 'lucide-react';

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 0,
    totalUsers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!isAdmin) return;
      try {
        const [
          { count: storiesCount },
          { count: usersCount },
          { count: subsCount },
          { data: transactions },
          { data: latestUsers },
          { data: latestTransactions }
        ] = await Promise.all([
          supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('subscriptions').select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .gte('expiry_date', new Date().toISOString()),
          supabase.from('subscription_transactions').select('amount')
            .eq('status', 'completed')
            .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('subscription_transactions').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(5)
        ]);

        const revenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        setStats({
          totalStories: storiesCount || 0,
          totalUsers: usersCount || 0,
          activeSubscribers: subsCount || 0,
          monthlyRevenue: revenue
        });
        
        setRecentUsers(latestUsers || []);
        setRecentTransactions(latestTransactions || []);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-wine" />
      </div>
    );
  }

  const statCards = [
    { label: 'Published Stories', value: stats.totalStories.toString(), trend: '+0%', up: true },
    { label: 'Total Users', value: stats.totalUsers.toString(), trend: '+0%', up: true },
    { label: 'Active Subscribers', value: stats.activeSubscribers.toString(), trend: '+0%', up: true },
    { label: 'Monthly Revenue', value: `TZS ${stats.monthlyRevenue.toLocaleString()}`, trend: '+0%', up: true },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Muhtasari wa KISA</p>
        </div>
        <Link
          to="/admin/stories/new"
          className="rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          Create story
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s, i) => (
          <StatsCard key={s.label} {...s} emphasis={i === 2} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <AdminPanel
          title="Recent Transactions"
          description="Malipo ya hivi karibuni"
          actions={
            <Link to="/admin/payments" className="text-xs font-semibold text-amber-300 hover:text-amber-200">
              View all
            </Link>
          }>
          <AdminTable columns={['Reference', 'User', 'Amount', 'Status', 'Date']}>
            {recentTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/50">
                <Td className="font-medium text-zinc-100">{t.reference}</Td>
                <Td>{t.profiles?.full_name || t.customer_name || 'Unknown'}</Td>
                <Td className="tabular-nums">TZS {t.amount.toLocaleString()}</Td>
                <Td>
                  <StatusPill status={t.status === 'completed' ? 'Successful' : t.status === 'pending' ? 'Pending' : 'Failed'} />
                </Td>
                <Td className="text-zinc-500">{new Date(t.created_at).toLocaleDateString()}</Td>
              </tr>
            ))}
            {recentTransactions.length === 0 && (
              <tr>
                <Td className="text-center text-zinc-500 py-4" colSpan={5}>Hakuna miamala</Td>
              </tr>
            )}
          </AdminTable>
        </AdminPanel>

        <AdminPanel 
          title="Latest Users" 
          description="Watumiaji wapya waliojiunga"
          actions={
            <Link to="/admin/users" className="text-xs font-semibold text-amber-300 hover:text-amber-200">
              View all
            </Link>
          }>
          <ul className="divide-y divide-zinc-800/70">
            {recentUsers.map((u, i) => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <span className="w-5 font-display text-sm font-bold text-zinc-600">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-100">{u.full_name || 'No Name'}</span>
                  <span className="text-xs text-zinc-500">{u.email}</span>
                </span>
                <span className="shrink-0 text-xs text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</span>
              </li>
            ))}
            {recentUsers.length === 0 && (
              <li className="px-4 py-3.5 sm:px-5 text-center text-sm text-zinc-500">
                Hakuna watumiaji wapya
              </li>
            )}
          </ul>
        </AdminPanel>
      </div>
    </div>
  );
}