<template>
  <div v-if="open" class="dim" @click.self="$emit('close')">
    <div class="modal">
      <header class="hd">
        <h2>미리보기</h2>
        <button class="x" @click="$emit('close')">×</button>
      </header>

      <section class="body">
        <img v-if="mainImageUrl" :src="mainImageUrl" class="hero" alt="main" />
        <h1 class="ttl">{{ title }}</h1>
        <h3 class="subttl" v-if="subtitle">{{ subtitle }}</h3>
        <div class="cat">카테고리: <b>{{ categoryLabel }}</b></div>

        <article class="content" v-html="contentHtml"></article>

        <div v-if="contentImageUrls?.length" class="grid">
          <img v-for="(u,i) in contentImageUrls" :key="i" :src="u" alt="" />
        </div>
      </section>

      <footer class="ft">
        <button class="ghost" @click="$emit('close')">닫기</button>
        <button class="primary" @click="$emit('submit')">바로 등록</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "PreviewModal",
  props: {
    open: Boolean,
    mainImageUrl: String,
    title: String,
    subtitle: String,
    categoryLabel: String,
    contentHtml: String,
    contentImageUrls: Array
  },
  emits: ["close","submit"]
};
</script>

<style scoped>
.dim{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:2000}
.modal{width:min(920px,92vw);max-height:92vh;overflow:auto;background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.25)}
.hd{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #eee}
.hd .x{border:none;background:transparent;font-size:20px;cursor:pointer}
.body{padding:16px 18px}
.hero{width:100%;max-height:420px;object-fit:cover;border-radius:10px;margin-bottom:12px}
.ttl{font-size:24px;margin:6px 0}
.subttl{color:#555;margin:0 0 8px}
.cat{font-size:14px;color:#666;margin-bottom:10px}
.content{line-height:1.7;white-space:pre-wrap}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-top:14px}
.grid img{width:100%;height:120px;object-fit:cover;border-radius:8px}
.ft{display:flex;justify-content:flex-end;gap:8px;padding:14px 18px;border-top:1px solid #eee}
.ghost{border:1px solid #ccc;background:#fff;padding:8px 14px;border-radius:10px;cursor:pointer}
.primary{border:none;background:#111;color:#fff;padding:8px 14px;border-radius:10px;cursor:pointer}
</style>
