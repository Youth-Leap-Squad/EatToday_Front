import {createRouter, createWebHistory} from 'vue-router';

// view 페이지 import 
import SignUpPage from '@/views/member/SignUp.vue';
import LoginPage from '@/views/member/Login.vue';
import UpdateProfilePage from '@/views/member/UpdateProfilePage.vue'
import Dm from '@/components/dm/Dm.vue';
import PhotoReviewList from '@/components/photo_review/PhotoReviewList.vue';
import PhotoReviewDetail from '@/components/photo_review/PhotoReviewDetail.vue';
import PhotoReviewCreate from '@/components/photo_review/PhotoReviewCreate.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // {path: '/', component: HomePage},  // 메인화면
        {path: '/login', component: LoginPage},  //로그인
        {path: '/signup', component: SignUpPage},  //회원가입
        {path: '/updateprofile', component: UpdateProfilePage},  //회원정보 수정
        // { path: '/', redirect: '/login' },   //로그인 창에서 회원가입 누르면 회원가입 페이지로 리다이렉트
        {path: '/', component: Dm},
        { path: '/dm', component: Dm },
        { path: '/reviews', component: PhotoReviewList },
        { path: '/reviews/new', component: PhotoReviewCreate },
        { path: '/reviews/:id', component: PhotoReviewDetail, props: true },
        { path: '/:pathMatch(.*)*', redirect: '/reviews' }
    ]   
});

export default router;