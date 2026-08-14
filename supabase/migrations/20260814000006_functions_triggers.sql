-- ============================================================
-- KISA Platform — Migration 6: Functions & Triggers
-- ============================================================

-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION kisa_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Msomaji'),
        NEW.email,
        'reader'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION kisa_handle_new_user();

-- ── Update story avg_rating when ratings change ───────────────
CREATE OR REPLACE FUNCTION kisa_refresh_story_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_story_id UUID;
BEGIN
    -- Determine which story was affected
    IF TG_OP = 'DELETE' THEN
        target_story_id := OLD.story_id;
    ELSE
        target_story_id := NEW.story_id;
    END IF;

    IF target_story_id IS NOT NULL THEN
        UPDATE stories
        SET avg_rating = (
            SELECT COALESCE(ROUND(AVG(score)::NUMERIC, 2), 0)
            FROM ratings
            WHERE story_id = target_story_id
        )
        WHERE id = target_story_id;
    END IF;

    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_story_rating_on_insert
    AFTER INSERT ON ratings
    FOR EACH ROW WHEN (NEW.story_id IS NOT NULL)
    EXECUTE FUNCTION kisa_refresh_story_rating();

CREATE TRIGGER trg_story_rating_on_update
    AFTER UPDATE ON ratings
    FOR EACH ROW WHEN (NEW.story_id IS NOT NULL OR OLD.story_id IS NOT NULL)
    EXECUTE FUNCTION kisa_refresh_story_rating();

CREATE TRIGGER trg_story_rating_on_delete
    AFTER DELETE ON ratings
    FOR EACH ROW WHEN (OLD.story_id IS NOT NULL)
    EXECUTE FUNCTION kisa_refresh_story_rating();

-- ── Increment story read count ────────────────────────────────
CREATE OR REPLACE FUNCTION kisa_increment_story_reads(p_story_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE stories
    SET total_reads = total_reads + 1
    WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Check if user has active subscription ────────────────────
CREATE OR REPLACE FUNCTION kisa_has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = p_user_id
          AND status = 'active'
          AND expiry_date >= CURRENT_DATE
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Activate subscription after payment ──────────────────────
-- Called by webhook handler via service role
CREATE OR REPLACE FUNCTION kisa_activate_subscription(
    p_user_id UUID,
    p_transaction_id UUID,
    p_reference TEXT
)
RETURNS UUID AS $$
DECLARE
    v_sub_id UUID;
    v_existing_expiry DATE;
BEGIN
    -- Check for existing active subscription to extend it
    SELECT id, expiry_date INTO v_sub_id, v_existing_expiry
    FROM subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    ORDER BY expiry_date DESC
    LIMIT 1;

    IF v_sub_id IS NOT NULL THEN
        -- Extend existing subscription by 30 days from current expiry
        UPDATE subscriptions
        SET expiry_date = GREATEST(expiry_date, CURRENT_DATE) + INTERVAL '30 days',
            status = 'active',
            updated_at = NOW()
        WHERE id = v_sub_id;
    ELSE
        -- Create new subscription
        INSERT INTO subscriptions (user_id, status, amount, start_date, expiry_date)
        VALUES (p_user_id, 'active', 2000, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
        RETURNING id INTO v_sub_id;
    END IF;

    -- Link transaction to subscription and mark completed
    UPDATE subscription_transactions
    SET subscription_id = v_sub_id,
        status = 'completed',
        updated_at = NOW()
    WHERE id = p_transaction_id;

    RETURN v_sub_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Seed: default categories ──────────────────────────────────
INSERT INTO categories (name, slug, description) VALUES
    ('Mapenzi',   'mapenzi',   'Hadithi za mapenzi na hisia'),
    ('Drama',     'drama',     'Hadithi za msisimko wa kijamii'),
    ('Siri',      'siri',      'Mafumbo na misteri'),
    ('Thriller',  'thriller',  'Hatari na msisimko'),
    ('Adventure', 'adventure', 'Safari na ujasiri'),
    ('Fantasy',   'fantasy',   'Ulimwengu wa ajabu'),
    ('Horror',    'horror',    'Hofu na giza'),
    ('Vijana',    'vijana',    'Hadithi za vijana'),
    ('Maisha',    'maisha',    'Hadithi za kila siku')
ON CONFLICT (slug) DO NOTHING;
