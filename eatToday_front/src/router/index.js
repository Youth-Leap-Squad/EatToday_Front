import { createRouter, createWebHistory } from "vue-router";
import PostList from "@/views/post/PostList.vue";

const routes = [
  { path: "/", redirect: "/post" },
  { path: "/post", name: "PostList", component: PostList },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
