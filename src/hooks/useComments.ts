import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export function useComments({ storyId, episodeId }: { storyId?: string, episodeId?: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('comments')
        .select('*, profiles(id, full_name, avatar_url)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (storyId) query = query.eq('story_id', storyId);
      if (episodeId) query = query.eq('episode_id', episodeId);

      const { data, error } = await query;
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storyId || episodeId) {
      fetchComments();
    }
  }, [storyId, episodeId]);

  const addComment = async (body: string) => {
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        story_id: storyId,
        episode_id: episodeId,
        body
      })
      .select('*, profiles(id, full_name, avatar_url)')
      .single();
      
    if (error) throw error;
    if (data) setComments([data, ...comments]);
    return data;
  };

  const deleteComment = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) throw error;
    setComments(comments.filter(c => c.id !== id));
  };

  return { comments, loading, addComment, deleteComment };
}
