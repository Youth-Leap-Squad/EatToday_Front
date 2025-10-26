<template>
  <div class="wrap">
    <!-- 헤더 영역(제목/작성자/메타) -->
    <header class="head">
      <h1 class="title">{{ post.title }}</h1>
      <div class="sub">
        <span>작성자: {{ post.author }}</span>
        <span>·</span>
        <span>{{ post.date }}</span>
        <span>· 조회 {{ Number(post.views || 0).toLocaleString() }}</span>
        <span>· 댓글 {{ comments.length }}</span>
      </div>
    </header>

    <!-- 대표 이미지 -->
    <img class="hero" :src="post.cover" alt="cover" v-if="post.cover"/>

    <!-- 본문 (이미 HTML로 저장/랜더) -->
    <article class="content" v-html="post.html"></article>

    <!-- 스크랩 & 반응 -->
    <section class="action-bar">
      <ScrapButton
        v-model:isScrapped="scrapped"
        :postId="post.id"
        :title="post.title"
        :image="post.cover"
        :author="post.author"
        :date="post.date"
        defaultFolder="기본"
      />
    </section>

    <ReactionChips :items="reactions" @toggle="onToggleReaction" class="mt16" />

    <!-- 댓글 -->
    <CommentBox
      class="mt24"
      :comments="comments"
      placeholder="맛은 어땠나요? 댓글을 남겨보세요 :)"
      @add="addComment"
    />

    <!-- 사진 리뷰 -->
    <section class="photo-review">
      <div class="pr-head">
        <h2>사진 리뷰</h2>
        <button class="add" @click="addPhotoReview">리뷰 등록하기</button>
      </div>

      <div class="pr-grid">
        <PhotoReviewCard
          v-for="r in photoReviews"
          :key="r.id"
          :image="r.image"
          :avatar="r.avatar"
          :nickname="r.nickname"
          :text="r.text"
          :likes="r.likes"
          @like="r.likes++"
        />
      </div>

      <div class="more">
        <button class="more-btn" @click="loadMore">더보기</button>
      </div>
    </section>
  </div>
</template>

<script>
import ScrapButton from "@/components/post/ScrapButton.vue";
import ReactionChips from "@/components/post/ReactionChips.vue";
import CommentBox from "@/components/post/CommentBox.vue";
import PhotoReviewCard from "@/components/post/PhotoReviewCard.vue";

const SCRAP_KEY = "scraps";
const LOCAL_POSTS_KEY = "local_posts";

function getScraps() {
  try { return JSON.parse(localStorage.getItem(SCRAP_KEY) || "[]"); }
  catch { return []; }
}

export default {
  name: "PostDetail",
  components: { ScrapButton, ReactionChips, CommentBox, PhotoReviewCard },
  data() {
    return {
      scrapped: false,
      post: {
        id: "",
        title: "",
        author: "",
        date: "",
        views: 0,
        cover: "",
        html: ""
      },
      reactions: [
        { key: "curious", emoji: "🤔", label: "궁금해요", count: 4,  me:false },
        { key: "cheered", emoji: "👏", label: "맛있어요", count: 1,  me:false },
        { key: "soju",    emoji: "🍶", label: "술술들어가요", count: 52, me:true  },
        { key: "yummy",   emoji: "🤔", label: "맛없어요", count: 6,  me:false }
      ],
      comments: [
        { id: 1, author: "짱구야놀자", date: "2025-10-15", text: "굽기 팁 감사합니다!" },
        { id: 2, author: "맹구양구", date: "2025-10-15", text: "지글지글 삼겹살엔 소주가 찰떡✨" },
      ],
      photoReviews: [
        { id: 1, image:"https://images.unsplash.com/photo-1544025161-32fdc2e1d2d0?q=80&w=900", avatar:"https://randomuser.me/api/portraits/men/12.jpg", nickname:"짱구야 놀자", text:"삼겹살 한 판~^^", likes:50 },
        { id: 2, image:"https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=900", avatar:"https://randomuser.me/api/portraits/men/25.jpg", nickname:"맹구양구", text:"바삭한 껍데기", likes:58 },
        { id: 3, image:"https://images.unsplash.com/photo-1543352634-8730e3b3b9f4?q=80&w=900", avatar:"https://randomuser.me/api/portraits/women/45.jpg", nickname:"user3", text:"오늘의 야외 삼겹살!", likes:34 },
        { id: 4, image:"https://images.unsplash.com/photo-1599599810769-6f5b0bd44adf?q=80&w=900", avatar:"https://randomuser.me/api/portraits/men/77.jpg", nickname:"user4", text:"겉바속촉 고기맛", likes:3 },
        { id: 5, image:"https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900", avatar:"https://randomuser.me/api/portraits/men/31.jpg", nickname:"user5", text:"고소+짭짤 삼겹살~", likes:12 },
        { id: 6, image:"https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=900", avatar:"https://randomuser.me/api/portraits/women/36.jpg", nickname:"user6", text:"굽는 정도가 딱!", likes:2 },
      ]
    };
  },
  mounted() {
    this.loadPost();
    this.initScrapState();
  },
  methods:{
    // 상세 데이터 로드 (로컬 작성글도 지원)
    loadPost(){
      const id = String(this.$route.params.id || "");
      this.post.id = id;

      // 1) 로컬 작성글(local_posts)인지 확인
      try {
        const locals = JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || "[]");
        const found = locals.find(p => String(p.id) === id);
        if (found) {
          this.post = {
            id: found.id,
            title: found.title,
            author: found.author || "나",
            date: found.date,
            views: found.views || 0,
            cover: found.cover,
            html: found.content // 이미 HTML
          };
          return;
        }
      } catch {}

      // 2) 없으면 예시 더미 데이터 사용
      this.post = {
        id: id || "2",
        title: "삼겹살과 소주의 조합",
        author: "짱구야놀자",
        date: "2025-10-15",
        views: 643,
        cover: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200",
        html: `
          <p>소줏잔 한잔 얹기 위한 삼겹살을 맛있게 굽는 법 알려드려요^^</p>
          <h3>🥓 1. 고기 준비</h3>
          <p>두께는 1.5~2cm 정도가 적당! 실온에 10분 두면 육즙이 살아나요.</p>
          <img src="https://images.unsplash.com/photo-1615937691190-61f22f8312ea?q=80&w=1200" />
          <h3>🧄 2. 굽는 순서</h3>
          <p>중불에 기름 빼고, 마늘과 함께 구우면 풍미 업!</p>
          <img src="https://images.unsplash.com/photo-1563245372-f21724e3856b?q=80&w=1200" />
          <h3>🌿 3. 황금 비율 쌈</h3>
          <p>상추 + 깻잎 + 김치 + 고기 + 쌈장 + 마늘… 그리고 소주 한 잔 🍶</p>
          <img src="https://images.unsplash.com/photo-1544025162-5d0b2e3f9b9b?q=80&w=1200" />
        `
      };
    },

    // 현재 글이 스크랩되어 있는지 초기화
    initScrapState(){
      const list = getScraps();
      const route = `/post/${this.post.id}`;
      this.scrapped = list.some(s => s.postId === route);
    },

    onToggleReaction(key){
      const current = this.reactions.find(r => r.me)?.key || null;
      this.reactions = this.reactions.map(r => {
        if (r.key === key) {
          if (r.me) return { ...r, me:false, count: Math.max(0, r.count-1) };
          return { ...r, me:true, count: r.count+1 };
        }
        if (r.me && current && current !== key) {
          return { ...r, me:false, count: Math.max(0, r.count-1) };
        }
        return { ...r, me:false };
      });
    },

    addComment(text){
      const id = Date.now();
      const date = new Date().toISOString().slice(0,10);
      this.comments.unshift({ id, author:"나", date, text });
    },

    addPhotoReview(){
      const id = Date.now();
      this.photoReviews.unshift({
        id,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=900",
        avatar: "https://randomuser.me/api/portraits/men/40.jpg",
        nickname: "me",
        text: "방금 찍은 사진!",
        likes: 0
      });
    },

    loadMore(){
      const base = this.photoReviews.length + 1;
      this.photoReviews.push({
        id: base,
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=900",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        nickname: "userX",
        text: "더보기로 추가된 사진",
        likes: 0
      });
    }
  }
};
</script>

<style scoped>
.wrap{width:900px;margin:0 auto;padding:24px 0;color:#2b2b2b}
.head .title{font-size:28px;margin:4px 0 6px}
.sub{color:#6f6257;font-size:14px;display:flex;gap:6px}
.hero{width:100%;max-height:460px;object-fit:cover;border-radius:16px;margin:18px 0}
.content{line-height:1.8}
.content img{display:block;margin:18px auto;border-radius:14px;max-width:100%}
.action-bar{margin:18px 0}
.mt16{margin-top:16px}
.mt24{margin-top:24px}

.photo-review{margin-top:28px;padding:18px;border-radius:14px;background:#efe7d9}
.pr-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.pr-head h2{font-size:20px}
.pr-head .add{border:none;background:#111;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer}
.pr-grid{
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap:18px;
}
.more{display:flex;justify-content:center;margin-top:16px}
.more-btn{border:1px solid #ccc;background:#fff;padding:8px 16px;border-radius:20px;cursor:pointer}
@media (max-width: 980px){ .pr-grid{grid-template-columns: repeat(2, minmax(0,1fr));} }
</style>
