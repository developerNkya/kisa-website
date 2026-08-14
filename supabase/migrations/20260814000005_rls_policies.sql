-- ============================================================
-- KISA Platform — Migration 5: Row-Level Security Policies
-- ============================================================

-- Enable RLS on all user-data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public read-only tables (no RLS needed for reads)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ── Helper: is admin ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION kisa_is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ──────────────────────────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Profiles: users can read own" ON profiles
    FOR SELECT USING (id = auth.uid() OR kisa_is_admin());

CREATE POLICY "Profiles: users can update own" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Profiles: admins can read all" ON profiles
    FOR SELECT USING (kisa_is_admin());

-- ──────────────────────────────────────────────────────────────
-- STORIES (public read for published; admin full access)
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Stories: anyone can read published" ON stories
    FOR SELECT USING (status = 'published' OR kisa_is_admin());

CREATE POLICY "Stories: admins can insert" ON stories
    FOR INSERT WITH CHECK (kisa_is_admin());

CREATE POLICY "Stories: admins can update" ON stories
    FOR UPDATE USING (kisa_is_admin());

CREATE POLICY "Stories: admins can delete" ON stories
    FOR DELETE USING (kisa_is_admin());

-- ──────────────────────────────────────────────────────────────
-- EPISODES (public read for published)
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Episodes: anyone can read published" ON episodes
    FOR SELECT USING (status = 'published' OR kisa_is_admin());

CREATE POLICY "Episodes: admins can insert" ON episodes
    FOR INSERT WITH CHECK (kisa_is_admin());

CREATE POLICY "Episodes: admins can update" ON episodes
    FOR UPDATE USING (kisa_is_admin());

CREATE POLICY "Episodes: admins can delete" ON episodes
    FOR DELETE USING (kisa_is_admin());

-- ──────────────────────────────────────────────────────────────
-- AUTHORS & CATEGORIES (public read)
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Authors: anyone can read" ON authors
    FOR SELECT USING (true);

CREATE POLICY "Authors: admins can manage" ON authors
    FOR ALL USING (kisa_is_admin());

CREATE POLICY "Categories: anyone can read" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Categories: admins can manage" ON categories
    FOR ALL USING (kisa_is_admin());

-- ──────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Subscriptions: users see own" ON subscriptions
    FOR SELECT USING (user_id = auth.uid() OR kisa_is_admin());

CREATE POLICY "Subscriptions: service can insert" ON subscriptions
    FOR INSERT WITH CHECK (true); -- controlled by service role key

CREATE POLICY "Subscriptions: service can update" ON subscriptions
    FOR UPDATE USING (true); -- controlled by service role key

-- ──────────────────────────────────────────────────────────────
-- SUBSCRIPTION TRANSACTIONS
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Transactions: users see own" ON subscription_transactions
    FOR SELECT USING (user_id = auth.uid() OR kisa_is_admin());

CREATE POLICY "Transactions: service can manage" ON subscription_transactions
    FOR ALL USING (true);

-- ──────────────────────────────────────────────────────────────
-- READING PROGRESS
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "ReadingProgress: users manage own" ON reading_progress
    FOR ALL USING (user_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- BOOKMARKS
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Bookmarks: users manage own" ON bookmarks
    FOR ALL USING (user_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- COMMENTS
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Comments: anyone can read non-deleted" ON comments
    FOR SELECT USING (is_deleted = false OR kisa_is_admin());

CREATE POLICY "Comments: authenticated can insert" ON comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Comments: users can soft-delete own" ON comments
    FOR UPDATE USING (user_id = auth.uid() OR kisa_is_admin());

CREATE POLICY "Comments: admins can hard-delete" ON comments
    FOR DELETE USING (kisa_is_admin());

-- ──────────────────────────────────────────────────────────────
-- RATINGS
-- ──────────────────────────────────────────────────────────────
CREATE POLICY "Ratings: anyone can read" ON ratings
    FOR SELECT USING (true);

CREATE POLICY "Ratings: authenticated can upsert" ON ratings
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Ratings: users can update own" ON ratings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Ratings: users can delete own" ON ratings
    FOR DELETE USING (user_id = auth.uid() OR kisa_is_admin());
