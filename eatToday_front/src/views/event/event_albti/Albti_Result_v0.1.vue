<template>
  <div class="wrapper">

    <div class="title">나의 술BTI 결과 🍺</div>
    <div class="divider"></div>

    <h2 class="type">{{ result.typeName }}</h2>
    <p class="desc">{{ result.description }}</p>

    <div class="content-box">
      <div class="left-box">
        <div class="info-card">
          <p class="label">추천하는 술은</p>
          <div class="value">{{ result.recommendAlcohol }}</div>
        </div>

        <div class="info-card">
          <p class="label">어울리는 안주는</p>
          <div class="value">{{ result.recommendFood }}</div>
        </div>
      </div>

      <div class="right-box">
        <img :src="result.imageUrl" class="result-img" alt="술BTI 결과 이미지" />
      </div>
    </div>

    <button class="button" @click="$router.push('/event')">확인</button>
  </div>
</template>

<script>
export default {
  name: "Albti_Result",
  data() {
    return {
      result: {}
    };
  },
  mounted() {
    const type = this.$route.query.type;

    const data = {
    "활발함": {
        typeName: "활발한 술자리 메이커 🍻",
        description: "분위기를 주도하고 다 같이 즐거운 시간을 만드는 타입!",
        recommendAlcohol: "소맥 / 하이볼",
        recommendFood: "치킨 / 감자튀김",
        imageUrl: "https://i.imgur.com/Y1XGxWQ.png"
    },
    "차분함": {
        typeName: "조용히 음미하는 담백한 주당 🍷",
        description: "잔잔한 대화와 조용한 분위기를 좋아하는 타입!",
        recommendAlcohol: "와인 / 위스키",
        recommendFood: "스테이크 / 치즈 플래터",
        imageUrl: "https://i.imgur.com/8mX5bRM.png"
    },
    "전통파": {
        typeName: "한국 술 감성파 🍶",
        description: "막걸리나 소주에서 오는 편안함과 향수를 느끼는 타입!",
        recommendAlcohol: "소주 / 막걸리",
        recommendFood: "파전 / 두부김치",
        imageUrl: "https://i.imgur.com/hjBia5S.png"
    },
    "도전적": {
        typeName: "새로움을 찾아 떠나는 탐험가 🍾",
        description: "새로운 술과 조합을 두려워하지 않는 타입!",
        recommendAlcohol: "수제 맥주 / 칵테일",
        recommendFood: "이색 안주 / 퓨전 요리",
        imageUrl: "https://i.imgur.com/Ri7iP3j.png"
    },
    "감성파": {
        typeName: "분위기 + 감성 장인 ✨",
        description: "분위기와 감성적인 무드를 가장 중요하게 여기는 타입!",
        recommendAlcohol: "와인 / 청주",
        recommendFood: "살라미 / 치즈 플래터",
        imageUrl: "https://i.imgur.com/0lR3NjO.png"
    },
    "테이스팅러버": {
        typeName: "맛과 향의 소믈리에 🍷",
        description: "술의 향과 여운에 집중하는 섬세한 타입!",
        recommendAlcohol: "위스키 / 내추럴와인",
        recommendFood: "견과류 / 초콜릿",
        imageUrl: "https://i.imgur.com/DR3Q9ok.png"
    },
    "로맨틱": {
        typeName: "감성 + 무드형 🌹",
        description: "사람과 분위기의 조화를 가장 중시하는 타입!",
        recommendAlcohol: "와인 / 칵테일",
        recommendFood: "파스타 / 고르곤졸라 피자",
        imageUrl: "https://i.imgur.com/TmfYH5S.png"
    },
    "정열파": {
        typeName: "화끈하고 열정적인 주당 🔥",
        description: "강렬한 맛과 무드를 사랑하는 타입!",
        recommendAlcohol: "맥주 / 진 / 테킬라",
        recommendFood: "핫치킨 / 매운 안주",
        imageUrl: "https://i.imgur.com/VYkM5kS.png"
    },
    "힐링러": {
        typeName: "편안하게 여유를 즐기는 타입 🌙",
        description: "조용히 차분하게 편안한 술자리를 좋아하는 타입.",
        recommendAlcohol: "막걸리 / 와인",
        recommendFood: "과일 / 견과류",
        imageUrl: "https://i.imgur.com/tO6j9Ak.png"
    },
    "클래식": {
        typeName: "전통 조합 선호 스타일 🍜",
        description: "익숙한 맛과 조합에서 안정감을 느끼는 타입!",
        recommendAlcohol: "소주 / 청하 / 막걸리",
        recommendFood: "마른안주 / 계란말이 / 오뎅탕",
        imageUrl: "https://i.imgur.com/wBn6jHX.png"
    }
    };

    this.result = data[type] || {};
  }
};
</script>

<style scoped>
.wrapper {
  width: 90%;
  max-width: 1000px;
  margin: 60px auto;
  background-color: #fdf6eb;
  border-radius: 20px;
  padding: 50px 60px;
  text-align: center;
  font-family: "Ownglyph", sans-serif;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 25px;
  color: #6b4b2c;
}

.divider {
  width: 80%;
  height: 2px;
  background-color: #e0d6c3;
  margin: 0 auto 30px auto;
  border-radius: 5px;
}


.type {
  font-size: 2.6rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #6b4b2c;
}

.desc {
  font-size: 1.2rem;
  color: #8b5e3c;
  margin-bottom: 40px; 
}

.content-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.left-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 280px;
}

.info-card {
  background: #fff;
  border-radius: 15px;
  padding: 16px 20px;   /* 기존 20px → 14px 로 줄임 */
  margin-top: 10px;     /* 카드 전체를 조금 위로 올려줌 */
  border: 2px solid #d9c9ac;
}

.label {
  margin-top: 5px;   /* ✅ 텍스트를 위로 살짝 올림 */
  font-size: 1.8rem;
  color: #6b4b2c;
  margin-bottom: 4px;     /* 기존 8px → 4px */
  line-height: 1.2;       /* ✅ 글자 아래 여백 줄이기 */
}

.value {
  margin-top: 10px;        /* ✅ 아래 값을 약간만 떨어지게 조절 */
  background: #76570D;
  color: white;
  padding: 8px 10px;      /* 기존 12px → 8px */
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: bold;
}

.right-box img {
  width: 340px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.button {
  margin-top: 50px;
  background-color: #c1a978;
  color: #fff;
  border: none;
  padding: 12px 60px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: 0.2s;
}

.button:hover {
  background-color: #a88c5a;
}

</style>