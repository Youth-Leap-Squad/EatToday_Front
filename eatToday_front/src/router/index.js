import { createRouter, createWebHistory } from 'vue-router'

// 게시글
import PostList from '@/views/post/PostList.vue'
import PostDetail from '@/views/post/PostDetail.vue'
import PostCreate from '@/views/post/PostCreate.vue'
import ScrapPage from '@/views/post/ScrapPage.vue'

// 라운지
import RoungePage from '@/views/rounge/Rounge.vue'

// 기타 페이지
import HomePage from '@/views/Home.vue'
import SignUpPage from '@/views/member/SignUp.vue'
import LoginPage from '@/views/member/Login.vue'
import UpdateProfilePage from '@/views/member/UpdateProfilePage.vue'
import MyPage from '@/views/mypage/Mypage.vue'

// Event
import EventHome from "@/views/event/EventHome.vue"
import Albti_Survey from "@/views/event/event_albti/Albti_Survey.vue"
import Albti_Result from "@/views/event/event_albti/Albti_Result.vue"
import Worldcup_Select from "@/views/event/event_worldcup/Worldcup_Select.vue"
import Worldcup_Play from "@/views/event/event_worldcup/Worldcup_Play.vue"
import Worldcup_Week from "@/views/event/event_worldcup/Worldcup_Week.vue"

// QnA
import MainQna from '@/views/report_dm_qna/MainQna.vue'
import MyQna from '@/views/report_dm_qna/MyQna.vue'
import QnaComment from '@/views/report_dm_qna/QnaComment.vue'
import QnaCreate from '@/views/report_dm_qna/QnaCreate.vue'

// 관리자
import AdminDashboard from '@/views/member/admin/AdminDashboard.vue'
import PostManagement from '@/views/member/admin/PostManagement.vue'
import MemberManagement from '@/views/member/admin/MemberManagement.vue'
import EventManagement from '@/views/member/admin/EventManagement.vue'
import WorldCupGameDetails from '@/views/member/admin/WorldCupGameDetails.vue'
import AlbtiStatistics from '@/views/member/admin/AlbtiStatistics.vue'
import ReportManagement from '@/views/member/admin/ReportManagement.vue'
import QnaManagement from '@/views/member/admin/QnaManagement.vue'
import AdminQnaAnswer from '@/views/member/admin/AdminQnaAnswer.vue'

// Message
import Dm from '@/views/message/Dm.vue'

// PhotoReview
import PhotoReviewDetail from '@/views/review/PhotoReviewDetail.vue'
import PhotoReviewCreate from '@/views/review/PhotoReviewCreate.vue'
import PhotoReviewMiniList from '@/views/review/PhotoReviewMiniListByBoard.vue'

// Footer pages
import AboutProject from '@/views/AboutProject.vue'
import TermsDefinition from '@/views/TermsDefinition.vue'
import TermsOfService from '@/views/TermsOfService.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },

    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignUpPage },
    { path: '/updateprofile', component: UpdateProfilePage },

    { path: '/rounge', component: RoungePage },

    // ✅ 마이페이지 경로 개선 - 핵심 수정
    { path: '/mypage', name: 'mypage.self', component: MyPage },
    { path: '/mypage/:memberNo', name: 'mypage.user', component: MyPage, props: true },

    // 게시글
    { path: '/alcohol/:id', name: 'AlcoholList', component: PostList, props: true },
    { path: '/post/new', name: 'PostCreate', component: PostCreate },
    { path: '/post/:id', name: 'PostDetail', component: PostDetail, props: true },
    { path: '/post/scrap', component: ScrapPage },

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
    { path: '/admin/qna', component: QnaManagement },
    { path: '/admin/qna/answer', component: AdminQnaAnswer },

    // 메시지
    { path: '/dm', component: Dm },

    // 사진 리뷰
    { path: '/boards/:boardNo/reviews/new', component: PhotoReviewCreate },
    { path: '/reviews/:reviewNo', component: PhotoReviewDetail, props: true },
    { path: '/board/:boardNo', component: PhotoReviewMiniList },

    // footer
    { path: '/about', component: AboutProject },
    { path: '/terms', component: TermsDefinition },
    { path: '/service-terms', component: TermsOfService },
    { path: '/privacy', component: PrivacyPolicy },

    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router