import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import { isAuthenticated } from "../utils/auth";

const routes = [
  { path: "/", component: Login },
  {
    path: "/dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next("/");
    },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
