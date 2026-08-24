import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Trash2, User } from 'lucide-react';

interface CommentsSectionProps {
  storyId?: string;
  episodeId?: string;
  requireAuth?: boolean;
}

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSec < 60) return 'sasa hivi';
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `dakika ${diffInMin} zilizopita`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `masaa ${diffInHours} yaliyopita`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `siku ${diffInDays} zilizopita`;
  return date.toLocaleDateString('sw-TZ');
}

export function CommentsSection({ storyId, episodeId, requireAuth = false }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    if (!storyId && !episodeId) return;
    setLoading(true);

    let query = supabase
      .from('comments')
      .select(`
        id, 
        body, 
        created_at, 
        user_id,
        profiles(full_name, avatar_url)
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (storyId) query = query.eq('story_id', storyId);
    if (episodeId) query = query.eq('episode_id', episodeId);

    const { data, error } = await query;

    if (!error && data) {
      const formattedComments = data.map((c: any) => ({
        id: c.id,
        body: c.body,
        created_at: c.created_at,
        user_id: c.user_id,
        full_name: c.profiles?.full_name || 'Mtumiaji',
        avatar_url: c.profiles?.avatar_url || null,
      }));
      setComments(formattedComments);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [storyId, episodeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      body: newComment.trim(),
      story_id: storyId || null,
      episode_id: episodeId || null,
      user_id: user.id,
    });

    if (!error) {
      setNewComment('');
      await fetchComments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white text-gray-900">
      <h3 className="font-display text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Maoni</h3>
      
      {(!requireAuth || user) ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ongeza maoni..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#9B1B3B]/50 focus:ring-1 focus:ring-[#9B1B3B]/50 min-h-[90px] resize-y"
            disabled={!user || submitting}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!user || !newComment.trim() || submitting}
              className="bg-[#9B1B3B] hover:bg-[#C42B53] text-white font-semibold py-2 px-5 rounded-full text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Inatuma...' : 'Tuma'}
            </button>
          </div>
          {!user && (
            <p className="text-xs text-gray-500">
              <a href="/ingia" className="text-[#9B1B3B] font-semibold hover:underline">Ingia</a> ili kutoa maoni yako.
            </p>
          )}
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Ingia ili kutoa maoni yako</p>
          <a
            href="/ingia"
            className="inline-block bg-[#9B1B3B] hover:bg-[#C42B53] text-white font-semibold py-2 px-5 rounded-full text-xs transition-colors"
          >
            Ingia
          </a>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5 pt-1">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-3.5 rounded-xl bg-gray-50/60 border border-gray-150">
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                {comment.avatar_url ? (
                  <img src={comment.avatar_url} alt={comment.full_name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-xs">
                      {comment.full_name || 'Mtumiaji'}
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      {timeAgo(comment.created_at)}
                    </p>
                  </div>
                  {user && user.id === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Futa maoni"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap mt-2 leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 text-xs">Hakuna maoni bado. Kuwa wa kwanza kutoa maoni!</p>
          </div>
        )}
      </div>
    </div>
  );
}
