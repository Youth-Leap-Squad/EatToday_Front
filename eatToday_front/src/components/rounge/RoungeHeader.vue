<template>
  <section class="rounge-header">
    <h1>Rounge</h1>

    <div class="search-wrap">
      <img class="search-icon" src="@/assets/images/search.png" alt="검색" />
      <input
        class="search-input"
        type="text"
        v-model="keywordLocal"
        placeholder="검색하고 싶은 내용을 입력해주세요."
        @keyup.enter="onSearchEnter"
      />
    </div>

    <div class="category-row">
      <button
        v-for="c in alcohols"
        :key="c.no"
        class="alcohol-btn"
        @click="toggleAlcohol(c.no)"
      >
        <span class="alcohol-element" :class="{ active: selectedAlcoholNo === c.no }">
          <img
            :src="c.icon"
            :alt="c.label"
            loading="lazy"
            draggable="false"
            @error="onIconError($event)"
          />
        </span>
        <span class="alcohol-label">{{ c.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import beer from '@/assets/images/alcohols/beer.png'
import soju from '@/assets/images/alcohols/soju.png'
import makgeolli from '@/assets/images/alcohols/makgeolli.png'
import champagne from '@/assets/images/alcohols/champagne.png'
import sake from '@/assets/images/alcohols/sake.png'
import highqualityliquor from '@/assets/images/alcohols/highqualotyliquor.png'
import highball from '@/assets/images/alcohols/highball.png'
import wine from '@/assets/images/alcohols/wine.png'
import etc from '@/assets/images/alcohols/etc.png'

const props = defineProps({
  keyword: { type: String, default: '' },
  alcoholNo: { type: Number, default: null }
})
const emit = defineEmits(['update:keyword', 'update:alcoholNo', 'search'])

const keywordLocal = ref(props.keyword)
watch(() => props.keyword, v => { if (v !== keywordLocal.value) keywordLocal.value = v })
watch(keywordLocal, v => emit('update:keyword', v))

const selectedAlcoholNo = ref(props.alcoholNo)
watch(() => props.alcoholNo, v => { selectedAlcoholNo.value = v })

const alcohols = [
  { no: 1, label: '맥주', icon: beer },
  { no: 2, label: '소주', icon: soju },
  { no: 3, label: '막걸리', icon: makgeolli },
  { no: 4, label: '샴페인', icon: champagne },
  { no: 5, label: '사케', icon: sake },
  { no: 6, label: '고량주', icon: highqualityliquor },
  { no: 7, label: '하이볼', icon: highball },
  { no: 8, label: '와인', icon: wine },
  { no: 9, label: '기타', icon: etc },
]

function toggleAlcohol(no) {
  selectedAlcoholNo.value = selectedAlcoholNo.value === no ? null : no
  emit('update:alcoholNo', selectedAlcoholNo.value)
  emit('search')
}

function onSearchEnter() {
  emit('search')
}

function onIconError(e) {
  e.target.src = etc
}
</script>

<style scoped>
.rounge-header { text-align: center; padding: 24px 16px 8px; background: #fff7ec; }
h1 { font-size: 36px; margin: 0 0 18px; color: #2b1f14; }
.search-wrap { position: relative; height: 70px; max-width: 661px; width: 55%; margin: 8px auto 18px; background: #ffffff; border: 5px solid #f2d5a7; border-radius: 20px; box-sizing: border-box; }
.search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 19px; height: 18px; object-fit: contain; pointer-events: none; }
.search-input { width: 100%; height: 100%; border: none; outline: none; background: transparent; font-size: 16px; color: #333; padding-left: 60px; padding-right: 16px; }
.search-input::placeholder { color: #8e8e8e; }
.category-row { display: flex; gap: 28px; flex-wrap: wrap; justify-content: center; align-items: flex-start; margin: 18px auto 10px; padding: 0 12px; }
.alcohol-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; background: transparent; border: none; padding: 0; cursor: pointer; }
.alcohol-element { width: 90px; height: 90px; border-radius: 9999px; border: 1px solid #bfbfbf; display: grid; place-items: center; background: #fff4e3; overflow: hidden; }
.alcohol-element img { width: 72px; height: 72px; object-fit: contain; image-rendering: auto; display: block; }
.alcohol-element.active { background-color: #f2dcb9; border-color: #bfbfbf; }
.alcohol-btn:hover .alcohol-element { background-color: #f2dcb9; }
.alcohol-label { font-size: 14px; font-weight: 400; color: #2d2d2f; }
</style>