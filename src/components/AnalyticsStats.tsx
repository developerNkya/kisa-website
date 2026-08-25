// src/components/AnalyticsStats.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Eye, BookOpen, TrendingUp } from "lucide-react";

interface StoryStats {
  total_views: number;
  unique_views: number;
  total_reads: number;
  unique_reads: number;
  views_last_24_hours: number;
  reads_last_24_hours: number;
}

export function AnalyticsStats({ storyId }: { storyId: string }) {
  const [stats, setStats] = useState<StoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!storyId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_story_stats", {
          p_story_id: storyId,
        });

        if (error) {
          console.error("Error loading stats:", error);
          return;
        }

        setStats(data[0] || null);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [storyId]);

  if (loading) {
    return <div className="animate-pulse text-gray-400">Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-gray-600">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">Views</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{stats.total_views}</p>
        <p className="text-xs text-gray-400">
          {stats.views_last_24_hours} today
        </p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Reads</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{stats.total_reads}</p>
        <p className="text-xs text-gray-400">
          {stats.reads_last_24_hours} today
        </p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Engagement</span>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {stats.total_views > 0
            ? `${Math.round((stats.total_reads / stats.total_views) * 100)}%`
            : "0%"}
        </p>
        <p className="text-xs text-gray-400">Read rate</p>
      </div>
    </div>
  );
}
