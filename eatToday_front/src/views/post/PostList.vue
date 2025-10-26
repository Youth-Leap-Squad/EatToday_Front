<template>
  <div class="container">
    <!-- 상단 타이틀+작성 버튼 -->
    <div class="topbar">
      <h2 class="page-title">소주: 한국인의 소울 드링크</h2>
      <!-- ✅ 작성 페이지로 이동 -->
      <RouterLink to="/posts/new" class="write-btn">📝 게시글 작성하기</RouterLink>
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

    <!-- 탭 -->
    <PostTabs v-model="sort" :tabs="tabs" />

    <!-- 안주 카드 -->
    <section class="card-section">
      <div class="card-grid">
        <!-- ✅ 카드 클릭 → /post/food, 데이터는 localStorage로 전달 -->
        <div
          v-for="p in sortedPosts"
          :key="p.id"
          class="click-card"
          @click="openPost(p)"
        >
          <PostCard
            :image="p.image"
            :author="p.author"
            :avatar="p.avatar"
            :text="p.text"
            :likes="p.likes"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import PostTabs from "@/components/post/PostTabs.vue";
import PostCard from "@/components/post/PostCard.vue";

// 이미지 임포트
import sojuImg from "@/assets/images/소주-Photoroom.png";
import dakbalImg from "@/assets/images/dakbal.jpg";
import samImg from "@/assets/images/samgyeopsal.jpg";
import sashimiImg from "@/assets/images/sashimi.jpg";

export default {
  name: "PostList",
  components: { PostTabs, PostCard },
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
          author: "user01",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          image: dakbalImg,
          text: "매콤한 닭발 좋아하세요?",
          likes: 11,
          view: 500,
          comment: 6,
        },
        {
          id: 2,
          author: "user02",
          avatar: "https://randomuser.me/api/portraits/men/35.jpg",
          image: samImg,
          text: "소주에는 삼겹살이 최고!",
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
      // ✅ 상세에서 사용할 현재 게시글 저장
      localStorage.setItem("current_post", JSON.stringify(post));
      // ✅ 고정 라우트로 이동
      this.$router.push("/post/food");
    },
  },
};
</script>

<style scoped>
.container { width: 85%; margin: 0 auto; font-family: "Pretendard", sans-serif; color: #2b2b2b; }

/* 상단바: 타이틀 + 작성 버튼 */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
}
.page-title { font-size: 22px; font-weight: 800; }

/* 작성 버튼 스타일 */
.write-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 9999px;
  background: #f7f2e8;
  border: 1px solid #e7decc;
  color: #222;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.write-btn:hover { filter: brightness(0.96); }

.drink-info { display: flex; gap: 40px; margin-top: 20px; margin-bottom: 40px; }
.drink-img { width: 150px; height: auto; }
.card-section { margin-top: 20px; }
.card-grid { display: flex; flex-wrap: wrap; gap: 25px; }
.click-card { cursor: pointer; }
</style>
