<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <header class="mb-12 text-center">
        <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">极简待办清单</h1>
        <p class="text-gray-300 text-lg">高效管理您的任务</p>
      </header>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-5 text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:scale-105">
          <div class="text-3xl font-bold text-cyan-400">{{ todos.length }}</div>
          <div class="text-gray-400 text-sm mt-1">总任务数</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-5 text-center border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105">
          <div class="text-3xl font-bold text-green-400">{{ completedCount }}</div>
          <div class="text-gray-400 text-sm mt-1">已完成</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-5 text-center border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105">
          <div class="text-3xl font-bold text-yellow-400">{{ pendingCount }}</div>
          <div class="text-gray-400 text-sm mt-1">待完成</div>
        </div>
      </div>

      <!-- Add Todo Form -->
      <div class="bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-700">
        <form @submit.prevent="addTodo" class="flex gap-3">
          <input
            v-model="newTodo"
            type="text"
            placeholder="输入新的待办事项..."
            class="flex-1 px-5 py-4 bg-gray-700/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent border border-gray-600 placeholder-gray-400"
            @keyup.enter="addTodo"
          />
          <button
            type="submit"
            class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl transition-all duration-300 flex items-center shadow-lg hover:shadow-cyan-500/30 hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            添加
          </button>
        </form>
      </div>

      <!-- Todo Filters -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex rounded-xl shadow-lg bg-gray-800/60 p-1 border border-gray-700" role="group">
          <button
            type="button"
            @click="filter = 'all'"
            :class="{ 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white': filter === 'all', 'bg-gray-700/50 text-gray-300 hover:bg-gray-700': filter !== 'all' }"
            class="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300"
          >
            全部
          </button>
          <button
            type="button"
            @click="filter = 'active'"
            :class="{ 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white': filter === 'active', 'bg-gray-700/50 text-gray-300 hover:bg-gray-700': filter !== 'active' }"
            class="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 mx-1"
          >
            待办
          </button>
          <button
            type="button"
            @click="filter = 'completed'"
            :class="{ 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white': filter === 'completed', 'bg-gray-700/50 text-gray-300 hover:bg-gray-700': filter !== 'completed' }"
            class="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300"
          >
            已完成
          </button>
        </div>
      </div>

      <!-- Todo List -->
      <div class="bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <ul class="divide-y divide-gray-700">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-700/40 transition-all duration-300 transform hover:translate-x-1"
            :class="{ 'opacity-70': todo.completed }"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo)"
                class="h-6 w-6 text-cyan-500 rounded focus:ring-cyan-500 bg-gray-700 border-gray-600 cursor-pointer"
              />
              <span
                class="ml-4 text-gray-200 text-lg"
                :class="{ 'line-through text-gray-500': todo.completed }"
              >
                {{ todo.text }}
              </span>
            </div>
            <div class="flex space-x-3">
              <button
                @click="editTodo(todo)"
                class="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/50 p-2 rounded-full transition-all duration-300"
                title="编辑"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                @click="removeTodo(todo)"
                class="text-red-400 hover:text-red-300 hover:bg-red-900/50 p-2 rounded-full transition-all duration-300"
                title="删除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
          <li v-if="filteredTodos.length === 0" class="px-6 py-16 text-center">
            <div class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-xl text-gray-400">暂无任务</p>
              <p class="text-gray-500 mt-2">添加新任务开始您的计划</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Clear Completed -->
      <div class="mt-6 text-center" v-if="completedCount > 0">
        <button
          @click="clearCompleted"
          class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30"
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
}

const newTodo = ref('');
const filter = ref<'all' | 'active' | 'completed'>('all');
const todos = ref<Todo[]>([
  { id: 1, text: '学习Vue 3', completed: true, createdAt: new Date() },
  { id: 2, text: '构建待办事项应用', completed: false, createdAt: new Date() },
  { id: 3, text: '部署到生产环境', completed: false, createdAt: new Date() }
]);

// Generate unique IDs
let nextId = Math.max(...todos.value.map(t => t.id), 0) + 1;

// Computed properties
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
    createdAt: new Date()
  });
  
  newTodo.value = '';
};

const toggleTodo = (todo: Todo) => {
  todo.completed = !todo.completed;
};

const removeTodo = (todo: Todo) => {
  const index = todos.value.indexOf(todo);
  if (index !== -1) {
    todos.value.splice(index, 1);
  }
};

const editTodo = (todo: Todo) => {
  const newText = prompt('编辑任务:', todo.text);
  if (newText !== null && newText.trim() !== '') {
    todo.text = newText.trim();
  }
};

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed);
};
</script>