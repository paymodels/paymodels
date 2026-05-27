-- Migration: add featured, features, sub_price to pm_products
-- Run in Supabase SQL Editor if pm_products already exists

ALTER TABLE pm_products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE pm_products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE pm_products ADD COLUMN IF NOT EXISTS sub_price TEXT;

-- Update seed data
UPDATE pm_products SET featured = true,  features = '["5 倍 Plus 额度","Codex 编程支持","优先客服响应","极速到账通道","Stripe 国际支付","微信支付支持"]'::jsonb, sub_price = '$120/月',  description = '性价比之选'  WHERE slug = 'pro5x';
UPDATE pm_products SET featured = false, features = '["人工充值服务","充值失败全额退款","基础客服支持","标准到账速度"]'::jsonb,                                               description = '人工充值 · 不成功全额退款' WHERE slug = 'plus';
UPDATE pm_products SET featured = false, features = '["20 倍 Plus 额度","Codex 编程支持","专属客户经理","最高优先级到账","Stripe 国际支付","微信支付支持","API 接口对接","企业级 SLA 保障"]'::jsonb, sub_price = '$225/月', description = '顶级体验' WHERE slug = 'pro20x';
