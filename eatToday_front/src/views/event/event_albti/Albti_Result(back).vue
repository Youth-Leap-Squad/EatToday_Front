<template>
  <div>
    <div class="wrapper">

      <h2>{{ result.typeName }}</h2>
      <p>{{ result.description }}</p>

      <p>🍷 추천 술: {{ result.recommendAlcohol }}</p>
      <p>🥩 어울리는 안주: {{ result.recommendFood }}</p>

      <img :src="result.imageUrl" class="result-img" alt="술BTI 결과 이미지" />

      <button class="button" @click="$router.push('/event')">확인</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Albti_Result",
  components: 0,
  data() {
    return {
    //   memberNo: localStorage.getItem("member_no"),            // 로그인 된 사용자 번호 자동 적용
      memberNo: 2,
      result: {} 
    };
  },
  mounted() {
    fetch(`http://localhost:17284/albti/getalbtiresult?member_no=${this.memberNo}`)    
      .then(res => res.json())
      .then(data => {
        this.result = data;
      });
  }
};
</script>



<style scoped>
/* 폰트만 살짝 적용 (기존 스타일 최대한 유지) */
.wrapper {
  font-family: "Ownglyph", sans-serif;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f6ead7;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.wrapper {
  background-color: #fdf6eb;
  width: 90%;
  max-width: 900px;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #6b4b2c;
  margin-bottom: 10px;
}

.divider {
  width: 80%;
  height: 2px;
  background-color: #d9c9ac;
  margin: 10px auto 30px auto;
}

.type {
  font-size: 2rem;
  font-weight: bold;
  color: #6b4b2c;
  margin-bottom: 8px;
}

.desc {
  font-size: 1rem;
  color: #8b5e3c;
  margin-bottom: 25px;
}

.info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.text-area {
  flex: 1;
  min-width: 250px;
}

.info-item {
  background-color: #fff8f0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
}

.info-item strong {
  display: block;
  color: #6b4b2c;
  margin-bottom: 5px;
}

.info-item span {
  background-color: #bca27b;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
}

.image-area img,
.result-img {
  width: 320px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.15);
}

.button {
  margin-top: 30px;
  background-color: #c1a978;
  color: #fff;
  border: none;
  padding: 12px 40px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}

.button:hover {
  background-color: #a88c5a;
}
</style>