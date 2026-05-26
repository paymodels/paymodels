# Auth + Supabase Integration Design

**Date:** 2026-05-26
**Status:** Draft

## Overview

Integrate NextAuth v5 (Auth.js) for Google OAuth + Credentials (email/password) authentication, with Supabase as the database backend. Users authenticate via NextAuth, and user data is synced to Supabase for persistence and business operations.

---

## Architecture

```
User → Google OAuth / Email+Password → NextAuth (JWT) → Middleware guards routes
                                                   ↓
                                          signIn callback → sync to Supabase users
                                                   ↓
                                          API Routes → service_role key → Supabase CRUD
```

### Key Decisions

- **NextAuth v5 (Auth.js)** over v4: Next.js 16.2.6 native compatibility, future-proof
- **JWT strategy**: No database session table needed, simpler architecture
- **`@supabase/supabase-js`** over `@supabase/ssr`: Direct server-side operations via service_role key; no Supabase auth cookie management needed since NextAuth handles sessions
- **Supabase RLS**: Tables have Row Level Security enabled; API routes use service_role key to bypass RLS for full server-side access
- **Dual auth providers**: Google OAuth + Credentials (email/password with bcrypt)

---

## Database Schema

Run the following SQL in Supabase SQL Editor:

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- users: 用户表
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  password_hash TEXT,          -- bcrypt hash, NULL for Google-only users
  google_id     TEXT UNIQUE,   -- NULL for password-only users
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT users_auth_check CHECK (
    password_hash IS NOT NULL OR google_id IS NOT NULL
  )
);

-- ============================================================
-- products: 产品表
-- ============================================================
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL CHECK (slug IN ('plus', 'pro5x', 'pro20x')),
  name        TEXT NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  description TEXT,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO products (slug, name, price, description) VALUES
  ('plus',   'ChatGPT Plus 月卡',  189,  '基础月卡方案'),
  ('pro5x',  'ChatGPT Pro 5X',    864,  '高级 5X 方案'),
  ('pro20x', 'ChatGPT Pro 20X',  1620,  '旗舰 20X 方案');

-- ============================================================
-- orders: 订单表
-- ============================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id      UUID REFERENCES products(id),
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
-- payments: 支付记录表
-- ============================================================
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read (public pricing)
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);

-- Users: read own data
CREATE POLICY "Users read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Orders: CRUD own orders
CREATE POLICY "Users CRUD own orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

-- Payments: read own payments
CREATE POLICY "Users read own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);
```

### Table Relationships

```
products (id) ──→ orders (product_id)
users (id) ─────→ orders (user_id) ──→ payments (order_id)
users (id) ─────→ payments (user_id)
```

---

## Environment Variables

```bash
# NextAuth
AUTH_SECRET=                          # Generate: openssl rand -base64 32
AUTH_GOOGLE_ID=                       # Google Cloud Console → OAuth Client ID
AUTH_GOOGLE_SECRET=                   # Google Cloud Console → OAuth Client Secret
AUTH_URL=http://localhost:3000        # Change to actual domain in production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=             # Your Supabase project URL (e.g., https://xxx.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # Supabase anon/public key (safe for client-side, RLS-enforced)
SUPABASE_SERVICE_ROLE_KEY=            # Supabase service_role key (server-side only, NEVER exposed)
```

---

## File Structure (New & Modified)

```
lib/
  auth.ts                          # [NEW] NextAuth config (providers + callbacks)
  auth-client.ts                   # [NEW] Client-side auth helpers
  supabase/
    server.ts                      # [NEW] Server-side Supabase client (service_role)
    client.ts                      # [NEW] Browser-side Supabase client (anon key)

middleware.ts                      # [NEW] Route protection middleware

app/api/auth/[...nextauth]/
  route.ts                         # [NEW] NextAuth API route handler

app/api/orders/
  route.ts                         # [NEW] GET (list) + POST (create) user orders

app/api/orders/[id]/
  route.ts                         # [NEW] GET (detail) + PATCH (update status)

app/components/Header.tsx          # [MODIFIED] Replace mock login with real auth
app/order/page.tsx                 # [MODIFIED] Call POST /api/orders on payment step

package.json                       # [MODIFIED] Add next-auth, @supabase/supabase-js, bcryptjs
.env.local                         # [NEW] Created manually by developer
```

---

## Auth Flow Detail

### Login Flow

```
1. User clicks "登录" in Header
2. If Google OAuth:
   a. Redirect to /api/auth/signin → Google consent → callback
   b. signIn callback: UPSERT users table (email, name, avatar_url, google_id)
   c. jwt callback: inject supabase user_id (users.id) into JWT token.sub
   d. session callback: expose user.id, user.email, user.name to client
3. If Email/Password:
   a. User enters email + password in form
   b. Credentials authorize(): query Supabase users by email, bcrypt.compare password
   c. jwt callback: inject supabase user_id
4. Redirect back to original page (or /)
```

### Logout Flow

```
1. User clicks "退出"
2. NextAuth signOut() clears JWT cookie
3. Redirect to /
```

### Route Protection (middleware.ts)

```ts
// Routes that require authentication
export const config = {
  matcher: ["/order", "/orders", "/api/orders/:path*"]
};
// Unauthenticated users → redirect to /
```

---

## API Routes

### `POST /api/orders` — Create Order

**Auth:** Required (session.user.id)
**Body:** `{ plan: string, amount: number, payment_method?: string, access_token?: string }`
**Response:** `{ id: uuid, ...order }`

1. Lookup product by slug → get product_id
2. Insert into orders (user_id, product_id, plan, amount, payment_method, access_token)
3. Return created order

### `GET /api/orders` — List User Orders

**Auth:** Required
**Response:** `[{ id, plan, amount, status, product, created_at }]`

### `GET /api/orders/[id]` — Order Detail

**Auth:** Required, ownership check
**Response:** `{ id, ...order, product, payments }`

### `PATCH /api/orders/[id]` — Update Order Status

**Auth:** Required, ownership check
**Body:** `{ status: string, payment_method?: string }`
**Response:** `{ id, ...updated_order }`

---

## Supabase Client Design

### Server Client (`lib/supabase/server.ts`)

```ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
```

- Used in: API routes, Server Components, NextAuth callbacks
- Uses service_role key → bypasses RLS → full DB access
- Never imported in client components
- `persistSession: false` avoids cookie conflicts with NextAuth

### Browser Client (`lib/supabase/client.ts`)

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

- Used for: reading public data (products, etc.) on client side
- Uses anon key → RLS enforced
- Note: `NEXT_PUBLIC_SUPABASE_ANON_KEY` needs to be added to `.env.local`

---

## NextAuth Config (`lib/auth.ts`)

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email as string)
          .single();

        if (!user || !user.password_hash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string, user.password_hash
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.avatar_url };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        const { data } = await supabaseAdmin
          .from("users")
          .upsert({
            email: user.email!,
            name: user.name,
            avatar_url: user.image,
            google_id: account.providerAccountId,
          }, { onConflict: "email" })
          .select("id")
          .single();

        if (data) user.id = data.id;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;  // supabase users.id
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",  // Use homepage with modal/dropdown instead of dedicated page
  },
});
```

---

## Client Auth Helpers (`lib/auth-client.ts`)

```ts
"use client";
import { useSession } from "next-auth/react";
export { signIn, signOut, useSession };
```

---

## Header Integration (`app/components/Header.tsx`)

**Before (mock):**
```tsx
const [loggedIn, setLoggedIn] = useState(false);
<Button onClick={() => setLoggedIn(true)}>Sign in</Button>
```

**After (real):**
```tsx
"use client";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// In component:
const { data: session } = useSession();

{session ? (
  <div className="flex items-center gap-3">
    <Avatar className="size-8">
      <AvatarImage src={session.user?.image ?? ""} />
      <AvatarFallback>{session.user?.name?.[0] ?? "U"}</AvatarFallback>
    </Avatar>
    <span className="text-sm">{session.user?.name}</span>
    <Button variant="outline" size="sm" onClick={() => signOut()}>退出</Button>
  </div>
) : (
  <Button onClick={() => signIn("google")}>Google 登录</Button>
)}
```

---

## Order Page Integration (`app/order/page.tsx`)

Changes in the payment step:

```tsx
// When user clicks a payment method, create order via API
async function createOrder() {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan: planInfo.slug,
      amount: planInfo.price,
      payment_method: selectedMethod,
      access_token: tokenValue,
    }),
  });
  const order = await res.json();
  setOrderId(order.id);
}
```

---

## Dependencies

```bash
pnpm add next-auth@beta @auth/core
pnpm add @supabase/supabase-js
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

---

## Verification

After implementation, verify:

1. `pnpm lint` — no new errors
2. `node --test test/landing-order.test.mjs` — existing tests pass
3. Manual test: Google login → check Supabase users table has new row
4. Manual test: Email/password login → verify bcrypt comparison works
5. Manual test: Signed-in user visits /order → page renders with user info
6. Manual test: Signed-out user visits /order → redirected to /
7. Manual test: POST /api/orders creates order in DB with correct user_id
