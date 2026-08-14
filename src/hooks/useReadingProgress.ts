import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export function useReadingProgress(storyId: string) {
  const { user } = useAuth();
  const [progress, setProgressList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      if (!user || !storyId) return;
      
      const { data } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('story_id', storyId);
        
      setProgressList(data || []);
    }
    
    fetchProgress();
  }, [user, storyId]);

  const setProgress = async (episodeId: string, percent: number) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert(
        { user_id: user.id, story_id: storyId, episode_id: episodeId, percent },
        { onConflict: 'user_id, episode_id' }
      )
      .select()
      .single();
      
    if (!error && data) {
      setProgressList(prev => {
        const idx = prev.findIndex(p => p.episode_id === episodeId);
        if (idx >= 0) {
          const newArr = [...prev];
          newArr[idx] = data;
          return newArr;
        }
        return [...prev, data];
      });
    }
  };

  const getProgressForEpisode = (episodeId: string) => {
    const epProgress = progress.find(p => p.episode_id === episodeId);
    return epProgress ? epProgress.percent : 0;
  };

  return { progress, setProgress, getProgressForEpisode };
}
