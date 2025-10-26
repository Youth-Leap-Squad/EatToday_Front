// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 게시글
import PostList from '@/views/post/PostList.vue';
import PostDetail from "@/views/post/PostDetail.vue"; 
import PostCreate from "@/views/post/PostCreate.vue";
import ScrapPage from "@/views/post/ScrapPage.vue";

// 회원 관련
import SignUpPage from '@/views/member/SignUp.vue';
import LoginPage from '@/views/member/Login.vue';
import UpdateProfilePage from '@/views/member/UpdateProfilePage.vue';

const routes = [
  { path: '/', redirect: '/post' },

  { path: '/post', name: 'PostList', component: PostList },
  { path: "/post/food", name: "PostDetail", component: PostDetail },
  { path: "/post/new", component: PostCreate },
  { path: "/post/scrap", component: ScrapPage },

  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/signup', name: 'SignUp', component: SignUpPage },
  { path: '/updateprofile', name: 'UpdateProfile', component: UpdateProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
