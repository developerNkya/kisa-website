-- Create function to safely track story views with duplicate prevention
CREATE OR REPLACE FUNCTION public.track_story_view(
  p_story_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_type TEXT DEFAULT NULL,
  p_view_type TEXT DEFAULT 'view'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_count INTEGER;
  v_recent_view BOOLEAN;
  v_has_session BOOLEAN;
BEGIN
  -- Validate view_type
  IF p_view_type NOT IN ('view', 'read') THEN
    RAISE EXCEPTION 'Invalid view_type. Must be "view" or "read"';
  END IF;

  -- Check for duplicate view within 24 hours
  SELECT EXISTS (
    SELECT 1 
    FROM public.story_views 
    WHERE story_id = p_story_id 
      AND (user_id = p_user_id OR (user_id IS NULL AND p_user_id IS NULL))
      AND session_id = p_session_id
      AND view_type = p_view_type
      AND created_at > NOW() - INTERVAL '24 hours'
  ) INTO v_recent_view;
  
  IF v_recent_view THEN
    -- Return current count without incrementing
    SELECT COALESCE(total_reads, 0) INTO v_new_count 
    FROM public.stories 
    WHERE id = p_story_id;
    RETURN v_new_count;
  END IF;

  -- Check if session exists for this user/story
  IF p_user_id IS NOT NULL AND p_session_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 
      FROM public.story_views 
      WHERE story_id = p_story_id 
        AND user_id = p_user_id
        AND session_id = p_session_id
    ) INTO v_has_session;
    
    -- If session exists but different view_type, allow it
    IF v_has_session THEN
      -- Still insert but don't increment total_reads (only counts unique sessions)
      INSERT INTO public.story_views (
        story_id, 
        user_id, 
        session_id,
        ip_address, 
        user_agent, 
        device_type,
        view_type
      ) VALUES (
        p_story_id,
        p_user_id,
        p_session_id,
        p_ip_address,
        p_user_agent,
        p_device_type,
        p_view_type
      );
      
      -- Return current count without incrementing
      SELECT COALESCE(total_reads, 0) INTO v_new_count 
      FROM public.stories 
      WHERE id = p_story_id;
      RETURN v_new_count;
    END IF;
  END IF;
  
  -- Insert the view record
  INSERT INTO public.story_views (
    story_id, 
    user_id, 
    session_id,
    ip_address, 
    user_agent, 
    device_type,
    view_type
  ) VALUES (
    p_story_id,
    p_user_id,
    p_session_id,
    p_ip_address,
    p_user_agent,
    p_device_type,
    p_view_type
  );
  
  -- Increment total_reads
  UPDATE public.stories
  SET total_reads = COALESCE(total_reads, 0) + 1
  WHERE id = p_story_id
  RETURNING COALESCE(total_reads, 0) INTO v_new_count;
  
  RETURN v_new_count;
END;
$$;

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION public.track_story_view TO anon, authenticated;