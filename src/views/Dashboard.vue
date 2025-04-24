<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useTodoStore } from "../stores/todoStore";
import { storeToRefs } from "pinia";
import Draggable from "vuedraggable";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "../style.css";

gsap.registerPlugin(ScrollTrigger);

// Theme
const isDark = ref(localStorage.getItem("theme") === "dark");
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

// Store logic
const store = useTodoStore();
const { filteredTodos, search, filter, selectedTodo, todos } = storeToRefs(store);
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

// Load data
onMounted(async () => {
  await fetchTodos();
  loading.value = false;

  const savedTodos = JSON.parse(localStorage.getItem("todos"));
  if (savedTodos) store.todos = savedTodos;

  nextTick(() => {
    animateTodoList();
  });
});

watch(search, (val) => setSearch(val));
watch(filter, (val) => setFilter(val));

// Add, delete, toggle
function add() {
  if (!newTodoTitle.value.trim()) return;
  addTodo(newTodoTitle.value);
  newTodoTitle.value = "";

  nextTick(() => {
    animateTodoList(); // Animate new todo
  });
}
function remove(id) {
  deleteTodo(id);
}
function toggle(id) {
  toggleTodo(id);
}

// Edit logic
const updatedTitle = ref("");
const updatedCompleted = ref(false);
function selectTodoForEditing(todo) {
  setSelectedTodo(todo);
  updatedTitle.value = todo.title;
  updatedCompleted.value = todo.completed;
}
function edit() {
  if (!updatedTitle.value.trim()) return;
  editTodo(selectedTodo.value.id, updatedTitle.value, updatedCompleted.value);
  cancel();
}
function cancel() {
  clearSelectedTodo();
  updatedTitle.value = "";
}

// Drag & Drop
function onDragEnd(evt) {
  const movedItem = filteredTodos.value[evt.oldIndex];
  const newIndex = evt.newIndex;

  const oldIndexInAll = todos.value.findIndex(t => t.id === movedItem.id);
  todos.value.splice(oldIndexInAll, 1);

  const beforeItem = filteredTodos.value[newIndex - 1];
  const afterItem = filteredTodos.value[newIndex + 1];

  let insertAt = todos.value.length;
  if (beforeItem) {
    insertAt = todos.value.findIndex(t => t.id === beforeItem.id) + 1;
  } else if (afterItem) {
    insertAt = todos.value.findIndex(t => t.id === afterItem.id);
  }

  todos.value.splice(insertAt, 0, movedItem);

  localStorage.setItem("todos", JSON.stringify(todos.value));
}

// GSAP Scroll-based Left-to-Right animation
function animateTodoList() {
  gsap.utils.toArray(".todo-item").forEach((el, index) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 0.1,
        delay: index * 0.03,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      }
    );
  });
}
</script>

<template>
  <div :class="`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`">
    
    <!-- Header -->
    <div class="flex justify-between items-center p-4 shadow">
      <h1 class="text-2xl font-bold">To-Do Application</h1>
      <button @click="toggleTheme" class="text-2xl flex items-center gap-2">
        <span v-if="isDark"><font-awesome-icon :icon="['fas', 'sun']" /></span>
        <span v-else><font-awesome-icon :icon="['fas', 'moon']" /></span>
      </button>
    </div>


   

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-96">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>

    <!-- Main UI -->
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

      <!-- Add New -->
      <div class="mb-4">
        <input
          v-model="newTodoTitle"
          placeholder="Enter new todo..."
          class="border p-2 w-full rounded mb-2 text-zinc-600"
        />
        <button @click="add" class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full transition">Add Todo</button>
      </div>

      <!-- Drag-and-Drop Todo List -->
      <Draggable :list="filteredTodos" item-key="id" @end="onDragEnd">
        <template #item="{ element: todo }">
          <li
            class="todo-item flex items-center justify-between mb-2 p-2 rounded shadow transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div class="flex items-center">
              <input type="checkbox" v-model="todo.completed" @change="toggle(todo.id)" class="mr-2" />
              <span :class="{ 'line-through text-gray-400': todo.completed }">
                {{ todo.title }}
              </span>
            </div>
            <div class="flex gap-2">
              <button @click="selectTodoForEditing(todo)" class="text-black bg-green-400 rounded-md w-[40px] h-[40px]">Edit</button>
              <button @click="remove(todo.id)" class="text-black w-[80px] h-[40px] bg-red-600 rounded-md">Delete</button>
            </div>
          </li>
        </template>
      </Draggable>

      <!-- Edit Modal -->
      <div v-if="selectedTodo" id="editmodel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
        <div class="bg-white dark:bg-white p-6 rounded-lg w-full max-w-md shadow-lg transition">
          <h2 class="text-xl font-bold mb-4">Edit Todo</h2>
          <input v-model="updatedTitle" :placeholder="selectedTodo.title" class="border p-2 w-full mb-4 rounded" />
          <div class="flex items-center mb-4">
            <input type="checkbox" v-model="updatedCompleted" class="mr-2" />
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
html.dark {
  background-color: #d3d3d3;
}

</style>
