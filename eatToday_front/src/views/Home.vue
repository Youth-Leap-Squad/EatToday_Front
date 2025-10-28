<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <h1 class="eat-today">
        <span
          v-for="(ch, i) in letters"
          :key="i"
          class="letter"
          :style="{ '--i': i }"
        >
          {{ ch }}
        </span>
      </h1>

      <!-- 반짝이 -->
      <div class="sparkles">
        <span class="sparkle" style="--x: 15%; --y: 55%; --d: 0s;"></span>
        <span class="sparkle" style="--x: 35%; --y: 30%; --d: 0.1s;"></span>
        <span class="sparkle" style="--x: 60%; --y: 50%; --d: 0.2s;"></span>
        <span class="sparkle" style="--x: 80%; --y: 40%; --d: 0.25s;"></span>
      </div>

      <!-- 배경 이미지 -->
      <img class="main-img" :src="mainImg" alt="main" />
    </section>

    <!-- DRINK GRID -->
    <section class="drink-section">
      <h2 class="title">Choose a drink</h2>
      <ul class="drink-grid">
        <li
          v-for="d in drinks"
          :key="d.label"
          class="drink-item"
          @mouseenter="hovered = d.label"
          @mouseleave="hovered = null"
          @click="goDrink(d)"
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
import { ref } from "vue";
import { useRouter } from "vue-router";

import mainImg from "@/assets/images/main.png";

import beer from "@/assets/images/alcohols/beer.png";
import soju from "@/assets/images/alcohols/soju.png";
import makgeolli from "@/assets/images/alcohols/makgeolli.png";
import champagne from "@/assets/images/alcohols/champagne.png";
import sake from "@/assets/images/alcohols/sake.png";
import highqualotyliquor from "@/assets/images/alcohols/highqualotyliquor.png";
import highball from "@/assets/images/alcohols/highball.png";
import wine from "@/assets/images/alcohols/wine.png";
import etc from "@/assets/images/alcohols/etc.png";

import chooseBeer from "@/assets/images/alcohols/chooseBeer.png";
import chooseSoju from "@/assets/images/alcohols/chooseSoju.png";
import chooseMakgeolli from "@/assets/images/alcohols/chooseMakgeolli.png";
import chooseChampagne from "@/assets/images/alcohols/chooseChampagne.png";
import chooseSake from "@/assets/images/alcohols/chooseSake.png";
import chooseHighqualityliquor from "@/assets/images/alcohols/chooseHighqualityliquor.png";
import chooseHighball from "@/assets/images/alcohols/chooseHighball.png";
import chooseWine from "@/assets/images/alcohols/chooseWine.png";


const drinks = [
  { label: "맥주", img: beer, hover: chooseBeer, alcoholNo: 1 },
  { label: "소주", img: soju, hover: chooseSoju, alcoholNo: 2 },
  { label: "막걸리", img: makgeolli, hover: chooseMakgeolli, alcoholNo: 3 },
  { label: "샴페인", img: champagne, hover: chooseChampagne,alcoholNo: 4 }, 
  { label: "사케", img: sake, hover: chooseSake, alcoholNo: 5},        
  { label: "고량주", img: highqualotyliquor, hover: chooseHighqualityliquor, alcoholNo: 6},
  { label: "하이볼", img: highball, hover: chooseHighball, alcoholNo: 7},
  { label: "와인", img: wine, hover: chooseWine, alcoholNo: 8 },
  { label: "기타", img: etc, hover: null, alcoholNo: 9},
];

const hovered = ref(null);
const letters = "E A T       T O D A Y".split("");
const router = useRouter();

function goDrink(d) {
  if (d.alcoholNo) {
    // 라우터에 등록한 주종별 페이지로 이동: /alcohol/:id
    router.push({ name: "AlcoholList", params: { id: d.alcoholNo } }).then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    // 미지원 주종 클릭 시 동작 (원하면 안내 모달/토스트로 변경)
    console.warn(`아직 미지원 주종: ${d.label}`);
  }
}
</script>

<style scoped>
/* ================= HERO ================= */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;     /* 글씨 위, 이미지 아래 */
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  min-height: 100vh;
  height: auto;
  overflow: hidden;
  background: linear-gradient(180deg, #fff7e9 0%, #f8e5c3 50%, #fff7e9 100%);
  border-bottom: 1px solid #e0d3b4;
  padding: clamp(10px, 6vh, 60px) 16px 24px; 
}

/* 비율 유지 + 잘림 없음 */
.main-img {
  position: static;
  display: block;
  width: 105%;
  height: auto;
  object-fit: contain;
  max-width: 1600px;
  opacity: 0.9;
  z-index: 1;
  margin-top: -5vw;
}

/* 떨어지는 타이틀 */
.eat-today {
  position: relative;
  z-index: 2;
  display: inline-block;
  font-weight: 900;
  color: #111;
  text-align: center;
  letter-spacing: 0.2em;  
  word-spacing: 1em;     
  line-height: 1;
  margin-top: 0vw; 
}

@media (max-width: 768px) {
  .eat-today {
    margin-top: -4vw; 
  }
}

/* sparkles는 그대로 사용 가능 (absolute 오버레이) */
.sparkles { position: absolute; inset: 0; z-index: 3; pointer-events: none; }

.letter {
  display: inline-block;
  font-size: clamp(60px, 18vw, 220px); 
  opacity: 0;
  transform: translateY(-120%) scaleY(1.2);
  animation: drop-in 1s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards;
  animation-delay: calc(var(--i) * 0.07s);
}

@keyframes drop-in {
  0% {
    transform: translateY(-120%) scaleY(1.2);
    opacity: 0;
  }
  60% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
  }
  78% {
    transform: translateY(-10px) scaleY(0.98);
  }
  100% {
    transform: translateY(0) scaleY(1);
    opacity: 1; 
  }
}

/* 반짝이 효과 */
.sparkles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  transform: translate(-50%, -50%) scale(1);
  width: 20px;
  height: 20px;
  opacity: 0.9;
}

.sparkle::before,
.sparkle::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 3px;
  height: 20px;
  background: #fff;
  border-radius: 3px;
}
.sparkle::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.hero:hover .sparkle {
  animation: twinkle 1s ease-in-out var(--d) infinite alternate;
}

@keyframes twinkle {
  0% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.7;
  }
}

/* ================= DRINK SECTION ================= */
.home {
  background: #fff7e9;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 40px;
  font-weight: 600;
  color: #000;
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
}

.drink-section {
  width: 90%;
  margin: 40px auto 80px;
  text-align: center;
}

.drink-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 48px 24px; 
  justify-items: center;
  align-items: center;
}

.drink-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.drink-item:hover {
  transform: scale(1.05); 
}

/* 이미지 크기 확대 */
.drink-img {
  width: 280px;   
  height: 280px; 
  object-fit: contain;
  margin-bottom: 12px;
}

.drink-name {
  font-size: 40px;
  font-weight: 600;
  color: #000;
}

@media (max-width: 1024px) {
  .drink-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .drink-img {
    width: 240px;
    height: 240px;
  }
}

@media (max-width: 600px) {
  .drink-grid {
    grid-template-columns: 1fr;
  }
  .drink-img {
    width: 220px;
    height: 220px;
  }
}
</style>
