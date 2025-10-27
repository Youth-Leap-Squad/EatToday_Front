<!-- src/views/review/ReviewCard.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { likeReview } from '@/mock/review.js' // 실제 API로 바꾸려면 여기만 교체

const router = useRouter()
const props = defineProps({
  // { id, title, content, authorName, authorAvatar, likeCount, imgUrl }
  item: { type: Object, required: true }
})

const likes = ref(props.item?.likeCount ?? 0)
watch(() => props.item?.likeCount, v => likes.value = v ?? 0)

function goDetail(){
  if (!props.item?.id) return
  router.push(`/reviews/${props.item.id}`)
}
async function onLike(e){
  e.stopPropagation()
  if (!props.item?.id) return
  likes.value = await likeReview(props.item.id) // 실제 API면 응답의 likeCount로 세팅
}
</script>

<template>
  <article class="card" @click="goDetail" tabindex="0" @keyup.enter="goDetail">
    <!-- 큰 썸네일 -->
    <div class="thumb">
      <img v-if="item?.imgUrl" :src="item.imgUrl" alt="" />
      <div v-else class="placeholder">이미지</div>

      <!-- 우측 상단 하트 배지 -->
      <button class="like-badge" @click="onLike" aria-label="좋아요">
        <span class="heart">♡</span>
        <span class="cnt">{{ likes }}</span>
      </button>
    </div>

    <!-- 하단 메타 -->
    <div class="meta">
      <div class="row">
        <img v-if="item?.authorAvatar" :src="item.authorAvatar" class="avatar" alt="" />
        <div v-else class="avatar ph">👤</div>
        <div class="text">
          <div class="name">{{ item?.authorName || 'user' }}</div>
          <div class="desc">{{ item?.title || '제목 없음' }}</div>
          <div class="sub">{{ item?.content || '' }}</div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card{
  background:#f6efe2; /* 카드 바탕 약간 베이지 */
  border-radius:18px;
  padding:12px;
  box-shadow:0 8px 24px rgba(50,30,0,.07);
  cursor:pointer;
  transition:transform .15s ease, box-shadow .15s ease;
}
.card:hover{ transform:translateY(-2px); box-shadow:0 10px 28px rgba(50,30,0,.10); }

.thumb{
  position:relative;
  width:100%;
  aspect-ratio:16/10;
  background:#ece5dc;
  border-radius:14px;
  overflow:hidden;
}
.thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
.placeholder{ width:100%; height:100%; display:grid; place-items:center; color:#9a8b7a; font-weight:800; }

/* 우측 상단 하트 배지 */
.like-badge{
  position:absolute; top:10px; right:10px;
  display:flex; align-items:center; gap:6px;
  border:none; background:#ffffff;
  padding:6px 10px; border-radius:999px;
  box-shadow:0 6px 16px rgba(0,0,0,.12);
  font-weight:900; color:#2e2318; cursor:pointer;
}
.heart{ font-size:16px; line-height:1; }
.cnt{ font-size:14px; }

.meta{ padding:12px 6px 4px; }
.row{ display:flex; gap:10px; align-items:flex-start; }
.avatar{ width:36px; height:36px; border-radius:50%; object-fit:cover; background:#f0eadf; }
.avatar.ph{ display:grid; place-items:center; font-size:18px; }
.text{ display:grid; gap:2px; }
.name{ font-weight:900; color:#2f2419; }
.desc{ color:#2f2419; font-weight:800; }
.sub{
  color:#6b5b4a; font-size:13px;
  display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
}
</style>
