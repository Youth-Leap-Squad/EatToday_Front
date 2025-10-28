<template>
  <div>
    <div class="wrapper">
      <div class="title">나의 술BTI 검사 🍺</div>
      <div class="subtitle">당신의 술자리 성향을 선택해보세요.</div>

      <div class="progress">{{ currentIndex + 1 }} / {{ total }}</div>

      <div v-if="questions.length && questions[currentIndex]" class="question">
        {{ questions[currentIndex].question }}
      </div>

      <div v-if="questions.length && questions[currentIndex]">
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

    <!-- 포인트 획득 모달 -->
    <PointEarnedModal 
      :visible="showPointModal"
      :description="POINT_POLICY.ALBTI_PARTICIPATE.description"
      :points="POINT_POLICY.ALBTI_PARTICIPATE.points"
      @close="closePointModal"
      :auto-close="true"
      :auto-close-delay="2500"
    />
  </div>
</template>

<script>
import { getAlbtiSurveyList, submitAlbtiAnswers } from "@/api/albti"
import PointEarnedModal from '@/common/modal/PointEarnedModal.vue'
import { POINT_POLICY } from '@/common/constants/pointPolicy'

export default {
  name: "Albti_Survey",

  components: {
    PointEarnedModal
  },

  data() {
    return {
      currentIndex: 0,
      answersSelected: [],
      questions: [],
      total: 0,
      showPointModal: false,

      customAnswerTextsByQuestion: {
        1: { a: "시끌벅적한 술자리가 좋아! 🥳", b: "조용히 대화 나누는 분위기가 좋아 ☺️" },
        2: { a: "익숙한 술이 편안해 🍶", b: "새로운 술은 언제나 설레! 🍸" },
        3: { a: "잔잔한 음악과 함께 감성에 젖고 싶어 🎧", b: "신나는 비트로 텐션 업! 🔥" },
        4: { a: "편안하고 여유로운 분위기가 좋아 🌙", b: "감성적인 분위기와 설렘이 중요해 🌹" },
        5: { a: "맛과 향을 천천히 음미하고 싶어 🍷", b: "차분하게 조용히 즐기고 싶어 ☺️" },
        6: { a: "전통 조합이 제일 안정감 있어 👍", b: "새로운 조합도 재밌지! ✨" },
        7: { a: "게임으로 분위기 띄워보자! 🎉", b: "조용히 맛에 집중하고 싶어 😌" },
        8: { a: "새로운 조합은 언제나 환영! 🍽️", b: "역시 익숙한 맛이 최고지 🍜" },
        9: { a: "열정적으로 이야기 나누는게 좋아! 🔥", b: "잔잔하고 따뜻한 대화가 좋아 🌙" },
        10: { a: "조용히 깊은 대화가 좋아 ☺️", b: "편안하게 휴식하듯 마시고 싶어 💤" }
      }
    };
  },

  // // ✅ 로그인 안 되어 있으면 페이지 진입 차단
  // beforeMount() {
  //   if (!localStorage.getItem("token")) {
  //     alert("로그인이 필요한 서비스입니다.");
  //     this.$router.push("/login");
  //   }
  // },

  // ✅ 설문 목록 로딩
  async mounted() {
    try {
      const data = await getAlbtiSurveyList();
      this.questions = data.map(q => {
        const custom = this.customAnswerTextsByQuestion[q.albtiSurveyNo] ?? { a: "A", b: "B" };
        return {
          question: q.question,
          answers: [
            { text: custom.a, value: "A", surveyNo: q.albtiSurveyNo },
            { text: custom.b, value: "B", surveyNo: q.albtiSurveyNo }
          ]
        };
      });
      this.total = this.questions.length;
    } catch (err) {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
    }
  },

  methods: {
    // ✅ 답변 선택
    async selectAnswer(choiceValue) {
      const current = this.questions[this.currentIndex];
      if (!current) return;

      const surveyNo = current.answers[0].surveyNo;
      this.answersSelected.push({ albtiSurveyNo: surveyNo, choice: choiceValue });
      this.currentIndex++;

      // ✅ 모든 질문 종료 시 저장
      if (this.currentIndex >= this.total) {
        try {
          const memberNo = Number(localStorage.getItem("member_no"));
          const result = await submitAlbtiAnswers(memberNo, this.answersSelected);

          if (result.pointGranted) {
            // 포인트 모달 표시
            this.showPointModal = true
          } else {
            // 재참여 - 바로 결과 페이지로
            this.$router.push("/event/albti/result")
          }
        } catch (err) {
          alert("로그인이 필요합니다!");
          this.$router.push("/login");
        }
      }
    },

    goBack() {
      if (this.currentIndex === 0) return this.$router.push("/event");
      this.currentIndex--;
      this.answersSelected.pop();
    },

    closePointModal() {
      this.showPointModal = false
      this.$router.push("/event/albti/result")
    }
  }
};
</script>


<style scoped>
/* ✅ 스타일 그대로 유지 */
.wrapper {
  font-family: "Ownglyph", sans-serif;
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