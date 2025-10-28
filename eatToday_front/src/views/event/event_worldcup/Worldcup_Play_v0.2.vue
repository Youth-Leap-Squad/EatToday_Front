<!--
<template>
  <div class="wrapper">

    <div class="alcohol-box">
      <img :src="alcoholImage" class="alcohol-icon" />
      <span class="alcohol-name">{{ alcohol }}</span>
    </div>

    <h2 class="round-title">술안주 월드컵 {{ roundName }} 🍽️</h2>
    <p class="progress">{{ matchIndex + 1 }} / {{ totalMatches }}</p>

    <div class="match-box" v-if="!showModal">
      <div class="food-card" @click="selectWinner(currentPair[0])">
        <img :src="currentPair[0].image" />
        <p>{{ currentPair[0].name }}</p>
      </div>

      <div class="vs">VS</div>

      <div class="food-card" @click="selectWinner(currentPair[1])">
        <img :src="currentPair[1].image" />
        <p>{{ currentPair[1].name }}</p>
      </div>
    </div>

    <div class="modal-bg" v-if="showModal">
      <div class="modal">
        <h1 class="win-text">WIN 🏆</h1>
        <img :src="finalWinner.image" class="win-img">
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
    { name: "문어숙회", image: new URL("@/assets/images/food/octopus.jpg", import.meta.url).href }, ];
    
    const wineFoods = [ 
    { name: "회", image: new URL("@/assets/images/food/sashimi.jpg", import.meta.url).href },
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "브루케스타", image: new URL("@/assets/images/food/bruschetta.jpg", import.meta.url).href },
    { name: "감바스", image: new URL("@/assets/images/food/gambas.jpg", import.meta.url).href },
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href },
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "회무침", image: new URL("@/assets/images/food/hoemuchim.jpg", import.meta.url).href }, 
    { name: "치즈감바스", image: new URL("@/assets/images/food/cheesegambas.jpg", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href }, 
    { name: "수정", image: new URL("@/assets/images/food/맥주-Photoroom.png", import.meta.url).href } ];

    this.roundList = this.alcohol === "소주" ? sojuFoods : wineFoods;
    this.shuffle(this.roundList);
  },

  methods: {
    shuffle(arr) {
      arr.sort(() => Math.random() - 0.5);
    },

    async selectWinner(food) {
      this.nextRound.push(food);

      if (this.matchIndex + 1 >= this.totalMatches) {
        this.roundList = this.nextRound;
        this.nextRound = [];
        this.matchIndex = 0;

        if (this.roundList.length === 1) {
          this.finalWinner = food;
          this.showModal = true;

          const memberNo = Number(localStorage.getItem("member_no"));
          const worldcupNo = 1;
          const alcoholIdMap = { "소주": 2, "와인": 8 };
          const alcoholId = alcoholIdMap[this.alcohol];
          const foodId = food.id;

          try {
            await joinWorldcup(memberNo, worldcupNo, alcoholId, foodId);
            alert("🎉 월드컵 참여 완료!\n포인트가 지급되었습니다! (+30P)");
          } catch (err) {
            alert("⚠️ 이미 이번 주에 이 술로 참여하셨습니다!\n다른 술로는 참여할 수 있어요 😊");
          }
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
.wrapper { text-align: center; padding-top: 40px; font-family: "Ownglyph"; }
</style>
-->