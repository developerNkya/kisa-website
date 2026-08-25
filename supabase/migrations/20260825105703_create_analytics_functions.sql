-- Get story view statistics
CREATE OR REPLACE FUNCTION public.get_story_stats(p_story_id UUID)
RETURNS TABLE(
  total_views BIGINT,
  unique_views BIGINT,
  total_reads BIGINT,
  unique_reads BIGINT,
  views_last_24_hours BIGINT,
  reads_last_24_hours BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE view_type = 'view') AS total_views,
    COUNT(DISTINCT user_id) FILTER (WHERE view_type = 'view') AS unique_views,
    COUNT(*) FILTER (WHERE view_type = 'read') AS total_reads,
    COUNT(DISTINCT user_id) FILTER (WHERE view_type = 'read') AS unique_reads,
    COUNT(*) FILTER (WHERE view_type = 'view' AND created_at > NOW() - INTERVAL '24 hours') AS views_last_24_hours,
    COUNT(*) FILTER (WHERE view_type = 'read' AND created_at > NOW() - INTERVAL '24 hours') AS reads_last_24_hours
  FROM public.story_views
  WHERE story_id = p_story_id;
END;
$$;

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION public.get_story_stats TO anon, authenticated;

-- Get trending stories based on views
CREATE OR REPLACE FUNCTION public.get_trending_stories(
  p_limit INTEGER DEFAULT 10,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE(
  story_id UUID,
  title TEXT,
  slug TEXT,
  cover_url TEXT,
  total_views BIGINT,
  total_reads BIGINT,
  authors JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id AS story_id,
    s.title,
    s.slug,
    s.cover_url,
    COUNT(sv.id) FILTER (WHERE sv.view_type = 'view') AS total_views,
    COUNT(sv.id) FILTER (WHERE sv.view_type = 'read') AS total_reads,
    jsonb_build_object('name', a.name) AS authors
  FROM public.stories s
  LEFT JOIN public.story_views sv ON s.id = sv.story_id 
    AND sv.created_at > NOW() - (p_days || ' days')::INTERVAL
  LEFT JOIN public.authors a ON s.author_id = a.id
  WHERE s.status = 'published'
  GROUP BY s.id, s.title, s.slug, s.cover_url, a.name
  ORDER BY total_views DESC, total_reads DESC
  LIMIT p_limit;
END;
$$;

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION public.get_trending_stories TO anon, authenticated;