<template>
  <article class="pr-card" @click="$emit('click')">
    <div class="thumb">
      <img :src="image" loading="lazy" @error="onImgError" alt="" />
      <button class="like" @click.stop="$emit('like')">♡ {{ likes }}</button>
    </div>

    <div class="foot">
      <img :src="avatar" class="av" alt="" @error="onAvError" />
      <div class="meta">
        <div class="nick">{{ nickname }}</div>
        <div class="txt">{{ text }}</div>
      </div>
    </div>
  </article>
</template>

<script>
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900";
const FALLBACK_AV = "https://i.pravatar.cc/100?img=1";

export default {
  name: "PhotoReviewCard",
  props: {
    image: String,
    avatar: String,
    nickname: String,
    text: String,
    likes: { type: Number, default: 0 }
  },
  emits: ["click","like"],
  methods:{
    onImgError(e){ e.target.src = FALLBACK_IMG; }
    ,onAvError(e){ e.target.src = FALLBACK_AV; }
  }
};
</script>

<style scoped>
.pr-card{
  background:#f7f2e9;border-radius:16px;overflow:hidden;
  box-shadow:0 4px 18px rgba(0,0,0,.06);transition:transform .15s ease
}
.pr-card:hover{ transform: translateY(-2px); }

.thumb{ position:relative; aspect-ratio: 4/3; background:#eee; }
.thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
.like{
  position:absolute; right:10px; top:10px;
  font-weight:700; font-size:13px; padding:6px 10px; border-radius:999px;
  border:1px solid rgba(0,0,0,.12); background:rgba(255,255,255,.85); cursor:pointer;
  backdrop-filter: blur(4px);
}

.foot{ display:flex; align-items:center; gap:10px; padding:12px; }
.av{ width:34px; height:34px; border-radius:50%; object-fit:cover; background:#fff; }
.meta{ min-width:0; }
.nick{ font-weight:700; font-size:13px; line-height:1; }
.txt{
  font-size:12px; color:#5b5145; margin-top:3px;
  display:-webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow:hidden;
}
</style>
