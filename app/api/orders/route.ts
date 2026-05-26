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
