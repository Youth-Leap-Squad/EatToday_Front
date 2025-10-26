<template>
  <div class="wrap" v-if="post">
    <!-- 헤더 -->
    <header class="head">
      <div>
        <h1 class="title">{{ post.title }}</h1>
        <div class="sub">
          <span>작성자: {{ post.author }}</span>
          <span>·</span>
          <span>{{ post.date || '오늘' }}</span>
          <span>· 조회 {{ Number(post.views || 0).toLocaleString() }}</span>
          <span>· 댓글 {{ comments.length }}</span>
        </div>
      </div>
    </header>

    <!-- 대표 이미지 -->
    <img class="hero" :src="post.cover || post.image" alt="cover" v-if="post.cover || post.image"/>

    <!-- 본문 -->
    <article class="content" v-html="post.html || defaultHtml"></article>

    <!-- 스크랩 & 반응 -->
    <section class="action-bar">
      <ScrapButton
        v-model="scrapped"
        :postId="scrapKey"
        :title="post.title"
        :image="post.cover || post.image"
        :author="post.author"
        :date="post.date || '오늘'"
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

  <div v-else class="empty">게시글 데이터를 불러오지 못했습니다. 목록에서 다시 시도해주세요.</div>
</template>

<script>
import ScrapButton from "@/components/post/ScrapButton.vue";
import ReactionChips from "@/components/post/ReactionChips.vue";
import CommentBox from "@/components/post/CommentBox.vue";
import PhotoReviewCard from "@/components/post/PhotoReviewCard.vue";

const SCRAP_KEY = "scraps";
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
      post: null,
      reactions: [
        { key: "curious", emoji: "🤔", label: "궁금해요", count: 4,  me:false },
        { key: "cheered", emoji: "👏", label: "맛있어요", count: 1,  me:false },
        { key: "soju",    emoji: "🍶", label: "술술들어가요", count: 52, me:true  },
        { key: "yummy",   emoji: "🤤", label: "먹고싶어요", count: 6,  me:false }
      ],
      comments: [
        { id: 1, author: "짱구야놀자", date: "2025-10-15", text: "굽기 팁 감사합니다!" },
        { id: 2, author: "맹구양구", date: "2025-10-15", text: "지글지글 삼겹살엔 소주가 찰떡✨" },
      ],
      photoReviews: [
        { id: 1, image:"https://images.unsplash.com/photo-1544025161-32fdc2e1d2d0?q=80&w=900", avatar:"https://randomuser.me/api/portraits/men/12.jpg", nickname:"짱구야 놀자", text:"삼겹살 한 판~^^", likes:50 },
        { id: 2, image:"https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=900", avatar:"https://randomuser.me/api/portraits/men/25.jpg", nickname:"맹구양구", text:"바삭한 껍데기", likes:58 },
        { id: 3, image:"https://images.unsplash.com/photo-1543352634-8730e3b3b9f4?q=80&w=900", avatar:"https://randomuser.me/api/portraits/women/45.jpg", nickname:"user3", text:"오늘의 야외 삼겹살!", likes:34 },
      ]
    };
  },
  computed: {
    scrapKey() {
      const id = this.post?.id || "unknown";
      return `/post/food#${id}`;
    },
    defaultHtml() {
      return `<p>간단한 설명입니다. 실제 본문은 에디터/작성 페이지에서 저장된 HTML을 사용합니다.</p>`;
    }
  },
  mounted() {
    this.loadPostFromStorage();
    this.initScrapState();
  },
  methods:{
    loadPostFromStorage(){
      try {
        const raw = localStorage.getItem("current_post");
        if (raw) {
          const p = JSON.parse(raw);
          this.post = {
            id: p.id,
            title: p.title || p.text || "(제목 없음)",
            author: p.author || "익명",
            date: p.date || "",
            views: p.view || p.views || 0,
            cover: p.cover || p.image || "",
            html: p.content || ""
          };
        }
      } catch { this.post = null; }
    },
    initScrapState(){
      if (!this.post) return;
      const key = this.scrapKey;
      const list = getScraps();
      this.scrapped = list.some(s => s.postId === key);
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
.head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.head .title{font-size:28px;margin:4px 0 6px}
.sub{color:#6f6257;font-size:14px;display:flex;gap:6px;flex-wrap:wrap}
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
.pr-grid{display:grid;grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));gap:18px}
.more{display:flex;justify-content:center;margin-top:16px}
.more-btn{border:1px solid #ccc;background:#fff;padding:8px 16px;border-radius:20px;cursor:pointer}
.empty{text-align:center;padding:48px 0;color:#7a6f63}
@media (max-width: 980px){ .pr-grid{grid-template-columns: repeat(2, minmax(0,1fr));} }
</style>
