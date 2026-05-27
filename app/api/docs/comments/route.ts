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
    .select(`
      id,
      content,
      created_at,
      user:user_id (
        id,
        name,
        avatar_url
      )
    `)
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
      return NextResponse.json(
        { error: 'Missing slug or content' },
        { status: 400 }
      );
    }

    // 清理内容，防止 XSS
    const sanitizedContent = content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim();

    const { data, error } = await supabaseAdmin
      .from('pm_doc_comments')
      .insert({
        doc_slug: slug,
        user_id: session.user.id,
        content: sanitizedContent,
      })
      .select(`
        id,
        content,
        created_at,
        user:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
