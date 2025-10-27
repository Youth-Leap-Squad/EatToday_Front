<template>
  <div class="container">
    <div class="topbar">
      <h2 class="page-title">소주: 한국인의 소울 드링크</h2>
      <RouterLink to="/event" class="worldcup-btn">🏆 주간 월드컵 순위 조회하기</RouterLink>
    </div>

    <section class="drink-info">
      <img :src="drink.image" alt="soju" class="drink-img" />
      <div>
        <h2>🍶 {{ drink.title }}</h2>
        <p>{{ drink.desc1 }}</p>
        <h4>📍 소주의 종류</h4>
        <p>{{ drink.type1 }}</p>
        <p>{{ drink.type2 }}</p>
        <h4>🍽 소주와 안주, 완벽한 페어링</h4>
        <p>{{ drink.pairing }}</p>
      </div>
    </section>

    <div class="tabs-row">
      <PostTabs v-model="sort" :tabs="tabs" />
      <RouterLink to="/post/new" class="write-btn">📝 게시글 작성하기</RouterLink>
    </div>

    <section class="panel">
      <div class="panel-head"><h3>페어링 추천</h3></div>

      <div class="cards">
        <article v-for="p in items" :key="p.id" class="card" @click="openPost(p)">
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
import { fetchPosts } from '@/api/post'

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
      drink: {
        image: sojuImg,
        title: '소주: 한국인의 소울 드링크',
        desc1:
          '소주는 한국인의 일상과 함께하는 국민주입니다. 맑고 투명한 빛깔, 깔끔하고 상쾌한 맛, 그 한 잔 속엔 정과 추억이 담겨 있습니다.',
        type1: '증류식 소주 — 쌀이나 곡물을 전통 방식으로 증류해 만든 소주로 깊은 향과 부드러운 목넘김이 특징입니다.',
        type2: '희석식 소주 — 주정에 물과 감미료를 섞어 만든 현대 소주로, 부드럽고 깔끔한 맛이 특징입니다.',
        pairing: '소주는 어떤 음식에도 잘 어울립니다. 특히 매운 음식이나 기름진 요리와 함께할 때, 입안을 개운하게 해줍니다.',
      },
      items: [],
      page: { totalPages: 1, number: 0, size: 12 },
      loadingMore: false,
      defaultAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    }
  },
  async mounted() {
    await this.load(0)
  },
  watch: {
    sort: {
      immediate: false,
      async handler() {
        this.items = []
        await this.load(0)
      },
    },
  },
  methods: {
    async load(page = 0) {
      const { list, page: p } = await fetchPosts({ page, size: 12, sort: this.sort })
      // fetchPosts가 이미 정규화 완료 → 그대로 사용
      if (page === 0) this.items = list
      else this.items = [...this.items, ...list]
      this.page = p
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
      // coverUrl은 API에서 resolveAssetUrl로 이미 정규화됨
      return p.coverUrl || ''
    },
  },
}
</script>

<style scoped>
/* 기존 디자인 그대로 */
.container { width: 85%; margin: 0 auto; font-family: "Pretendard", sans-serif; color: #2b2b2b; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; }
.page-title { font-size: 22px; font-weight: 800; }
.worldcup-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9999px; background: #eef6ff; border: 1px solid #cfe4ff; color: #1e3a8a; font-weight: 700; text-decoration: none; transition: 0.2s; }
.worldcup-btn:hover { filter: brightness(0.95); }
.tabs-row { display: flex; align-items: center; justify-content: space-between; margin: 20px 0; }
.write-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9999px; background: #f7f2e8; border: 1px solid #e7decc; color: #222; font-weight: 700; text-decoration: none; transition: 0.2s; }
.write-btn:hover { filter: brightness(0.96); }
.drink-info { display: flex; align-items: flex-start; gap: 60px; margin-top: 20px; margin-bottom: 40px; }
.drink-img { width: 300px; height: auto; object-fit: contain; }
.panel{ margin-top: 24px; padding: 24px; border-radius: 24px; background: #F8ECD9; box-shadow: inset 0 1px 0 #ffffff66, 0 6px 18px rgba(0,0,0,.06); }
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
.title{
  margin-top:2px; font-size:15px; font-weight:800; color:#2b2b2b;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.stat{ display:flex; align-items:center; gap:10px; color:#8c7f6b; font-size:13px; }
.more-wrap{ display:flex; justify-content:center; margin-top: 18px; }
.more-btn{ background:#fff; border:1px solid #e4ded2; border-radius:9999px; padding:10px 18px; font-weight:700; color:#2b2b2b; box-shadow: 0 4px 10px rgba(0,0,0,.06); }
.more-btn:hover{ filter: brightness(.97); }
@media (max-width: 860px){ .thumb img{ height:190px; } }
@media (max-width: 560px){ .cards{ grid-template-columns: 1fr; } .thumb img{ height:180px; } }
</style>
