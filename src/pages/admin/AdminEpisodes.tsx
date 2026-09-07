import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PlusIcon, Loader2Icon, YoutubeIcon, LockIcon, UnlockIcon, InfoIcon } from 'lucide-react';
import { AdminPanel, AdminTable, StatusPill, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

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
        supabase.from('episodes').select('*, stories(title, price)').order('created_at', { ascending: false }),
        supabase.from('stories').select('id, title, price').order('title')
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
      const { data: deleted, error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id)
        .select('id');          // returning the deleted row confirms it was removed
      
      if (error) throw error;
      
      if (!deleted || deleted.length === 0) {
        // RLS silently blocked the delete — row still exists
        toast.error('Delete failed: you may not have permission, or the session expired. Try logging out and back in.');
        return;
      }
      
      toast.success('Episode deleted');
      setEpisodes(episodes.filter(e => e.id !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(err?.message || 'Failed to delete episode');
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  const filtered = filterStory === 'All' ? episodes : episodes.filter(e => e.story_id === filterStory);

  // Helper to determine if episode is actually accessible
  const getEpisodeAccessInfo = (episode: any) => {
    const storyPrice = episode.stories?.price ?? 1000;
    const epNum = episode.episode_number;
    
    // If story is free, all episodes are free
    if (storyPrice === 0) {
      return { 
        isFree: true, 
        label: 'Free',
        reason: 'Story is free',
        icon: <UnlockIcon className="h-3 w-3 text-green-400" />
      };
    }
    
    // If episode is explicitly free
    if (episode.is_free) {
      return { 
        isFree: true, 
        label: 'Free',
        reason: 'Manually set to free',
        icon: <UnlockIcon className="h-3 w-3 text-green-400" />
      };
    }
    
    // First 3 episodes of premium story are free
    if (epNum <= 3) {
      return { 
        isFree: true, 
        label: 'Free (Sample)',
        reason: 'First 3 episodes are free',
        icon: <UnlockIcon className="h-3 w-3 text-green-400" />
      };
    }
    
    // Everything else is premium
    return { 
      isFree: false, 
      label: 'Premium',
      reason: 'Requires purchase',
      icon: <LockIcon className="h-3 w-3 text-amber-400" />
    };
  };

  // Count premium vs free episodes
  const premiumCount = episodes.filter(e => {
    const storyPrice = e.stories?.price ?? 1000;
    if (storyPrice === 0) return false;
    if (e.is_free) return false;
    if (e.episode_number <= 3) return false;
    return true;
  }).length;

  const freeCount = episodes.length - premiumCount;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Episodes</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {episodes.length} episodes total
            {episodes.length > 0 && (
              <span className="ml-2 text-zinc-600">
                · {freeCount} free · {premiumCount} premium
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filterStory} 
            onChange={(e) => setFilterStory(e.target.value)}
            className="h-9 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none">
            <option value="All">All Stories</option>
            {stories.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} {s.price > 0 ? `(TSh ${s.price.toLocaleString()})` : '(Free)'}
              </option>
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
          <>
            <AdminTable columns={['Story', 'Episode', 'Title', 'Media', 'Access', 'Story Price', 'Status', 'Actions']}>
              {filtered.map((e) => {
                const accessInfo = getEpisodeAccessInfo(e);
                const storyPrice = e.stories?.price ?? 1000;
                
                return (
                  <tr key={e.id} className="hover:bg-zinc-900/50">
                    <Td className="font-medium text-zinc-100">{e.stories?.title}</Td>
                    <Td>Sehemu ya {e.episode_number}</Td>
                    <Td>{e.title || '-'}</Td>
                    <Td>
                      {e.youtube_video_id && <YoutubeIcon className="h-4 w-4 text-red-500" />}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        {/* Custom status badge instead of StatusPill with className */}
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                          accessInfo.isFree 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        )}>
                          {accessInfo.label}
                        </span>
                        {/* Show lock/unlock icon */}
                        {accessInfo.icon}
                        {/* Show reason on hover */}
                        <span className="group relative cursor-help">
                          <InfoIcon className="h-3 w-3 text-zinc-500" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-200 group-hover:block">
                            {accessInfo.reason}
                          </span>
                        </span>
                      </div>
                    </Td>
                    <Td>
                      {storyPrice === 0 ? (
                        <span className="text-green-400 text-xs font-medium">Bure</span>
                      ) : (
                        <span className="text-amber-400 text-xs font-medium">TSh {storyPrice.toLocaleString()}</span>
                      )}
                    </Td>
                    <Td>
                      <StatusPill status={e.status.charAt(0).toUpperCase() + e.status.slice(1)} />
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        <Link 
                          to={`/admin/episodes/${e.id}/edit`} 
                          className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(e.id)} 
                          className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:border-red-500 hover:text-red-300">
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><Td colSpan={8} className="text-center py-4 text-zinc-500">No episodes found</Td></tr>
              )}
            </AdminTable>

            {/* Legend for access status */}
            <div className="mt-4 border-t border-zinc-800 pt-4 px-4 pb-2">
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Access Legend:</span>
                <span className="flex items-center gap-1">
                  <UnlockIcon className="h-3 w-3 text-green-400" />
                  Free — Episode is accessible to all
                </span>
                <span className="flex items-center gap-1">
                  <LockIcon className="h-3 w-3 text-amber-400" />
                  Premium — Requires purchase
                </span>
                <span className="flex items-center gap-1 text-zinc-600">
                  <InfoIcon className="h-3 w-3" />
                  Hover for details
                </span>
              </div>
            </div>
          </>
        )}
      </AdminPanel>
    </div>
  );
}