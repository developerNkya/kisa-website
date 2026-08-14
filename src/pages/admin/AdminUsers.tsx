import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon, SearchIcon, ShieldIcon } from 'lucide-react';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

export function AdminUsers() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [isAdmin]);

  async function loadUsers() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const toggleRole = async (user: any) => {
    if (!window.confirm(`Are you sure you want to change ${user.full_name}'s role?`)) return;
    const newRole = user.role === 'admin' ? 'reader' : 'admin';
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
      if (error) throw error;
      toast.success(`Role updated to ${newRole}`);
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  const filtered = users.filter(u => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (u.full_name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Users</h1>
          <p className="mt-1 text-sm text-zinc-500">{users.length} registered users</p>
        </div>
        <div className="relative max-w-sm w-full sm:w-64">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </header>

      <AdminPanel title="All users" description="Simamia akaunti za wasomaji na admins">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions']}>
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/50">
                <Td className="font-medium text-zinc-100">{u.full_name || 'No Name'}</Td>
                <Td>{u.email}</Td>
                <Td>{u.phone || '-'}</Td>
                <Td>
                  <span className="inline-flex items-center gap-1">
                    {u.role === 'admin' && <ShieldIcon className="h-3 w-3 text-amber-500" />}
                    <StatusPill status={u.role === 'admin' ? 'Premium' : 'Free'} />
                  </span>
                </Td>
                <Td className="text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</Td>
                <Td>
                  <button onClick={() => toggleRole(u)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><Td colSpan={6} className="text-center py-4">No users found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>
    </div>
  );
}