-- ============================================================
-- KISA Platform — Migration 1: Initial Schema
-- ============================================================

-- Enums
CREATE TYPE user_role AS ENUM ('reader', 'admin');
CREATE TYPE story_status AS ENUM ('draft', 'published', 'archived');

-- ── Profiles (extends auth.users) ────────────────────────────
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    phone       TEXT,
    avatar_url  TEXT,
    role        user_role NOT NULL DEFAULT 'reader',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Authors ──────────────────────────────────────────────────
CREATE TABLE authors (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    bio         TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Categories ───────────────────────────────────────────────
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Stories ──────────────────────────────────────────────────
CREATE TABLE stories (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    title        TEXT NOT NULL,
    hook         TEXT,
    description  TEXT,
    cover_url    TEXT,
    author_id    UUID REFERENCES authors(id) ON DELETE SET NULL,
    category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
    status       story_status NOT NULL DEFAULT 'draft',
    is_featured  BOOLEAN DEFAULT false,
    is_original  BOOLEAN DEFAULT false,
    avg_rating   NUMERIC(3,2) DEFAULT 0,
    total_reads  INTEGER DEFAULT 0,
    tags         TEXT[] DEFAULT '{}',
    price        INTEGER NOT NULL DEFAULT 1000,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Episodes ─────────────────────────────────────────────────
CREATE TABLE episodes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id         UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    episode_number   INTEGER NOT NULL,
    title            TEXT NOT NULL,
    content          TEXT,
    youtube_video_id TEXT,           -- optional YouTube video ID (unlisted)
    is_free          BOOLEAN NOT NULL DEFAULT false,  -- true for ep 1-3 by convention
    reading_minutes  INTEGER DEFAULT 5,
    status           story_status NOT NULL DEFAULT 'draft',
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, episode_number)
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION kisa_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();

CREATE TRIGGER trg_authors_updated_at
    BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();

CREATE TRIGGER trg_stories_updated_at
    BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();

CREATE TRIGGER trg_episodes_updated_at
    BEFORE UPDATE ON episodes
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();
