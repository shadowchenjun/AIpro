<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <!-- 登录表单 -->
    <div v-if="!isLoggedIn && !emailSent" class="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
        极简待办清单
      </h2>
      <p class="text-gray-400 text-center mb-8">登录后同步您的待办事项</p>
      
      <!-- 邮箱登录 -->
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
        <button
          @click="sendCode"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? '发送中...' : '发送登录链接' }}
        </button>
        <p v-if="error" class="text-red-400 text-sm mt-4 text-center">{{ error }}</p>
      </div>
    </div>

    <!-- 邮箱已发送提示 -->
    <div v-else-if="!isLoggedIn && emailSent" class="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
        检查您的邮箱
      </h2>
      <p class="text-gray-400 text-center mb-8">我们已发送登录链接到 {{ email }}</p>
      
      <div class="text-center">
        <div class="animate-bounce mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-gray-300 mb-4">请点击邮箱中的链接完成登录</p>
        <button
          @click="emailSent = false"
          class="text-cyan-400 hover:text-cyan-300 text-sm"
        >
          更换邮箱
        </button>
      </div>
    </div>
    
    <!-- 登录成功 -->
    <div v-else class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
      <p class="text-cyan-400 text-xl">登录成功！</p>
      <p class="text-gray-400">正在加载您的待办事项...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase, authAPI } from './api'

const email = ref('')
const loading = ref(false)
const emailSent = ref(false)
const isLoggedIn = ref(false)
const error = ref('')
const emit = defineEmits(['login-success'])

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  // 检查是否已登录
  const { user } = await authAPI.getUser()
  if (user) {
    isLoggedIn.value = true
    emit('login-success', user)
  }

  // 监听认证状态变化
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      isLoggedIn.value = true
      emit('login-success', session.user)
    }
  })
  unsubscribe = () => subscription.unsubscribe()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const sendCode = async () => {
  if (!email.value || !email.value.includes('@')) {
    error.value = '请输入正确的邮箱地址'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const result = await authAPI.sendCode(email.value)
  
  loading.value = false
  
  if (result.success) {
    emailSent.value = true
  } else {
    error.value = result.error || '发送失败，请重试'
  }
}
</script>
