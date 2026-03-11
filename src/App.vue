<template>
  <!-- 登录页面 -->
  <Login v-if="!user" @login-success="handleLoginSuccess" />
  
  <!-- 主应用 -->
  <div v-else class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
    <!-- 登出按钮 -->
    <div class="absolute top-2 right-2 z-20">
      <button 
        @click="handleLogout" 
        class="text-xs text-gray-500 hover:text-gray-300 px-2 py-1"
      >
        退出登录
      </button>
    </div>
    
    <!-- Decorative Stars -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="n in 30" :key="n" 
        class="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
        :style="getStarStyle(n)"
      ></div>
    </div>
    
    <div class="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-2xl relative z-10">
      <!-- Header -->
      <header class="mb-3 sm:mb-4 text-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1 sm:mb-2">极简待办清单</h1>
        <p class="text-gray-400 text-xs sm:text-base">高效管理您的任务</p>
      </header>

      <!-- Stats Overview -->
      <div class="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 overflow-x-auto sm:overflow-visible">
        <div 
          @click="filter = 'all'" 
          class="cursor-pointer bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-2 sm:p-4 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 flex-1 sm:flex-none animate-fade-in min-w-[80px] sm:min-w-0"
        >
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400">{{ todos.length }}</div>
          <div class="text-gray-400 text-xs sm:text-sm">总任务数</div>
        </div>
        <div 
          @click="filter = 'completed'" 
          class="cursor-pointer bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-2 sm:p-4 text-center border border-gray-700 hover:border-green-500 transition-all duration-300 flex-1 sm:flex-none animate-fade-in min-w-[80px] sm:min-w-0"
          style="animation-delay: 0.05s"
        >
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">{{ completedCount }}</div>
          <div class="text-gray-400 text-xs sm:text-sm">已完成</div>
        </div>
        <div 
          @click="filter = 'active'" 
          class="cursor-pointer bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-2 sm:p-4 text-center border border-gray-700 hover:border-yellow-500 transition-all duration-300 flex-1 sm:flex-none animate-fade-in min-w-[80px] sm:min-w-0"
          style="animation-delay: 0.1s"
        >
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">{{ pendingCount }}</div>
          <div class="text-gray-400 text-xs sm:text-sm">待完成</div>
        </div>
      </div>

      <!-- Add Todo Form -->
      <div class="bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-700">
        <form @submit.prevent="addTodo" class="flex gap-2 sm:gap-3">
          <input
            v-model="newTodo"
            type="text"
            placeholder="输入新的待办事项..."
            class="flex-1 px-3 sm:px-5 py-2 sm:py-3 bg-gray-700/80 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent border border-gray-600 placeholder-gray-400"
            @keyup.enter="addTodo"
          />
          <button
            type="submit"
            class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center text-sm sm:text-base shadow-lg hover:shadow-cyan-500/30"
          >
            添加
          </button>
        </form>
      </div>

      <!-- Todo Filters -->
      <div class="flex justify-center mb-3 sm:mb-4">
        <div class="inline-flex rounded-lg sm:rounded-xl shadow-lg bg-gray-800/60 p-1 border border-gray-700" role="group">
          <button
            type="button"
            @click="filter = 'all'"
            :class="{ 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white': filter === 'all', 'bg-gray-700/50 text-gray-300 hover:bg-gray-700': filter !== 'all' }"
            class="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300"
          >
            全部
          </button>
          <button
            type="button"
            @click="filter = 'active'"
            :class="{ 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white': filter === 'active', 'bg-gray-700/50 text-gray-300 hover:bg-gray-700': filter !== 'active' }"
            class="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 mx-1"
          >
            待办
          </button>
          <button
            type="button"
            @click="filter = 'completed'"
            :class="{ 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white': filter === 'completed', 'bg-gray-700/50 text-gray-300 hover:bg-gray-700': filter !== 'completed' }"
            class="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300"
          >
            已完成
          </button>
        </div>
      </div>

      <!-- Todo List -->
      <div class="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <!-- 非已完成视图：普通列表 -->
        <ul v-if="filter !== 'completed'" class="divide-y divide-gray-700">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="px-3 sm:px-6 py-3 sm:py-4 flex items-start sm:items-center justify-between hover:bg-gray-700/40 transition-all duration-300"
            :class="{ 'opacity-70': todo.completed }"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="todo.completed"
                  @change="toggleTodo(todo)"
                  class="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500 rounded focus:ring-cyan-500 bg-gray-700 border-gray-600 cursor-pointer flex-shrink-0"
                />
                <span
                  @click="!todo.completed && openTimer(todo)"
                  class="ml-3 sm:ml-4 text-gray-200 text-sm sm:text-lg truncate cursor-pointer hover:text-cyan-400 transition-colors"
                  :class="{ 'line-through text-gray-500': todo.completed }"
                >
                  {{ todo.text }}
                </span>
              </div>
              <div class="ml-8 sm:ml-10 mt-1 text-xs text-gray-500 flex flex-wrap gap-1 sm:gap-2">
                <span class="bg-gray-700/50 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">📝 {{ formatTime(todo.createdAt) }}</span>
                <span v-if="todo.completed && todo.completedAt" class="bg-green-700/50 text-green-400 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">✅ {{ formatTime(todo.completedAt) }}</span>
                <span v-if="todo.completed && todo.completedAt" class="bg-blue-700/50 text-blue-400 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">⏱️ {{ getDuration(todo.createdAt, todo.completedAt) }}</span>
              </div>
            </div>
            <div class="flex space-x-1 sm:space-x-3 ml-2 flex-shrink-0">
              <button
                @click="editTodo(todo)"
                class="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/50 p-1.5 sm:p-2 rounded-full transition-all duration-300"
                title="编辑"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                @click="removeTodo(todo)"
                class="text-red-400 hover:text-red-300 hover:bg-red-900/50 p-1.5 sm:p-2 rounded-full transition-all duration-300"
                title="删除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
          <li v-if="filteredTodos.length === 0" class="px-6 py-8 sm:py-16 text-center">
            <div class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-base sm:text-xl text-gray-400">暂无任务</p>
              <p class="text-gray-500 mt-2 text-xs sm:text-base">添加新任务开始您的计划</p>
            </div>
          </li>
        </ul>
        
        <!-- 已完成视图：分组列表 -->
        <div v-else-if="filter === 'completed'">
          <div v-if="groupedCompletedTodos.length === 0" class="px-6 py-8 sm:py-16 text-center">
            <div class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-base sm:text-xl text-gray-400">暂无已完成任务</p>
              <p class="text-gray-500 mt-2 text-xs sm:text-base">完成的任务会在这里显示</p>
            </div>
          </div>
          <div v-else>
            <div v-for="group in groupedCompletedTodos" :key="group.title" class="border-b border-gray-700 last:border-b-0">
              <div class="px-3 sm:px-6 py-2 bg-gray-700/50 sticky top-0">
                <span class="text-xs sm:text-sm font-medium text-cyan-400">{{ group.title }} ({{ group.todos.length }})</span>
              </div>
              <ul class="divide-y divide-gray-700">
                <li
                  v-for="todo in group.todos"
                  :key="todo.id"
                  class="px-3 sm:px-6 py-3 sm:py-4 flex items-start sm:items-center justify-between hover:bg-gray-700/40 transition-all duration-300 opacity-70"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        :checked="todo.completed"
                        @change="toggleTodo(todo)"
                        class="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500 rounded focus:ring-cyan-500 bg-gray-700 border-gray-600 cursor-pointer flex-shrink-0"
                      />
                      <span class="ml-3 sm:ml-4 text-gray-200 text-sm sm:text-lg truncate cursor-pointer line-through text-gray-500">
                        {{ todo.text }}
                      </span>
                    </div>
                    <div class="ml-8 sm:ml-10 mt-1 text-xs text-gray-500 flex flex-wrap gap-1 sm:gap-2">
                      <span class="bg-gray-700/50 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">📝 {{ formatTime(todo.createdAt) }}</span>
                      <span v-if="todo.completedAt" class="bg-green-700/50 text-green-400 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">✅ {{ formatTime(todo.completedAt) }}</span>
                      <span v-if="todo.completedAt" class="bg-blue-700/50 text-blue-400 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">⏱️ {{ getDuration(todo.createdAt, todo.completedAt) }}</span>
                      <span v-if="todo.summary" class="bg-purple-700/50 text-purple-400 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">📝 {{ todo.summary }}</span>
                    </div>
                  </div>
                  <div class="flex space-x-1 sm:space-x-3 ml-2 flex-shrink-0">
                    <button
                      @click="removeTodo(todo)"
                      class="text-red-400 hover:text-red-300 hover:bg-red-900/50 p-1.5 sm:p-2 rounded-full transition-all duration-300"
                      title="删除"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear Completed -->
      <div class="mt-3 sm:mt-4 text-center" v-if="completedCount > 0">
        <button
          @click="clearCompleted"
          class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 text-xs sm:text-sm"
        >
          清除 {{ completedCount }} 个已完成任务
        </button>
      </div>
      
      <!-- Sync Status -->
      <div class="mt-4 text-center">
        <span v-if="syncing" class="text-xs text-cyan-400">🔄 同步中...</span>
        <span v-else class="text-xs text-gray-500">☁️ 已同步</span>
      </div>
    </div>
    
    <!-- 计时器弹窗 -->
    <div v-if="selectedTodo" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50" @click.self="closeTimer">
      <div class="text-center">
        <h2 class="text-2xl sm:text-3xl text-gray-300 mb-8 font-light">⏱️ 已过去时间</h2>
        
        <!-- 大屏幕计时器 -->
        <div class="bg-gray-900/80 rounded-3xl p-8 sm:p-12 mb-8 backdrop-blur-lg border border-gray-700">
          <div class="flex items-center justify-center gap-4 sm:gap-8">
            <div class="text-center">
              <div class="text-6xl sm:text-9xl font-bold text-cyan-400 font-mono tabular-nums">
                {{ padZero(elapsedTime.hours) }}
              </div>
              <div class="text-gray-500 mt-2 text-sm sm:text-lg">小时</div>
            </div>
            <div class="text-6xl sm:text-9xl font-bold text-gray-600">:</div>
            <div class="text-center">
              <div class="text-6xl sm:text-9xl font-bold text-cyan-400 font-mono tabular-nums">
                {{ padZero(elapsedTime.minutes) }}
              </div>
              <div class="text-gray-500 mt-2 text-sm sm:text-lg">分钟</div>
            </div>
            <div class="text-6xl sm:text-9xl font-bold text-gray-600">:</div>
            <div class="text-center">
              <div class="text-6xl sm:text-9xl font-bold text-cyan-400 font-mono tabular-nums">
                {{ padZero(elapsedTime.seconds) }}
              </div>
              <div class="text-gray-500 mt-2 text-sm sm:text-lg">秒</div>
            </div>
          </div>
        </div>
        
        <!-- 任务内容 -->
        <div class="text-xl sm:text-2xl text-white mb-8 max-w-md">
          📝 {{ selectedTodo.text }}
        </div>
        
        <!-- 完成按钮 - 火焰效果 -->
        <button
          @click="completeTodoFromTimer"
          class="relative px-10 py-4 text-xl font-bold text-white rounded-xl overflow-hidden group mb-4"
          :class="{ 'opacity-50 cursor-not-allowed': selectedTodo.completed }"
          :disabled="selectedTodo.completed"
        >
          <!-- 火焰背景 -->
          <span class="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity"></span>
          <span class="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 blur-md opacity-50 group-hover:opacity-80 transition-all"></span>
          <!-- 火焰边缘动画 -->
          <span class="absolute inset-0 rounded-xl animate-pulse bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 opacity-30"></span>
          <!-- 按钮文字 -->
          <span class="relative flex items-center gap-2">
            <span class="text-2xl">🎉</span>
            {{ selectedTodo.completed ? '已完成!' : '完成目标' }}
            <span class="text-2xl">🔥</span>
          </span>
        </button>
        
        <!-- 关闭按钮 -->
        <button
          @click="closeTimer"
          class="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl text-lg transition-all duration-300 ml-4"
        >
          关闭
        </button>
      </div>
    </div>
    
    <!-- 总结填写弹窗 -->
    <div v-if="showSummaryModal" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50" @click.self="cancelSummary">
      <div class="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 border border-gray-700">
        <h2 class="text-xl sm:text-2xl text-white font-bold mb-4 text-center">📝 填写任务总结</h2>
        <p class="text-gray-400 text-sm mb-4 text-center">
          任务：{{ pendingCompleteTodo?.text }}
        </p>
        <textarea
          v-model="taskSummary"
          placeholder="记录完成这个任务的感悟、经验或后续想法..."
          class="w-full px-4 py-3 bg-gray-700/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600 placeholder-gray-400 resize-none"
          rows="4"
        ></textarea>
        <div class="flex justify-center gap-4 mt-6">
          <button
            @click="confirmCompleteWithoutSummary"
            class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            跳过
          </button>
          <button
            @click="confirmCompleteWithSummary"
            class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            确认完成
          </button>
        </div>
      </div>
    </div>
    
    <!-- 恭喜达成目标动画 -->
    <div v-if="showCelebration" class="fixed inset-0 bg-black/95 flex items-center justify-center z-[100]" @click="closeCelebration">
      <div class="text-center">
        <!-- 烟花效果 - 根据等级调整数量 -->
        <div class="relative">
          <div v-for="i in celebrationConfig.fireworkCount" :key="i" 
            class="absolute rounded-full"
            :style="getFireworkStyle(i, celebrationConfig.fireworkColors)"
          ></div>
        </div>
        
        <!-- 主标题动画 -->
        <div class="relative z-10">
          <h2 class="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text animate-bounce mb-4"
              :style="{ backgroundImage: celebrationConfig.gradient }">
            {{ celebrationConfig.emoji }} {{ celebrationConfig.title }} {{ celebrationConfig.emoji }}
          </h2>
          <p class="text-2xl sm:text-3xl text-white mb-8 animate-pulse">
            {{ completedGoalText }}
          </p>
          
          <!-- 成就徽章 - 根据等级调整 -->
          <div class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border"
               :style="{ background: celebrationConfig.badgeBg, borderColor: celebrationConfig.badgeBorder }">
            <span class="text-4xl">{{ celebrationConfig.badgeEmoji }}</span>
            <span class="text-xl font-bold" :style="{ color: celebrationConfig.titleColor }">
              {{ celebrationConfig.badgeText }}
            </span>
          </div>
          
          <!-- 等级提示 -->
          <p v-if="celebrationLevel > 1" class="text-yellow-400 mt-4 text-lg">
            🎯 今日已完成 {{ dailyCompletionCount }} 个任务！
          </p>
          
          <p class="text-gray-400 mt-8 text-sm">点击任意位置关闭</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Login from './Login.vue'
import { supabase, authAPI, todosAPI, userStatsAPI } from './api'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  completedAt: Date | null
  summary: string | null
}

const user = ref<any>(null)
const newTodo = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')
const todos = ref<Todo[]>([])
const syncing = ref(false)
const selectedTodo = ref<Todo | null>(null)
const timerInterval = ref<number | null>(null)
const elapsedTime = ref({ hours: 0, minutes: 0, seconds: 0 })
const showCelebration = ref(false)
const completedGoalText = ref('')
const dailyCompletionCount = ref(0)
const celebrationLevel = ref(1)
const showSummaryModal = ref(false)
const pendingCompleteTodo = ref<Todo | null>(null)
const taskSummary = ref('')

// 庆祝配置
const celebrationConfigs = {
  1: {  // 第1个 - 初战告捷
    title: '恭喜你达成目标!',
    emoji: '🎉',
    gradient: 'linear-gradient(to right, #00FFFF, #00FF00)',
    fireworkCount: 12,
    fireworkColors: ['#00FFFF', '#00FF00', '#FFFF00'],
    badgeBg: 'rgba(0, 255, 255, 0.3)',
    badgeBorder: 'rgba(0, 255, 255, 0.8)',
    badgeEmoji: '🌟',
    badgeText: '初战告捷',
    titleColor: '#00FFFF'
  },
  3: {  // 第3个 - 渐入佳境
    title: '太棒了！连续达成!',
    emoji: '🚀',
    gradient: 'linear-gradient(to right, #00FF00, #39FF14)',
    fireworkCount: 20,
    fireworkColors: ['#00FF00', '#39FF14', '#7FFF00'],
    badgeBg: 'rgba(57, 255, 20, 0.3)',
    badgeBorder: 'rgba(57, 255, 20, 0.8)',
    badgeEmoji: '💪',
    badgeText: '渐入佳境',
    titleColor: '#39FF14'
  },
  5: {  // 第5个 - 势如破竹
    title: '势如破竹！所向披靡!',
    emoji: '⚡',
    gradient: 'linear-gradient(to right, #FF00FF, #FF1493)',
    fireworkCount: 30,
    fireworkColors: ['#FF00FF', '#FF1493', '#FF6B6B'],
    badgeBg: 'rgba(255, 0, 255, 0.3)',
    badgeBorder: 'rgba(255, 0, 255, 0.8)',
    badgeEmoji: '🔥',
    badgeText: '势如破竹',
    titleColor: '#FF00FF'
  },
  8: {  // 第8个 - 卓越非凡
    title: '卓越非凡！无人能挡!',
    emoji: '💎',
    gradient: 'linear-gradient(to right, #FF0080, #FF8C00)',
    fireworkCount: 40,
    fireworkColors: ['#FF0080', '#FF8C00', '#FFD700'],
    badgeBg: 'rgba(255, 0, 128, 0.3)',
    badgeBorder: 'rgba(255, 0, 128, 0.8)',
    badgeEmoji: '👑',
    badgeText: '卓越非凡',
    titleColor: '#FF0080'
  },
  15: {  // 第15个 - 传奇王者
    title: '传奇王者！封神之作!',
    emoji: '🏆',
    gradient: 'linear-gradient(to right, #FFD700, #FF0000, #FF00FF, #00FFFF)',
    fireworkCount: 60,
    fireworkColors: ['#FFD700', '#FF0000', '#FF00FF', '#00FFFF', '#00FF00'],
    badgeBg: 'rgba(255, 215, 0, 0.4)',
    badgeBorder: 'rgba(255, 215, 0, 1)',
    badgeEmoji: '🦞',
    badgeText: '传奇王者',
    titleColor: '#FFD700'
  }
}

const celebrationConfig = computed(() => {
  const level = celebrationLevel.value
  if (level >= 15) return celebrationConfigs[15]
  if (level >= 8) return celebrationConfigs[8]
  if (level >= 5) return celebrationConfigs[5]
  if (level >= 3) return celebrationConfigs[3]
  return celebrationConfigs[1]
})

// 获取当日完成次数
const getDailyCompletionCount = async () => {
  // 直接从已加载的任务中统计所有已完成的数量
  if (!user.value || !todos.value.length) return 0
  
  const completedCount = todos.value.filter(t => t.completed).length
  console.log('总已完成任务:', completedCount)
  console.log('任务详情:', todos.value.map(t => ({ text: t.text, completed: t.completed, completedAt: t.completedAt })))
  
  return completedCount
}
let nextId = 1

// Computed
const completedCount = computed(() => todos.value.filter(t => t.completed).length)
const pendingCount = computed(() => todos.value.filter(t => !t.completed).length)

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(t => !t.completed)
    case 'completed':
      return todos.value.filter(t => t.completed)
    default:
      return todos.value
  }
})

// 按时间分组（已完成任务）
const groupedCompletedTodos = computed(() => {
  const completed = todos.value.filter(t => t.completed)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - today.getDay())
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const groups: { title: string; todos: Todo[] }[] = []
  
  const todayTodos = completed.filter(t => {
    const d = new Date(t.completedAt!)
    return d >= today
  })
  if (todayTodos.length > 0) {
    groups.push({ title: '今日内', todos: todayTodos })
  }
  
  const thisWeekTodos = completed.filter(t => {
    const d = new Date(t.completedAt!)
    return d >= thisWeekStart && d < today
  })
  if (thisWeekTodos.length > 0) {
    groups.push({ title: '本周内', todos: thisWeekTodos })
  }
  
  const thisMonthTodos = completed.filter(t => {
    const d = new Date(t.completedAt!)
    return d >= thisMonthStart && d < thisWeekStart
  })
  if (thisMonthTodos.length > 0) {
    groups.push({ title: '本月内', todos: thisMonthTodos })
  }
  
  const olderTodos = completed.filter(t => {
    const d = new Date(t.completedAt!)
    return d < thisMonthStart
  })
  if (olderTodos.length > 0) {
    groups.push({ title: '更早', todos: olderTodos })
  }
  
  return groups
})

// Time formatting
const formatTime = (date: Date): string => {
  const d = new Date(date)
  const now = new Date()
  
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  const diff = now.getTime() - d.getTime()
  if (diff < 7 * 24 * 3600000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[d.getDay()] + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const getDuration = (start: Date, end: Date): string => {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天${hours % 24}小时`
  if (hours > 0) return `${hours}小时${minutes % 60}分钟`
  if (minutes > 0) return `${minutes}分钟`
  return `${seconds}秒`
}

// 计时器功能
const updateElapsedTime = () => {
  if (!selectedTodo.value) return
  const now = new Date()
  const created = new Date(selectedTodo.value.createdAt)
  const diff = now.getTime() - created.getTime()
  
  const totalSeconds = Math.floor(diff / 1000)
  elapsedTime.value.hours = Math.floor(totalSeconds / 3600)
  elapsedTime.value.minutes = Math.floor((totalSeconds % 3600) / 60)
  elapsedTime.value.seconds = totalSeconds % 60
}

const openTimer = (todo: Todo) => {
  if (todo.completed) return
  selectedTodo.value = todo
  updateElapsedTime()
  timerInterval.value = window.setInterval(updateElapsedTime, 1000)
}

const closeTimer = () => {
  selectedTodo.value = null
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// 从计时器完成任务
// 完成任务时填写总结
const confirmCompleteWithSummary = async () => {
  if (!pendingCompleteTodo.value) return
  
  const todo = pendingCompleteTodo.value
  todo.completed = true
  todo.completedAt = new Date()
  todo.summary = taskSummary.value.trim() || null
  
  // 同步到云端
  if (user.value) {
    await todosAPI.updateTodo(user.value.id, todo.id, {
      completed: true,
      completed_at: todo.completedAt,
      summary: todo.summary
    })
  }
  
  // 重新计算当日完成次数
  const newCount = await getDailyCompletionCount()
  dailyCompletionCount.value = newCount
  
  // 确定庆祝等级
  if (newCount >= 15) celebrationLevel.value = 15
  else if (newCount >= 8) celebrationLevel.value = 8
  else if (newCount >= 5) celebrationLevel.value = 5
  else if (newCount >= 3) celebrationLevel.value = 3
  else celebrationLevel.value = 1
  
  // 关闭总结弹窗
  showSummaryModal.value = false
  taskSummary.value = ''
  pendingCompleteTodo.value = null
  
  // 显示庆祝动画
  showCelebration.value = true
  
  // 3秒后自动关闭计时器
  setTimeout(() => {
    closeTimer()
  }, 500)
}

const cancelSummary = () => {
  showSummaryModal.value = false
  taskSummary.value = ''
  pendingCompleteTodo.value = null
  closeTimer()
}

const completeTodoFromTimer = async () => {
  if (!selectedTodo.value || selectedTodo.value.completed) return
  
  // 显示总结填写弹窗
  pendingCompleteTodo.value = selectedTodo.value
  taskSummary.value = ''
  showSummaryModal.value = true
}

const closeCelebration = () => {
  showCelebration.value = false
}

// 烟花样式
const getFireworkStyle = (i: number, colors: string[]) => {
  const color = colors[i % colors.length]
  const angle = (i / colors.length) * 360
  const distance = 150 + Math.random() * 100
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance
  
  return {
    left: '50%',
    top: '50%',
    backgroundColor: color,
    transform: `translate(${x}px, ${y}px)`,
    animation: `firework 1.5s ease-out forwards`,
    animationDelay: `${i * 0.05}s`,
    boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
    width: i % 3 === 0 ? '8px' : '4px',
    height: i % 3 === 0 ? '8px' : '4px'
  }
}

const padZero = (n: number) => n.toString().padStart(2, '0')

const getStarStyle = (n: number) => {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 5
  const duration = 2 + Math.random() * 3
  const size = Math.random() > 0.7 ? 2 : 1
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: 0.3 + Math.random() * 0.7
  }
}

// Cloud sync
const loadTodos = async () => {
  if (!user.value) return
  
  syncing.value = true
  try {
    const result = await todosAPI.getTodos(user.value.id)
    
    if (result.success && result.todos) {
      // 确保completed字段正确读取
      todos.value = result.todos.map((t: any) => ({
        id: t.id,
        text: t.text,
        completed: Boolean(t.completed),
        createdAt: new Date(t.created_at),
        completedAt: t.completed_at ? new Date(t.completed_at) : null,
        summary: t.summary || null
      }))
    }
  } catch (e) {
    console.error('加载任务失败:', e)
  }
  syncing.value = false
}

const syncTodo = async (todo: Todo, action: 'create' | 'update' | 'delete') => {
  if (!user.value) return
  
  syncing.value = true
  
  if (action === 'create') {
    await todosAPI.createTodo(user.value.id, todo.text)
  } else if (action === 'update') {
    await todosAPI.updateTodo(user.value.id, todo.id, {
      text: todo.text,
      completed: todo.completed,
      completed_at: todo.completedAt
    })
  } else if (action === 'delete') {
    await todosAPI.deleteTodo(user.value.id, todo.id)
  }
  
  syncing.value = false
}

// Todo actions
const addTodo = async () => {
  if (newTodo.value.trim() === '') return
  
  const todo: Todo = {
    id: String(nextId++),
    text: newTodo.value.trim(),
    completed: false,
    createdAt: new Date(),
    completedAt: null
  }
  
  todos.value.unshift(todo)
  newTodo.value = ''
  
  await syncTodo(todo, 'create')
}

const toggleTodo = async (todo: Todo) => {
  if (!todo.completed) {
    // 勾选完成时，显示总结弹窗
    pendingCompleteTodo.value = todo
    taskSummary.value = ''
    showSummaryModal.value = true
  } else {
    // 取消完成
    todo.completed = false
    todo.completedAt = null
    todo.summary = null
    await syncTodo(todo, 'update')
  }
}

// 直接确认完成（不填写总结）
const confirmCompleteWithoutSummary = async () => {
  if (!pendingCompleteTodo.value) return
  
  const todo = pendingCompleteTodo.value
  todo.completed = true
  todo.completedAt = new Date()
  todo.summary = null
  
  // 同步到云端
  if (user.value) {
    await todosAPI.updateTodo(user.value.id, todo.id, {
      completed: true,
      completed_at: todo.completedAt,
      summary: null
    })
  }
  
  // 重新计算当日完成次数
  const newCount = await getDailyCompletionCount()
  dailyCompletionCount.value = newCount
  
  // 确定庆祝等级
  if (newCount >= 15) celebrationLevel.value = 15
  else if (newCount >= 8) celebrationLevel.value = 8
  else if (newCount >= 5) celebrationLevel.value = 5
  else if (newCount >= 3) celebrationLevel.value = 3
  else celebrationLevel.value = 1
  
  // 关闭总结弹窗
  showSummaryModal.value = false
  taskSummary.value = ''
  pendingCompleteTodo.value = null
  
  // 显示庆祝动画
  showCelebration.value = true
}

const removeTodo = async (todo: Todo) => {
  const index = todos.value.indexOf(todo)
  if (index !== -1) {
    todos.value.splice(index, 1)
    await syncTodo(todo, 'delete')
  }
}

const editTodo = async (todo: Todo) => {
  const newText = prompt('编辑任务:', todo.text)
  if (newText !== null && newText.trim() !== '') {
    todo.text = newText.trim()
    await syncTodo(todo, 'update')
  }
}

const clearCompleted = async () => {
  const completed = todos.value.filter(t => t.completed)
  todos.value = todos.value.filter(t => !t.completed)
  
  for (const todo of completed) {
    await syncTodo(todo, 'delete')
  }
}

// Auth
const handleLoginSuccess = async (userData: any) => {
  user.value = userData
  await loadTodos()
  // 任务加载完成后再计算等级
  const count = getDailyCompletionCount()
  dailyCompletionCount.value = count
  if (count >= 15) celebrationLevel.value = 15
  else if (count >= 8) celebrationLevel.value = 8
  else if (count >= 5) celebrationLevel.value = 5
  else if (count >= 3) celebrationLevel.value = 3
  else celebrationLevel.value = 1
}

const handleLogout = async () => {
  await authAPI.logout()
  user.value = null
  todos.value = []
}

// Check auth on mount
onMounted(async () => {
  const { user: currentUser } = await authAPI.getUser()
  if (currentUser) {
    user.value = currentUser
    loadTodos()
  }
})
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

ul li {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

input[type="checkbox"] {
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  transform: scale(1.2);
}

button {
  transition: all 0.3s ease;
}

.min-h-screen {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.animate-twinkle {
  animation: twinkle ease-in-out infinite;
}

@keyframes firework {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(1);
    opacity: 0;
  }
}
</style>
