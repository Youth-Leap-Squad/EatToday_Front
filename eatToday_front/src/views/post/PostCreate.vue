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
        <input v-model="form.title" :maxlength="limits.title" class="input" placeholder="제목을 입력하세요" @input="touch()" />
        <span class="count">{{ form.title.length }}/{{ limits.title }}</span>
      </div>
    </div>

    <div class="row">
      <label class="lb">소제목</label>
      <div class="field">
        <input v-model="form.subtitle" :maxlength="limits.subtitle" class="input" placeholder="소제목을 입력하세요" @input="touch()" />
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

        <textarea ref="contentRef" v-model="form.content" :maxlength="limits.content" class="textarea" placeholder="내용을 입력하세요" @input="touch()"></textarea>
        <span class="count">{{ form.content.length }}/{{ limits.content }}</span>

        <ContentImageUploader class="mt10" @files="contentImages = $event" @insert="insertImageAtCursor" />
      </div>
    </div>

    <!-- 버튼 -->
    <div class="btns">
      <button class="ghost" @click="saveTemp">임시 저장</button>
      <button class="ghost" @click="openPreview = true">미리보기</button>
      <button class="primary" @click="submit">작성 완료</button>
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
  </div>
</template>

<script>
import ToggleSelect from "@/components/post/ToggleSelect.vue";
import ImageUploader from "@/components/post/ImageUploader.vue";
import ContentImageUploader from "@/components/post/ContentImageUploader.vue";
import PreviewModal from "@/components/post/PreviewModal.vue";

const toDataURL = (file) =>
  new Promise((res, rej) => {
    if (!file) return res("");
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

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
    };
  },
  computed: {
    categoryLabel() { return this.drinkOptions.find((o) => o.value === this.form.category)?.label || ""; },
    mainPreviewUrl() { return this.form.mainImage ? URL.createObjectURL(this.form.mainImage) : ""; },
    contentPreviewUrls() { return this.contentImages.map((f) => URL.createObjectURL(f)); },
    renderedContent() {
      const src = this.form.content ?? "";
      let html = src
        .replace(/!\[[^\]]*\]\(([^)]+)\)/g, (_, url) =>
          `<img src="${url}" alt="" style="max-width:100%;border-radius:10px;display:block;margin:12px 0;"/>`
        )
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/_(.+?)_/g, "<em>$1</em>")
        .replace(/\n/g, "<br/>");
      return html;
    },
  },
  mounted() {
    const saved = localStorage.getItem("temp_post_v2");
    if (saved) {
      try { this.form = { ...this.form, ...JSON.parse(saved) }; } catch {}
    }
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() { window.removeEventListener("beforeunload", this.handleBeforeUnload); },
  methods: {
    touch() { this.isDirty = true; },
    handleBeforeUnload(e) { if (this.isDirty) { e.preventDefault(); e.returnValue = ""; } },
    insertText(snippet) {
      const el = this.$refs.contentRef;
      const start = el?.selectionStart || 0, end = el?.selectionEnd || 0;
      const v = this.form.content ?? "";
      this.form.content = v.slice(0, start) + snippet + v.slice(end);
      this.$nextTick(() => { if (el) { el.selectionStart = el.selectionEnd = start + snippet.length; el.focus(); }});
      this.touch();
    },
    insertImageAtCursor(url) { this.insertText(`\n![이미지](${url})\n`); },
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
      if (!this.validate()) return;

      const mainImageDataUrl = await toDataURL(this.form.mainImage);
      const contentImageDataUrls = await Promise.all(this.contentImages.map((f) => toDataURL(f)));

      const post = {
        id: `local-${Date.now()}`,
        category: this.form.category,
        title: this.form.title.trim(),
        subtitle: this.form.subtitle.trim(),
        content: this.renderedContent.trim(),
        cover: mainImageDataUrl,
        contentImages: contentImageDataUrls,
        author: "나",
        date: new Date().toISOString().slice(0, 10),
        views: 0,
        likes: 0,
      };

      // 목록 저장(옵션)
      const key = "local_posts";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.unshift(post);
      localStorage.setItem(key, JSON.stringify(list));

      // 상세에서 읽을 수 있도록 현재 글 저장 후 상세로 이동
      localStorage.setItem("current_post", JSON.stringify(post));
      localStorage.removeItem("temp_post_v2");
      this.isDirty = false;

      alert("게시글이 등록되었습니다!");
      this.$router.push({ name: 'PostDetail', params: { id: post.id } });
    },
  },
};
</script>

<style scoped>
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
</style>
