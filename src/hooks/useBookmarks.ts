import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*, story:stories(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBookmarks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  return { bookmarks, loading, refetch: fetchBookmarks };
}

export function useBookmark(storyId: string) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkBookmark() {
      if (!user || !storyId) {
        setIsBookmarked(false);
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('story_id', storyId)
        .maybeSingle();
        
      setIsBookmarked(!!data);
      setLoading(false);
    }
    
    checkBookmark();
  }, [user, storyId]);

  const toggle = async () => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('story_id', storyId);
        setIsBookmarked(false);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, story_id: storyId });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { isBookmarked, toggle, loading };
}
