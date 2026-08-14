import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

const filters = ['All', 'Active', 'Expired', 'Trial', 'Cancelled'] as const;

export function AdminSubscriptions() {
  const { isAdmin } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  useEffect(() => {
    loadSubscriptions();
  }, [isAdmin]);

  async function loadSubscriptions() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const filtered = subscriptions.filter(s => {
    if (filter === 'All') return true;
    return s.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Subscriptions</h1>
          <p className="mt-1 text-sm text-zinc-500">{subscriptions.length} subscriptions total</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
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
        ))}
      </div>

      <AdminPanel title="All subscriptions" description="Tazama hali za vifurushi vya wasomaji">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['User', 'Plan', 'Status', 'Start Date', 'Expiry Date', 'Amount']}>
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/50">
                <Td>
                  <div className="font-medium text-zinc-100">{s.profiles?.full_name || 'Unknown'}</div>
                  <div className="text-xs text-zinc-500">{s.profiles?.email}</div>
                </Td>
                <Td>
                  {s.is_trial ? 'Trial' : 'Premium'}
                </Td>
                <Td>
                  <StatusPill status={s.status.charAt(0).toUpperCase() + s.status.slice(1)} />
                </Td>
                <Td className="text-zinc-500">{new Date(s.start_date).toLocaleDateString()}</Td>
                <Td className="text-zinc-500">{new Date(s.expiry_date).toLocaleDateString()}</Td>
                <Td className="tabular-nums text-zinc-300">TZS {(s.amount || 0).toLocaleString()}</Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><Td colSpan={6} className="text-center py-4">No subscriptions found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>
    </div>
  );
}