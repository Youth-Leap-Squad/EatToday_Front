<template>
  <div class="wrapper">
    <div class="header">
      <img :src="alcoholImage" class="alcohol-icon" />
      <h2>{{ alcohol }} 주간 월드컵 게임 순위 🏆</h2>
    </div>

    <!-- 조회 기간 선택 -->
    <div class="week-select">
      <select v-model="selectedWeek">
        <option v-for="week in weeks" :key="week" :value="week">
          {{ week }}
        </option>
      </select>
    </div>

    <div class="divider"></div>

    <!-- 순위 테이블 -->
    <table class="rank-table">
      <thead>
        <tr>
          <th>순위</th>
          <th>안주명</th>
          <th>우승횟수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(food, index) in rankList" :key="food.name">
          <td>{{ index + 1 }}위</td>
          <td>{{ food.name }}</td>
          <td>{{ food.wins }}회</td>
        </tr>
      </tbody>
    </table>

    <button class="close-btn" @click="$router.push('/event/worldcup')">확인</button>
  </div>
</template>

<script>
export default {
  name: "Worldcup_Week",
  data() {
    return {
      alcohol: this.$route.query.alcohol || "소주",
      selectedWeek: "2025.10.20 ~ 2025.10.26",

      weeks: [
        "2025.10.20 ~ 2025.10.26",
        "2025.10.13 ~ 2025.10.19",
        "2025.10.06 ~ 2025.10.12"
      ],

      rankList: [
        { name: "회", wins: 12 },
        { name: "삼겹살", wins: 10 },
        { name: "닭발", wins: 8 },
        { name: "소고기 전골", wins: 7 },
        { name: "피자", wins: 5 }
      ]
    };
  },
    computed: {
    alcoholImage() {
        const alcoholImages = {
        "소주": new URL("@/assets/images/소주-Photoroom.png", import.meta.url).href,
        "와인": new URL("@/assets/images/와인-Photoroom.png", import.meta.url).href,
        "맥주": new URL("@/assets/images/맥주-Photoroom.png", import.meta.url).href,
        "막걸리": new URL("@/assets/images/막걸리-Photoroom.png", import.meta.url).href,
        "샴페인": new URL("@/assets/images/샴페인-Photoroom.png", import.meta.url).href,
        "사케": new URL("@/assets/images/사케-Photoroom.png", import.meta.url).href,
        "고량주": new URL("@/assets/images/고량주-Photoroom.png", import.meta.url).href,
        "하이볼": new URL("@/assets/images/하이볼-Photoroom.png", import.meta.url).href,
        "기타": new URL("@/assets/images/기타-Photoroom.png", import.meta.url).href,
        };

        return alcoholImages[this.alcohol] || "";
    }
    }
};
</script>

<style scoped>
.wrapper {
  width: 90%;
  max-width: 800px;
  margin: 60px auto;
  background-color: #fdf6eb;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  font-family: "Ownglyph", sans-serif;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.alcohol-icon {
  width: 55px;
}

.week-select {
  margin-top: 20px;
}
.week-select select {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #d5c4aa;
  background: white;
  font-size: 1rem;
  color: #6b4b2c;
}

.divider {
  width: 80%;
  height: 2px;
  background-color: #e0d6c3;
  margin: 20px auto;
  border-radius: 5px;
}

.rank-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.rank-table th,
.rank-table td {
  border-bottom: 1px solid #d9c9ac;
  padding: 12px;
  color: #6b4b2c;
  font-size: 1.1rem;
}

.close-btn {
  margin-top: 40px;
  background-color: #c1a978;
  color: #fff;
  border: none;
  padding: 12px 50px;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.25s;
}
.close-btn:hover {
  background-color: #a88c5a;
}
</style>