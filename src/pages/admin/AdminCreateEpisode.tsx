import React, { useEffect, useState } from 'react';
import { BoldIcon, ItalicIcon, ListIcon, QuoteIcon, Redo2Icon, Undo2Icon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';
import { AdminPanel } from '../../components/admin/AdminTable';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const inputClass =
  'w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500';

export function AdminCreateEpisode() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  
  const [storyId, setStoryId] = useState('');
  const [number, setNumber] = useState('1');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [status, setStatus] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 180));

  useEffect(() => {
    if (isAdmin) loadStories();
  }, [isAdmin]);

  async function loadStories() {
    const { data } = await supabase.from('stories').select('id, title').order('title');
    if (data) {
      setStories(data);
      if (data.length > 0) setStoryId(data[0].id);
    }
  }

  // Auto-suggest is_free based on episode number
  useEffect(() => {
    const epNum = parseInt(number, 10);
    if (!isNaN(epNum)) {
      setIsFree(epNum <= 3);
    }
  }, [number]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId || !content.trim()) {
      toast.error('Story and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const epNum = parseInt(number, 10);
      const { error } = await supabase.from('episodes').insert({
        story_id: storyId,
        episode_number: isNaN(epNum) ? 1 : epNum,
        title: title || null,
        content,
        youtube_video_id: youtubeVideoId || null,
        is_free: isFree,
        reading_minutes: minutes,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      });

      if (error) throw error;
      toast.success('Episode created successfully');
      navigate('/admin/episodes');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to create episode');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  const selectedStoryTitle = stories.find(s => s.id === storyId)?.title || 'Story';

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Create Episode</h1>
        <p className="mt-1 text-sm text-zinc-500">Andika sehemu mpya ya hadithi.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <div className="space-y-4">
          <AdminPanel title="Episode">
            <div className="grid gap-4 p-4 sm:grid-cols-[1fr_100px] sm:p-5">
              <div>
                <label htmlFor="ep-story" className={labelClass}>Story</label>
                <select id="ep-story" value={storyId} onChange={(e) => setStoryId(e.target.value)} required className={inputClass}>
                  {stories.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ep-number" className={labelClass}>Number</label>
                <input
                  id="ep-number"
                  type="number"
                  min="1"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ep-title" className={labelClass}>Episode title (hiari)</label>
                <input
                  id="ep-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ndoto Mbaya"
                  className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ep-youtube" className={labelClass}>YouTube Video ID (hiari)</label>
                <input
                  id="ep-youtube"
                  value={youtubeVideoId}
                  onChange={(e) => setYoutubeVideoId(e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ"
                  className={inputClass} />
                <p className="mt-1 text-xs text-zinc-500">Weka ID ya video ya YouTube peke yake, si URL nzima.</p>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Story content" description={`Maneno ${words.toLocaleString()} · Dakika ${minutes} za kusoma`}>
            <div className="border-b border-zinc-800 px-3 py-2">
              <div className="flex flex-wrap gap-1">
                {[BoldIcon, ItalicIcon, QuoteIcon, ListIcon, Undo2Icon, Redo2Icon].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <textarea
                id="ep-content"
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className={cn(inputClass, 'resize-y font-read text-[15px] leading-[1.85] text-zinc-200')} />
            </div>
          </AdminPanel>
        </div>

        <div className="space-y-4">
          <AdminPanel title="Publishing">
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="ep-minutes" className={labelClass}>Reading time</label>
                <input id="ep-minutes" readOnly value={`Dakika ${minutes}`} className={inputClass} />
              </div>
              <div>
                <span className={labelClass}>Access</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFree(true)}
                    className={cn('flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors', isFree ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-zinc-800 text-zinc-400 hover:text-zinc-100')}>
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFree(false)}
                    className={cn('flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors', !isFree ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-zinc-800 text-zinc-400 hover:text-zinc-100')}>
                    Premium
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="ep-status" className={labelClass}>Status</label>
                <select
                  id="ep-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright disabled:opacity-50">
                  {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
                  Save Episode
                </button>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Reader preview">
            <div className="p-4 sm:p-5">
              <div className="rounded-md border border-line-soft bg-ink p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{selectedStoryTitle}</p>
                <p className="mt-1.5 font-display text-lg font-bold text-cream">
                  Sehemu ya {number} {title ? `— ${title}` : ''}
                </p>
                <p className="mt-3 line-clamp-6 font-read text-[13px] leading-[1.8] text-cream/80">
                  {content || 'Hakuna yaliyomo bado...'}
                </p>
              </div>
            </div>
          </AdminPanel>
        </div>
      </form>
    </div>
  );
}