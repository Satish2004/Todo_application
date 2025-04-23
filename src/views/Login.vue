<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
    <form
      class="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm"
      @submit.prevent="handleLogin"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

      <input
        v-model="email"
        type="email"
        class="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        class="w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Password"
      />

      <button
        class="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import { login } from "../utils/auth";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      const toast = useToast();
      if (login(this.email, this.password)) {
        localStorage.setItem("isLoggedIn", "true");
        this.$router.push("/dashboard");
        toast.success("Login successful! Redirecting to dashboard...");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Custom styles */
</style>    export function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}