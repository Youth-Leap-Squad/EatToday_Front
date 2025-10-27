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
import axios from "axios";

export default {
  name: "Albti_Result",
  data() {
    return {
      result: {}
    };
  },

  mounted() {
    // ✅ 설문 단계에서 이미 localStorage에 member_no 저장됨
    const memberNo = localStorage.getItem("member_no");

    // ✅ 로그인 토큰 요구 X / 프록시 경로 사용
    axios.get(`/albti/getalbtiresult?member_no=${memberNo}`)
      .then(res => {
        const data = res.data;

        this.result = {
          typeName: data.albti_dto.alBTI_category,
          description: data.albti_dto.alBTI_detail,
          recommendAlcohol: data.albti_output.alBTI_alcohol_explain,
          recommendFood: data.foodpost_dto.food_explain,
          imageUrl: data.foodpost_dto.food_picture // ✅ DB 경로 그대로
        };
      })
      .catch(err => {
        console.error("⚠️ 결과 조회 실패:", err);
        alert("결과를 불러오지 못했습니다.");
        this.$router.push("/event");
      });
  }
};
</script>

<style scoped>
/* ✅ CSS 그대로 유지 */
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
  padding: 16px 20px;
  margin-top: 10px;
  border: 2px solid #d9c9ac;
}

.label {
  margin-top: 5px;
  font-size: 1.8rem;
  color: #6b4b2c;
  margin-bottom: 4px;
  line-height: 1.2;
}

.value {
  margin-top: 10px;
  background: #76570D;
  color: white;
  padding: 8px 10px;
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