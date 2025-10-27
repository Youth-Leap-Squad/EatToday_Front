import { createRouter, createWebHistory } from 'vue-router';

// view 페이지 import 
import HomePage from '@/views/Home.vue'
import SignUpPage from '@/views/member/SignUp.vue';
import LoginPage from '@/views/member/Login.vue';
import UpdateProfilePage from '@/views/member/UpdateProfilePage.vue'
import RoungePage from '@/views/rounge/Rounge.vue';

// event 파트
import EventHome from "@/views/event/EventHome.vue";
import Albti_Survey from "@/views/event/event_albti/Albti_Survey.vue";    // 술BTI 설문화면
import Albti_Result from "@/views/event/event_albti/Albti_Result.vue";    // 술BTI 결과화면
import Worldcup_Select from "@/views/event/event_worldcup/Worldcup_Select.vue"; // World 술선택 화면
import Worldcup_Play from "@/views/event/event_worldcup/Worldcup_Play.vue";     // World 진행 화면
import Worldcup_Week from "@/views/event/event_worldcup/Worldcup_Week.vue";     // World 주간 순위 조회 화면

import MyPage from '@/views/mypage/Mypage.vue'; // 마이페이지

// Qna
import MainQna from '@/views/report_dm_qna/MainQna.vue';
import MyQna from '@/views/report_dm_qna/MyQna.vue';
import QnaComment from '@/views/report_dm_qna/QnaComment.vue';
import QnaCreate from '@/views/report_dm_qna/QnaCreate.vue';

import AdminDashboard from '@/views/member/admin/AdminDashboard.vue';
import PostManagement from '@/views/member/admin/PostManagement.vue';
import MemberManagement from '@/views/member/admin/MemberManagement.vue';
import EventManagement from '@/views/member/admin/EventManagement.vue';
import WorldCupGameDetails from '@/views/member/admin/WorldCupGameDetails.vue';
import AlbtiStatistics from '@/views/member/admin/AlbtiStatistics.vue';
import ReportManagement from '@/views/member/admin/ReportManagement.vue';

// Footer pages
import AboutProject from '@/views/AboutProject.vue';
import TermsDefinition from '@/views/TermsDefinition.vue';
import TermsOfService from '@/views/TermsOfService.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';

const router = createRouter({

    history: createWebHistory(),
    routes: [  
        
    //    {path: '/', component: HomePage},  // 메인화면
        {path: '/login', component: LoginPage},  //로그인
        {path: '/signup', component: SignUpPage},  //회원가입
        {path: '/updateprofile', component: UpdateProfilePage},  //회원정보 수정
        {path: '/admindashboard', component:AdminDashboard}, // 관리자페이지 대시보드
       // {path: 'adminstatcard', component:} 

        {path: '/', component: HomePage},  // 메인화면
        {path: '/login', component: LoginPage},  //로그인
        {path: '/signup', component: SignUpPage},  //회원가입
        {path: '/updateprofile', component: UpdateProfilePage},  //회원정보 수정


    { path: '/login', component: LoginPage },                // 로그인
    { path: '/signup', component: SignUpPage },              // 회원가입
    { path: '/rounge', component: RoungePage },              // 라운지
    { path: '/updateprofile', component: UpdateProfilePage}, // 회원정보 수정
    { path: '/mypage', component: MyPage },                  // 마이페이지

    // QnA
    { path: '/qna', component: MainQna },
    { path: '/qna/my', component: MyQna },
    { path: '/qna/comment', component: QnaComment },
    { path: '/qna/create', component: QnaCreate },

    // 이벤트
    { path: '/event', component: EventHome },
    { path: '/event/albti/survey', component: Albti_Survey },
    { path: '/event/albti/result', component: Albti_Result },
    { path: '/event/worldcup', component: Worldcup_Select },
    { path: '/event/worldcup/play', component: Worldcup_Play },
    { path: '/event/worldcup/week', component: Worldcup_Week },

    // 관리자
    { path: '/admindashboard', component: AdminDashboard },
    { path: '/admin/member', component: MemberManagement },
    { path: '/admin/post', component: PostManagement },
    { path: '/admin/report', component: ReportManagement },
    { path: '/admin/event', component: EventManagement },
    { path: '/admin/event/worldcup', component: WorldCupGameDetails },
    { path: '/admin/event/albti', component: AlbtiStatistics },

    // Footer pages
    { path: '/about', component: AboutProject },
    { path: '/terms', component: TermsDefinition },
    { path: '/service-terms', component: TermsOfService },
    { path: '/privacy', component: PrivacyPolicy },

    // ✅ catch-all 은 항상 맨 마지막
    { path: '/:pathMatch(.*)*', redirect: '/event' },
  ]
});

export default router;
