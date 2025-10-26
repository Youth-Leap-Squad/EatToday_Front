<template>
  <div>
    <div class="wrapper">
      <div class="title">나의 술BTI 검사 🍺</div>
      <div class="subtitle">당신의 술자리 성향을 선택해보세요.</div>

      <div class="progress">{{ currentIndex + 1 }} / {{ total }}</div>
      <div class="question">{{ questions[currentIndex].question }}</div>

      <div>
        <button
          v-for="(ans, i) in questions[currentIndex].answers"
          :key="i"
          class="btn"
          @click="selectAnswer(ans.value)"
        >
          {{ ans.text }}
        </button>
      </div>

      <div class="back-btn" @click="goBack">↩</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Albti_Survey",
  data() {
    return {
      currentIndex: 0,
      answersSelected: [], // ✅ 선택한 값 저장 (백엔드 X)

        questions: [
        { question: "술자리에서 나는?!", answers: [
            { text: "시끄럽고 활발한 분위기가 좋아!", value: "활발함" },
            { text: "조용하고 차분한 분위기가 좋아~", value: "차분함" }
        ]},
        { question: "새로운 술이 보이면?", answers: [
            { text: "일단 도전해봐야지!", value: "도전적" },
            { text: "늘 마시던 게 최고지.", value: "클래식" }
        ]},
        { question: "좋아하는 술 스타일은?", answers: [
            { text: "한국술(소주/막걸리)이 편안해", value: "전통파" },
            { text: "분위기 있는 와인이나 칵테일!", value: "감성파" }
        ]},
        { question: "술은 누구와 마시고 싶어?", answers: [
            { text: "많은 친구들과 함께!", value: "활발함" },
            { text: "가까운 사람 몇 명과 조용히", value: "차분함" }
        ]},
        { question: "술자리에 음악이 있다면?", answers: [
            { text: "신나는 댄스 음악!", value: "정열파" },
            { text: "잔잔한 재즈나 발라드", value: "감성파" }
        ]},
        { question: "안주는 어떤 스타일이 좋아?", answers: [
            { text: "매운 안주에 시원한 맥주!", value: "정열파" },
            { text: "익숙한 조합이 최고지 (치킨+소주)", value: "클래식" }
        ]},
        { question: "오늘 하루 기분은?", answers: [
            { text: "지치니까 힐링이 필요해", value: "힐링러" },
            { text: "스트레스 날릴 파티가 필요해!", value: "활발함" }
        ]},
        { question: "술을 고를 때 가장 중요하게 여기는 건?", answers: [
            { text: "향과 맛의 밸런스", value: "테이스팅러버" },
            { text: "기분 / 분위기", value: "감성파" }
        ]},
        { question: "술을 마실 때 나는?", answers: [
            { text: "대화의 중심에 있는 타입", value: "활발함" },
            { text: "조용히 듣는 타입", value: "차분함" }
        ]},
        { question: "다음 날 숙취는?", answers: [
            { text: "물 한 잔으로 회복 가능!", value: "도전적" },
            { text: "하루 종일 천천히 회복해야 해...", value: "힐링러" }
        ]}
        ],
      total: 10
    };
  },
  methods: {
    selectAnswer(value) {
      this.answersSelected.push(value);
      this.currentIndex++;

      if (this.currentIndex >= this.total) {
        // ✅ 가장 많이 선택된 성향 계산
        const result = this.getResultType();
        this.$router.push(`/event/albti/result?type=${result}`);
      }
    },

    // 가장 많이 나온 value 계산
    getResultType() {
      const freq = {};
      this.answersSelected.forEach(v => freq[v] = (freq[v] || 0) + 1);
      return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    },

    goBack() {
    // 첫번째 질문일 경우 → 이벤트 메인 화면으로 이동
    if (this.currentIndex === 0) {
        this.$router.push('/event');
        return;
    }

    // 그 외 → 설문 한 단계 되돌리기
    this.currentIndex--;
    this.answersSelected.pop();
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

.progress {
  background: #fff;
  display: inline-block;
  border: 2px solid #c7b8a3;
  padding: 8px 20px;
  border-radius: 10px;
  color: #6b4b2c;
  margin-bottom: 30px;
  font-size: 1rem;
}

.question {
  font-size: 1.6rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 30px;
}

.btn {
  width: 60%;
  padding: 16px;
  margin: 12px auto;
  background-color: #faeacf;
  border: none;
  border-radius: 18px;
  font-size: 1rem;
  color: #6b4b2c;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.back-btn {
  position: absolute;
  bottom: 25px;
  left: 25px;
  font-size: 1.8rem;
  cursor: pointer;
  color: #6b4b2c;
  transition: 0.2s;
}

.back-btn:hover {
  transform: scale(1.15);
}
</style>