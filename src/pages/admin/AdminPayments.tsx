import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon, ExternalLinkIcon } from 'lucide-react';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

export function AdminPayments() {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [isAdmin]);

  async function loadTransactions() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('subscription_transactions')
        .select('*, profiles(full_name, email), stories(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Payments & Book Sales</h1>
          <p className="mt-1 text-sm text-zinc-500">Miamala na mauzo ya hadithi</p>
        </div>
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Revenue</p>
          <p className="font-display text-xl font-bold text-amber-400">TZS {totalRevenue.toLocaleString()}</p>
        </div>
      </header>

      <AdminPanel title="All Transactions" description="Rekodi za malipo ya hadithi">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['Reference', 'Customer', 'Story / Item', 'Amount', 'Status', 'Date', 'Receipt']}>
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/50">
                <Td className="font-mono text-xs text-zinc-400">{t.reference}</Td>
                <Td>
                  <div className="font-medium text-zinc-100">{t.profiles?.full_name || t.customer_name || 'Unknown'}</div>
                  <div className="text-xs text-zinc-500">{t.profiles?.email || t.customer_email || '-'}</div>
                </Td>
                <Td>
                  <span className="font-medium text-zinc-200">
                    {t.stories?.title || 'Hadithi ya KISA'}
                  </span>
                </Td>
                <Td className="tabular-nums font-semibold text-gold">TZS {(t.amount || 0).toLocaleString()}</Td>
                <Td>
                  <StatusPill status={t.status === 'completed' ? 'Successful' : t.status === 'pending' ? 'Pending' : 'Failed'} />
                </Td>
                <Td className="text-zinc-500 text-xs">{new Date(t.created_at).toLocaleString()}</Td>
                <Td>
                  {t.payment_url ? (
                    <a href={t.payment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300">
                      <ExternalLinkIcon className="h-3 w-3" />
                      <span className="text-xs">Link</span>
                    </a>
                  ) : '-'}
                </Td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><Td colSpan={7} className="text-center py-4">No transactions found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>
    </div>
  );
}