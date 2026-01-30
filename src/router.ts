import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("./components/content/views/HomeView.vue"),
  },
  {
    path: "/services",
    name: "services",
    component: () => import("./components/content/views/ServicesView.vue"),
  },
  {
    path: "/blog",
    name: "blog",
    component: () => import("./components/content/views/BlogView.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});