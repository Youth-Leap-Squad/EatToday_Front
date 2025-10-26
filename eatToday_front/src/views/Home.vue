<template>
  <div class="home">
    <section class="hero">
      <img class="main-img" :src="mainImg" alt="main" />
    </section>

    <section class="drink-section">
      <h2 class="title">Choose a drink</h2>
      <ul class="drink-grid">
        <li
          v-for="d in drinks"
          :key="d.label"
          class="drink-item"
          @mouseenter="hovered = d.label"
          @mouseleave="hovered = null"
        >
          <img
            class="drink-img"
            :src="hovered === d.label && d.hover ? d.hover : d.img"
            :alt="d.label"
          />
          <p class="drink-name">{{ d.label }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import mainImg from '@/assets/images/main.png'

import beer from '@/assets/images/alcohols/beer.png'
import soju from '@/assets/images/alcohols/soju.png'
import makgeolli from '@/assets/images/alcohols/makgeolli.png'
import champagne from '@/assets/images/alcohols/champagne.png'
import sake from '@/assets/images/alcohols/sake.png'
import highqualotyliquor from '@/assets/images/alcohols/highqualotyliquor.png'
import highball from '@/assets/images/alcohols/highball.png'
import wine from '@/assets/images/alcohols/wine.png'
import etc from '@/assets/images/alcohols/etc.png'

import chooseBeer from '@/assets/images/alcohols/chooseBeer.png'
import chooseSoju from '@/assets/images/alcohols/chooseSoju.png'
import chooseMakgeolli from '@/assets/images/alcohols/chooseMakgeolli.png'
import chooseChampagne from '@/assets/images/alcohols/chooseChampagne.png'
import chooseSake from '@/assets/images/alcohols/chooseSake.png'
import chooseHighqualityliquor from '@/assets/images/alcohols/chooseHighqualityliquor.png'
import chooseHighball from '@/assets/images/alcohols/chooseHighball.png'
import chooseWine from '@/assets/images/alcohols/chooseWine.png'

const drinks = [
  { label: '맥주', img: beer, hover: chooseBeer },
  { label: '소주', img: soju, hover: chooseSoju },
  { label: '막걸리', img: makgeolli, hover: chooseMakgeolli },
  { label: '샴페인', img: champagne, hover: chooseChampagne },
  { label: '사케', img: sake, hover: chooseSake },
  { label: '고량주', img: highqualotyliquor, hover: chooseHighqualityliquor },
  { label: '하이볼', img: highball, hover: chooseHighball },
  { label: '와인', img: wine, hover: chooseWine },
  { label: '기타', img: etc, hover: null }
]

const hovered = ref(null)
</script>

<style scoped>
.home {
  background: #fff7e9;
  display: flex;
  flex-direction: column;
}

.hero {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}

.main-img {
  width: 100%;
  display: block;
}

.drink-section {
  width: 90%;
  margin: 24px auto 60px;
  text-align: center;
  flex: 1 0 auto;
}

.title {
  font-size: 40px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
}
.drink-grid {
  display: grid;
  list-style: none;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px 8px;
  justify-items: center;
}

.drink-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drink-img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  margin-bottom: 8px;
}

.drink-name {
  font-size: 30px;
  font-weight: 600;
  color: #000000;
}
</style>