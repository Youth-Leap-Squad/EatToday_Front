<template>
  <div class="container">
    <!-- 상단 타이틀 + 월드컵 버튼 -->
    <div class="topbar">
      <h2 class="page-title">소주: 한국인의 소울 드링크</h2>
      <RouterLink
        :to="{ path: '/event/worldcup/week', query: { alcohol: '소주' } }"
        class="worldcup-btn"
      >
        🏆 주간 월드컵 순위 조회하기
      </RouterLink>
    </div>

    <!-- 술 소개 -->
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

    <!-- 탭 + 게시글 작성하기 버튼 -->
    <div class="tabs-row">
      <PostTabs v-model="sort" :tabs="tabs" />
      <RouterLink to="/posts/new" class="write-btn">📝 게시글 작성하기</RouterLink>
    </div>

<!-- 게시글 카드 -->
<section class="panel">
  <div class="panel-head">
    <h3>사진 리뷰</h3>
  </div>
  <div class="cards">
    <article
      v-for="p in sortedPosts"
      :key="p.id"
      class="card"
      @click="openPost(p)"
    >
      <div class="thumb">
        <img :src="p.image" alt="" />
        <span class="like-badge">♡ {{ p.likes }}</span>
      </div>

      <footer class="info">
        <div class="author">
          <img :src="p.avatar" class="avatar" alt="" />
          <div class="meta">
            <strong class="name">{{ p.author }}</strong>
            <p class="text">{{ p.text }}</p>
          </div>
        </div>

        <div class="stat">
          <span>👁 {{ p.view }}</span>
          <span>💬 {{ p.comment }}</span>
        </div>
      </footer>
    </article>
  </div>

  <div class="more-wrap">
    <button class="more-btn" @click="/* 더보기 로직 */ null">더보기</button>
  </div>
</section>

  </div>
</template>

<script>
import PostTabs from "@/components/post/PostTabs.vue";
import sojuImg from "@/assets/images/소주-Photoroom.png";
import dakbalImg from "@/assets/images/dakbal.jpg";
import samImg from "@/assets/images/samgyeopsal.jpg";
import sashimiImg from "@/assets/images/sashimi.jpg";

export default {
  name: "PostList",
  components: { PostTabs },
  data() {
    return {
      sort: "view",
      tabs: [
        { label: "조회순", value: "view" },
        { label: "반응순", value: "like" },
        { label: "댓글순", value: "comment" },
      ],
      drink: {
        image: sojuImg,
        title: "소주: 한국인의 소울 드링크",
        desc1:
          "소주는 한국인의 일상과 함께하는 국민주입니다. 맑고 투명한 빛깔, 깔끔하고 상쾌한 맛, 그 한 잔 속엔 정과 추억이 담겨 있습니다.",
        type1:
          "증류식 소주 — 쌀이나 곡물을 전통 방식으로 증류해 만든 소주로 깊은 향과 부드러운 목넘김이 특징입니다.",
        type2:
          "희석식 소주 — 주정에 물과 감미료를 섞어 만든 현대 소주로, 부드럽고 깔끔한 맛이 특징입니다.",
        pairing:
          "소주는 어떤 음식에도 잘 어울립니다. 특히 매운 음식이나 기름진 요리와 함께할 때, 입안을 개운하게 해줍니다.",
      },
      posts: [
        {
          id: 1,
          author: "맹구맹구",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          image: dakbalImg,
          text: "매콤한 닭발 좋아하세요?",
          likes: 11,
          view: 500,
          comment: 6,
        },
        {
          id: 2,
          author: "찐구야놀자",
          avatar: "https://randomuser.me/api/portraits/men/35.jpg",
          image: samImg,
          text: "삼겹살과 소주의 조합 🍶",
          likes: 19,
          view: 700,
          comment: 12,
        },
        {
          id: 3,
          author: "유리",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg",
          image: sashimiImg,
          text: "소주에는 사시미가 최고죠 🍣",
          likes: 19,
          view: 620,
          comment: 9,
        },
      ],
    };
  },
  computed: {
    sortedPosts() {
      const key = this.sort;
      return [...this.posts].sort((a, b) => b[key] - a[key]);
    },
  },
  methods: {
    openPost(post) {
      localStorage.setItem("current_post", JSON.stringify(post));
      this.$router.push("/post/food");
    },
  },
};
</script>

<style scoped>
.container {
  width: 85%;
  margin: 0 auto;
  font-family: "Pretendard", sans-serif;
  color: #2b2b2b;
}

/* 상단바 */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
}
.page-title {
  font-size: 22px;
  font-weight: 800;
}

/* 월드컵 버튼 */
.worldcup-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9999px;
  background: #eef6ff;
  border: 1px solid #cfe4ff;
  color: #1e3a8a;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s;
}
.worldcup-btn:hover {
  filter: brightness(0.95);
}

/* 탭 + 작성버튼 */
.tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}
.write-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9999px;
  background: #f7f2e8;
  border: 1px solid #e7decc;
  color: #222;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s;
}
.write-btn:hover {
  filter: brightness(0.96);
}

/* 술 소개 */
.drink-info {
  display: flex;
  align-items: flex-start; /* 위쪽 기준 정렬 */
  gap: 60px;              
  margin-top: 20px;
  margin-bottom: 40px;
}
.drink-img {
  width: 300px;  
  height: auto;
  object-fit: contain; /* 이미지 비율 유지 */
}

.panel{
  margin-top: 24px;
  padding: 24px;
  border-radius: 24px;
  background: #F8ECD9;                 /* 따뜻한 베이지 톤 */
  box-shadow: inset 0 1px 0 #ffffff66, /* 살짝 양각감 */
              0 6px 18px rgba(0,0,0,.06);
}
.panel-head{
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom: 16px;
}
.panel-head h3{
  font-size: 20px; font-weight: 800; color:#2b2b2b;
}
.panel-cta{
  background:#111; color:#fff; border-radius:12px; padding:10px 14px;
  text-decoration:none; font-weight:700;
}

/* 카드 그리드 */
.cards{
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

/* 카드 */
.card{
  background:#fffdf8;
  border-radius: 22px;
  overflow:hidden;
  border:1px solid #ebe3d6;
  box-shadow: 0 6px 14px rgba(0,0,0,.08);
  cursor:pointer;
  transition: transform .25s ease, box-shadow .25s ease;
}
.card:hover{ transform: translateY(-6px); box-shadow: 0 10px 20px rgba(0,0,0,.12); }

/* 썸네일 */
.thumb{ position:relative; overflow:hidden; }
.thumb img{
  width:100%; height: 220px; object-fit: cover;
  display:block;
}
/* 좋아요 배지 */
.like-badge{
  position:absolute; top:12px; right:12px;
  background:#fff; color:#1f2937; font-weight:800;
  border:1px solid #e6e6e6; border-radius:9999px;
  padding:8px 10px; font-size:14px;
  box-shadow: 0 4px 10px rgba(0,0,0,.12);
}

/* 하단 정보 */
.info{
  display:flex; align-items:flex-end; justify-content:space-between;
  gap:12px; padding:16px 18px 18px;
}
.author{ display:flex; align-items:center; gap:10px; }
.avatar{ width:36px; height:36px; border-radius:50%; object-fit:cover; }
.meta{ display:flex; flex-direction:column; }
.name{ font-weight:800; font-size:14px; color:#3f3428; }
.text{ margin-top:2px; font-size:14px; color:#514840; }

/* 우측 숫자들 */
.stat{ display:flex; align-items:center; gap:10px; color:#8c7f6b; font-size:13px; }

/* 더보기 버튼 */
.more-wrap{ display:flex; justify-content:center; margin-top: 18px; }
.more-btn{
  background:#fff; border:1px solid #e4ded2; border-radius:9999px;
  padding:10px 18px; font-weight:700; color:#2b2b2b;
  box-shadow: 0 4px 10px rgba(0,0,0,.06);
}
.more-btn:hover{ filter: brightness(.97); }

/* 반응형 */
@media (max-width: 860px){
  .thumb img{ height:190px; }
}
@media (max-width: 560px){
  .cards{ grid-template-columns: 1fr; }
  .thumb img{ height:180px; }
}
</style>
