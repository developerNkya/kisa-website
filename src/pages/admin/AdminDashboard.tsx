import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { StatsCard } from '../../components/admin/StatsCard';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { Loader2Icon } from 'lucide-react';

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 0,
    totalUsers: 0,
    booksSold: 0,
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
          { count: purchasesCount },
          { data: transactions },
          { data: latestUsers },
          { data: latestTransactions }
        ] = await Promise.all([
          supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('story_purchases').select('*', { count: 'exact', head: true }),
          supabase.from('subscription_transactions').select('amount')
            .eq('status', 'completed')
            .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('subscription_transactions').select('*, profiles(full_name), stories(title)').order('created_at', { ascending: false }).limit(5)
        ]);

        const revenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        setStats({
          totalStories: storiesCount || 0,
          totalUsers: usersCount || 0,
          booksSold: purchasesCount || 0,
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
    { label: 'Total Readers', value: stats.totalUsers.toString(), trend: '+0%', up: true },
    { label: 'Books Sold', value: stats.booksSold.toString(), trend: '+0%', up: true },
    { label: 'Monthly Revenue', value: `TZS ${stats.monthlyRevenue.toLocaleString()}`, trend: '+0%', up: true },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Muhtasari wa mauzo na hadithi za KISA</p>
        </div>
        <Link
          to="/admin/stories/new"
          className="rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          Create story
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s, i) => (
          <StatsCard key={s.label} {...s} emphasis={i === 2 || i === 3} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminPanel
          title="Recent Sign-ups"
          description="Wasomaji wapya waliojiunga"
          actions={
            <Link to="/admin/users" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
              View all
            </Link>
          }>
          <AdminTable columns={['User', 'Role', 'Joined Date']}>
            {recentUsers.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/50">
                <Td>
                  <div className="font-medium text-zinc-100">{u.full_name}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </Td>
                <Td>
                  <StatusPill status={u.role === 'admin' ? 'Premium' : 'Free'} />
                </Td>
                <Td className="text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</Td>
              </tr>
            ))}
            {recentUsers.length === 0 && (
              <tr><Td colSpan={3} className="text-center py-4">No users found</Td></tr>
            )}
          </AdminTable>
        </AdminPanel>

        <AdminPanel
          title="Latest Transactions"
          description="Miamala ya hivi karibuni ya ununuzi"
          actions={
            <Link to="/admin/payments" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
              View all
            </Link>
          }>
          <AdminTable columns={['Customer', 'Story', 'Amount', 'Status']}>
            {recentTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/50">
                <Td>
                  <div className="font-medium text-zinc-100">{t.profiles?.full_name || t.customer_name || 'Customer'}</div>
                  <div className="text-xs text-zinc-500 font-mono">{t.reference}</div>
                </Td>
                <Td>
                  <span className="text-zinc-200 text-xs">{t.stories?.title || 'Story'}</span>
                </Td>
                <Td className="tabular-nums font-semibold text-gold">TZS {(t.amount || 0).toLocaleString()}</Td>
                <Td>
                  <StatusPill status={t.status === 'completed' ? 'Successful' : t.status === 'pending' ? 'Pending' : 'Failed'} />
                </Td>
              </tr>
            ))}
            {recentTransactions.length === 0 && (
              <tr><Td colSpan={4} className="text-center py-4">No transactions found</Td></tr>
            )}
          </AdminTable>
        </AdminPanel>
      </div>
    </div>
  );
}