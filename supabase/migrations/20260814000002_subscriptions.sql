-- ============================================================
-- KISA Platform — Migration 2: Subscriptions & Payments
-- ============================================================

CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled');
CREATE TYPE payment_method_type AS ENUM ('mobile', 'card');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- ── Subscriptions ────────────────────────────────────────────
CREATE TABLE subscriptions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status       subscription_status NOT NULL DEFAULT 'active',
    amount       INTEGER NOT NULL DEFAULT 2000,   -- TZS
    start_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date  DATE NOT NULL,
    is_trial     BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payment Transactions ─────────────────────────────────────
CREATE TABLE subscription_transactions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id  UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount           INTEGER NOT NULL DEFAULT 2000,
    payment_method   payment_method_type NOT NULL DEFAULT 'mobile',
    status           transaction_status NOT NULL DEFAULT 'pending',
    reference        TEXT NOT NULL UNIQUE,
    customer_name    TEXT,
    customer_phone   TEXT,
    customer_email   TEXT,
    payment_url      TEXT,
    snippe_reference TEXT,
    webhook_payload  JSONB,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();

CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON subscription_transactions
    FOR EACH ROW EXECUTE FUNCTION kisa_update_updated_at();
