<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <section class="greeting">
        안녕하세요. <b>오늘 뭐랑? 관리자님!</b>
      </section>

  <h1 class="title">대시보드</h1>

  <!-- KPI 카드 -->
  <section class="cards">
    <StatCard label="회원 수" :value="1324" unit="명" />
    <StatCard label="게시물 등록수" :value="294" unit="건" />
    <StatCard label="미처리 신고" :value="8" unit="건" highlight />
    <StatCard label="강퇴 회원" :value="1" unit="명" />
  </section>

  <section class="grid">
    <!-- 신고 내역 -->
    <div class="panel">
      <div class="panel-title">신고 내역</div>
      <table class="table">
        <thead>
          <tr>
            <th>신고자</th><th>신고 대상</th><th>신고 위치</th><th>신고 사유</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in reports" :key="i">
            <td>{{ r.reporter }}</td>
            <td>{{ r.target }}</td>
            <td>{{ r.place }}</td>
            <td>{{ r.reason }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 시스템 알림 -->
    <div class="panel">
      <div class="panel-title">시스템 알림</div>
      <table class="table">
        <thead>
          <tr><th>일자</th><th>메시지</th></tr>
        </thead>
        <tbody>
          <tr v-for="(n, i) in notices" :key="i">
            <td>{{ n.date }}</td>
            <td>{{ n.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>
     </section>
    </div>
    <AdminFooter />
  </div>
</template>

<script setup>
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'
import StatCard from './AdminStatCard.vue'

const reports = [
  { reporter: '박**', target: '신**', place: '게시물', reason: '욕설' },
  { reporter: '김**', target: '이**', place: '안주리뷰', reason: '부적절' },
  { reporter: '최**', target: '정**', place: '댓글', reason: '욕설' },
]

const notices = [
  { date: '2025.08.12', message: '서버 점검 예정' },
  { date: '2025.09.27', message: '이미지 업로드 오류 현상 안내' },
  { date: '2025.10.14', message: '🎉 새로운 이벤트 ‘술BTI’ 등록' },
]
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #fafafa;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 40px;
}

.greeting { background:#fff0d7; border:1px solid #f0e0c8; padding:10px 14px; border-radius:10px; margin-bottom:16px }
.title { font-size:28px; font-weight:800; color:#3b2e1e; margin: 6px 0 16px }

.cards {
  display:grid; grid-template-columns: repeat(4, 1fr); gap:14px; margin-bottom:18px;
}
.grid { display:grid; grid-template-columns: 1fr 1fr; gap:14px }
.panel { background:#fff; border:1px solid #ecdcc5; border-radius:14px; padding:14px }
.panel-title { font-weight:700; margin-bottom:10px; color:#3b2e1e }

.table { width:100%; border-collapse: collapse; }
.table th, .table td { padding:10px 8px; border-bottom:1px solid #f0e7d8; font-size:14px; }
.table thead th { text-align:left; color:#5a4936; }

@media (max-width: 960px) {
  .cards { grid-template-columns: 1fr 1fr; }
  .grid { grid-template-columns: 1fr; }
}
</style>
