import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export function useRatings({ storyId, episodeId }: { storyId?: string, episodeId?: string }) {
  const { user } = useAuth();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [myRating, setMyRating] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      if (!storyId && !episodeId) return;
      
      try {
        setLoading(true);
        let query = supabase.from('ratings').select('score, user_id');
        
        if (storyId) query = query.eq('story_id', storyId);
        if (episodeId) query = query.eq('episode_id', episodeId);
        
        const { data, error } = await query;
        if (error) throw error;
        
        if (data && data.length > 0) {
          const sum = data.reduce((acc, curr) => acc + curr.score, 0);
          setAvgRating(sum / data.length);
          setTotalCount(data.length);
          
          if (user) {
            const myR = data.find(r => r.user_id === user.id);
            if (myR) setMyRating(myR.score);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRatings();
  }, [storyId, episodeId, user]);

  const setRating = async (score: number) => {
    if (!user) throw new Error('Not authenticated');
    
    const payload: any = {
      user_id: user.id,
      score
    };
    if (storyId) payload.story_id = storyId;
    if (episodeId) payload.episode_id = episodeId;
    
    const { error } = await supabase
      .from('ratings')
      .upsert(payload, { onConflict: 'user_id, story_id, episode_id' });
      
    if (error) throw error;
    
    setMyRating(score);
  };

  return { avgRating, myRating, totalCount, loading, setRating };
}
