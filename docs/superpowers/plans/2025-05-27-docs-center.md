# 文档中心（Docs Center）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 `/docs` 路由下的文档中心，包含 FAQ、使用指南、退款政策、支付方式等页面，采用左侧内容 + 右侧导航布局，支持长文阅读和用户评论系统。

**Architecture:** 使用 Next.js App Router 的嵌套路由实现文档层级结构。共享布局组件提供面包屑、右侧导航和移动端菜单。评论数据存储在 Supabase，通过 Next.js API Route 提供 CRUD 接口。

**Tech Stack:** Next.js 16.2.6, React 19.2.4, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, NextAuth.js

---

## 文件结构

### 新建文件

- `app/docs/layout.tsx` — 文档中心共享布局
- `app/docs/page.tsx` — /docs 重定向到 /docs/faq
- `app/docs/faq/page.tsx` — FAQ 页面（长文格式）
- `app/docs/guide/page.tsx` — 使用指南首页
- `app/docs/guide/token/page.tsx` — 如何获取 Token
- `app/docs/guide/recharge-plus/page.tsx` — 如何充值 Plus
- `app/docs/guide/recharge-pro/page.tsx` — 如何充值 Pro
- `app/docs/refund/page.tsx` — 退款政策
- `app/docs/payment/page.tsx` — 支付方式说明
- `app/api/docs/comments/route.ts` — 评论 API
- `app/components/docs/DocLayout.tsx` — 文档布局包装器
- `app/components/docs/DocSidebar.tsx` — 右侧导航组件
- `app/components/docs/DocBreadcrumb.tsx` — 面包屑组件
- `app/components/docs/DocToc.tsx` — 本页目录组件
- `app/components/docs/DocComments.tsx` — 评论区组件
- `app/components/docs/MobileNav.tsx` — 移动端导航 overlay
- `lib/docs/navigation.ts` — 导航配置数据
- `lib/docs/content.ts` — 文档内容数据

### 修改文件

- `app/components/FAQ.tsx` — 不再使用，但保留参考
- `app/layout.tsx` — 可能需要添加 docs 相关的 metadata

---

## Task 1: 创建导航配置和数据结构

**Files:**

- Create: `lib/docs/navigation.ts`
- Create: `lib/docs/content.ts`

- [ ] **Step 1: 创建导航配置**

Create `lib/docs/navigation.ts`:

```typescript
export interface DocNavItem {
    title: string;
    slug: string;
    href: string;
    children?: DocNavItem[];
}

export interface DocNavGroup {
    title: string;
    items: DocNavItem[];
}

export const docNavigation: DocNavGroup[] = [
    {
        title: '常见问题',
        items: [{ title: '常见问题总览', slug: 'faq', href: '/docs/faq' }],
    },
    {
        title: '使用指南',
        items: [
            { title: '使用指南首页', slug: 'guide', href: '/docs/guide' },
            { title: '如何获取 Token', slug: 'guide-token', href: '/docs/guide/token' },
            {
                title: '如何充值 Plus',
                slug: 'guide-recharge-plus',
                href: '/docs/guide/recharge-plus',
            },
            { title: '如何充值 Pro', slug: 'guide-recharge-pro', href: '/docs/guide/recharge-pro' },
        ],
    },
    {
        title: '退款政策',
        items: [{ title: '退款政策', slug: 'refund', href: '/docs/refund' }],
    },
    {
        title: '支付方式',
        items: [{ title: '支付方式说明', slug: 'payment', href: '/docs/payment' }],
    },
];

export function findDocBySlug(slug: string): DocNavItem | undefined {
    for (const group of docNavigation) {
        for (const item of group.items) {
            if (item.slug === slug) return item;
        }
    }
    return undefined;
}

export function findDocByHref(href: string): DocNavItem | undefined {
    for (const group of docNavigation) {
        for (const item of group.items) {
            if (item.href === href) return item;
        }
    }
    return undefined;
}
```

- [ ] **Step 2: 创建文档内容数据**

Create `lib/docs/content.ts`:

```typescript
export interface DocContent {
    title: string;
    description: string;
    sections: {
        heading: string;
        content: string;
    }[];
}

export const docContents: Record<string, DocContent> = {
    faq: {
        title: '常见问题',
        description: '关于 ChatGPT Plus / Pro 充值的常见疑问',
        sections: [
            {
                heading: 'Plus 代充安全吗？会不会导致封号？',
                content:
                    '我们通过官方支付渠道为您充值，整个过程无需您的账号密码，只需一个临时会话令牌，充值完成后立即删除。所有充值均走正规通道，至今已为零封号记录，已服务超过 1000 位用户。',
            },
            {
                heading: '没有海外信用卡，如何充值 Plus？',
                content:
                    '这正是 PayModels 的核心价值。您使用微信支付即可完成 ChatGPT Plus 订阅，不需要海外信用卡、PayPal 或任何外币账户。全程以人民币结算，简单便捷。',
            },
            {
                heading: '充值大概多久能到账？',
                content:
                    '充值由人工处理，通常 3–6 小时内完成。到账后我们会通过邮件通知您，您也可以在 ChatGPT 设置页面查看订阅状态。感谢您的耐心等待。',
            },
            {
                heading: 'Plus 代充多少钱？',
                content: '月卡 ¥189/月，支持微信支付。充值不成功全额退款，无任何隐藏费用。',
            },
            {
                heading: '如果充值失败了怎么办？',
                content:
                    '不成功全额退款是我们的承诺。如遇任何问题，可通过页面右下角联系客服，我们会第一时间响应并为您处理。',
            },
            {
                heading: '除了 Plus，还支持哪些服务？',
                content:
                    '目前支持 ChatGPT Plus 月卡，以及 ChatGPT Pro 5X（$120/月）和 Pro 20X（$225/月）的代充。后续将陆续支持更多 AI 服务，敬请期待。',
            },
        ],
    },
    // 其他文档内容将在后续步骤中添加
};
```

- [ ] **Step 3: Commit**

```bash
git add lib/docs/navigation.ts lib/docs/content.ts
git commit -m "feat(docs): add navigation config and content data structures"
```

---

## Task 2: 创建右侧导航组件（DocSidebar）

**Files:**

- Create: `app/components/docs/DocSidebar.tsx`

- [ ] **Step 1: 创建 DocSidebar 组件**

Create `app/components/docs/DocSidebar.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { docNavigation, DocNavGroup } from '@/lib/docs/navigation';
import { Separator } from '@/components/ui/separator';

export function DocSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
        <nav className="flex flex-col gap-6">
          {/* 全局文档导航 */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              文档导航
            </h3>
            <div className="flex flex-col gap-1">
              {docNavigation.map((group) => (
                <NavGroup
                  key={group.title}
                  group={group}
                  currentPath={pathname}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function NavGroup({
  group,
  currentPath,
}: {
  group: DocNavGroup;
  currentPath: string;
}) {
  const isActive = group.items.some((item) => item.href === currentPath);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {group.title}
      </button>
      {isOpen && (
        <div className="flex flex-col ml-5 border-l border-border">
          {group.items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={`py-1.5 pl-3 text-sm transition-colors ${
                currentPath === item.href
                  ? 'text-primary font-medium border-l-2 border-primary -ml-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/docs/DocSidebar.tsx
git commit -m "feat(docs): add DocSidebar component with collapsible navigation groups"
```

---

## Task 3: 创建本页目录组件（DocToc）

**Files:**

- Create: `app/components/docs/DocToc.tsx`

- [ ] **Step 1: 创建 DocToc 组件**

Create `app/components/docs/DocToc.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 提取 h2, h3 标题
    const elements = document.querySelectorAll('article h2, article h3');
    const items: TocItem[] = Array.from(elements).map((el, index) => {
      const id = el.id || `heading-${index}`;
      if (!el.id) el.id = id;
      return {
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      };
    });
    setHeadings(items);

    // 滚动监听
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        本页目录
      </h3>
      <nav className="flex flex-col gap-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`text-left text-sm py-1 transition-colors ${
              heading.level === 3 ? 'pl-3' : ''
            } ${
              activeId === heading.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/docs/DocToc.tsx
git commit -m "feat(docs): add DocToc component with scroll spy"
```

---

## Task 4: 创建面包屑组件（DocBreadcrumb）

**Files:**

- Create: `app/components/docs/DocBreadcrumb.tsx`

- [ ] **Step 1: 创建 DocBreadcrumb 组件**

Create `app/components/docs/DocBreadcrumb.tsx`:

```typescript
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { docNavigation } from '@/lib/docs/navigation';

interface DocBreadcrumbProps {
  currentSlug: string;
}

export function DocBreadcrumb({ currentSlug }: DocBreadcrumbProps) {
  // 找到当前页面在导航中的位置
  let currentItem = null;
  let currentGroup = null;

  for (const group of docNavigation) {
    for (const item of group.items) {
      if (item.slug === currentSlug) {
        currentItem = item;
        currentGroup = group;
        break;
      }
    }
    if (currentItem) break;
  }

  if (!currentItem || !currentGroup) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link
        href="/"
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
        首页
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/docs" className="hover:text-foreground transition-colors">
        文档
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground">{currentGroup.title}</span>
      {currentItem.title !== currentGroup.title && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{currentItem.title}</span>
        </>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/docs/DocBreadcrumb.tsx
git commit -m "feat(docs): add DocBreadcrumb component"
```

---

## Task 5: 创建移动端导航组件（MobileNav）

**Files:**

- Create: `app/components/docs/MobileNav.tsx`

- [ ] **Step 1: 创建 MobileNav 组件**

Create `app/components/docs/MobileNav.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { docNavigation, DocNavGroup } from '@/lib/docs/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-md transition-colors">
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开导航菜单</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold">文档导航</span>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {docNavigation.map((group) => (
                <MobileNavGroup
                  key={group.title}
                  group={group}
                  currentPath={pathname}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavGroup({
  group,
  currentPath,
  onNavigate,
}: {
  group: DocNavGroup;
  currentPath: string;
  onNavigate: () => void;
}) {
  const isActive = group.items.some((item) => item.href === currentPath);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-2 text-sm font-medium text-foreground"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {group.title}
      </button>
      {isOpen && (
        <div className="flex flex-col ml-5 border-l border-border">
          {group.items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              onClick={onNavigate}
              className={`py-2 pl-3 text-sm transition-colors ${
                currentPath === item.href
                  ? 'text-primary font-medium border-l-2 border-primary -ml-[2px]'
                  : 'text-muted-foreground'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/docs/MobileNav.tsx
git commit -m "feat(docs): add MobileNav component with Sheet overlay"
```

---

## Task 6: 创建文档布局组件（DocLayout）

**Files:**

- Create: `app/components/docs/DocLayout.tsx`

- [ ] **Step 1: 创建 DocLayout 组件**

Create `app/components/docs/DocLayout.tsx`:

```typescript
import { ReactNode } from 'react';
import { DocSidebar } from './DocSidebar';
import { DocToc } from './DocToc';
import { DocBreadcrumb } from './DocBreadcrumb';
import { MobileNav } from './MobileNav';
import { Separator } from '@/components/ui/separator';

interface DocLayoutProps {
  children: ReactNode;
  slug: string;
  showToc?: boolean;
}

export function DocLayout({ children, slug, showToc = true }: DocLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 移动端导航和面包屑 */}
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <MobileNav />
      </div>

      <div className="flex gap-8 lg:gap-12">
        {/* 左侧内容区 */}
        <div className="flex-1 min-w-0">
          <DocBreadcrumb currentSlug={slug} />

          <article className="prose prose-slate max-w-none">
            {children}
          </article>
        </div>

        {/* 右侧导航 */}
        <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
          <div className="sticky top-24">
            <DocSidebar />
            <Separator className="my-6" />
            {showToc && <DocToc />}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/docs/DocLayout.tsx
git commit -m "feat(docs): add DocLayout wrapper component"
```

---

## Task 7: 创建评论 API

**Files:**

- Create: `app/api/docs/comments/route.ts`

- [ ] **Step 1: 创建评论 API Route**

Create `app/api/docs/comments/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/docs/comments?slug={doc_slug}
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('pm_doc_comments')
        .select(
            `
      id,
      content,
      created_at,
      user:user_id (
        id,
        name,
        avatar_url
      )
    `
        )
        .eq('doc_slug', slug)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments: data || [] });
}

// POST /api/docs/comments
export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { slug, content } = body;

        if (!slug || !content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Missing slug or content' }, { status: 400 });
        }

        // 清理内容，防止 XSS
        const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();

        const { data, error } = await supabaseAdmin
            .from('pm_doc_comments')
            .insert({
                doc_slug: slug,
                user_id: session.user.id,
                content: sanitizedContent,
            })
            .select(
                `
        id,
        content,
        created_at,
        user:user_id (
          id,
          name,
          avatar_url
        )
      `
            )
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ comment: data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/docs/comments/route.ts
git commit -m "feat(docs): add comments API with GET and POST endpoints"
```

---

## Task 8: 创建评论区组件（DocComments）

**Files:**

- Create: `app/components/docs/DocComments.tsx`

- [ ] **Step 1: 创建 DocComments 组件**

Create `app/components/docs/DocComments.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from '@/lib/utils';
import { LoginDialog } from '@/app/components/LoginDialog';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
}

interface DocCommentsProps {
  slug: string;
}

export function DocComments({ slug }: DocCommentsProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/docs/comments?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/docs/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data.comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">评论区</h2>

      {/* 评论输入区 */}
      {status === 'loading' ? (
        <div className="text-muted-foreground">加载中...</div>
      ) : session?.user ? (
        <div className="flex gap-4 mb-8">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback>
              {session.user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col gap-3">
            <Textarea
              placeholder="发表您的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                以 {session.user.name || '用户'} 发表评论
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting ? '发表中...' : '发表评论'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center mb-8">
          <p className="text-muted-foreground mb-4">登录后发表评论</p>
          <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
            登录
          </Button>
        </div>
      )}

      {/* 登录弹窗 */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />

      {/* 评论列表 */}
      <div className="flex flex-col gap-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            暂无评论，成为第一个评论的人吧！
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.user.avatar_url || undefined} />
                <AvatarFallback>
                  {comment.user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.user.name || '匿名用户'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at))}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 添加时间格式化工具函数**

如果 `lib/utils.ts` 中没有 `formatDistanceToNow`，需要添加：

Modify `lib/utils.ts`:

```typescript
export function formatDistanceToNow(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/docs/DocComments.tsx lib/utils.ts
git commit -m "feat(docs): add DocComments component with auth integration"
```

---

## Task 9: 创建 Supabase 评论表

**Files:**

- 需要执行 SQL 创建表

- [ ] **Step 1: 创建评论表 SQL**

在 Supabase Dashboard 中执行以下 SQL：

```sql
-- 创建评论表
CREATE TABLE IF NOT EXISTS pm_doc_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doc_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES pm_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_doc_comments_slug ON pm_doc_comments(doc_slug);
CREATE INDEX idx_doc_comments_user ON pm_doc_comments(user_id);
CREATE INDEX idx_doc_comments_created_at ON pm_doc_comments(created_at DESC);

-- 添加 RLS 策略
ALTER TABLE pm_doc_comments ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取评论
CREATE POLICY "Allow public read access" ON pm_doc_comments
    FOR SELECT USING (true);

-- 只允许已登录用户插入自己的评论
CREATE POLICY "Allow authenticated insert" ON pm_doc_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

- [ ] **Step 2: Commit**（记录迁移）

```bash
# 创建一个迁移记录文件
mkdir -p supabase/migrations
```

Create `supabase/migrations/20250527_create_doc_comments.sql`:

```sql
-- 创建评论表
CREATE TABLE IF NOT EXISTS pm_doc_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doc_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES pm_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_doc_comments_slug ON pm_doc_comments(doc_slug);
CREATE INDEX idx_doc_comments_user ON pm_doc_comments(user_id);
CREATE INDEX idx_doc_comments_created_at ON pm_doc_comments(created_at DESC);

-- 添加 RLS 策略
ALTER TABLE pm_doc_comments ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取评论
CREATE POLICY "Allow public read access" ON pm_doc_comments
    FOR SELECT USING (true);

-- 只允许已登录用户插入自己的评论
CREATE POLICY "Allow authenticated insert" ON pm_doc_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

```bash
git add supabase/migrations/20250527_create_doc_comments.sql
git commit -m "feat(docs): add Supabase migration for pm_doc_comments table"
```

---

## Task 10: 创建文档页面

**Files:**

- Create: `app/docs/layout.tsx`
- Create: `app/docs/page.tsx`
- Create: `app/docs/faq/page.tsx`
- Create: `app/docs/guide/page.tsx`
- Create: `app/docs/guide/token/page.tsx`
- Create: `app/docs/guide/recharge-plus/page.tsx`
- Create: `app/docs/guide/recharge-pro/page.tsx`
- Create: `app/docs/refund/page.tsx`
- Create: `app/docs/payment/page.tsx`

- [ ] **Step 1: 创建共享布局**

Create `app/docs/layout.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文档中心',
  description: 'PayModels 产品文档、常见问题、使用指南、退款政策和支付方式说明',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: 创建 /docs 重定向页面**

Create `app/docs/page.tsx`:

```typescript
import { redirect } from 'next/navigation';

export default function DocsPage() {
    redirect('/docs/faq');
}
```

- [ ] **Step 3: 创建 FAQ 页面**

Create `app/docs/faq/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';
import { docContents } from '@/lib/docs/content';

export const metadata: Metadata = {
  title: '常见问题',
  description: '关于 ChatGPT Plus / Pro 充值的常见疑问',
};

export default function FAQPage() {
  const content = docContents.faq;

  return (
    <DocLayout slug="faq">
      <h1 className="text-3xl font-bold tracking-tight mb-4">{content.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{content.description}</p>

      <div className="flex flex-col gap-8">
        {content.sections.map((section, index) => (
          <section key={index} id={`heading-${index}`}>
            <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
            <p className="text-base leading-relaxed text-foreground">
              {section.content}
            </p>
          </section>
        ))}
      </div>

      <DocComments slug="faq" />
    </DocLayout>
  );
}
```

- [ ] **Step 4: 创建使用指南首页**

Create `app/docs/guide/page.tsx`:

```typescript
import { Metadata } from 'next';
import Link from 'next/link';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { docNavigation } from '@/lib/docs/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: '使用指南',
  description: 'ChatGPT Plus / Pro 充值详细使用指南',
};

export default function GuidePage() {
  const guideGroup = docNavigation.find((g) => g.title === '使用指南');
  const guideItems = guideGroup?.items.filter((item) => item.slug !== 'guide') || [];

  return (
    <DocLayout slug="guide" showToc={false}>
      <h1 className="text-3xl font-bold tracking-tight mb-4">使用指南</h1>
      <p className="text-lg text-muted-foreground mb-8">
        了解如何获取 Token、充值 Plus 和 Pro 的详细步骤
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guideItems.map((item) => (
          <Link key={item.slug} href={item.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>点击查看详细教程</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </DocLayout>
  );
}
```

- [ ] **Step 5: 创建 Token 指南页面**

Create `app/docs/guide/token/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '如何获取 Token',
  description: '获取 ChatGPT Access Token 的详细步骤',
};

export default function TokenGuidePage() {
  return (
    <DocLayout slug="guide-token">
      <h1 className="text-3xl font-bold tracking-tight mb-4">如何获取 Token</h1>
      <p className="text-lg text-muted-foreground mb-8">
        本文将详细介绍如何获取 ChatGPT 的 Access Token，用于充值服务
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">什么是 Access Token</h2>
        <p className="text-base leading-relaxed">
          Access Token 是 ChatGPT 官方提供的临时会话令牌，用于验证您的账号身份。
          它不包含您的密码信息，且仅在本次充值过程中使用，充值完成后立即失效。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">获取步骤</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>登录 ChatGPT</strong>
            <p className="mt-2 ml-6">访问 chatgpt.com 并使用您的账号登录</p>
          </li>
          <li>
            <strong>打开开发者工具</strong>
            <p className="mt-2 ml-6">按 F12 或右键选择「检查」打开开发者工具</p>
          </li>
          <li>
            <strong>找到 Network 标签</strong>
            <p className="mt-2 ml-6">切换到 Network（网络）标签页</p>
          </li>
          <li>
            <strong>刷新页面</strong>
            <p className="mt-2 ml-6">按 F5 刷新页面，查看网络请求</p>
          </li>
          <li>
            <strong>找到 session 请求</strong>
            <p className="mt-2 ml-6">搜索包含 "session" 的请求，在 Response 中找到 accessToken</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">注意事项</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>Token 有效期通常为 1-2 小时，请尽快使用</li>
          <li>不要将 Token 分享给他人</li>
          <li>如果遇到问题，请联系客服获取帮助</li>
        </ul>
      </section>

      <DocComments slug="guide-token" />
    </DocLayout>
  );
}
```

- [ ] **Step 6: 创建 Plus 充值指南页面**

Create `app/docs/guide/recharge-plus/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '如何充值 Plus',
  description: 'ChatGPT Plus 充值详细教程',
};

export default function RechargePlusPage() {
  return (
    <DocLayout slug="guide-recharge-plus">
      <h1 className="text-3xl font-bold tracking-tight mb-4">如何充值 Plus</h1>
      <p className="text-lg text-muted-foreground mb-8">
        通过 PayModels 充值 ChatGPT Plus 的详细步骤
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">准备事项</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>确保您的 ChatGPT 账号可以正常登录</li>
          <li>准备好您的 Access Token（详见「如何获取 Token」指南）</li>
          <li>确认您的微信账户有足够余额</li>
        </ul>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">充值步骤</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>访问充值页面</strong>
            <p className="mt-2 ml-6">前往 paymodels.info/order?plan=plus</p>
          </li>
          <li>
            <strong>确认订单信息</strong>
            <p className="mt-2 ml-6">核对充值金额和服务内容</p>
          </li>
          <li>
            <strong>粘贴 Token</strong>
            <p className="mt-2 ml-6">在指定区域粘贴您的 Access Token</p>
          </li>
          <li>
            <strong>选择支付方式</strong>
            <p className="mt-2 ml-6">选择微信支付并完成付款</p>
          </li>
          <li>
            <strong>等待处理</strong>
            <p className="mt-2 ml-6">充值通常在 3-6 小时内完成</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">充值后验证</h2>
        <p className="text-base leading-relaxed">
          充值完成后，您可以登录 ChatGPT 查看订阅状态。Plus 会员将享受更快的响应速度、
          优先访问权以及 GPT-4 模型的使用权限。
        </p>
      </section>

      <DocComments slug="guide-recharge-plus" />
    </DocLayout>
  );
}
```

- [ ] **Step 7: 创建 Pro 充值指南页面**

Create `app/docs/guide/recharge-pro/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '如何充值 Pro',
  description: 'ChatGPT Pro 充值详细教程',
};

export default function RechargeProPage() {
  return (
    <DocLayout slug="guide-recharge-pro">
      <h1 className="text-3xl font-bold tracking-tight mb-4">如何充值 Pro</h1>
      <p className="text-lg text-muted-foreground mb-8">
        ChatGPT Pro 5X 和 Pro 20X 充值指南
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pro 计划介绍</h2>
        <p className="text-base leading-relaxed">
          ChatGPT Pro 是面向高频用户的升级方案，提供更高级的功能和更大的使用额度。
          目前支持 Pro 5X（$120/月）和 Pro 20X（$225/月）两种方案。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">充值流程</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>选择方案</strong>
            <p className="mt-2 ml-6">根据您的需求选择 Pro 5X 或 Pro 20X</p>
          </li>
          <li>
            <strong>访问对应页面</strong>
            <p className="mt-2 ml-6">Pro 5X: /order?plan=pro5x；Pro 20X: /order?plan=pro20x</p>
          </li>
          <li>
            <strong>完成支付</strong>
            <p className="mt-2 ml-6">支持微信支付和 Stripe 支付</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">常见问题</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>Pro 充值后功能何时生效？通常在 3-6 小时内</li>
          <li>可以升级现有 Plus 到 Pro 吗？可以，联系客服处理</li>
          <li>Pro 有使用限制吗？有月度额度限制，详见具体方案说明</li>
        </ul>
      </section>

      <DocComments slug="guide-recharge-pro" />
    </DocLayout>
  );
}
```

- [ ] **Step 8: 创建退款政策页面**

Create `app/docs/refund/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '退款政策',
  description: 'PayModels 充值失败全额退款政策说明',
};

export default function RefundPage() {
  return (
    <DocLayout slug="refund">
      <h1 className="text-3xl font-bold tracking-tight mb-4">退款政策</h1>
      <p className="text-lg text-muted-foreground mb-8">
        不成功全额退款是我们的承诺
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">退款原则</h2>
        <p className="text-base leading-relaxed">
          如果由于任何原因导致您的充值未能成功完成，我们将全额退还您支付的所有费用。
          无需任何理由，无需复杂流程，退款将在 3-5 个工作日内原路返回。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">退款流程</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>联系客服</strong>
            <p className="mt-2 ml-6">通过页面右下角的客服按钮或邮件联系</p>
          </li>
          <li>
            <strong>提供信息</strong>
            <p className="mt-2 ml-6">提供订单号和支付凭证</p>
          </li>
          <li>
            <strong>审核处理</strong>
            <p className="mt-2 ml-6">我们将在 24 小时内审核并处理</p>
          </li>
          <li>
            <strong>退款到账</strong>
            <p className="mt-2 ml-6">3-5 个工作日内原路退回</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">注意事项</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>已成功完成的充值不支持退款</li>
          <li>退款将退回至原支付账户</li>
          <li>如有疑问请联系客服获取帮助</li>
        </ul>
      </section>

      <DocComments slug="refund" />
    </DocLayout>
  );
}
```

- [ ] **Step 9: 创建支付方式说明页面**

Create `app/docs/payment/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '支付方式说明',
  description: 'PayModels 支持的支付方式介绍',
};

export default function PaymentPage() {
  return (
    <DocLayout slug="payment">
      <h1 className="text-3xl font-bold tracking-tight mb-4">支付方式说明</h1>
      <p className="text-lg text-muted-foreground mb-8">
        我们支持多种支付方式，确保您能够便捷地完成充值
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">微信支付</h2>
        <p className="text-base leading-relaxed">
          支持微信扫码支付，无需海外信用卡，全程以人民币结算。
          支付成功后系统将自动处理您的充值订单。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Stripe 支付</h2>
        <p className="text-base leading-relaxed">
          支持国际信用卡和借记卡支付，通过 Stripe 安全支付网关处理。
          支持 Visa、MasterCard、American Express 等主流信用卡。
        </p>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">支付安全</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>所有支付通过加密通道传输</li>
          <li>不存储您的银行卡信息</li>
          <li>支持支付失败自动重试</li>
        </ul>
      </section>

      <DocComments slug="payment" />
    </DocLayout>
  );
}
```

- [ ] **Step 10: Commit**

```bash
git add app/docs/
git commit -m "feat(docs): add all documentation pages with layout and comments"
```

---

## Task 11: 更新 Header 导航链接

**Files:**

- Modify: `app/components/Header.tsx`

- [ ] **Step 1: 在 Header 中添加文档中心入口**

检查 `app/components/Header.tsx`，找到导航链接区域，添加文档中心链接：

```typescript
// 在导航链接中添加
<Link href="/docs" className="...">
  帮助文档
</Link>
```

具体实现取决于现有 Header 组件的结构。

- [ ] **Step 2: Commit**

```bash
git add app/components/Header.tsx
git commit -m "feat(docs): add docs link to header navigation"
```

---

## Task 12: 运行测试和验证

**Files:**

- 测试整个文档中心功能

- [ ] **Step 1: 运行现有测试**

```bash
node --test test/landing-order.test.mjs
```

预期：所有现有测试通过。

- [ ] **Step 2: 运行 lint**

```bash
pnpm lint
```

预期：无新增错误（允许现有警告）。

- [ ] **Step 3: 验证路由**

访问以下 URL 验证页面是否正常：

- `http://localhost:3000/docs` → 应重定向到 `/docs/faq`
- `http://localhost:3000/docs/faq` → 显示 FAQ 页面
- `http://localhost:3000/docs/guide` → 显示使用指南首页
- `http://localhost:3000/docs/guide/token` → 显示 Token 指南
- `http://localhost:3000/docs/refund` → 显示退款政策
- `http://localhost:3000/docs/payment` → 显示支付方式

- [ ] **Step 4: 验证响应式**

在浏览器 DevTools 中切换到移动端视图：

- 确认汉堡菜单显示
- 点击汉堡菜单展开导航面板
- 确认导航链接可点击跳转

- [ ] **Step 5: 验证评论功能**

在任意文档页面底部：

- 未登录状态：显示「登录后发表评论」按钮
- 点击登录按钮：弹出登录对话框
- 登录后：显示评论输入框
- 输入内容并点击发表：评论显示在列表顶部

- [ ] **Step 6: Commit**

```bash
git commit -m "test(docs): verify all docs pages and comment functionality"
```

---

## 验收清单

- [ ] `/docs` 重定向到 `/docs/faq`
- [ ] 桌面端显示「左侧内容 + 右侧导航」布局
- [ ] 移动端显示汉堡菜单，点击展开导航 overlay
- [ ] 右侧导航支持分组展开/折叠
- [ ] 当前页面在导航中高亮
- [ ] 本页目录自动提取 h2/h3，滚动时高亮当前章节
- [ ] FAQ 页面使用长文格式，不再用手风琴
- [ ] 每个文档页面底部有评论区
- [ ] 未登录用户看到登录提示
- [ ] 登录用户可以发表评论
- [ ] 评论按时间倒序显示
- [ ] 面包屑导航正确显示当前位置
- [ ] 所有页面使用现有 shadcn 主题 token
- [ ] 移动端体验良好
- [ ] `node --test test/landing-order.test.mjs` 通过
- [ ] `pnpm lint` 无新增错误
