<script setup>
import { ref, onMounted } from "vue";
import { useTodoStore } from "../stores/todoStore";
import { storeToRefs } from "pinia";

// Check if a theme exists in localStorage and set it accordingly
const isDark = ref(localStorage.getItem("theme") === "dark");

// Function to toggle the theme
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  
  // Store the theme choice in localStorage
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

// Store logic
const store = useTodoStore();
const { filteredTodos, search, filter, selectedTodo } = storeToRefs(store);
const {
  fetchTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  setSearch,
  setFilter,
  editTodo,
  setSelectedTodo,
  clearSelectedTodo,
} = store;

const loading = ref(true);
const newTodoTitle = ref("");

// Fetch todos when component is mounted
onMounted(async () => {
  await fetchTodos();
  loading.value = false;
});

// Add new todo
function add() {
  if (!newTodoTitle.value.trim()) return;
  addTodo(newTodoTitle.value);
  newTodoTitle.value = "";
}

// Remove todo
function remove(id) {
  deleteTodo(id);
}

// Toggle todo completion
function toggle(id) {
  toggleTodo(id);
}

// Select todo for editing
function selectTodoForEditing(todo) {
  setSelectedTodo(todo);
  updatedTitle.value = todo.title;
  updatedCompleted.value = todo.completed;
}

// Edit todo
const updatedTitle = ref("");
const updatedCompleted = ref(false);
function edit() {
  if (!updatedTitle.value.trim()) return;
  editTodo(selectedTodo.value.id, updatedTitle.value, updatedCompleted.value);
  clearSelectedTodo();
  updatedTitle.value = "";
}

// Cancel editing
function cancel() {
  clearSelectedTodo();
  updatedTitle.value = "";
}

</script>

<template>
  <div :class="`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`">
    <!-- Header with Theme Toggle -->
    <div class="flex justify-between items-center p-4 shadow">
      <h1 class="text-2xl font-bold">To-Do Application</h1>
      <button @click="toggleTheme" class="text-2xl">
        <span v-if="isDark">🌞</span>
        <span v-else>🌙</span>
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-96">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>

    <!-- Main App UI -->
    <div v-else class="max-w-2xl mx-auto p-4">
      <!-- Search & Filter -->
      <div class="mb-4 flex flex-col sm:flex-row gap-2">
        <input v-model="search" placeholder="Search Your Todo" class="border p-2 w-full rounded text-zinc-600" />
        <select v-model="filter" class="border p-2 rounded text-zinc-600">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <!-- Add New Todo -->
      <div class="mb-4">
        <input
          v-model="newTodoTitle"
          placeholder="Enter new todo..."
          class="border p-2 w-full rounded mb-2 text-zinc-600"
        />
        <button @click="add" class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full transition">Add Todo</button>
      </div>

      <!-- Todo List -->
      <ul>
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="flex items-center justify-between mb-2 p-2 rounded shadow transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="todo.completed"
              @change="toggle(todo.id)"
              class="mr-2"
            />
            <span :class="{ 'line-through text-gray-400': todo.completed }">
              {{ todo.title }}
            </span>
          </div>
          <div class="flex gap-2">
            <button @click="selectTodoForEditing(todo)" class="text-black bg-green-400 rounded-md w-[40px] h-[40px]">Edit</button>
            <button @click="remove(todo.id)" class="text-black w-[80px] h-[40px] bg-red-600 rounded-md">Delete</button>
          </div>
        </li>
      </ul>

      <!-- Edit Todo Modal -->
      <div
        v-if="selectedTodo"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg transition">
          <h2 class="text-xl font-bold mb-4">Edit Todo</h2>
          <input
            v-model="updatedTitle"
            :placeholder="selectedTodo.title"
            class="border p-2 w-full mb-4 rounded"
          />
          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              v-model="updatedCompleted"
              class="mr-2"
            />
            <label>Completed</label>
          </div>
          <button @click="edit" class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full mb-2 transition">Save</button>
          <button @click="cancel" class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded w-full transition">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Ensure dark mode works properly */
html.dark {
  background-color: #1a202c;
}
</style>
