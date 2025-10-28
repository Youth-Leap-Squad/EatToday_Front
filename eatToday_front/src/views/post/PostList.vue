<template>
  <div class="container">
    <div class="topbar">
      <h2 class="page-title">{{ pageTitle }}</h2>
      <!-- 한글 파라미터 안전 전달을 위해 객체로 바인딩 -->
    <RouterLink
      :to="{ path: '/event/worldcup/week', query: { alcohol: meta.title } }"
      class="worldcup-btn"
    >
      🏆 주간 월드컵 순위 조회하기
    </RouterLink>
    </div>

    <!-- 소개 섹션 -->
    <section class="drink-info" v-if="drink">
      <img :src="drink.image" alt="alcohol" class="drink-img" />

      <div class="drink-copy">
        <h2 class="drink-title">🥂 {{ drink.title }}</h2>

        <p class="lead">
          소주는 한국인의 일상과 함께하는 국민주입니다. 맑고 투명한 빛깔, 깔끔하고 상쾌한 맛—
          그 한 잔 속에는 한국의 정(情)과 추억이 담겨 있어요.
        </p>

        <div class="info-grid">
          <!-- 종류 -->
          <div class="info-block">
            <h3>🍶 소주의 종류</h3>
            <dl class="desc-list">
              <dt>증류식 소주</dt>
              <dd>
                쌀·보리·고구마 등의 곡물을 전통 방식으로 증류하여 만든 소주.
                깊고 풍부한 향, 부드러운 목넘김이 매력입니다.
                <span class="muted">대표 브랜드: 화요, 일품진로, 대장부</span>
              </dd>

              <dt>희석식 소주</dt>
              <dd>
                주정에 물과 감미료를 섞어 만든 현대 소주.
                가볍고 깨끗하며 누구나 편하게 즐기기 좋아요.
              </dd>
            </dl>
          </div>

          <!-- 페어링 -->
          <div class="info-block">
            <h3>🍽 소주 × 안주, 완벽한 페어링</h3>
            <ul class="pair-list">
              <li><strong>매운맛</strong> — 불닭발, 오돌뼈, 순대볶음처럼 매콤한 안주와 찰떡!</li>
              <li><strong>기름진 요리</strong> — 삼겹살, 족발, 제육볶음의 기름기를 깔끔하게 잡아줘요.</li>
              <li><strong>담백한 해산물</strong> — 문어숙회, 오징어볶음 같이 담백·쫄깃 계열도 굿.</li>
            </ul>
            <p class="tip">TIP: 차게 마시면 청량감이 살아나고, 온잔에서는 은은한 단맛이 잘 느껴져요.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 정렬 탭 / 작성 버튼 -->
    <div class="tabs-row">
      <PostTabs v-model="sort" :tabs="tabs" />
      <RouterLink to="/post/new" class="write-btn">📝 게시글 작성하기</RouterLink>
    </div>

    <!-- 추천 카드 -->
    <section class="panel">
      <div class="panel-head"><h3>페어링 추천</h3></div>

      <div class="cards">
        <article
          v-for="p in items"
          :key="p.id"
          class="card"
          @click="openPost(p)"
        >
          <div class="thumb">
            <img :src="thumbOf(p)" alt="thumbnail" />
            <span class="like-badge">♡ {{ (p.likes ?? 0).toLocaleString() }}</span>
          </div>

          <footer class="info">
            <div class="author">
              <img :src="p.avatar || defaultAvatar" class="avatar" alt="avatar" />
              <div class="meta">
                <strong class="name">{{ p.author || '익명' }}</strong>
                <p class="title">{{ p.title || '(제목 없음)' }}</p>
              </div>
            </div>
            <div class="stat">
              <span>👁 {{ (p.views ?? 0).toLocaleString() }}</span>
              <span>💬 {{ p.comment ?? 0 }}</span>
            </div>
          </footer>
        </article>
      </div>

      <div class="more-wrap" v-if="page.totalPages > 1">
        <button class="more-btn" @click="loadMore" :disabled="loadingMore">
          {{ loadingMore ? '불러오는 중...' : '더보기' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import PostTabs from '@/components/post/PostTabs.vue'
import sojuImg from '@/assets/images/소주-Photoroom.png'
import wineImg from '@/assets/images/alcohols/wine.png'
import beerImg from '@/assets/images/alcohols/beer.png'
import makImg from '@/assets/images/alcohols/makgeolli.png'
import { fetchPostsByAlcohol } from '@/api/post'

export default {
  name: 'PostList',
  components: { PostTabs },
  data() {
    return {
      sort: 'view',
      tabs: [
        { label: '조회순', value: 'view' },
        { label: '반응순', value: 'like' },
        { label: '댓글순', value: 'comment' },
      ],
      items: [],
      page: { totalPages: 1, number: 0, size: 12 },
      loadingMore: false,
      defaultAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      fallbackThumb: '/images/placeholder-thumb.jpg', // public 폴더에 간단한 placeholders 이미지 하나 두세요
    }
  },
  computed: {
    alcoholNo() {
      return Number(this.$route.params.id || this.$route.query.alcohol || 2)
    },
    meta() {
      const map = {
        1: { title: '맥주', icon: '🍺', image: beerImg },
        2: { title: '소주', icon: '🍶', image: sojuImg },
        3: { title: '막걸리', icon: '🌾', image: makImg },
        8: { title: '와인', icon: '🍷', image: wineImg },
      }
      return map[this.alcoholNo] ?? { title: '주종', icon: '🥂', image: beerImg }
    },
    pageTitle() {
      return `${this.meta.title}: 추천 안주`
    },
    icon() {
      return this.meta.icon
    },
    drink() {
      return {
        title: `${this.meta.title}: 한국인의 소울 드링크`,
        image: this.meta.image,
      }
    },
  },
  async mounted() {
    await this.load(0)
  },
  watch: {
    '$route.params.id': {
      immediate: false,
      async handler() {
        this.items = []
        await this.load(0)
      },
    },
    sort() {
      this.applySort()
    },
  },
  methods: {
    async load(page = 0) {
      const { list, page: p } = await fetchPostsByAlcohol({
        alcoholNo: this.alcoholNo, // 소주 고정이면 2로 고정
        page,
        size: this.page.size || 12,
      })
      if (page === 0) this.items = list
      else this.items = [...this.items, ...list]

      this.applySort()
      this.page = {
        totalPages: p.totalPages ?? 1,
        number: page,
        size: p.size ?? 12,
      }
    },
    applySort() {
      const byView = (a, b) => (b.views ?? 0) - (a.views ?? 0)
      const byLike = (a, b) => (b.likes ?? 0) - (a.likes ?? 0)
      const byComment = (a, b) => (b.comment ?? 0) - (a.comment ?? 0)

      if (this.sort === 'view') this.items.sort(byView)
      else if (this.sort === 'like') this.items.sort(byLike)
      else if (this.sort === 'comment') this.items.sort(byComment)
    },
    async loadMore() {
      if (this.loadingMore) return
      if (this.page.number >= this.page.totalPages - 1) return
      this.loadingMore = true
      try {
        await this.load(this.page.number + 1)
      } finally {
        this.loadingMore = false
      }
    },
    openPost(p) {
      this.$router.push(`/post/${p.id}`)
    },
    thumbOf(p) {
      const src = p.coverUrl || ''
      return src || this.fallbackThumb
    },
  },
}
</script>

<style scoped>
.container { width: 85%; margin: 0 auto; font-family: "Pretendard", ui-sans-serif, system-ui; color: #2b2b2b; }

/* 상단 */
.topbar { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; }
.page-title { font-size: 22px; font-weight: 800; }
.worldcup-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9999px; background:#eef6ff; border:1px solid #cfe4ff; color:#1e3a8a; font-weight:700; text-decoration:none; transition: .2s; }
.worldcup-btn:hover { filter: brightness(.95); }

/* 소개 */
.drink-info { display:flex; gap:48px; align-items:flex-start; margin:20px 0 28px; }
.drink-img { width:280px; height:auto; object-fit:contain; flex:0 0 auto; }
.drink-copy { flex:1 1 auto; }
.drink-title { font-size:22px; font-weight:900; margin-bottom:10px; }
.lead { line-height:1.85; margin-bottom:14px; color:#2d2a27; }

.info-grid { display:grid; grid-template-columns: 1fr 1fr; gap:22px; }
.info-block { background:#fff8eb; border:1px solid #efe4d1; border-radius:18px; padding:16px 18px; }
.info-block h3 { font-weight:900; margin-bottom:10px; }

.desc-list { margin:0; }
.desc-list dt { font-weight:800; margin-top:8px; }
.desc-list dd { margin:4px 0 10px 0; color:#3a372f; line-height:1.7; }
.desc-list .muted { display:block; color:#8b7f6a; font-size:12px; margin-top:4px; }

.pair-list { list-style:none; padding:0; margin:0; }
.pair-list li { margin:6px 0; line-height:1.7; }
.tip { margin-top:10px; font-size:12px; color:#8b7f6a; }

/* 탭/작성 */
.tabs-row { display:flex; align-items:center; justify-content:space-between; margin:18px 0 14px; }
.write-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9999px; background:#f7f2e8; border:1px solid #e7decc; color:#222; font-weight:700; text-decoration:none; transition:.2s; }
.write-btn:hover { filter: brightness(.96); }

/* 카드 리스트 */
.panel{ margin-top: 10px; padding: 24px; border-radius: 24px; background: #F8ECD9; box-shadow: inset 0 1px 0 #ffffff66, 0 6px 18px rgba(0,0,0,.06); }
.panel-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; }
.panel-head h3{ font-size: 20px; font-weight: 800; color:#2b2b2b; }
.cards{ display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; }
.card{ background:#fffdf8; border-radius: 22px; overflow:hidden; border:1px solid #ebe3d6; box-shadow: 0 6px 14px rgba(0,0,0,.08); cursor:pointer; transition: transform .25s ease, box-shadow .25s ease; }
.card:hover{ transform: translateY(-6px); box-shadow: 0 10px 20px rgba(0,0,0,.12); }
.thumb{ position:relative; overflow:hidden; }
.thumb img{ width:100%; height: 220px; object-fit: cover; display:block; }
.like-badge{ position:absolute; top:12px; right:12px; background:#fff; color:#1f2937; font-weight:800; border:1px solid #e6e6e6; border-radius:9999px; padding:8px 10px; font-size:14px; box-shadow: 0 4px 10px rgba(0,0,0,.12); }
.info{ display:flex; align-items:flex-end; justify-content:space-between; gap:12px; padding:16px 18px 18px; }
.author{ display:flex; align-items:center; gap:10px; }
.avatar{ width:36px; height:36px; border-radius:50%; object-fit:cover; }
.meta{ display:flex; flex-direction:column; }
.name{ font-weight:800; font-size:14px; color:#3f3428; }
.title{ margin-top:2px; font-size:15px; font-weight:800; color:#2b2b2b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.stat{ display:flex; align-items:center; gap:10px; color:#8c7f6b; font-size:13px; }

/* more */
.more-wrap{ display:flex; justify-content:center; margin-top: 18px; }
.more-btn{ background:#fff; border:1px solid #e4ded2; border-radius:9999px; padding:10px 18px; font-weight:700; color:#2b2b2b; box-shadow: 0 4px 10px rgba(0,0,0,.06); }
.more-btn:hover{ filter: brightness(.97); }

@media (max-width: 960px){
  .info-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 860px){ .thumb img{ height:190px; } }
@media (max-width: 560px){
  .cards{ grid-template-columns: 1fr; }
  .thumb img{ height:180px; }
  .drink-info{ flex-direction:column; }
  .drink-img{ width:220px; }
}
</style>
