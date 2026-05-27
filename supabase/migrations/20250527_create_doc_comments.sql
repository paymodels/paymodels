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
