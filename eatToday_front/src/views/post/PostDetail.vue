<template>
  <div class="wrap" v-if="post">
<header class="head">
  <div>
    <h1 class="title">{{ post.title }}</h1>
    <div class="sub">
      <img :src="post.avatar || '/image/user-profile/basic_profile.jpg'" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;margin-right:6px;">
      <span>작성자: {{ post.author || '익명' }}</span>
      <span>·</span>
      <span>{{ (post.createdAt || post.date || '').toString().slice(0,10) || '오늘' }}</span>
      <span>· 조회 {{ Number(post.views || 0).toLocaleString() }}</span>
      <span>· 댓글 {{ comments.length }}</span>
    </div>
  </div>
</header>

    <!-- 이미지 -->
    <div class="hero-images" v-if="post.images && post.images.length > 0">
      <img class="hero" :src="img" alt="cover" v-for="(img, idx) in post.images" :key="idx" />
    </div>
    <img class="hero" :src="heroUrl" alt="cover" v-else-if="heroUrl"/>

    <article class="content" v-html="post.content || post.html || defaultHtml"></article>

    <!-- 스크랩 -->
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

    <!-- 반응 -->
    <div class="chips-center mt16">
      <ReactionChips :items="reactions" @toggle="onToggleReaction" />
    </div>

    <!-- 댓글 -->
    <CommentBox
      class="mt24"
      :comments="comments"
      placeholder="맛은 어땠나요? 댓글을 남겨보세요 :)"
      :current-user-no="meNo"
      :post-author-no="post?.authorNo"
      @go-user="goUserPage"
      @add="addComment"
      @update="updateComment"
      @delete="deleteComment"
      @report="reportComment"
    />

    <!-- 포토리뷰 미니 -->
    <PhotoReviewMiniListByBoard
      class="mt24"
      :board-no="
        post?.boardNo ||
        post?.anjuNo ||
        post?.raw?.boardNo ||
        post?.raw?.board_no ||
        post?.raw?.board?.boardNo ||
        post?.raw?.board?.board_no ||
        post?.raw?.board?.id ||
        post?.raw?.board?.boardId ||
        post?.raw?.foodBoardNo ||
        post?.raw?.foodNo ||
        post?.id ||
        $route.params.id
      "
    />
  </div>

  <div v-else class="empty">게시글 데이터를 불러오지 못했습니다. 목록에서 다시 시도해주세요.</div>
</template>

<script>
import ScrapButton from "@/components/post/ScrapButton.vue";
import ReactionChips from "@/components/post/ReactionChips.vue";
import CommentBox from "@/components/post/CommentBox.vue";
import PhotoReviewMiniListByBoard from '@/views/review/PhotoReviewMiniListByBoard.vue'
import { fetchPost, toggleReaction } from '@/api/post';
import http from '@/api/index';

const SCRAP_KEY = "scraps";
function getScraps() {
  try { return JSON.parse(localStorage.getItem(SCRAP_KEY) || "[]"); }
  catch { return []; }
}

export default {
  name: "PostDetail",
  components: { ScrapButton, ReactionChips, CommentBox, PhotoReviewMiniListByBoard },
  data() {
    return {
      scrapped: false,
      post: null,
      reacting: false,
      reactions: [
        { key: "curious", emoji: "🤔", label: "궁금해요",     count: 0, me:false },
        { key: "cheered", emoji: "👏", label: "맛있어요",     count: 0, me:false },
        { key: "soju",    emoji: "🍶", label: "술술들어가요", count: 0, me:false },
        { key: "yummy",   emoji: "🤤", label: "먹고싶어요",   count: 0, me:false },
      ],
      comments: [],
      meNo: null, // 로그인 사용자 번호를 주입하세요(토큰 파싱/프로필 호출 등).
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

    // 조회수 증가 (1회만)
    const id = Number(this.$route.params.id);
    if (!Number.isNaN(id)) {
      const key = `viewed:${id}`;
      if (!sessionStorage.getItem(key)) {
        try {
          await http.patch(`/command/foods/${id}/view`);
          if (this.post) this.post.views = Number(this.post.views || 0) + 1;
        } catch (_) {}
        sessionStorage.setItem(key, "1");
      }
    }

    this.initScrapState();
    this.$nextTick(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  },

  methods: {
    /** 게시글 + 댓글 + 반응 불러오기 */
    async loadPostFromApi() {
      try {
        const id = Number(this.$route.params.id);
        if (Number.isNaN(id)) return this.$router.replace("/post");

        // 게시글
        this.post = await fetchPost(id);

        if (this.post) {
          this.post.author =
            this.post.author ??
            this.post.memberId ??
            this.post.member?.memberId ??
            '익명';
          // 상세 페이지에서 작성자 이동을 위해 authorNo 보정
          this.post.authorNo = this.post.authorNo ?? this.post.memberNo ?? this.post.member?.memberNo ?? null;
        }

        // 댓글 (조회는 쿼리 API로 가정: GET /foods/{id}/comments)
        await this.reloadComments(id);

        // 반응 (조회는 쿼리 API로 가정: GET /foods/{id}/reactions)
        try {
          const { data } = await http.get(`/foods/${id}/reactions`);
          if (Array.isArray(data) && data[0]) {
            const r = data[0];
            const counts = [
              r.likesNo1 ?? r.likes_no_1 ?? 0,
              r.likesNo2 ?? r.likes_no_2 ?? 0,
              r.likesNo3 ?? r.likes_no_3 ?? 0,
              r.likesNo4 ?? r.likes_no_4 ?? 0,
            ].map(n => Number(n || 0));
            const storedKey = localStorage.getItem('reaction:post:'+id) || ''
            this.reactions = this.reactions.map((x, i) => ({ ...x, count: counts[i], me: x.key === storedKey }));
          }
        } catch (e) {
          console.warn("반응 로드 실패:", e.message);
          const storedKey = localStorage.getItem('reaction:post:'+id) || ''
          if (storedKey) this.reactions = this.reactions.map(x => ({ ...x, me: x.key === storedKey }))
        }

      } catch (e) {
        console.error("게시글 로드 실패:", e);
        this.post = null;
      }
    },

    async reloadComments(boardId) {
      try {
        const { data } = await http.get(`/foods/${boardId}/comments`);
        this.comments = (data || []).map(c => ({
          id: c.foodCommentNo ?? c.id,
          author: c.memberNickname ?? c.memberId ?? c.memberNo ?? "익명",
          writerId: c.memberNo ?? c.member?.memberNo ?? c.memberId ?? null,
          date: (c.createdAt ?? c.fcDate ?? "").toString().slice(0,10),
          text: c.content ?? c.fcContent,
          isAuthor: (c.memberNo ?? c.member?.memberNo) === (this.post?.authorNo ?? -1),
        }));
      } catch (e) {
        console.warn("댓글 로드 실패:", e.message);
        this.comments = [];
      }
    },

    /** 댓글 추가 -> POST /command/foods/{id}/comments */
    async addComment(text) {
      const content = (text || "").trim();
      if (!content) return alert("댓글 내용을 입력해주세요.");
      const id = Number(this.$route.params.id);

      try {
        await http.post(`/command/foods/${id}/comments`, { content });
        await this.reloadComments(id);
      } catch (e) {
        const code = e?.response?.status;
        if (code === 401 || code === 403) {
          alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
          this.$router.push({ path: "/login", query: { redirect: this.$route.fullPath } });
        } else {
          alert("댓글 등록에 실패했어요. 네트워크 상태를 확인해주세요.");
        }
      }
    },

    /** 댓글 수정 -> PATCH /command/comments/{commentId} */
    async updateComment({ id: commentId, text }) {
      const boardId = Number(this.$route.params.id);
      try {
        await http.patch(`/command/comments/${commentId}`, { content: text });
        await this.reloadComments(boardId);
      } catch (e) {
        const code = e?.response?.status;
        if (code === 401 || code === 403) {
          alert("본인 댓글만 수정할 수 있어요. 로그인 후 다시 시도해주세요.");
        } else {
          alert("댓글 수정에 실패했습니다.");
        }
      }
    },

    /** 댓글 삭제 -> DELETE /command/comments/{commentId} */
    async deleteComment(commentId) {
      if (!confirm("댓글을 삭제할까요?")) return;
      const boardId = Number(this.$route.params.id);
      try {
        await http.delete(`/command/comments/${commentId}`);
        await this.reloadComments(boardId);
      } catch (e) {
        const code = e?.response?.status;
        if (code === 401 || code === 403) {
          alert("본인 댓글만 삭제할 수 있어요. 로그인 후 다시 시도해주세요.");
        } else {
          alert("댓글 삭제에 실패했습니다.");
        }
      }
    },

    /** 스크랩 상태 동기화 */
    initScrapState() {
      if (!this.post) return;
      const key = this.scrapKey;
      const list = getScraps();
      this.scrapped = list.some(s => s.postId === key);
    },

    likesTypeFromKey(key) {
      return { curious: 1, cheered: 2, soju: 3, yummy: 4 }[key] ?? 1;
    },

    /** 반응 클릭 */
    async onToggleReaction(key) {
      if (this.reacting) return;
      this.reacting = true;

      try {
        const id = Number(this.$route.params.id);
        const likesType = this.likesTypeFromKey(key);
        const resp = await toggleReaction(id, likesType);

        const counts = [
          resp?.likesNo1 ?? resp?.likes_no_1 ?? 0,
          resp?.likesNo2 ?? resp?.likes_no_2 ?? 0,
          resp?.likesNo3 ?? resp?.likes_no_3 ?? 0,
          resp?.likesNo4 ?? resp?.likes_no_4 ?? 0,
        ].map(Number);

        this.reactions = this.reactions.map((r, i) => ({
          ...r,
          count: counts[i],
          me: r.key === key,
        }));
        try { localStorage.setItem('reaction:post:'+id, key) } catch {}
      } catch (e) {
        const msg = e?.response?.data?.message || "반응 반영에 실패했어요. 다시 시도해주세요.";
        alert(msg);
      } finally {
        this.reacting = false;
      }
    },

    /** 작성자/사용자 페이지 이동 (필요 시 구현) */
    goUserPage(memberNo) {
      if (!memberNo) return;
      // 예: this.$router.push(`/profile/${memberNo}`);
    },
  },
};
</script>

<style scoped>
.wrap { width: 900px; margin: 0 auto; padding: 24px 0; color: #2b2b2b; }
.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.head .title { font-size: 28px; margin: 4px 0 6px; }
.sub { color: #6f6257; font-size: 14px; display: flex; gap: 6px; flex-wrap: wrap; }
.hero { width: 100%; max-height: 460px; object-fit: cover; border-radius: 16px; margin: 18px 0; }
.hero-images { display: flex; flex-direction: column; gap: 12px; margin: 18px 0; }
.hero-images .hero { width: 100%; }
.content { line-height: 1.8; }
.content img { display: block; margin: 18px auto; border-radius: 14px; max-width: 100%; }
.action-bar { margin: 18px 0; width: 100%; text-align: center; }
.chips-center { display: flex; justify-content: center; }
.mt16 { margin-top: 16px; }
.mt24 { margin-top: 24px; }
.empty { text-align: center; padding: 48px 0; color: #7a6f63; }
</style>
