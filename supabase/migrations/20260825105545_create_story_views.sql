-- Create story_views table for tracking
CREATE TABLE IF NOT EXISTS public.story_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  view_type TEXT CHECK (view_type IN ('view', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate views per user/session/story
  CONSTRAINT story_views_unique UNIQUE(story_id, user_id, session_id, view_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON public.story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_user_id ON public.story_views(user_id);
CREATE INDEX IF NOT EXISTS idx_story_views_session ON public.story_views(session_id);
CREATE INDEX IF NOT EXISTS idx_story_views_created ON public.story_views(created_at);
CREATE INDEX IF NOT EXISTS idx_story_views_type ON public.story_views(view_type);

-- Enable Row Level Security
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable insert for all users" ON public.story_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON public.story_views
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_views;