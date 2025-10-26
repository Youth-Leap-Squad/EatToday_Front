<template>
  <div class="rounge-page">
    <RoungeHeader
      v-model:keyword="inputValue"
      @search="onSearch"
      @select-alcohol="onSelectAlcohol"
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

    <p v-if="loading" style="text-align:center; margin:8px 0;">불러오는 중…</p>
    <p v-else-if="!loading && items.length === 0" style="text-align:center; margin:8px 0;">검색 결과가 없습니다.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
const keyword = ref('')
const inputValue = ref('')
const selectedAlcohol = ref(null)
const page = ref(0)
const size = ref(6)
const loading = ref(false)
const items = ref([])
const hasNext = ref(true)

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
  loading.value = true
  try {
    let res
    const kw = keyword.value.trim()
    if (kw) {
      res = await searchPhotoReviews({ keyword: kw, page: page.value, size: size.value })
    } else if (selectedAlcohol.value) {
      if (sort.value === 'likes') {
        res = await fetchPhotoReviewsByAlcoholLike({ alcoholNo: selectedAlcohol.value, page: page.value, size: size.value })
      } else {
        res = await fetchPhotoReviewsByAlcohol({ alcoholNo: selectedAlcohol.value, page: page.value, size: size.value })
      }
    } else if (sort.value === 'likes') {
      res = await fetchPhotoReviewsByLike({ page: page.value, size: size.value })
    } else {
      res = await fetchPhotoReviewsByDate({ page: page.value, size: size.value })
    }

    const rows = Array.isArray(res?.content) ? res.content : []
    if (append) items.value.push(...rows.map(normalize))
    else items.value = rows.map(normalize)
    hasNext.value = res?.hasNext ?? false
  } finally {
    loading.value = false
  }
}

function onSearch() {
  keyword.value = inputValue.value.trim()
  page.value = 0
  fetchPage()
  inputValue.value = ''
}

function onClickLatest() {
  sort.value = 'latest'
  page.value = 0
  fetchPage()
}

function onClickLikes() {
  sort.value = 'likes'
  page.value = 0
  fetchPage()
}

function onSelectAlcohol(no) {
  selectedAlcohol.value = selectedAlcohol.value === no ? null : no
  page.value = 0
  fetchPage()
}

function onScroll() {
  if (!hasNext.value || loading.value) return
  if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 10) {
    page.value++
    fetchPage({ append: true })
  }
}

window.addEventListener('scroll', onScroll)

fetchPage()
</script>

<style scoped>
.rounge-page { background-color: #FFF7E9; min-height: 100vh; }
.boundary { border: none; border-top: 1px solid #BFBFBF; width: 85%; margin: 0 auto; }
.sort-bar { width: 85%; margin: 20px auto 0; display: flex; justify-content: flex-end; gap: 24px; }
.sort-btn { border: none; background: transparent; font-size: 16px; font-weight: 600; color: #2D2D2F; cursor: pointer; }
.sort-btn.active { color: #D2B382; }
.card-grid { width: 85%; margin: 16px auto 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 28px; }
</style>