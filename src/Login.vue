<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <!-- 登录表单 -->
    <div v-if="!isLoggedIn" class="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
        极简待办清单
      </h2>
      <p class="text-gray-400 text-center mb-8">登录后同步您的待办事项</p>
      
      <!-- 手机号登录 -->
      <div v-if="!showVerify">
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-medium mb-2">手机号</label>
          <input
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
            class="w-full px-4 py-3 bg-gray-700/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
          />
        </div>
        <button
          @click="sendCode"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? '发送中...' : '获取验证码' }}
        </button>
        <p v-if="error" class="text-red-400 text-sm mt-4 text-center">{{ error }}</p>
      </div>
      
      <!-- 验证码验证 -->
      <div v-else>
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-medium mb-2">验证码</label>
          <input
            v-model="code"
            type="text"
            placeholder="请输入6位验证码"
            maxlength="6"
            class="w-full px-4 py-3 bg-gray-700/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600 text-center text-2xl tracking-widest"
          />
        </div>
        <button
          @click="verifyCode"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? '验证中...' : '登录' }}
        </button>
        <button
          @click="showVerify = false"
          class="w-full text-gray-400 py-2 text-sm mt-2 hover:text-cyan-400"
        >
          返回重新输入手机号
        </button>
        <p v-if="error" class="text-red-400 text-sm mt-4 text-center">{{ error }}</p>
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
import { ref, onMounted } from 'vue'
import { supabase, authAPI } from './api'

const phone = ref('')
const code = ref('')
const loading = ref(false)
const showVerify = ref(false)
const isLoggedIn = ref(false)
const error = ref('')
const emit = defineEmits(['login-success'])

onMounted(async () => {
  // 检查是否已登录
  const { user } = await authAPI.getUser()
  if (user) {
    isLoggedIn.value = true
    emit('login-success', user)
  }
})

const sendCode = async () => {
  if (!phone.value || phone.value.length !== 11) {
    error.value = '请输入正确的手机号'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const result = await authAPI.sendCode(phone.value)
  
  loading.value = false
  
  if (result.success) {
    showVerify.value = true
  } else {
    error.value = result.error || '发送失败，请重试'
  }
}

const verifyCode = async () => {
  if (!code.value || code.value.length !== 6) {
    error.value = '请输入6位验证码'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const result = await authAPI.verifyCode(phone.value, code.value)
  
  loading.value = false
  
  if (result.success) {
    isLoggedIn.value = true
    emit('login-success', result.user)
  } else {
    error.value = result.error || '验证失败，请重试'
  }
}
</script>
