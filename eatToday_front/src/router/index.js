import {createRouter, createWebHistory} from 'vue-router';


// view 페이지 import 
import SignUpPage from '@/views/member/SignUp.vue';
import LoginPage from '@/views/member/Login.vue';
import UpdateProfilePage from '@/views/member/UpdateProfilePage.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [  
        // {path: '/', component: HomePage},  // 메인화면
        {path: '/login', component: LoginPage},  //로그인
        {path: '/signup', component: SignUpPage},  //회원가입
        {path: '/updateprofile', component: UpdateProfilePage},  //회원정보 수정
        { path: '/', redirect: '/login' }   //로그인 창에서 회원가입 누르면 회원가입 페이지로 리다이렉트
    ]   
});

export default router;