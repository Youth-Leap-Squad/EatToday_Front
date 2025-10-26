<template>
  <section class="rounge-header">
    <h1>Rounge</h1>

    <div class="search-wrap">
      <img class="search-icon" src="@/assets/images/search.png" alt="검색" />
      <input
        class="search-input"
        type="text"
        placeholder="검색하고 싶은 내용을 입력해주세요."
      />
    </div>

    <div class="category-row">
      <button
        v-for="c in alcohols"
        :key="c.key"
        class="alcohol-btn"
        @click="selectAlcohol(c.key)"
      >
        <span
          class="alcohol-element"
          :class="{ active: selectedAlcohol === c.key }"
        >
          <img :src="c.icon" :alt="c.label" />
        </span>
        <span class="alcohol-label">{{ c.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import beer from '@/assets/images/alcohols/beer.png'
import soju from '@/assets/images/alcohols/soju.png'
import makgeolli from '@/assets/images/alcohols/makgeolli.png'
import champagne from '@/assets/images/alcohols/champagne.png'
import sake from '@/assets/images/alcohols/sake.png'
import highqualityliquor from '@/assets/images/alcohols/highqualotyliquor.png'
import highball from '@/assets/images/alcohols/highball.png'
import wine from '@/assets/images/alcohols/wine.png'
import etc from '@/assets/images/alcohols/etc.png'

const alcohols = [
  { key: 'beer', label: '맥주', icon: beer },
  { key: 'soju', label: '소주', icon: soju },
  { key: 'makgeolli', label: '막걸리', icon: makgeolli },
  { key: 'champagne', label: '샴페인', icon: champagne },
  { key: 'sake', label: '사케', icon: sake },
  { key: 'highqualityliquor', label: '고량주', icon: highqualityliquor },
  { key: 'highball', label: '하이볼', icon: highball },
  { key: 'wine', label: '와인', icon: wine },
  { key: 'etc', label: '기타', icon: etc },
]

const selectedAlcohol = ref(null)

const selectAlcohol = (key) => {
  selectedAlcohol.value = key
}
</script>

<style scoped>
.rounge-header {
  text-align: center;
  padding: 24px 16px 8px;
  background: #fff7ec;
}
h1 {
  font-size: 36px;
  margin: 0 0 18px;
  color: #2b1f14;
}
.search-wrap {
  position: relative;
  height: 70px;
  max-width: 661px;
  width: 55%;
  margin: 8px auto 18px;
  background: #ffffff;
  border: 5px solid #f2d5a7;
  border-radius: 20px;
  box-sizing: border-box;
}
.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 19px;
  height: 18px;
  object-fit: contain;
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #333;
  padding-left: 60px;
  padding-right: 16px;
}
.search-input::placeholder {
  color: #8e8e8e;
}

.category-row {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin: 18px auto 10px;
  padding: 0 12px;
}
.alcohol-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}
.alcohol-element {
  width: 90px;
  height: 90px;
  border-radius: 9999px;
  border: 1px solid #bfbfbf;
  display: grid;
  place-items: center;
  background: #fff4e3;
}
.alcohol-element img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}
.alcohol-element.active {
  background-color: #f2dcb9;
  border-color: #bfbfbf;
}
.alcohol-btn:hover .alcohol-element {
  background-color: #f2dcb9;
}
.alcohol-label {
  font-size: 14px;
  font-weight: 400;
  color: #2d2d2f;
}
</style>