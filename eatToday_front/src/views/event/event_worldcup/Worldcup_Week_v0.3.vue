<template>
  <div class="wrapper">
    <div class="header">
      <img :src="alcoholImage" class="alcohol-icon" />
      <h2>{{ alcohol }} 주간 월드컵 게임 순위 🏆</h2>
    </div>

    <!-- 조회 기간 선택 -->
    <div class="week-select">
        <select v-model="selectedWeek" @change="fetchRank">
            <option v-for="w in weeks" :key="w.value" :value="w.value">
                {{ w.label }}
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
import { getWorldcupRank } from "@/api/worldcup";

export default {
  name: "Worldcup_Week",
    data() {
    return {
        alcohol: this.$route.query.alcohol || "소주",

        // 화면에서 선택되는 값은 "날짜 문자열"
        selectedWeek: 2,    // "2025.10.27 ~ 2025.11.02"

        // UI에 표시용 + weekNo 매핑
        weeks: [
        { label: "2025.10.20 ~ 2025.10.26", value: 1 },
        { label: "2025.10.27 ~ 2025.11.02", value: 2 },
        { label: "2025.11.03 ~ 2025.11.09", value: 3 }
        ],

        rankList: []    // 백엔드에서 받아온 결과
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
  },
  // async created() {
    //   await this.fetchRank();
    // },
    
    // watch: {
      //   selectedWeek() {
        //     this.fetchRank();
        //   }
        // },
  mounted() {
    this.fetchRank();
  },
        
  methods: {
    async fetchRank() {
      // ✅ 프론트에서 사용중인 술 → DB alcoholNo 매핑
      const alcoholIdMap = { "소주": 2, "와인": 8 };
      const alcoholNo = alcoholIdMap[this.alcohol];
      const weekNo = this.selectedWeek;

      try {
        // ✅ 1️⃣ 백엔드 데이터 우선 가져오기
        const data = await getWorldcupRank(alcoholNo, weekNo);

        // ✅ 2️⃣ 백엔드 응답 구조 변환
        const baseRank = data.map((item) => ({
          name: item.worldcupeventfood?.worldcup_winning_food || item.name,
          wins: item.worldcupeventfood?.num_of_wins || item.wins || 0,
        }));

        // ✅ 3️⃣ localStorage에서 추가 반영
        const localKey = "worldcup_results";
        const localData = JSON.parse(localStorage.getItem(localKey)) || [];

        // 현재 주차 + 술 필터링
        const myLocalResults = localData.filter(
          (r) => r.weekNo === weekNo && r.alcohol === this.alcohol
        );

        // 로컬 데이터 순회하면서 baseRank에 반영
        myLocalResults.forEach((res) => {
          const found = baseRank.find((f) => f.name === res.winner);
          if (found) {
            found.wins += 1;
          } else {
            baseRank.push({ name: res.winner, wins: 1 });
          }
        });

        // ✅ 4️⃣ 순위 정렬
        this.rankList = baseRank.sort((a, b) => b.wins - a.wins);

        if (this.rankList.length === 0) {
          alert("⚠️ 아직 해당 주차의 순위 정보가 없습니다!");
        }
      } catch (e) {
        console.error(e);
        alert("순위 정보를 불러오는 중 오류가 발생했습니다.");
      }
    },
  },
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