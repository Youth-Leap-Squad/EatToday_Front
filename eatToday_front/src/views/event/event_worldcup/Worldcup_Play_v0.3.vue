<template>
  <div class="wrapper">

    <!-- ✅ 선택한 술 박스 -->
    <div class="alcohol-box">
      <img :src="alcoholImage" class="alcohol-icon" />
      <span class="alcohol-name">{{ alcohol }}</span>
    </div>
    <h2 class="round-title">술안주 월드컵 {{ roundName }} 🍽️</h2>

    <p class="progress">{{ matchIndex + 1 }} / {{ totalMatches }}</p>

    <div class="match-box" v-if="!showModal">
      <!-- 왼쪽 선택 -->
      <div class="food-card" @click="selectWinner(currentPair[0])">
        <img :src="currentPair[0].image" />
        <p>{{ currentPair[0].name }}</p>
      </div>

      <div class="vs">VS</div>

      <!-- 오른쪽 선택 -->
      <div class="food-card" @click="selectWinner(currentPair[1])">
        <img :src="currentPair[1].image" />
        <p>{{ currentPair[1].name }}</p>
      </div>
    </div>

    <!-- ✅ WIN 결과 모달 -->
    <div class="modal-bg" v-if="showModal">
      <div class="modal">
        <h1 class="win-text">WIN 🏆</h1>
        <img :src="finalWinner.image" class="win-img" />
        <p class="win-name">{{ finalWinner.name }}</p>
        <p class="win-desc">선택한 술과 당신의 빼이보릿 안주가 찰떡궁합이네요~!! 😋</p>

        <button class="again-btn" @click="goHome">다른 술로 월드컵 다시하기</button>
        <button class="rank-btn" @click="goRank">주간 월드컵 순위 조회하기</button>
      </div>
    </div>

    <div class="back-btn" @click="goBack">↩</div>
  </div>
</template>

<script>
import { joinWorldcup } from "@/api/worldcup";

export default {
  name: "Worldcup_Play",
  data() {
    return {
      alcohol: this.$route.query.alcohol,
      alcoholImage: null,
      roundList: [],
      nextRound: [],
      matchIndex: 0,
      showModal: false,
      finalWinner: null,

      // ✅ 음식 이름 → DB Food_id 매핑 (임시, 나중에 DB 값으로 교체)
      foodIdMap: {
        "삼겹살": 10,
        "매운닭꼬치": 33,
        "닭발": 1,
        "육회비빔밥": 4,
        "오징어볶음": 24,
        "소세지야채볶음": 26,
        "홍합탕": 27,
        "낙지볶음": 22,
        "오돌뼈": 3,
        "순대볶음": 20,
        "계란말이": 29,
        "골뱅이무침": 5,
        "김치찌개": 30,
        "두부김치": 16,
        "불족발": 6,
        "문어숙회": 12,

        "회": 18,
        "브루케스타": 38,
        "감바스": 2,
        "회무침": 34,
        "치즈감바스": 36,
        "수정1":206,
        "수정2":207,
        "수정3":208,
        "수정4":209,
        "수정5":210,
        "수정6":211,
        "수정7":212,
        "수정8":213,
        "수정9":214,
        "수정10":215,
        "수정11":216
      }
    };
  },

  computed: {
    currentPair() {
      if (this.roundList.length < 2) return [];
      return [
        this.roundList[this.matchIndex * 2],
        this.roundList[this.matchIndex * 2 + 1]
      ];
    },
    totalMatches() {
      return this.roundList.length / 2;
    },
    roundName() {
      const size = this.roundList.length;
      if (size === 16) return "16강";
      if (size === 8) return "8강";
      if (size === 4) return "4강";
      if (size === 2) return "결승전";
      return "";
    }
  },

  created() {
    const alcoholImages = {
      "소주": new URL("@/assets/images/소주-Photoroom.png", import.meta.url).href,
      "와인": new URL("@/assets/images/와인-Photoroom.png", import.meta.url).href
    };
    this.alcoholImage = alcoholImages[this.alcohol] || "";

    if (!["소주", "와인"].includes(this.alcohol)) {
      alert("현재는 소주와 와인만 월드컵 게임을 지원합니다 😊");
      this.$router.push("/event/worldcup");
      return;
    }

    const sojuFoods = [
      { name: "삼겹살", image: new URL("@/assets/images/food/samgyeopsal.jpg", import.meta.url).href },
      { name: "매운닭꼬치", image: new URL("@/assets/images/food/chickenskewer.jpg", import.meta.url).href },
      { name: "닭발", image: new URL("@/assets/images/food/chicken.jpg", import.meta.url).href },
      { name: "육회비빔밥", image: new URL("@/assets/images/food/yukhoe.jpg", import.meta.url).href },
      { name: "오징어볶음", image: new URL("@/assets/images/food/squid.jpg", import.meta.url).href },
      { name: "소세지야채볶음", image: new URL("@/assets/images/food/sausage.jpg", import.meta.url).href },
      { name: "홍합탕", image: new URL("@/assets/images/food/mussel.jpg", import.meta.url).href },
      { name: "낙지볶음", image: new URL("@/assets/images/food/nakji.jpg", import.meta.url).href },
      { name: "오돌뼈", image: new URL("@/assets/images/food/odol.jpg", import.meta.url).href },
      { name: "순대볶음", image: new URL("@/assets/images/food/soondae.jpg", import.meta.url).href },
      { name: "계란말이", image: new URL("@/assets/images/food/eggroll.jpg", import.meta.url).href },
      { name: "골뱅이무침", image: new URL("@/assets/images/food/golbaeng.jpg", import.meta.url).href },
      { name: "김치찌개", image: new URL("@/assets/images/food/kimchistew.jpg", import.meta.url).href },
      { name: "두부김치", image: new URL("@/assets/images/food/dubukimchi.jpg", import.meta.url).href },
      { name: "불족발", image: new URL("@/assets/images/food/jokbal.jpg", import.meta.url).href },
      { name: "문어숙회", image: new URL("@/assets/images/food/octopus.jpg", import.meta.url).href }
    ];

    const wineFoods = [
    { name: "회", image: new URL("@/assets/images/food/sashimi.jpg", import.meta.url).href },
    { name: "치즈감바스", image: new URL("@/assets/images/food/cheesegambas.jpg", import.meta.url).href }, 
    { name: "브루케스타", image: new URL("@/assets/images/food/bruschetta.jpg", import.meta.url).href },
    { name: "감바스", image: new URL("@/assets/images/food/gambas.jpg", import.meta.url).href },
    { name: "회무침", image: new URL("@/assets/images/food/hoemuchim.jpg", import.meta.url).href }, 
    { name: "수정1", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정2", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정3", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정4", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정5", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href },
    { name: "수정6", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정7", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정8", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정9", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정10", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정11", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href } ];

    this.roundList = this.alcohol === "소주" ? sojuFoods : wineFoods;
    this.shuffle(this.roundList);
  },

  methods: {
    shuffle(arr) {
      arr.sort(() => Math.random() - 0.5);
    },

    async selectWinner(food) {
      this.nextRound.push(food);
      // ✅ 이번 라운드의 매치가 끝났는지 확인
      if (this.matchIndex + 1 >= this.totalMatches) {
        // 다음 라운드로 넘어감
        this.roundList = this.nextRound;
        this.nextRound = [];
        this.matchIndex = 0;
        
        // 최종 우승자 결정
        if (this.roundList.length === 1) {
          this.finalWinner = food;
          this.showModal = true;

        // ✅ 로그인 체크 추가
        const token = localStorage.getItem("token");
        const memberNo = Number(localStorage.getItem("member_no"));
        if (!token || !memberNo) {
          alert("로그인이 필요한 기능입니다 😊");
          this.$router.push("/login");
          return;
        }

          // DB 저장 실행
          const worldcupNo = 2;                           // 지금은 2주차 고정, 나중에 자동 계산 넣을 수 있음
          const alcoholIdMap = { "소주": 2, "와인": 8 };
          const alcoholId = alcoholIdMap[this.alcohol];
          const foodId = this.foodIdMap[food.name];     // 일단 DB에 저장x


          try {
            await joinWorldcup(memberNo, worldcupNo, alcoholId, foodId);
            alert("🎉 참여 완료! 포인트 +30 지급되었습니다!");
          } catch (e) {
            console.warn("DB 저장 실패 (일시적 문제일 수 있음) → 그래도 UI 진행");
          }

          // ✅ 결과를 localStorage에 저장 → 주간순위 화면에서 반영됨
          const key = "worldcup_results";
          const stored = JSON.parse(localStorage.getItem(key)) || [];
          stored.push({
            weekNo: worldcupNo,
            alcohol: this.alcohol,
            winner: food.name,
            date: new Date().toISOString()
          });
          localStorage.setItem(key, JSON.stringify(stored));
          return;
        }
      } else {
        this.matchIndex++;
      }
    },

    goHome() {
      this.$router.push("/event/worldcup");
    },

    goBack() {
      if (this.matchIndex === 0 && this.nextRound.length === 0) {
        this.$router.push("/event/worldcup");
        return;
      }
      if (this.nextRound.length > 0) this.nextRound.pop();
      if (this.matchIndex > 0) this.matchIndex--;
    },

    goRank() {
      this.$router.push({
        path: "/event/worldcup/week",
        query: { alcohol: this.alcohol }
      });
    }
  }
};
</script>

<style scoped>
/* ✅ 스타일 그대로 유지 */
.wrapper { text-align: center; padding-top: 40px; font-family: "Ownglyph"; }

/* ✅ 선택한 술 박스 */
.alcohol-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff8f0;
  border: 2px solid #d8c6a4;
  border-radius: 12px;
  padding: 10px 18px;
  gap: 10px;
  margin: 0 auto 22px auto; /* 중앙 정렬 */
}

.alcohol-icon {
  width: 45px;
  height: 45px;
}

.alcohol-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #6b4b2c;
}

.round-title { font-size: 2rem; color:#6b4b2c; }
.progress { color:#8b6e4a; margin-bottom: 25px; }

.match-box { display:flex; justify-content:center; align-items:center; gap:40px; }

.food-card { background:#fff8f0; border-radius:15px; padding:12px; cursor:pointer; transition:.25s; }
.food-card:hover { transform:scale(1.05); box-shadow:0 4px 8px rgba(0,0,0,0.15); }
.food-card img { width:260px; border-radius:12px; }
.food-card p { margin-top:8px; font-size:1.3rem; color:#6b4b2c; }

.vs { font-size:2rem; font-weight:bold; color:#6b4b2c; }

.modal-bg { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index: 9999;   /* ✅ 추가 */; }
.modal { background:#fff8f0; padding:30px; border-radius:20px; text-align:center; width:450px; }
.win-text { font-size:3rem; color:#6b4b2c; margin-bottom:10px; }
.win-img { width:350px; border-radius:12px; margin-bottom:15px; }
.win-desc { color:#6b4b2c; margin-bottom:20px; }
.again-btn, .rank-btn { display:block; width:100%; padding:12px; margin-top:10px; background:#c1a978; color:white; border:none; border-radius:10px; cursor:pointer; }

.back-btn {
  position: absolute;
  bottom: 25px;
  left: 25px;
  font-size: 1.8rem;
  cursor: pointer;
  color: #6b4b2c;
  transition: 0.2s;
}
.back-btn:hover { transform: scale(1.15); }

.win-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #6b4b2c;
  margin-bottom: 10px;
}
</style>