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
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-2xl text-cream font-bold">Maoni</h3>
      
      {(!requireAuth || user) ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ongeza maoni..."
            className="w-full bg-surface-raised border border-line rounded-lg p-3 text-cream placeholder:text-mist focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine min-h-[100px] resize-y"
            disabled={!user || submitting}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!user || !newComment.trim() || submitting}
              className="bg-wine hover:bg-wine-bright text-cream font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Inatuma...' : 'Tuma'}
            </button>
          </div>
          {!user && (
            <p className="text-sm text-mist">
              <a href="/ingia" className="text-wine-bright hover:underline">Ingia</a> ili kutoa maoni yako.
            </p>
          )}
        </form>
      ) : (
        <div className="bg-surface-raised border border-line rounded-lg p-6 text-center">
          <p className="text-mist mb-4">Ingia ili kutoa maoni yako</p>
          <a
            href="/ingia"
            className="inline-block bg-wine hover:bg-wine-bright text-cream font-medium py-2 px-6 rounded-md transition-colors"
          >
            Ingia
          </a>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-surface-raised shrink-0" />
              <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="w-32 h-4 bg-surface-raised rounded" />
                <div className="w-full h-16 bg-surface-raised rounded" />
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-surface border border-line-soft">
              <div className="w-10 h-10 rounded-full bg-surface-raised overflow-hidden shrink-0 flex items-center justify-center border border-line">
                {comment.avatar_url ? (
                  <img src={comment.avatar_url} alt={comment.full_name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-mist" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-medium text-cream text-sm">
                      {comment.full_name || 'Mtumiaji'}
                    </h4>
                    <p className="text-xs text-mist">
                      {timeAgo(comment.created_at)}
                    </p>
                  </div>
                  {user && user.id === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-mist hover:text-wine-bright p-1 transition-colors"
                      title="Futa maoni"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-mist text-sm whitespace-pre-wrap mt-2 leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-mist">Hakuna maoni bado. Kuwa wa kwanza kutoa maoni!</p>
          </div>
        )}
      </div>
    </div>
  );
}
