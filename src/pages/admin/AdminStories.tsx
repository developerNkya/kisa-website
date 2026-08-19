import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PlusIcon, Loader2Icon } from 'lucide-react';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { compact } from '../../utils/format';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

const filters = ['All', 'Published', 'Draft', 'Archived'] as const;

export function AdminStories() {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStories();
  }, [isAdmin]);

  async function loadStories() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          authors(name),
          categories(name),
          episodes(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Story deleted');
      setStories(stories.filter(s => s.id !== id));
    } catch (err) {
      toast.error('Failed to delete story');
    }
  };

  const toggleStatus = async (story: any) => {
    const newStatus = story.status === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase.from('stories').update({ status: newStatus }).eq('id', story.id);
      if (error) throw error;
      toast.success(`Story ${newStatus}`);
      setStories(stories.map(s => s.id === story.id ? { ...s, status: newStatus } : s));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  const filtered = stories.filter(s => {
    if (filter !== 'All' && s.status !== filter.toLowerCase()) return false;
    if (searchTerm) {
      return s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             s.authors?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Stories</h1>
          <p className="mt-1 text-sm text-zinc-500">{stories.length} stories total</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="h-9 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
          />
          <Link
            to="/admin/stories/new"
            className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
            <PlusIcon className="h-4 w-4" />
            Create story
          </Link>
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

      <AdminPanel title="All stories" description="Simamia hadithi, bei, sehemu na hali ya kuchapishwa">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['Cover & Title', 'Author & Category', 'Price', 'Episodes', 'Status', 'Views', 'Actions']}>
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/50">
                <Td>
                  <div className="flex items-center gap-3">
                    {s.cover_url && (
                      <img src={s.cover_url} alt="" className="h-10 w-7 rounded object-cover" />
                    )}
                    <span className="font-medium text-zinc-100">{s.title}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <span className="text-zinc-100">{s.authors?.name}</span>
                    <span className="text-xs text-zinc-500">{s.categories?.name}</span>
                  </div>
                </Td>
                <Td className="tabular-nums font-semibold text-gold">
                  {s.price > 0 ? `TZS ${(s.price || 1000).toLocaleString()}` : 'Bure'}
                </Td>
                <Td className="tabular-nums">{s.episodes?.[0]?.count || 0}</Td>
                <Td>
                  <StatusPill status={s.status.charAt(0).toUpperCase() + s.status.slice(1)} />
                </Td>
                <Td className="tabular-nums">{compact(s.total_reads || 0)}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <Link to={`/hadithi/${s.slug}`} target="_blank" className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">View</Link>
                    <button onClick={() => toggleStatus(s)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">
                      {s.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:border-red-500 hover:text-red-300">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><Td colSpan={7} className="text-center py-4">No stories found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>
    </div>
  );
}