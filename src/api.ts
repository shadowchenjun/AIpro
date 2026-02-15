import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config.example'

// Supabase 配置
const supabaseUrl = supabaseConfig.url
const supabaseAnonKey = supabaseConfig.anonKey

// 验证配置
if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('请配置 Supabase！请复制 config.example.ts 为 config.ts 并填入你的 Supabase 配置')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 用户相关 API
export const authAPI = {
  // 发送手机号验证码
  async sendCode(phone: string) {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms'
      }
    })
    return { success: !error, error: error?.message }
  },

  // 验证验证码并登录
  async verifyCode(phone: string, code: string) {
    const { data, error } = await supabase.auth.verifyOTP(phone, code)
    if (error) return { success: false, error: error.message }
    return { success: true, user: data.user }
  },

  // 获取当前用户
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error: error?.message }
  },

  // 登出
  async logout() {
    const { error } = await supabase.auth.signOut()
    return { success: !error }
  },

  // 监听登录状态变化
  onAuthChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

// 待办事项 API
export const todosAPI = {
  // 获取用户的所有待办事项
  async getTodos(userId: string) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) return { success: false, error: error.message, todos: [] }
    return { success: true, todos: data }
  },

  // 创建待办事项
  async createTodo(userId: string, text: string) {
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        text,
        completed: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) return { success: false, error: error.message, todo: null }
    return { success: true, todo: data }
  },

  // 更新待办事项
  async updateTodo(userId: string, todoId: string, updates: any) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', todoId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) return { success: false, error: error.message, todo: null }
    return { success: true, todo: data }
  },

  // 删除待办事项
  async deleteTodo(userId: string, todoId: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId)
    
    return { success: !error, error: error?.message }
  },

  // 批量同步（从本地到云端）
  async syncTodos(userId: string, todos: any[]) {
    // 先获取云端数据
    const { data: cloudTodos } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
    
    const localIds = new Set(todos.map(t => t.id))
    const cloudIds = new Set(cloudTodos?.map(t => t.id) || [])
    
    // 找出需要新增的（本地有，云端没有）
    const toCreate = todos.filter(t => t.id && !cloudIds.has(t.id))
    
    // 找出需要更新的
    const toUpdate = todos.filter(t => t.id && cloudIds.has(t.id))
    
    // 找出需要删除的（云端有，本地没有，且是已完成的任务）
    const toDelete = (cloudTodos || []).filter(t => !localIds.has(t.id))
    
    let results = { created: 0, updated: 0, deleted: 0, errors: [] }
    
    // 执行批量操作
    if (toCreate.length > 0) {
      const { error } = await supabase
        .from('todos')
        .insert(toCreate.map(t => ({
          user_id: userId,
          id: t.id,
          text: t.text,
          completed: t.completed,
          created_at: t.createdAt,
          completed_at: t.completedAt
        })))
      if (error) results.errors.push(error.message)
      else results.created = toCreate.length
    }
    
    for (const todo of toUpdate) {
      const { error } = await supabase
        .from('todos')
        .update({
          text: todo.text,
          completed: todo.completed,
          completed_at: todo.completedAt
        })
        .eq('id', todo.id)
        .eq('user_id', userId)
      if (!error) results.updated++
    }
    
    for (const todo of toDelete) {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todo.id)
      if (!error) results.deleted++
    }
    
    return results
  }
}
