import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../utils/cn';

interface RatingWidgetProps {
  storyId?: string;
  episodeId?: string;
}

export function RatingWidget({ storyId, episodeId }: RatingWidgetProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [showThanks, setShowThanks] = useState(false);

  const fetchRatings = async () => {
    if (!storyId && !episodeId) return;
    
    let query = supabase.from('ratings').select('score', { count: 'exact' });
    if (storyId) query = query.eq('story_id', storyId);
    if (episodeId) query = query.eq('episode_id', episodeId);

    const { data, count: totalCount, error } = await query;
    
    if (!error && data) {
      if (data.length > 0) {
        const sum = data.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
        setAverage(sum / data.length);
        setCount(totalCount || data.length);
      } else {
        setAverage(0);
        setCount(0);
      }
    }

    if (user) {
      let userQuery = supabase.from('ratings').select('score').eq('user_id', user.id);
      if (storyId) userQuery = userQuery.eq('story_id', storyId);
      if (episodeId) userQuery = userQuery.eq('episode_id', episodeId);
      
      const { data: userData, error: userError } = await userQuery.maybeSingle();
      if (!userError && userData) {
        setRating(userData.score);
      }
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [storyId, episodeId, user]);

  const handleRate = async (newRating: number) => {
    if (!user) return;

    setRating(newRating);
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);

    const payload: any = {
      user_id: user.id,
      score: newRating,
    };
    if (storyId) payload.story_id = storyId;
    if (episodeId) payload.episode_id = episodeId;

    await supabase.from('ratings').upsert(payload);

    fetchRatings();
  };

  const displayRating = hoverRating > 0 ? hoverRating : (rating > 0 ? rating : average);
  
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <div 
          className={cn(
            "flex items-center",
            !user && "opacity-80"
          )}
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = displayRating >= star;
            const isHalf = displayRating >= star - 0.5 && displayRating < star;
            
            return (
              <button
                key={star}
                type="button"
                disabled={!user}
                onMouseEnter={() => user && setHoverRating(star)}
                onClick={() => handleRate(star)}
                className={cn(
                  "p-1 transition-colors",
                  !user && "cursor-default"
                )}
              >
                {isHalf ? (
                  <StarHalf className="w-5 h-5 text-gold fill-gold" />
                ) : (
                  <Star 
                    className={cn(
                      "w-5 h-5",
                      isFilled ? "text-gold fill-gold" : "text-mist"
                    )} 
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="text-sm font-medium text-mist">
          {average > 0 ? `${average.toFixed(1)} (${count})` : "Hakuna tathmini"}
        </span>
      </div>
      
      {showThanks && (
        <span className="text-xs text-wine-bright font-medium animate-in fade-in slide-in-from-bottom-1">
          Asante kwa tathmini yako!
        </span>
      )}
    </div>
  );
}
