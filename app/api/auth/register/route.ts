import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";

const registerSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码长度不能少于 6 位"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = result.data;

  const { data: existing } = await supabaseAdmin
    .from("pm_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { error } = await supabaseAdmin.from("pm_users").insert({
    email,
    password_hash: passwordHash,
  });

  if (error) {
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
