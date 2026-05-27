CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- pm_users: 用户表
-- ============================================================
CREATE TABLE IF NOT EXISTS pm_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  password_hash TEXT,
  google_id     TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT users_auth_check CHECK (
    password_hash IS NOT NULL OR google_id IS NOT NULL
  )
);

-- ============================================================
-- pm_products: 产品表
-- ============================================================
CREATE TABLE IF NOT EXISTS pm_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL CHECK (slug IN ('plus', 'pro5x', 'pro20x')),
  name        TEXT NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  description TEXT,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO pm_products (slug, name, price, description)
SELECT 'plus',  'ChatGPT Plus 月卡', 189,  '基础月卡方案'
WHERE NOT EXISTS (SELECT 1 FROM pm_products WHERE slug = 'plus');

INSERT INTO pm_products (slug, name, price, description)
SELECT 'pro5x', 'ChatGPT Pro 5X',  864,  '高级 5X 方案'
WHERE NOT EXISTS (SELECT 1 FROM pm_products WHERE slug = 'pro5x');

INSERT INTO pm_products (slug, name, price, description)
SELECT 'pro20x','ChatGPT Pro 20X', 1620, '旗舰 20X 方案'
WHERE NOT EXISTS (SELECT 1 FROM pm_products WHERE slug = 'pro20x');

-- ============================================================
-- pm_orders: 订单表
-- ============================================================
CREATE TABLE IF NOT EXISTS pm_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES pm_users(id) ON DELETE CASCADE NOT NULL,
  product_id      UUID REFERENCES pm_products(id),
  plan            TEXT NOT NULL CHECK (plan IN ('plus', 'pro5x', 'pro20x')),
  amount          NUMERIC(10,2) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method  TEXT CHECK (payment_method IN ('wechat', 'stripe')),
  access_token    TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- pm_payments: 支付记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS pm_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES pm_orders(id) ON DELETE CASCADE NOT NULL,
  user_id         UUID REFERENCES pm_users(id) ON DELETE CASCADE NOT NULL,
  method          TEXT NOT NULL CHECK (method IN ('wechat', 'stripe')),
  amount          NUMERIC(10,2) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE pm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_products ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read (public pricing)
CREATE POLICY "Anyone can read products" ON pm_products FOR SELECT USING (true);

-- Users: read own data
CREATE POLICY "Users read own data" ON pm_users
  FOR SELECT USING (auth.uid() = id);

-- Orders: CRUD own orders
CREATE POLICY "Users CRUD own orders" ON pm_orders
  FOR ALL USING (auth.uid() = user_id);

-- Payments: read own payments
CREATE POLICY "Users read own payments" ON pm_payments
  FOR SELECT USING (auth.uid() = user_id);
