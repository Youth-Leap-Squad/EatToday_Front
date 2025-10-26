<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { likeReview } from '@/mock/review.js';

const router = useRouter();
const props = defineProps({
  // { id, title, authorName, authorAvatar, likeCount, imgUrl }
  item: { type: Object, required: true }
});

const likes = ref(props.item?.likeCount ?? 0);
watch(() => props.item?.likeCount, v => likes.value = v ?? 0);

function goDetail() {
  if (!props.item?.id) return;
  router.push(`/reviews/${props.item.id}`);
}
function onLike(e) {
  e.stopPropagation(); // 카드 클릭과 구분
  if (!props.item?.id) return;
  likes.value = likeReview(props.item.id);
}
</script>

<template>



  <article class="card" @click="goDetail" tabindex="0" @keyup.enter="goDetail">
    <div class="thumb">
      <img v-if="item?.imgUrl" :src="item.imgUrl" alt="" />
      <div v-else class="placeholder">이미지</div>
    </div>

    <div class="meta">
      <div class="author">
        <div class="avatar">👤</div>
        <div class="name">{{ item?.authorName || 'user' }}</div>
      </div>

      <div class="title" :title="item?.title">{{ item?.title || '제목 없음' }}</div>

      <button class="likes" @click="onLike" aria-label="좋아요">
        <span class="heart">♡</span>
        <span>{{ likes }}</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.card{background:#fff;border-radius:22px;padding:14px;box-shadow:0 6px 20px rgba(50,30,0,.07);cursor:pointer;}
.card:hover{transform:translateY(-2px)}
.thumb{width:100%;aspect-ratio:16/10;background:#ece5dc;border-radius:18px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.thumb img{width:100%;height:100%;object-fit:cover}
.placeholder{color:#9a8b7a;font-weight:800}
.meta{padding:12px 6px 2px}
.author{display:flex;align-items:center;gap:8px}
.avatar{width:32px;height:32px;border-radius:50%;background:#f0eadf;display:grid;place-items:center}
.name{font-size:14px;color:#6b5b4a}
.title{margin-top:8px;font-weight:900;color:#3f3023;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.likes{margin-top:8px;display:flex;gap:6px;align-items:center;background:transparent;border:none;color:#3f3023;font-weight:800;cursor:pointer}
.heart{font-size:18px}
</style>
