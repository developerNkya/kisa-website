import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { AdminPanel, AdminTable, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

export function AdminSubscriptions() {
  const { isAdmin } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, [isAdmin]);

  async function loadPurchases() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('story_purchases')
        .select('*, profiles(full_name, email), stories(title, price)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const totalAmount = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Book Purchases</h1>
          <p className="mt-1 text-sm text-zinc-500">{purchases.length} book purchases total</p>
        </div>
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sales Volume</p>
          <p className="font-display text-xl font-bold text-amber-400">TZS {totalAmount.toLocaleString()}</p>
        </div>
      </header>

      <AdminPanel title="Purchased Books" description="Wasomaji walionunua hadithi">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['User', 'Story / Book', 'Amount Paid', 'Purchase Date']}>
            {purchases.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/50">
                <Td>
                  <div className="font-medium text-zinc-100">{p.profiles?.full_name || 'Unknown'}</div>
                  <div className="text-xs text-zinc-500">{p.profiles?.email}</div>
                </Td>
                <Td>
                  <span className="font-semibold text-zinc-200">{p.stories?.title || 'Story'}</span>
                </Td>
                <Td className="tabular-nums font-semibold text-gold">TZS {(p.amount || 0).toLocaleString()}</Td>
                <Td className="text-zinc-500 text-xs">{new Date(p.created_at).toLocaleString()}</Td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr><Td colSpan={4} className="text-center py-4">No purchases found yet</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>
    </div>
  );
}