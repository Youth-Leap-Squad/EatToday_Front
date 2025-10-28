<template>
  <div class="wrap">
    <h1 class="page-title">게시글 작성</h1>

    <!-- ① 대표 이미지 -->
    <ImageUploader @file="form.mainImage = $event" />

    <!-- ② 카테고리 -->
    <div class="row">
      <label class="lb">카테고리</label>
      <ToggleSelect
        v-model="form.category"
        :options="drinkOptions"
        placeholder="술을 선택하세요"
        width="360px"
      />
      <small class="req">* 필수</small>
    </div>

    <!-- ③ 제목 / 소제목 -->
    <div class="row">
      <label class="lb">제목</label>
      <div class="field">
        <input
          v-model="form.title"
          :maxlength="limits.title"
          class="input"
          placeholder="제목을 입력하세요"
          @input="touch()"
        />
        <span class="count">{{ form.title.length }}/{{ limits.title }}</span>
      </div>
    </div>

    <div class="row">
      <label class="lb">소제목</label>
      <div class="field">
        <input
          v-model="form.subtitle"
          :maxlength="limits.subtitle"
          class="input"
          placeholder="소제목을 입력하세요"
          @input="touch()"
        />
        <span class="count">{{ form.subtitle.length }}/{{ limits.subtitle }}</span>
      </div>
    </div>

    <!-- ④ 본문 -->
    <div class="row">
      <label class="lb">본문</label>
      <div class="field">
        <div class="toolbar">
          <button type="button" class="md-btn" @click="insertText('**굵게**')">B</button>
          <button type="button" class="md-btn" @click="insertText('_기울임_')">I</button>
        </div>

        <textarea
          ref="contentRef"
          v-model="form.content"
          :maxlength="limits.content"
          class="textarea"
          placeholder="내용을 입력하세요"
          @input="touch()"
        ></textarea>
        <span class="count">{{ form.content.length }}/{{ limits.content }}</span>

        <ContentImageUploader
          class="mt10"
          @files="contentImages = $event"
          @insert="insertImageAtCursor"
        />
      </div>
    </div>

    <!-- 버튼 -->
    <div class="btns">
      <button class="ghost" @click="saveTemp">임시 저장</button>
      <button class="ghost" @click="openPreview = true">미리보기</button>
      <button class="primary" :disabled="submitting" @click="submit">
        {{ submitting ? '등록 중...' : '작성 완료' }}
      </button>
    </div>

    <!-- 프리뷰 모달 -->
    <PreviewModal
      :open="openPreview"
      :mainImageUrl="mainPreviewUrl"
      :title="form.title"
      :subtitle="form.subtitle"
      :categoryLabel="categoryLabel"
      :contentHtml="renderedContent"
      :contentImageUrls="contentPreviewUrls"
      @close="openPreview = false"
      @submit="submit"
    />

    <!-- 등록 완료 모달 -->
    <div v-if="openSuccess" class="modal-backdrop" @click.self="closeSuccess">
      <div class="modal">
        <h2 class="modal-title">게시글이 등록되었어요 🎉</h2>
        <p class="modal-desc">
          관리자 승인 후 <strong>{{ categoryLabel || '해당' }}</strong> 게시판의
          <strong>페어링 추천 목록</strong>에 노출됩니다.
        </p>
        <p class="modal-warn">
          * 승인 완료 시 <b>게시글 수정 및 삭제가 불가</b>합니다.
        </p>
        <div class="modal-btns">
          <button class="ghost" @click="goPostList">
            {{ categoryLabel ? `${categoryLabel} 게시판으로` : '술 게시판으로' }}
          </button>
          <button class="primary" @click="goMyPost">내 게시글 보러가기</button>
        </div>
        <button class="x" aria-label="닫기" @click="closeSuccess">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleSelect from "@/components/post/ToggleSelect.vue";
import ImageUploader from "@/components/post/ImageUploader.vue";
import ContentImageUploader from "@/components/post/ContentImageUploader.vue";
import PreviewModal from "@/components/post/PreviewModal.vue";
import { createPost } from "@/api/post";

export default {
  name: "PostCreate",
  components: { ToggleSelect, ImageUploader, ContentImageUploader, PreviewModal },
  data() {
    return {
      limits: { title: 50, subtitle: 100, content: 2000 },
      drinkOptions: [
        { label: "맥주", value: "beer" },
        { label: "소주", value: "soju" },
        { label: "막걸리", value: "makgeolli" },
        { label: "샴페인", value: "champagne" },
        { label: "사케", value: "sake" },
        { label: "고량주", value: "golyangju" },
        { label: "하이볼", value: "highball" },
        { label: "와인", value: "wine" },
        { label: "기타", value: "etc" },
      ],
      form: { mainImage: null, category: "", title: "", subtitle: "", content: "" },
      contentImages: [],
      isDirty: false,
      openPreview: false,
      submitting: false,

      /** 등록 완료 모달 상태 */
      openSuccess: false,
      createdId: null,
    };
  },
  computed: {
    categoryLabel() {
      return this.drinkOptions.find((o) => o.value === this.form.category)?.label || "";
    },
    mainPreviewUrl() {
      return this.form.mainImage ? URL.createObjectURL(this.form.mainImage) : "";
    },
    contentPreviewUrls() {
      return this.contentImages.map((f) => URL.createObjectURL(f));
    },
    renderedContent() {
      const src = this.form.content ?? "";
      let html = src
        .replace(/!\[[^\]]*\]\(([^)]+)\)/g, (_, url) => {
          return `<img src="${url}" alt="" style="max-width:100%;border-radius:10px;display:block;margin:12px 0;"/>`;
        })
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/_(.+?)_/g, "<em>$1</em>")
        .replace(/\n/g, "<br/>");
      return html;
    },
  },
  mounted() {
    const saved = localStorage.getItem("temp_post_v2");
    if (saved) {
      try {
        this.form = { ...this.form, ...JSON.parse(saved) };
      } catch {}
    }
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },
  methods: {
    /** 카테고리 → alcoholNo 매핑 */
    categoryToNo(category) {
      const map = {
        beer: 1,
        soju: 2,
        makgeolli: 3,
        champagne: 4,
        sake: 5,
        golyangju: 6,
        highball: 7,
        wine: 8,
        etc: 9,
      };
      return map[String(category || "").toLowerCase()] || 1; // 기본값: beer(1)
    },

    touch() {
      this.isDirty = true;
    },
    handleBeforeUnload(e) {
      if (this.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    insertText(snippet) {
      const el = this.$refs.contentRef;
      const start = el?.selectionStart || 0,
        end = el?.selectionEnd || 0;
      const v = this.form.content ?? "";
      this.form.content = v.slice(0, start) + snippet + v.slice(end);
      this.$nextTick(() => {
        if (el) {
          el.selectionStart = el.selectionEnd = start + snippet.length;
          el.focus();
        }
      });
      this.touch();
    },
    insertImageAtCursor(url) {
      this.insertText(`\n![이미지](${url})\n`);
    },
    saveTemp() {
      const { mainImage, ...rest } = this.form;
      localStorage.setItem("temp_post_v2", JSON.stringify(rest));
      this.isDirty = false;
      alert("임시 저장되었습니다.");
    },
    validate() {
      const title = (this.form.title ?? "").trim();
      const content = (this.form.content ?? "").trim();
      if (!this.form.category) return alert("카테고리를 선택하세요."), false;
      if (!title) return alert("제목을 입력하세요."), false;
      if (content.length < 10) return alert("본문은 10자 이상 입력하세요."), false;
      return true;
    },
    async submit() {
      if (!this.validate() || this.submitting) return;
      this.submitting = true;
      try {
        const alcoholNo = this.categoryToNo(this.form.category); // ✅ 하드코딩 제거

        const payload = {
          category: this.form.category,
          alcoholNo, // ✅ 선택 카테고리 기반 번호
          title: this.form.title.trim(),
          subtitle: this.form.subtitle.trim(),
          contentHtml: this.renderedContent.trim(),
          mainImageFile: this.form.mainImage || null,
          contentImageFiles: this.contentImages || [],
        };
        const created = await createPost(payload);
        localStorage.removeItem("temp_post_v2");
        this.isDirty = false;

        // 성공 모달 오픈
        const id = created?.id ?? created?.boardNo ?? created?.data?.id;
        this.createdId = id;
        this.openSuccess = true;
      } catch (e) {
        console.error(e);
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "등록 실패";
        alert(msg);
      } finally {
        this.submitting = false;
      }
    },

    /** 등록 완료 모달 동작 */
    closeSuccess() {
      this.openSuccess = false;
    },
    goMyPost() {
      if (this.createdId) this.$router.push(`/post/${this.createdId}`);
      else this.$router.push("/mypage");
      this.closeSuccess();
    },
    goPostList() {
      // ✅ 선택 카테고리의 alcoholNo로 /alcohol/{no} 이동
      const alcoholNo = this.categoryToNo(this.form.category);
      this.$router.push(`/alcohol/${alcoholNo}`).then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      this.closeSuccess();
    },
  },
};
</script>

<style scoped>
/* 기본 스타일 */
.wrap { width: 900px; margin: 0 auto; padding: 24px; color: #2b2b2b; }
.page-title { font-size: 28px; margin-bottom: 12px; }
.row { display: flex; align-items: flex-start; gap: 14px; margin: 14px 0; }
.lb { width: 90px; font-weight: 700; color: #3e352b; padding-top: 8px; }
.req { color: #8a7d6d; padding-top: 8px; }
.field { flex: 1; position: relative; }
.input { width: 100%; height: 40px; border: 1px solid #d9d2c7; border-radius: 10px; padding: 0 12px; background: #fff; }
.textarea { width: 100%; min-height: 240px; border: 1px solid #d9d2c7; border-radius: 10px; padding: 12px; background: #fff; resize: vertical; }
.count { position: absolute; right: 12px; bottom: 8px; font-size: 12px; color: #8a7d6d; }
.toolbar { display: flex; gap: 6px; margin-bottom: 8px; }
.md-btn { border: 1px solid #ddd; background: #fff; border-radius: 8px; padding: 4px 8px; cursor: pointer; }
.mt10 { margin-top: 10px; }
.btns { display: flex; gap: 10px; margin-top: 18px; }
.btns .ghost { border: 1px solid #ccc; background: #fff; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.btns .primary { border: none; background: #111; color: #fff; padding: 10px 16px; border-radius: 10px; cursor: pointer; }

/* 등록 완료 모달 스타일 */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal {
  position: relative;
  width: 520px; max-width: calc(100% - 32px);
  background: #fff; border-radius: 14px; padding: 22px 22px 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.22);
}
.modal-title { font-size: 20px; font-weight: 800; margin-bottom: 8px; color: #222; }
.modal-desc { font-size: 15px; color: #333; margin-bottom: 6px; }
.modal-warn { font-size: 12px; color: #a3792a; background:#fff7e0; border:1px solid #ffe3a6; padding: 8px 10px; border-radius: 8px; }
.modal-btns { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
.modal .ghost { border: 1px solid #ccc; background: #fff; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.modal .primary { border: none; background: #111; color: #fff; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.modal .x { position: absolute; right: 10px; top: 8px; border: none; background: transparent; font-size: 22px; line-height: 1; cursor: pointer; color:#666; }
</style>
