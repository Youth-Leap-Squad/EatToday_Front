<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>

    <div v-if="foods.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="f in foods" :key="f.boardNo" class="border rounded-xl p-3 bg-white">
        <img :src="resolveAssetUrl(f.food_picture)" class="w-full h-40 object-cover rounded-lg mb-2" />
        <h3 class="font-semibold text-lg">{{ f.board_title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ f.food_explain }}</p>
      </div>
    </div>

    <div v-else class="text-gray-500">해당 주종 게시글이 없습니다.</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPostsByAlcohol } from '@/api/post'

const route = useRoute()
const foods = ref([])

const alcoholNames = { 1: '🍺 맥주', 2: '🍶 소주', 3: '🌾 막걸리', 8: '🍷 와인' }
const title = computed(() => `${alcoholNames[Number(route.params.id)] ?? '주종'} 안주 게시글`)

async function load() {
  const id = Number(route.params.id)
  const allowed = [1, 2, 3, 8]
  if (!allowed.includes(id)) { foods.value = []; return }

  const { list } = await fetchPostsByAlcohol({ alcoholNo: id, page: 0, size: 12 })
  foods.value = list
}
onMounted(load)
watch(() => route.params.id, load)
</script>
