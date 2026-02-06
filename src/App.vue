<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Modern Todo App</h1>
        <p class="text-gray-600">Organize your tasks efficiently</p>
      </header>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ todos.length }}</div>
          <div class="text-gray-600 text-sm">Total Tasks</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
          <div class="text-gray-600 text-sm">Completed</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ pendingCount }}</div>
          <div class="text-gray-600 text-sm">Pending</div>
        </div>
      </div>

      <!-- Add Todo Form -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <form @submit.prevent="addTodo" class="flex gap-3">
          <input
            v-model="newTodo"
            type="text"
            placeholder="What needs to be done?"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @keyup.enter="addTodo"
          />
          <button
            type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add
          </button>
        </form>
      </div>

      <!-- Todo Filters -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            @click="filter = 'all'"
            :class="{ 'bg-indigo-600 text-white': filter === 'all', 'bg-white text-gray-700 hover:bg-gray-100': filter !== 'all' }"
            class="px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200"
          >
            All
          </button>
          <button
            type="button"
            @click="filter = 'active'"
            :class="{ 'bg-indigo-600 text-white': filter === 'active', 'bg-white text-gray-700 hover:bg-gray-100': filter !== 'active' }"
            class="px-4 py-2 text-sm font-medium border-t border-b border-gray-200"
          >
            Active
          </button>
          <button
            type="button"
            @click="filter = 'completed'"
            :class="{ 'bg-indigo-600 text-white': filter === 'completed', 'bg-white text-gray-700 hover:bg-gray-100': filter !== 'completed' }"
            class="px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200"
          >
            Completed
          </button>
        </div>
      </div>

      <!-- Todo List -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
            :class="{ 'opacity-75': todo.completed }"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo)"
                class="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span
                class="ml-4 text-gray-800"
                :class="{ 'line-through': todo.completed }"
              >
                {{ todo.text }}
              </span>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editTodo(todo)"
                class="text-indigo-600 hover:text-indigo-900"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                @click="removeTodo(todo)"
                class="text-red-600 hover:text-red-900"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
          <li v-if="filteredTodos.length === 0" class="px-6 py-12 text-center">
            <div class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No tasks found. Add a new task to get started!</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Clear Completed -->
      <div class="mt-6 text-center" v-if="completedCount > 0">
        <button
          @click="clearCompleted"
          class="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Clear {{ completedCount }} completed {{ completedCount === 1 ? 'task' : 'tasks' }}
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
  { id: 1, text: 'Learn Vue 3', completed: true, createdAt: new Date() },
  { id: 2, text: 'Build a Todo app', completed: false, createdAt: new Date() },
  { id: 3, text: 'Deploy to production', completed: false, createdAt: new Date() }
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
  const newText = prompt('Edit your task:', todo.text);
  if (newText !== null && newText.trim() !== '') {
    todo.text = newText.trim();
  }
};

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed);
};
</script>