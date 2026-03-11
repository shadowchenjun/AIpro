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
  summary TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户统计表
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stat_date)
);

-- 启用 RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- todos 表策略
CREATE POLICY "用户只能查看自己的待办" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能创建自己的待办" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的待办" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的待办" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- user_stats 表策略
CREATE POLICY "用户只能查看自己的统计" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的统计" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的统计" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建索引
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX idx_user_stats_user_date ON user_stats(user_id, stat_date);
