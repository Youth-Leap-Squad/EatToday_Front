<template>
  <div class="wrapper">
      <div class="title">나의 술BTI 검사 🍺</div>
      <div class="subtitle">당신의 술자리 성향을 선택해보세요.</div>
    <div class="divider"></div>

    <div class="alcohol-grid">
      <div 
        class="alcohol-card"
        v-for="item in alcoholList"
        :key="item.name"
        @click="selectAlcohol(item)"
        @mouseenter="item.isHover = true"
        @mouseleave="item.isHover = false"
      >
        <!-- ✅ 카드 hover 시 이미지 변경 -->
        <img :src="item.isHover ? item.hoverImage : item.image" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { checkWorldcupPlayed } from "@/api/worldcup";

export default {
  name: "Worldcup_Select",
  data() {
    return {
      alcoholList: [
        { name: "맥주", image: new URL("@/assets/images/맥주-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/맥주안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "소주", image: new URL("@/assets/images/소주-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/소주안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "막걸리", image: new URL("@/assets/images/막걸리-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/막걸리안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "샴페인", image: new URL("@/assets/images/샴페인-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/샴페인 안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "사케", image: new URL("@/assets/images/사케-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/사케안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "고량주", image: new URL("@/assets/images/고량주-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/고량주안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "하이볼", image: new URL("@/assets/images/하이볼-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/하이볼안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "와인", image: new URL("@/assets/images/와인-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/와인안주-Photoroom.png", import.meta.url).href, isHover:false },

        { name: "기타", image: new URL("@/assets/images/기타-Photoroom.png", import.meta.url).href,
          hoverImage:new URL("@/assets/images/기타-Photoroom.png", import.meta.url).href, isHover:false }
      ]
    };
  },
  methods: {
    async selectAlcohol(item) {
      const token = localStorage.getItem("token");
      const memberNo = Number(localStorage.getItem("member_no"));

      // ✅ 로그인 체크
      if (!token || !memberNo) {
        alert("로그인이 필요한 서비스입니다 😊");
        this.$router.push("/login");
        return;
      }

      const alcoholIdMap = { "소주": 2, "와인": 8 };
      const alcoholId = alcoholIdMap[item.name];

      // ✅ 지원 안되는 술 안내
      if (!alcoholId) {
        alert("현재는 소주와 와인만 월드컵 게임을 지원합니다 😊");
        return;
      }

      // ✅ 프론트 재참여 제한 로직 (localStorage 기반)
      const key = "worldcup_results";
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      const currentWeek = 2; // 👉 임시값, 나중에 백엔드로부터 주차 받아오면 자동화

      const alreadyPlayed = stored.some(
        (record) => record.weekNo === currentWeek && record.alcohol === item.name
      );

      if (alreadyPlayed) {
        alert("⚠️ 이미 이번 주에 이 술로 월드컵을 진행했습니다!\n다른 술로는 참여 가능해요 😊");
        return;
      }

      // ✅ 서버 중복 체크 (백엔드 정상 동작 시)
      try {
        await checkWorldcupPlayed(memberNo, alcoholId);
      } catch (err) {
        alert("⚠️ 이미 이번 주에 이 술로 월드컵을 진행했습니다!\n다른 술로는 참여 가능해요 😊");
        return;
      }

      // ✅ 통과 → 게임 시작
      this.$router.push({
        path: "/event/worldcup/play",
        query: { alcohol: item.name }
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Ownglyph", sans-serif; /* ✅ 폰트 적용 */
  background-color: #fdf6eb;
  width: 90%;
  max-width: 1000px;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin: 60px auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #6b4b2c;
}

.subtitle {
  font-size: 1.1rem;
  color: #a27a52;
  margin-bottom: 30px;
}
.divider {
  width: 80%;
  height: 2px;
  background-color: #e0d6c3;
  margin: 0 auto 30px auto;
  border-radius: 5px;
}
.alcohol-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 30px;
}
.alcohol-card {
  background: #F8ECD9;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.alcohol-card img {
  height: 80px;
  transition: 0.3s ease;
}
.alcohol-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.alcohol-card p {
  font-size: 1.4rem;
  font-weight: bold;
  color: #6b4b2c;
  margin-top: 10px;
}
</style>