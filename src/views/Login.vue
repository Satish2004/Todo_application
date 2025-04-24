<template>
  <div>
    <!-- Preloader -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center bg-black">
      <div class="text-center">
        <div class="text-[730%] font-semibold text-zinc-400 mb-4">{{ progress }}%</div>
      </div>
    </div>

    <!-- Login Form -->
    <div v-else class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      
      <!-- GLB 3D Model Viewer -->
    <model-viewer
  src="/model1.glb"
  alt="3D Login Mascot"
  camera-controls
  disable-zoom
  auto-rotate
  animation-name="walk"
  interaction-prompt="none"
  rotation-per-second="10deg"
  shadow-intensity="1"
  class="w-[100px] h-[150px] mb-[-18.5rem] ml-[16rem] sm:ml-[22rem]"
></model-viewer>


      <BlobCursor fillColor="#ff00ff" blobType="circle" />

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

      <div class="text-center mt-10 text-[9px]">
        <p class="text-zinc-400">
          <strong>Note:</strong> This is a dummy login page. To log in, use the username <code>user@example.com</code> and the password <code>password123</code>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../utils/auth";
import { useToast } from "vue-toastification";
import BlobCursor from "../components/animation.vue";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: true,
      progress: 0,
    };
  },
  mounted() {
    this.simulatePreloader();
  },
  methods: {
    simulatePreloader() {
      const interval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      }, 20);
    },
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
  components: {
    BlobCursor,
  },
};
</script>

<style scoped>
/* You can customize styles here */
</style>
