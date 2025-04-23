import { defineStore } from "pinia";
import axios from "axios";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: JSON.parse(localStorage.getItem("todos")) || [], // Load todos from localStorage
    search: "",
    filter: "all",
    selectedTodo: null, // Store the selected todo for detailed view
  }),
  getters: {
    filteredTodos(state) {
      return state.todos
        .filter((todo) =>
          todo.title.toLowerCase().includes(state.search.toLowerCase())
        )
        .filter((todo) => {
          if (state.filter === "completed") return todo.completed;
          if (state.filter === "pending") return !todo.completed;
          return true;
        });
    },
  },
  actions: {
    // Save todos to localStorage whenever there's a change
    saveTodosToLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    async fetchTodos() {
      // Use local storage for persistence
      const todosFromStorage = JSON.parse(localStorage.getItem("todos"));
      if (todosFromStorage) {
        this.todos = todosFromStorage;
      } else {
        // If there's no data in localStorage, fetch from API
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/todos"
        );
        this.todos = res.data.slice(0, 20);
        this.saveTodosToLocalStorage();
      }
    },
    async addTodo(title) {
      const newTodo = {
        id: Date.now(), // Temporary ID based on timestamp
        title,
        completed: false,
      };
      this.todos.unshift(newTodo);
      this.saveTodosToLocalStorage(); // Save to localStorage
    },
    async editTodo(id, updatedTitle, updatedCompleted) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.title = updatedTitle;
        todo.completed = updatedCompleted;
        this.saveTodosToLocalStorage(); // Save to localStorage
      }
    },
    async deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.saveTodosToLocalStorage(); // Save to localStorage
    },
    async toggleTodo(id) {
      const todo = this.todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this.saveTodosToLocalStorage(); // Save to localStorage
      }
    },
    setSearch(text) {
      this.search = text;
    },
    setFilter(type) {
      this.filter = type;
    },
    setSelectedTodo(todo) {
      this.selectedTodo = todo;
    },
    clearSelectedTodo() {
      this.selectedTodo = null; // To reset selected todo
    },
  },
});
