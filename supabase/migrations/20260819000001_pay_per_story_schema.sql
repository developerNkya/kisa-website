-- ============================================================
-- KISA Platform — Migration: Pay-Per-Book Model
-- ============================================================

-- 1. Add price column to stories table (default 1000 TZS)
ALTER TABLE stories ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 1000;

-- 2. Create story_purchases table for tracking purchased books
CREATE TABLE IF NOT EXISTS story_purchases (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id   UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    amount     INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

-- 3. Add story_id column to subscription_transactions for tracking book payments
ALTER TABLE subscription_transactions ADD COLUMN IF NOT EXISTS story_id UUID REFERENCES stories(id) ON DELETE SET NULL;

-- 4. Enable RLS on story_purchases
ALTER TABLE story_purchases ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for story_purchases
CREATE POLICY "StoryPurchases: users can read own" ON story_purchases
    FOR SELECT USING (user_id = auth.uid() OR kisa_is_admin());

CREATE POLICY "StoryPurchases: service can manage" ON story_purchases
    FOR ALL USING (true);

-- 6. RPC Function to unlock story on successful payment
CREATE OR REPLACE FUNCTION kisa_unlock_story_purchase(
    p_user_id UUID,
    p_story_id UUID,
    p_transaction_id UUID,
    p_amount INTEGER
)
RETURNS UUID AS $$
DECLARE
    v_purchase_id UUID;
BEGIN
    -- Record or update story purchase
    INSERT INTO story_purchases (user_id, story_id, amount)
    VALUES (p_user_id, p_story_id, p_amount)
    ON CONFLICT (user_id, story_id) DO UPDATE
    SET amount = EXCLUDED.amount
    RETURNING id INTO v_purchase_id;

    -- Mark transaction as completed and link story_id
    UPDATE subscription_transactions
    SET status = 'completed',
        story_id = p_story_id,
        updated_at = NOW()
    WHERE id = p_transaction_id;

    RETURN v_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Helper: check if user has purchased a story
CREATE OR REPLACE FUNCTION kisa_has_purchased_story(p_user_id UUID, p_story_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM story_purchases
        WHERE user_id = p_user_id AND story_id = p_story_id
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_story_purchases_user ON story_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_story_purchases_story ON story_purchases(story_id);
CREATE INDEX IF NOT EXISTS idx_transactions_story ON subscription_transactions(story_id);
