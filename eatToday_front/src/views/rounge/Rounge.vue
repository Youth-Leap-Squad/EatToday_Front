<template>
  <div class="rounge-page">
    <RoungeHeader
      v-model:keyword="inputValue"
      v-model:alcoholNo="alcoholNo"
      @search="onSearch"
    />
    <hr class="boundary" />

    <div class="sort-bar">
      <button class="sort-btn" :class="{ active: sort === 'latest' }" @click="onClickLatest">최신순</button>
      <button class="sort-btn" :class="{ active: sort === 'likes' }" @click="onClickLikes">좋아요순</button>
    </div>

    <section class="card-grid">
      <PhotoReviewCard
        v-for="item in items"
        :key="item.id"
        :photo-src="item.photo ?? undefined"
        :avatar-src="item.avatar ?? undefined"
        :nickname="item.nickname"
        :content="item.content"
        :like-count="item.likes ?? 0"
        :is-liked="item.isLiked ?? false"
      />
    </section>

    <div ref="sentinel" class="sentinel"></div>

    <p v-if="loading && items.length === 0" class="center">불러오는 중…</p>
    <p v-else-if="!loading && items.length === 0" class="center">검색 결과가 없습니다.</p>
    <p v-if="loadingMore" class="center">더 불러오는 중…</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import RoungeHeader from '@/components/rounge/RoungeHeader.vue'
import PhotoReviewCard from '@/components/photo_review/PhotoReviewCard.vue'
import {
  searchPhotoReviews,
  fetchPhotoReviewsByDate,
  fetchPhotoReviewsByLike,
  fetchPhotoReviewsByAlcohol,
  fetchPhotoReviewsByAlcoholLike
} from '@/api/photoReview'

const sort = ref('latest')
const inputValue = ref('')
const searchKeyword = ref('')
const alcoholNo = ref(null)
const page = ref(0)
const size = ref(6)
const items = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const hasNext = ref(true)
let observer = null
let reqSeq = 0

const normalize = r => ({
  id: r.reviewNo,
  nickname: r?.member?.memberName ?? '익명',
  content: r.reviewContent ?? r.reviewTitle ?? '',
  likes: r.reviewLike ?? 0,
  createdAt: r.reviewDate ? new Date(r.reviewDate).toISOString() : new Date().toISOString(),
  photo: r.files?.[0]?.url ?? r.files?.[0]?.fileUrl ?? r.files?.[0]?.path ?? null,
  avatar: null
})

async function fetchPage({ append = false } = {}) {
  const mySeq = ++reqSeq
  if (append) {
    if (!hasNext.value || loadingMore.value) return
    loadingMore.value = true
  } else {
    loading.value = true
    items.value = []
    page.value = 0
    hasNext.value = true
  }

  try {
    let res
    const kw = searchKeyword.value.trim()
    const al = alcoholNo.value

    if (kw) {
      res = await searchPhotoReviews({ keyword: kw, page: page.value, size: size.value })
    } else if (al) {
      if (sort.value === 'likes') {
        res = await fetchPhotoReviewsByAlcoholLike({ alcoholNo: al, page: page.value, size: size.value })
      } else {
        res = await fetchPhotoReviewsByAlcohol({ alcoholNo: al, page: page.value, size: size.value })
      }
    } else {
      if (sort.value === 'likes') {
        res = await fetchPhotoReviewsByLike({ page: page.value, size: size.value })
      } else {
        res = await fetchPhotoReviewsByDate({ page: page.value, size: size.value })
      }
    }

    if (mySeq !== reqSeq) return

    const rows = Array.isArray(res?.content) ? res.content.map(normalize) : []
    items.value = append ? items.value.concat(rows) : rows
    hasNext.value = res?.hasNext ?? false
    if (hasNext.value) page.value += 1
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function onSearch() {
  searchKeyword.value = inputValue.value.trim()
  fetchPage({ append: false })
  inputValue.value = ''
}

function onClickLatest() {
  sort.value = 'latest'
  fetchPage({ append: false })
}

function onClickLikes() {
  sort.value = 'likes'
  fetchPage({ append: false })
}

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) fetchPage({ append: true })
    },
    { root: null, rootMargin: '300px', threshold: 0.1 }
  )
  const el = sentinel.value
  if (el) observer.observe(el)
  fetchPage({ append: false })
})

onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value)
})

const sentinel = ref(null)
</script>

<style scoped>
.rounge-page { background-color: #FFF7E9; min-height: 100vh; }
.boundary { border: none; border-top: 1px solid #BFBFBF; width: 85%; margin: 0 auto; }
.sort-bar { width: 85%; margin: 20px auto 0; display: flex; justify-content: flex-end; gap: 24px; }
.sort-btn { border: none; background: transparent; font-size: 16px; font-weight: 600; color: #2D2D2F; cursor: pointer; }
.sort-btn.active { color: #D2B382; }
.card-grid { width: 85%; margin: 16px auto 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 28px; }
.center { text-align: center; margin: 8px 0; }
.sentinel { height: 1px; }
</style>