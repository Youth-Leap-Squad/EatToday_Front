<template>
  <article class="card" @click="open">
    <div class="thumb">
      <img :src="safeThumb" alt="thumbnail" @error="onErr" />
      <span class="like-badge">♥️ {{ (likes ?? 0).toLocaleString() }}</span>
    </div>
    <footer class="info">
      <div class="author">
        <img :src="safeAvatar" class="avatar" alt="avatar" @error="onAvatarErr" />
        <div class="meta">
          <p class="name">{{ author || '익명' }}</p>
          <p class="title">{{ title || '(제목 없음)' }}</p>
        </div>
      </div>
      <div class="stat">
        <span>👁 {{ (views ?? 0).toLocaleString() }}</span>
        <span>💬 {{ (comment ?? 0).toLocaleString() }}</span>
      </div>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: { type: [Number, String], required: true },
  title: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comment: { type: Number, default: 0 },
  author: { type: String, default: '' },
  avatar: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  fallbackThumb: { type: String, default: '/images/placeholder-thumb.jpg' },
  // ✅ 기본 프사 로컬 경로
  fallbackAvatar: { type: String, default: '/image/user-profile/basic_profile.jpg' },
  to: { type: String, default: '' }
})

const router = useRouter()
const safeThumb = computed(() => props.thumbnail || props.fallbackThumb)
const safeAvatar = computed(() => props.avatar || props.fallbackAvatar)

function open() {
  if (props.to) router.push(props.to)
  else router.push(`/post/${props.id}`)
}
function onErr(e) { e.target.onerror = null; e.target.src = props.fallbackThumb }
function onAvatarErr(e) { e.target.onerror = null; e.target.src = props.fallbackAvatar }
</script>

<style scoped>
.card{ background:#fffdf8; border-radius:22px; overflow:hidden; border:1px solid #ebe3d6; box-shadow:0 6px 14px rgba(0,0,0,.08); cursor:pointer; transition:transform .25s ease, box-shadow .25s ease }
.card:hover{ transform:translateY(-6px); box-shadow:0 10px 20px rgba(0,0,0,.12) }
.thumb{ position:relative; overflow:hidden }
.thumb img{ width:100%; height:220px; object-fit:cover; display:block }
.like-badge{ position:absolute; top:12px; right:12px; background:#fff; color:#1f2937; font-weight:800; border:1px solid #e6e6e6; border-radius:9999px; padding:8px 10px; font-size:14px; box-shadow:0 4px 10px rgba(0,0,0,.12) }
.info{ display:flex; align-items:flex-end; justify-content:space-between; gap:12px; padding:16px 18px 18px }
.author{ display:flex; align-items:center; gap:10px }
.avatar{ width:36px; height:36px; border-radius:50%; object-fit:cover }
.meta{ display:flex; flex-direction:column }
.name{ font-weight:800; font-size:14px; color:#3f3428 }
.title{ margin-top:2px; font-size:15px; font-weight:800; color:#2b2b2b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:38vw }
.stat{ display:flex; align-items:center; gap:10px; color:#8c7f6b; font-size:13px }
@media (max-width: 860px){ .thumb img{ height:190px } }
@media (max-width: 560px){ .thumb img{ height:180px } }
</style>
