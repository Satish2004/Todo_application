import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import { isAuthenticated } from "../utils/auth";

const routes = [
  // Default route: Login page
  {
    path: "/",
    name: "Login",
    component: Login,
  },

  // Protected route: Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      // If the user is authenticated, allow them to enter the dashboard
      if (isAuthenticated()) {
        next();
      } else {
        // If not authenticated, redirect to login page
        next("/");
      }
    },
  },

  // Add any additional routes here if needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
