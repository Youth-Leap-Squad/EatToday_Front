<!-- src/views/post/AlcoholList.vue -->
<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>

    <p class="mb-3 text-gray-600">route param: {{ id }}</p>

    <div v-if="items.length">
      <div v-for="it in items" :key="it.id" class="mb-2">
        <strong>{{ it.title }}</strong>
        <small> · 👁 {{ it.views ?? 0 }} · ♡ {{ it.likes ?? 0 }} · 💬 {{ it.comment ?? 0 }}</small>
      </div>
    </div>
    <div v-else class="text-gray-500">데이터가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPostsByAlcohol } from '@/api/post' // ✅ post.js에 있음

const route = useRoute()
const id = computed(() => Number(route.params.id))
const items = ref([])

const alcoholNames = { 1: '🍺 맥주', 2: '🍶 소주', 3: '🌾 막걸리', 8: '🍷 와인' }
const title = computed(() => `${alcoholNames[id.value] ?? '주종'} 안주 게시글`)

async function load() {
  // 소주: 2, 와인: 8
  const { list } = await fetchPostsByAlcohol({ alcoholNo: id.value, page: 0, size: 12 })
  items.value = list
}

onMounted(load)
watch(() => route.params.id, load)
</script>
