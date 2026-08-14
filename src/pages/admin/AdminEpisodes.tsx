import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PlusIcon, Loader2Icon, YoutubeIcon } from 'lucide-react';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

export function AdminEpisodes() {
  const { isAdmin } = useAuth();
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStory, setFilterStory] = useState('All');

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  async function loadData() {
    if (!isAdmin) return;
    try {
      const [epRes, stRes] = await Promise.all([
        supabase.from('episodes').select('*, stories(title)').order('created_at', { ascending: false }),
        supabase.from('stories').select('id, title').order('title')
      ]);

      if (epRes.error) throw epRes.error;
      if (stRes.error) throw stRes.error;

      setEpisodes(epRes.data || []);
      setStories(stRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load episodes');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this episode?')) return;
    try {
      const { error } = await supabase.from('episodes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Episode deleted');
      setEpisodes(episodes.filter(e => e.id !== id));
    } catch (err) {
      toast.error('Failed to delete episode');
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  const filtered = filterStory === 'All' ? episodes : episodes.filter(e => e.story_id === filterStory);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Episodes</h1>
          <p className="mt-1 text-sm text-zinc-500">{episodes.length} episodes total</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filterStory} 
            onChange={(e) => setFilterStory(e.target.value)}
            className="h-9 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none">
            <option value="All">All Stories</option>
            {stories.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <Link
            to="/admin/episodes/new"
            className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
            <PlusIcon className="h-4 w-4" />
            Create episode
          </Link>
        </div>
      </header>

      <AdminPanel title="All episodes" description="Simamia sehemu zote za hadithi">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['Story', 'Episode', 'Title', 'Media', 'Access', 'Status', 'Actions']}>
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-zinc-900/50">
                <Td className="font-medium text-zinc-100">{e.stories?.title}</Td>
                <Td>Sehemu ya {e.episode_number}</Td>
                <Td>{e.title || '-'}</Td>
                <Td>
                  {e.youtube_video_id && <YoutubeIcon className="h-4 w-4 text-red-500" />}
                </Td>
                <Td>
                  <StatusPill status={e.is_free ? 'Free' : 'Premium'} />
                </Td>
                <Td>
                  <StatusPill status={e.status.charAt(0).toUpperCase() + e.status.slice(1)} />
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <Link to={`/admin/episodes/${e.id}/edit`} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">Edit</Link>
                    <button onClick={() => handleDelete(e.id)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:border-red-500 hover:text-red-300">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><Td colSpan={7} className="text-center py-4">No episodes found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>
    </div>
  );
}