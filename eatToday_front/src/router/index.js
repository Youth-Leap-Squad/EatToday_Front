import {createRouter, createWebHistory} from 'vue-router';


// view 페이지 import 
import SignUpPage from '@/views/member/SignUp.vue';
import LoginPage from '@/views/member/Login.vue';
import UpdateProfilePage from '@/views/member/UpdateProfilePage.vue'

// event 파트
import EventHome from "@/views/event/EventHome.vue";
import Albti_Survey from "@/views/event/event_albti/Albti_Survey.vue";    // 술BTI 설문화면
import Albti_Result from "@/views/event/event_albti/Albti_Result.vue";    // 술BTI 결과화면
import Worldcup_Select from "@/views/event/event_worldcup/Worldcup_Select.vue"; // World 술선택 화면
import Worldcup_Play from "@/views/event/event_worldcup/Worldcup_Play.vue";     // World 진행 화면
import Worldcup_Week from "@/views/event/event_worldcup/Worldcup_Week.vue"; // World 주간 순위 조회 화면


const router = createRouter({
    history: createWebHistory(),
    routes: [  
        // {path: '/', component: HomePage},  // 메인화면
        {path: '/login', component: LoginPage},  //로그인
        {path: '/signup', component: SignUpPage},  //회원가입
        {path: '/updateprofile', component: UpdateProfilePage},  //회원정보 수정
        // {path: '/', redirect: '/login' },   //로그인 창에서 회원가입 누르면 회원가입 페이지로 리다이렉트


        {path: '/', component: EventHome},
        {path: "/event", component: EventHome },    // 이벤트 메인화면
        {path: "/event/albti/survey", component: Albti_Survey },    // 술BTI 설문화면
        {path: "/event/albti/result", component: Albti_Result },     // 술BTI 결과화면
        // { path: '/:pathMatch(.*)*', redirect: '/event/albti/survey' }
        
        
        {path: "/event/worldcup",component: Worldcup_Select},       // World 술선택 화면
        {path: "/event/worldcup/play",component: Worldcup_Play},    // World 진행 화면
        {path: "/event/worldcup/week",component: Worldcup_Week}, // World 주간 순위 조회 화면
        
        // ✅ catch-all 은 항상 **제일 마지막**
        { path: '/:pathMatch(.*)*', redirect: '/event' }
    ]   
});

export default router;