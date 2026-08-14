-- ============================================================
-- KISA Platform — Migration 3: Reading Progress & Bookmarks
-- ============================================================

-- ── Reading Progress ─────────────────────────────────────────
CREATE TABLE reading_progress (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    episode_id  UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    story_id    UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    percent     INTEGER NOT NULL DEFAULT 0 CHECK (percent >= 0 AND percent <= 100),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, episode_id)
);

-- ── Bookmarks ────────────────────────────────────────────────
CREATE TABLE bookmarks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id    UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

-- Index for fast progress lookups
CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_story ON reading_progress(story_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
