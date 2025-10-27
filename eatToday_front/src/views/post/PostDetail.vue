<!-- src/views/PostDetail.vue -->
<template>
  <div class="wrap" v-if="post">
    <header class="head">
      <div>
        <h1 class="title">{{ post.title }}</h1>
        <div class="sub">
          <span>작성자: {{ post.author || '익명' }}</span>
          <span>·</span>
          <span>{{ (post.createdAt || post.date || '').toString().slice(0,10) || '오늘' }}</span>
          <span>· 조회 {{ Number(post.views || 0).toLocaleString() }}</span>
          <span>· 댓글 {{ comments.length }}</span>
        </div>
      </div>
    </header>

    <img class="hero" :src="heroUrl" alt="cover" v-if="heroUrl"/>

    <article class="content" v-html="post.content || post.html || defaultHtml"></article>

    <section class="action-bar">
      <ScrapButton
        v-model="scrapped"
        :postId="scrapKey"
        :title="post.title"
        :image="heroUrl"
        :author="post.author || '익명'"
        :date="(post.createdAt || post.date || '').toString().slice(0,10) || '오늘'"
        defaultFolder="기본"
      />
    </section>

    <div class="chips-center mt16">
      <ReactionChips :items="reactions" @toggle="onToggleReaction" />
    </div>

    <CommentBox
      class="mt24"
      :comments="comments"
      placeholder="맛은 어땠나요? 댓글을 남겨보세요 :)"
      @add="addComment"
    />
  </div>

  <div v-else class="empty">게시글 데이터를 불러오지 못했습니다. 목록에서 다시 시도해주세요.</div>
</template>

<script>
import ScrapButton from "@/components/post/ScrapButton.vue";
import ReactionChips from "@/components/post/ReactionChips.vue";
import CommentBox from "@/components/post/CommentBox.vue";
import PhotoReviewCard from "@/components/post/PhotoReviewCard.vue";
import { fetchPost } from '@/api/post';
import http from '@/api/index'; // ✅ axios 인스턴스 (baseURL: '/api')

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
        { key: "curious", emoji: "🤔", label: "궁금해요", count: 0,  me:false },
        { key: "cheered", emoji: "👏", label: "맛있어요", count: 0,  me:false },
        { key: "soju",    emoji: "🍶", label: "술술들어가요", count: 0, me:false  },
        { key: "yummy",   emoji: "🤤", label: "먹고싶어요", count: 0,  me:false }
      ],
      comments: [],
    };
  },
  computed: {
    scrapKey() {
      const id = this.post?.id || "unknown";
      return `/post/${id}`;
    },
    defaultHtml() {
      return `<p>간단한 설명입니다. 실제 본문은 에디터/작성 페이지에서 저장된 HTML을 사용합니다.</p>`;
    },
    heroUrl() {
      return this.post?.coverUrl || this.post?.mainImageUrl || this.post?.cover || this.post?.image || '';
    }
  },
  async mounted() {
    await this.loadPostFromApi();
    this.initScrapState();
    this.$nextTick(() => {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }
      catch (_) { window.scrollTo(0, 0); }
    });
  },
  methods:{
    async loadPostFromApi(){
      try {
        const rawId = this.$route.params.id;
        if (!rawId) { this.$router.replace('/post'); return; }
        const id = Number(rawId);
        if (Number.isNaN(id)) { this.$router.replace('/post'); return; }

        // ✅ 게시글 상세
        const data = await fetchPost(id);
        this.post = data;

        // ✅ 댓글 목록
        const { data: comments } = await http.get(`/foods/${id}/comments`);
        this.comments = (comments || []).map(c => ({
          id: c.foodCommentNo,
          author: c.memberId || '익명',
          date: (c.fcDate || '').toString().slice(0,10),
          text: c.fcContent
        }));

        // ✅ 반응 집계 (likesNo1~4)
        const { data: reacts } = await http.get(`/foods/${id}/reactions`);
        if (Array.isArray(reacts) && reacts[0]) {
          const r = reacts[0];
          const counts = [r.likesNo1, r.likesNo2, r.likesNo3, r.likesNo4].map(n=>Number(n||0));
          this.reactions = this.reactions.map((x, i) => ({ ...x, count: counts[i]}));
        }
      } catch (e) {
        console.error(e);
        this.post = null;
      }
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
.action-bar { margin: 18px 0; width: 100%; text-align: center; }
.chips-center{ display:flex; justify-content:center; }
.mt16{margin-top:16px}
.mt24{margin-top:24px}
.empty{text-align:center;padding:48px 0;color:#7a6f63}
</style>
