<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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

      <!-- Stats Overview - Horizontal on mobile -->
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
        <ul class="divide-y divide-gray-700">
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
                  class="ml-3 sm:ml-4 text-gray-200 text-sm sm:text-lg truncate"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

const newTodo = ref('');
const filter = ref<'all' | 'active' | 'completed'>('all');
// Load from localStorage
const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem('todos');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : null
      }));
    } catch {
      return [];
    }
  }
  return [
    { id: 1, text: '学习Vue 3', completed: true, createdAt: new Date(Date.now() - 86400000), completedAt: new Date(Date.now() - 3600000) },
    { id: 2, text: '构建待办事项应用', completed: false, createdAt: new Date() },
    { id: 3, text: '部署到生产环境', completed: false, createdAt: new Date() }
  ];
};

const todos = ref<Todo[]>(loadTodos());

// Save to localStorage
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos.value));
};

// Generate unique IDs
let nextId = Math.max(...todos.value.map(t => t.id), 0) + 1;

// Format time
const formatTime = (date: Date): string => {
  const d = new Date(date);
  const now = new Date();
  
  // Within today
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // This week
  const diff = now.getTime() - d.getTime();
  if (diff < 7 * 24 * 3600000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[d.getDay()] + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Older
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

// Get duration string
const getDuration = (start: Date, end: Date): string => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}天${hours % 24}小时`;
  if (hours > 0) return `${hours}小时${minutes % 60}分钟`;
  if (minutes > 0) return `${minutes}分钟`;
  return `${seconds}秒`;
};

// Generate star position and animation
const getStarStyle = (n: number) => {
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = 2 + Math.random() * 3;
  const size = Math.random() > 0.7 ? 2 : 1;
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: 0.3 + Math.random() * 0.7
  };
};

const completedCount = computed(() => todos.value.filter(todo => todo.completed).length);
const pendingCount = computed(() => todos.value.filter(todo => !todo.completed).length);

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed);
    case 'completed':
      return todos.value.filter(todo => todo.completed);
    default:
      return todos.value;
  }
});

// Methods
const addTodo = () => {
  if (newTodo.value.trim() === '') return;
  
  todos.value.push({
    id: nextId++,
    text: newTodo.value.trim(),
    completed: false,
    createdAt: new Date(),
    completedAt: null
  });
  
  newTodo.value = '';
  saveTodos();
};

const toggleTodo = (todo: Todo) => {
  todo.completed = !todo.completed;
  todo.completedAt = todo.completed ? new Date() : null;
  saveTodos();
};

const removeTodo = (todo: Todo) => {
  const index = todos.value.indexOf(todo);
  if (index !== -1) {
    todos.value.splice(index, 1);
    saveTodos();
  }
};

const editTodo = (todo: Todo) => {
  const newText = prompt('编辑任务:', todo.text);
  if (newText !== null && newText.trim() !== '') {
    todo.text = newText.trim();
    saveTodos();
  }
};

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed);
  saveTodos();
};
</script>

<style>
/* Fade in animation */
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

/* Task item animations */
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

/* Checkbox animation */
input[type="checkbox"] {
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  transform: scale(1.2);
}

/* Button hover effects */
button {
  transition: all 0.3s ease;
}

/* Background subtle animation */
.min-h-screen {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Twinkling stars animation */
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
</style>