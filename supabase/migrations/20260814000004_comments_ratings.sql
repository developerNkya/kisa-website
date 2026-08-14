-- ============================================================
-- KISA Platform — Migration 4: Comments & Ratings
-- ============================================================

-- ── Comments ─────────────────────────────────────────────────
-- Can be on a story OR on a specific episode
CREATE TABLE comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id    UUID REFERENCES stories(id) ON DELETE CASCADE,
    episode_id  UUID REFERENCES episodes(id) ON DELETE CASCADE,
    body        TEXT NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 2000),
    is_deleted  BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    -- Must target at least one of story or episode
    CONSTRAINT comments_must_have_target
        CHECK (story_id IS NOT NULL OR episode_id IS NOT NULL)
);

-- ── Ratings ──────────────────────────────────────────────────
-- Can be on a story OR on a specific episode (one per user per target)
CREATE TABLE ratings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id    UUID REFERENCES stories(id) ON DELETE CASCADE,
    episode_id  UUID REFERENCES episodes(id) ON DELETE CASCADE,
    score       INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT ratings_must_have_target
        CHECK (story_id IS NOT NULL OR episode_id IS NOT NULL),
    -- One rating per user per story
    UNIQUE NULLS NOT DISTINCT (user_id, story_id),
    -- One rating per user per episode
    UNIQUE NULLS NOT DISTINCT (user_id, episode_id)
);

CREATE TRIGGER trg_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();

CREATE TRIGGER trg_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();

-- Indexes
CREATE INDEX idx_comments_story ON comments(story_id) WHERE is_deleted = false;
CREATE INDEX idx_comments_episode ON comments(episode_id) WHERE is_deleted = false;
CREATE INDEX idx_ratings_story ON ratings(story_id);
CREATE INDEX idx_ratings_episode ON ratings(episode_id);
