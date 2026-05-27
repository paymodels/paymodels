import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: '\u672a\u767b\u5f55' }, { status: 401 });
    }

    const { id } = await params;

    const { data: order, error } = await supabaseAdmin
        .from('pm_orders')
        .select('*, product:pm_products(*), pm_payments(*)')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

    if (error || !order) {
        return NextResponse.json({ error: '\u8ba2\u5355\u4e0d\u5b58\u5728' }, { status: 404 });
    }

    return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: '\u672a\u767b\u5f55' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { data: existing } = await supabaseAdmin
        .from('pm_orders')
        .select('id')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

    if (!existing) {
        return NextResponse.json({ error: '\u8ba2\u5355\u4e0d\u5b58\u5728' }, { status: 404 });
    }

    const { data: order, error } = await supabaseAdmin
        .from('pm_orders')
        .update({
            status: body.status,
            payment_method: body.payment_method,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*, product:pm_products(*)')
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(order);
}
