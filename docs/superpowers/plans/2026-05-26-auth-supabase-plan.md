# Auth + Supabase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate NextAuth v5 (Google + Credentials) and Supabase as the database backend for the paymodels checkout site.

**Architecture:** NextAuth v5 handles JWT-based auth with Google OAuth and email/password credentials. signIn callback syncs user to Supabase. API routes use service_role key for DB operations. Middleware protects `/order` and `/api/orders/*`.

**Tech Stack:** next-auth@beta, @supabase/supabase-js, bcryptjs, Next.js 16.2.6, React 19.2.4, Tailwind v4

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Run install commands**

```bash
pnpm add next-auth@beta
pnpm add @supabase/supabase-js
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

Expected: Dependencies added to `package.json` and `pnpm-lock.yaml`.

---

### Task 2: Create Environment Variable Template

**Files:**
- Create: `.env.local`

- [ ] **Step 1: Write .env.local template**

```bash
# NextAuth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

This file is `.gitignore`d. Developer fills in values manually. Generate `AUTH_SECRET` with `openssl rand -base64 32`.

---

### Task 3: Create Supabase Server Client

**Files:**
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Write server client**

```ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
```

Used by: API routes, NextAuth callbacks, Server Components. Uses service_role key → bypasses RLS.

---

### Task 4: Create Supabase Browser Client

**Files:**
- Create: `lib/supabase/client.ts`

- [ ] **Step 1: Write browser client**

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Used for: reading public data (products) on client side. Uses anon key → RLS enforced.

---

### Task 5: Create NextAuth Session Type Augmentation

**Files:**
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: Write type augmentation**

```ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
```

This adds `session.user.id` (Supabase users.id) to the type system.

---

### Task 6: Create NextAuth Configuration

**Files:**
- Create: `lib/auth.ts`

- [ ] **Step 1: Write auth config**

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
          credentials.password as string,
          user.password_hash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        const { data } = await supabaseAdmin
          .from("users")
          .upsert(
            {
              email: user.email!,
              name: user.name,
              avatar_url: user.image,
              google_id: account.providerAccountId,
            },
            { onConflict: "email" }
          )
          .select("id")
          .single();

        if (data) user.id = data.id;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
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
    signIn: "/",
  },
});
```

---

### Task 7: Create NextAuth API Route Handler

**Files:**
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Write route handler**

```ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

This exposes NextAuth endpoints at `/api/auth/signin`, `/api/auth/callback`, etc.

---

### Task 8: Create Client Auth Helper

**Files:**
- Create: `lib/auth-client.ts`

- [ ] **Step 1: Write client helper**

```ts
"use client";

import { useSession } from "next-auth/react";

export { signIn, signOut, useSession } from "next-auth/react";
```

Re-exports client-side hooks with `"use client"` directive already applied.

---

### Task 9: Create Route Protection Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Write middleware**

```ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/order", "/orders", "/api/orders/:path*"],
};
```

Unauthenticated users visiting `/order` or order API routes will be redirected to `/` (signIn page).

---

### Task 10: Add SessionProvider to Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Read current file**

Current `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import ContactFloat from './components/ContactFloat';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <ContactFloat />
            </body>
        </html>
    );
}
```

- [ ] **Step 2: Add SessionProvider wrapper**

Replace the `export default function RootLayout` block with:

```tsx
import { SessionProvider } from "next-auth/react";

// ... keep all imports above ...

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <SessionProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <ContactFloat />
                </SessionProvider>
            </body>
        </html>
    );
}
```

`SessionProvider` must wrap the entire app tree so `useSession()` works in all components.

---

### Task 11: Create Orders API Route (List + Create)

**Files:**
- Create: `app/api/orders/route.ts`

- [ ] **Step 1: Write orders route handler**

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*, product:products(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json();
  const { plan, amount, payment_method, access_token } = body;

  if (!plan || !amount) {
    return NextResponse.json(
      { error: "缺少必要参数 plan 或 amount" },
      { status: 400 }
    );
  }

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id")
    .eq("slug", plan)
    .single();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: session.user.id,
      product_id: product?.id ?? null,
      plan,
      amount,
      payment_method: payment_method ?? null,
      access_token: access_token ?? null,
      status: "pending",
    })
    .select("*, product:products(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(order, { status: 201 });
}
```

---

### Task 12: Create Order Detail API Route (Get + Update)

**Files:**
- Create: `app/api/orders/[id]/route.ts`

- [ ] **Step 1: Write order detail route handler**

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*, product:products(*), payments(*)")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .update({
      status: body.status,
      payment_method: body.payment_method,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*, product:products(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(order);
}
```

---

### Task 13: Modify Header to Use Real Auth

**Files:**
- Modify: `app/components/Header.tsx`

- [ ] **Step 1: Read current file**

Current state (168 lines):

```tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, HelpCircle, BookOpen, Sparkles, Zap, LogIn, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const menus = [
    { label: '首页', href: '/', icon: Home },
    { label: '常见问题', href: '/faq', icon: HelpCircle },
    { label: '教程', href: '/tutorials', icon: BookOpen },
    { label: 'Gemini', href: '/gemini', icon: Sparkles },
    { label: 'Grok', href: '/grok', icon: Zap },
];

export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ... rest of component
}
```

- [ ] **Step 2: Replace state and Desktop auth buttons**

In imports, add:
```tsx
import { AvatarImage } from '@/components/ui/avatar';
import { signIn, signOut, useSession } from '@/lib/auth-client';
```

Replace:
```tsx
const [loggedIn, setLoggedIn] = useState(false);
```
with:
```tsx
const { data: session } = useSession();
```

Replace the Desktop auth section (lines 66-87):
```tsx
{loggedIn ? (
    <div className="hidden items-center gap-2 sm:flex">
        <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">
                <Search />
                查询订单
            </Link>
        </Button>
        <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">U</AvatarFallback>
        </Avatar>
    </div>
) : (
    <Button
        size="sm"
        className="hidden sm:inline-flex"
        onClick={() => setLoggedIn(true)}
    >
        <LogIn />
        Sign in
    </Button>
)}
```

with:
```tsx
{session ? (
    <div className="hidden items-center gap-2 sm:flex">
        <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">
                <Search data-icon="inline-start" />
                查询订单
            </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
            退出
        </Button>
        <Avatar className="size-8">
            <AvatarImage src={session.user?.image ?? ""} />
            <AvatarFallback className="text-xs">
                {session.user?.name?.[0] ?? "U"}
            </AvatarFallback>
        </Avatar>
    </div>
) : (
    <Button
        size="sm"
        className="hidden sm:inline-flex"
        onClick={() => signIn("google")}
    >
        <LogIn data-icon="inline-start" />
        登录
    </Button>
)}
```

- [ ] **Step 3: Replace Mobile Sheet auth section (lines 131-162)**

Replace:
```tsx
<div className="mt-6 border-t pt-4">
    {loggedIn ? (
        <div className="flex items-center justify-between">
            <Button
                variant="outline"
                size="sm"
                asChild
                onClick={() => setMobileOpen(false)}
            >
                <Link href="/orders">
                    <Search />
                    查询订单
                </Link>
            </Button>
            <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
        </div>
    ) : (
        <Button
            className="w-full"
            onClick={() => {
                setLoggedIn(true);
                setMobileOpen(false);
            }}
        >
            <LogIn />
            Sign in
        </Button>
    )}
</div>
```

with:
```tsx
<div className="mt-6 border-t pt-4">
    {session ? (
        <div className="flex items-center justify-between">
            <Button
                variant="outline"
                size="sm"
                asChild
                onClick={() => setMobileOpen(false)}
            >
                <Link href="/orders">
                    <Search data-icon="inline-start" />
                    查询订单
                </Link>
            </Button>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                >
                    退出
                </Button>
                <Avatar className="size-8">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback className="text-xs">
                        {session.user?.name?.[0] ?? "U"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    ) : (
        <Button
            className="w-full"
            onClick={() => {
                signIn("google");
                setMobileOpen(false);
            }}
        >
            <LogIn data-icon="inline-start" />
            登录
        </Button>
    )}
</div>
```

- [ ] **Step 4: Remove unused `useState` import**

Remove `useState` from the import:
```tsx
import { useEffect } from 'react';
```

---

### Task 14: Modify Order Page to Call Create Order API

**Files:**
- Modify: `app/order/page.tsx`

- [ ] **Step 1: Add `orderId` state and `createOrder` function**

After the existing state declarations (line 171):

```tsx
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
```

Add:
```tsx
const [orderId, setOrderId] = useState<string | null>(null);
const [isCreatingOrder, setIsCreatingOrder] = useState(false);
```

- [ ] **Step 2: Add `createOrder` function after state declarations**

After the `const hasToken = token.trim().length > 0;` line (line 175), add:

```tsx
const createOrder = async (method: PaymentMethod) => {
    if (!selected || isCreatingOrder) return;
    setIsCreatingOrder(true);
    try {
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                plan,
                amount: parseFloat(selected.price.replace(/[^0-9.]/g, "")),
                payment_method: method,
                access_token: token,
            }),
        });
        const data = await res.json();
        if (res.ok && data.id) {
            setOrderId(data.id);
        }
    } finally {
        setIsCreatingOrder(false);
    }
};
```

The function accepts `method` as parameter to avoid stale closure on `paymentMethod` state (React batches state updates, so `paymentMethod` in closure is still the old value when called in the same event handler).

- [ ] **Step 3: Modify payment method button onClick to call createOrder with method**

Replace lines 298-301:
```tsx
onClick={() => {
    setPaymentMethod(method.value);
    setCurrentStep(3);
}}
```

with:
```tsx
onClick={() => {
    setPaymentMethod(method.value);
    setCurrentStep(3);
    createOrder(method.value);
}}
```

- [ ] **Step 4: Add `orderId` to the completion step (step 4) Alert**

In the step 4 Alert (lines 451-459), add the order ID display. Replace:
```tsx
<AlertTitle>
    升级请求已提交，客服会按订单信息开始处理。
</AlertTitle>
```

with:
```tsx
<AlertTitle>
    升级请求已提交，客服会按订单信息开始处理。
</AlertTitle>
{orderId && (
    <AlertDescription>
        订单编号：{orderId}
    </AlertDescription>
)}
```

Note: this adds the orderId line *after* the existing `<AlertDescription>` block on line 456-458. The final block becomes:

```tsx
{currentStep === 4 && (
    <Alert className="border-primary/20 bg-primary/5">
        <Check className="size-4 text-primary" />
        <AlertTitle>
            升级请求已提交，客服会按订单信息开始处理。
        </AlertTitle>
        {orderId && (
            <AlertDescription>
                订单编号：{orderId}
            </AlertDescription>
        )}
        <AlertDescription>
            如需核对订单，可提供所选方案和支付方式。
        </AlertDescription>
    </Alert>
)}
```

---

### Task 15: Database Schema (Manual SQL)

**Files:**
- Reference: SQL schema in spec at `docs/superpowers/specs/2026-05-26-auth-supabase-design.md`

This task is **manual** — run in Supabase SQL Editor.

- [ ] **Step 1: Open your Supabase project dashboard → SQL Editor**

- [ ] **Step 2: Run the complete SQL from the spec** (sections: `users`, `products`, `orders`, `payments`, RLS policies)

- [ ] **Step 3: Verify tables exist** — check Table Editor in Supabase dashboard shows all 4 tables with correct columns

- [ ] **Step 4: Set up Google OAuth in Google Cloud Console**

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID → `AUTH_GOOGLE_ID` in `.env.local`
5. Copy Client Secret → `AUTH_GOOGLE_SECRET` in `.env.local`

- [ ] **Step 5: Fill in Supabase env vars**

1. Go to Supabase project dashboard → Settings → API
2. Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **Step 6: Generate AUTH_SECRET**

```bash
openssl rand -base64 32
```

Paste output → `AUTH_SECRET` in `.env.local`.

---

### Task 16: Verification

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: No new errors (existing warning about unused `Icon` import in `Testimonials.tsx` is pre-existing).

- [ ] **Step 2: Run existing regression tests**

```bash
node --test test/landing-order.test.mjs
```

Expected: All 20 tests pass.

- [ ] **Step 3: Manual verification checklist**

1. Start dev server: `pnpm dev`
2. Visit `/` — Header shows "登录" button
3. Click "登录" → redirects to Google OAuth
4. After Google login → Header shows user avatar + name + "退出" button
5. Visit `/order?plan=plus` — page renders normally with logged-in state
6. Logout → Visit `/order` — redirected to `/`
7. Log back in, paste Token, select payment method → check Supabase `orders` table has new row with correct user_id

---
