import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: '\u672a\u767b\u5f55' }, { status: 401 });
    }

    const { data: orders, error } = await supabaseAdmin
        .from('pm_orders')
        .select('*, product:pm_products(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: '\u672a\u767b\u5f55' }, { status: 401 });
    }

    const body = await req.json();
    const { plan, amount, payment_method, access_token } = body;

    if (!plan || !amount) {
        return NextResponse.json(
            { error: '\u7f3a\u5c11\u5fc5\u8981\u53c2\u6570 plan \u6216 amount' },
            { status: 400 }
        );
    }

    const { data: product } = await supabaseAdmin
        .from('pm_products')
        .select('id')
        .eq('slug', plan)
        .single();

    const { data: order, error } = await supabaseAdmin
        .from('pm_orders')
        .insert({
            user_id: session.user.id,
            product_id: product?.id ?? null,
            plan,
            amount,
            payment_method: payment_method ?? null,
            access_token: access_token ?? null,
            status: 'pending',
        })
        .select('*, product:pm_products(*)')
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(order, { status: 201 });
}
