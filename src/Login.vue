<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <!-- 登录/注册表单 -->
    <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
        极简待办清单
      </h2>
      <p class="text-gray-400 text-center mb-8">{{ isLogin ? '登录' : '注册' }}后同步您的待办事项</p>
      
      <!-- 用户名密码登录 -->
      <div>
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-medium mb-2">邮箱地址</label>
          <input
            v-model="email"
            type="email"
            placeholder="请输入邮箱地址"
            class="w-full px-4 py-3 bg-gray-700/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-medium mb-2">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-4 py-3 bg-gray-700/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
            @keyup.enter="handleSubmit"
          />
        </div>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
        </button>
        
        <p v-if="error" class="text-red-400 text-sm mt-4 text-center">{{ error }}</p>
        
        <!-- 切换登录/注册 -->
        <p class="text-gray-400 text-sm mt-6 text-center">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <button @click="isLogin = !isLogin" class="text-cyan-400 hover:text-cyan-300 ml-1">
            {{ isLogin ? '立即注册' : '立即登录' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase, authAPI } from './api'

const email = ref('')
const password = ref('')
const loading = ref(false)
const isLogin = ref(true)
const error = ref('')
const emit = defineEmits(['login-success'])

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  // 检查是否已登录
  const { user } = await authAPI.getUser()
  if (user) {
    emit('login-success', user)
  }

  // 监听认证状态变化
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      emit('login-success', session.user)
    }
  })
  unsubscribe = () => subscription.unsubscribe()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const handleSubmit = async () => {
  if (!email.value || !email.value.includes('@')) {
    error.value = '请输入正确的邮箱地址'
    return
  }
  if (!password.value || password.value.length < 6) {
    error.value = '密码至少需要6位'
    return
  }
  
  loading.value = true
  error.value = ''
  
  let result
  if (isLogin.value) {
    // 登录
    result = await authAPI.signIn(email.value, password.value)
  } else {
    // 注册 - 先检查邮箱是否已存在
    const checkResult = await authAPI.getUser()
    if (checkResult.user && checkResult.user.email === email.value) {
      loading.value = false
      error.value = '该邮箱已注册，请直接登录'
      isLogin.value = true
      return
    }
    // 注册
    result = await authAPI.signUp(email.value, password.value)
  }
  
  loading.value = false
  
  if (result.success) {
    if (isLogin.value) {
      emit('login-success', result.user)
    } else {
      // 注册成功，提示用户登录
      error.value = '注册成功！请使用邮箱和密码登录'
      isLogin.value = true
    }
  } else {
    error.value = result.error || '操作失败，请重试'
  }
}
</script>
