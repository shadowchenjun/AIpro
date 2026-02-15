-- Supabase Database Setup SQL
-- 在 Supabase SQL Editor 中执行

-- 创建 todos 表
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能操作自己的数据
CREATE POLICY "用户只能查看自己的待办" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能创建自己的待办" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的待办" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的待办" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- 创建索引优化查询性能
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
