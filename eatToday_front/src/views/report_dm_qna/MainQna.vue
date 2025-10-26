<template>
    <div class="qna">
      <div class="inner">
        <h1 class="title">고객센터</h1>
        <hr class="title-line" />
  
        <div class="search-box">
          <img class="search-icon" :src="searchImg" alt="search" />
          <input v-model="query" class="search-input" type="text" placeholder="검색어를 입력하세요." />
        </div>
  
        <div class="tabs">
          <button
            v-for="c in categories"
            :key="c.key"
            class="tab"
            :class="{ active: activeCat === c.key }"
            @click="setCat(c.key)"
          >
            {{ c.label }}
          </button>
        </div>
  
        <div class="board">
          <div class="board-head">
            <div class="board-head-inner">
              <button class="my-btn" @click="goToMyQna">
                내 문의 사항
                <img class="arrow-img" :src="nextBtn" alt="next" />
              </button>
              <hr class="my-line" />
            </div>
          </div>
  
          <ul class="rows">
            <li v-for="row in pagedRows" :key="row.id" class="row">
              <div class="row-inner">
                <span class="badge">{{ row.badge }}</span>
                <span class="subject">{{ row.subject }}</span>
              </div>
            </li>
          </ul>
        </div>
  
        <div class="pager">
          <button class="nav" @click="prevPage" :disabled="page === 1">
            <img :src="leftBtn" alt="prev" />
          </button>
  
          <button
            v-for="p in pages"
            :key="p"
            class="page"
            :class="{ current: p === page }"
            @click="go(p)"
          >
            {{ p }}
          </button>
  
          <button class="nav" @click="nextPage" :disabled="page === pages">
            <img :src="rightBtn" alt="next" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import searchImg from '@/assets/images/search.png'
  import leftBtn from '@/assets/images/leftbutton.png'
  import rightBtn from '@/assets/images/rightbutton.png'
  import nextBtn from '@/assets/images/nextbutton.png'
  
  const router = useRouter()
  function goToMyQna() {
    router.push('/qna/my')
  }
  const categories = [
    { key: 'notice', label: '공지' },
    { key: 'event', label: '이벤트' },
    { key: 'guide', label: '서비스 안내' },
    { key: 'faq', label: '자주 묻는 질문' },
    { key: 'etc', label: '기타' }
  ]
  
  const allRows = [
    { id: 1, cat: 'faq', badge: '자주 묻는 질문', subject: '이벤트 시작이 안돼요' },
    { id: 2, cat: 'faq', badge: '자주 묻는 질문', subject: '포인트가 안쌓여요' },
    { id: 3, cat: 'faq', badge: '자주 묻는 질문', subject: '이메일 인증이 안와요' },
    { id: 4, cat: 'notice', badge: '공지', subject: '서비스 점검 안내' },
    { id: 5, cat: 'event', badge: '이벤트', subject: '가을 프로모션 참여 방법' },
    { id: 6, cat: 'guide', badge: '서비스 안내', subject: '회원등급 기준 변경' },
    { id: 7, cat: 'etc', badge: '기타', subject: '기타 문의 예시 1' },
    { id: 8, cat: 'etc', badge: '기타', subject: '기타 문의 예시 2' },
    { id: 9,  cat: 'faq',    badge: '자주 묻는 질문', subject: '비밀번호를 잊어버렸어요' },
    { id: 10, cat: 'faq',    badge: '자주 묻는 질문', subject: '휴면 해제는 어떻게 하나요' },
    { id: 11, cat: 'faq',    badge: '자주 묻는 질문', subject: '쿠폰이 적용되지 않아요' },
    { id: 12, cat: 'notice', badge: '공지', subject: '개인정보 처리방침 개정 안내' },
    { id: 13, cat: 'event',  badge: '이벤트', subject: '친구 초대 이벤트 유의사항' },
    { id: 14, cat: 'guide',  badge: '서비스 안내', subject: '문의 접수 후 처리 절차' },
    { id: 15, cat: 'etc',    badge: '기타', subject: '제휴 문의 방법' },
    { id: 16, cat: 'faq',    badge: '자주 묻는 질문', subject: '알림이 오지 않아요' },
    { id: 17, cat: 'faq',    badge: '자주 묻는 질문', subject: '결제가 실패해요' },
    { id: 18, cat: 'guide',  badge: '서비스 안내', subject: '탈퇴 전 꼭 확인하세요' }
  ]
  
  const activeCat = ref('faq')
  const query = ref('')
  const page = ref(1)
  const pageSize = 3
  
  const filtered = computed(() => {
    const q = query.value.trim()
    const byCat = allRows.filter(r => (activeCat.value ? r.cat === activeCat.value : true))
    if (!q) return byCat
    return byCat.filter(r => r.subject.includes(q) || r.badge.includes(q))
  })
  
  const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
  
  const pagedRows = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })
  
  function setCat(key) { activeCat.value = key; page.value = 1 }
  function go(p) { page.value = p }
  function prevPage() { if (page.value > 1) page.value-- }
  function nextPage() { if (page.value < pages.value) page.value++ }
  </script>
  
  <style scoped>
  .qna {
    background: #FFF7E9;
    min-height: 100vh;
  }
  .inner {
    width: 86%;
    max-width: 980px;
    margin: 0 auto;
    padding: 28px 0 48px;
    box-sizing: border-box;
  }
  
  .title {
    font-size: 32px;
    font-weight: 800;
    color: #2B1F14;
    margin: 0 0 8px 0;
  }
  .title-line {
    border: none;
    border-top: 3px solid #BFBFBF;
    margin: 0 0 24px 0;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: #fff;
    border: 5px solid #F8ECD9;
    border-radius: 14px;
    height: 56px;
    width: 85%;
    margin: 0 auto 26px auto;
    max-width: 100%;
  }
  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
  }
  .search-input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    padding: 0 16px 0 48px;
    color: #2d2d2f;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin: 12px 0 32px 0;
  }
  .tab {
    width: 140px;
    height: 48px;
    border-radius: 50px;
    border: none;
    background: #F8ECD9;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    color: #2d2d2f;
  }
  .tab.active {
    background: #F2D5A7;
    color: #000;
    font-weight: 800;
  }
  
  .board {
    background: #F5E7D1AB;
    border: 1px solid #E2D8C7;
    border-radius: 12px;
    width: 90%;
    height: 350px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
  
  /* 헤더 컨테이너를 row와 동일 폭(90%)으로 */
  .board-head {
    padding: 12px 0 0 0;
  }
  .board-head-inner {
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end; 
    }
  .my-btn {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 18px;
    color: #3b3127;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    margin-top: 7px;
  }
  .arrow-img {
    width: 16px;
    height: 16px;
  }
  .my-line {
    width: 100%;
    border: none;
    border-top: 1px solid #BFBFBF; 
    margin: 10px 0 0 0;
    }
  
  .rows {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex: 1 1 auto;
  }
  
  .row {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
    .row-inner {
    width: 90%;
    display: grid;
    grid-template-columns: 180px 1fr;
    align-items: center;
    padding: 18px 0;
    border-bottom: 1px solid #BFBFBF; 
    margin-bottom: 5px;
    }
  .badge {
    color: #caa86b;
    font-weight: 800;
    font-size: 18px;
  }
  .row:last-child .row-inner {
  border-bottom: none;
}
  .subject {
    color: #3b3127;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.5;
  }
  
  .pager {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 22px;
  }
  .nav {
    border: none;
    background: transparent;
    padding: 4px;
    cursor: pointer;
  }
  .nav[disabled] {
    opacity: 0.4;
    cursor: default;
  }
  .nav img {
    width: 18px;
    height: 18px;
  }
  .page {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 15px;
    color: #BFBFBF;
    padding: 4px 6px;
  }
  .page.current {
    color: #c4a874;
    font-size: 17px;
    font-weight: 700;
  }
  </style>