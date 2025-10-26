<template>
  <div>
    <div class="header">
      <h1>Event</h1>
    </div>
    <div class="divider"></div>

    <div class="container">
      <!-- 술안주 월드컵 카드 -->
      <div class="card">
        <h2>술안주 월드컵 게임</h2>
        <p>당신의 취향을 알아볼까요?</p>
        <div>
          <img src="https://img.icons8.com/emoji/48/shrimp-emoji.png" alt="shrimp">
          <img src="https://img.icons8.com/emoji/48/pizza-emoji.png" alt="pizza">
          <img src="https://img.icons8.com/emoji/48/pancakes-emoji.png" alt="pancakes">
          <img src="https://img.icons8.com/emoji/48/pizza-emoji.png" alt="pizza">
        </div>
        <button>월드컵 게임 시작하기</button>
      </div>

      <!-- 술BTI 카드 -->
      <div class="card">
        <h2>나의 술BTI는?</h2>
        <p>술자리에서 나는 어떤 타입?</p>

        <div class="btitypes">
          <div class="type-item"><strong>활발함</strong><p>파티에서 분위기를 띄우는 타입</p></div>
          <div class="type-item"><strong>차분함</strong><p>조용히 술을 즐기는 타입</p></div>
          <div class="type-item"><strong>전통파</strong><p>한국 술을 선호하는 타입</p></div>
          <div class="type-item"><strong>도전적</strong><p>새로운 술을 시도하는 타입</p></div>
          <div class="type-item"><strong>감성파</strong><p>잔잔한 음악과 함께하는 타입</p></div>
          <div class="type-item"><strong>로맨틱</strong><p>분위기와 조화를 중시</p></div>
          <div class="type-item"><strong>정열파</strong><p>매운 안주와 강한 술 선호</p></div>
          <div class="type-item"><strong>힐링러</strong><p>편안한 한 잔</p></div>
          <div class="type-item"><strong>테이스팅 러버</strong><p>향미 분석을 즐기는 타입</p></div>
        </div>

        <button @click="$router.push('/event/event_albti')">술BTI 검사 시작하기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventHome"
};
</script>

<style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #fdf6e3;
    margin: 0;
    padding: 0;
  }

  /* 제목 영역 */
  .header {
    text-align: center;
    margin-top: 40px;
    color: #8b5e3c;
  }

  .header h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .divider {
    width: 80%;
    height: 2px;
    background-color: #e0d6c3;
    margin: 0 auto 30px auto;
    border-radius: 5px;
  }

  .container {
    max-width: 900px;
    margin: 0 auto 50px auto;
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .card {
    background-color: #fff8f0;
    border: 1px solid #e0d6c3;
    border-radius: 15px;
    padding: 20px;
    width: 45%;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    min-height: 450px; /* 버튼을 아래로 맞추기 위한 높이 */
  }

  .card img {
    width: 60px;
    margin: 10px;
  }

  .card h2 {
    font-size: 1.4rem;
    margin-bottom: 10px;
    color: #8b5e3c;
  }

  .card p {
    font-size: 0.9rem;
    color: #8b5e3c;
    margin-bottom: 15px;
  }

  .card button {
    background-color: #d4c1a3;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.2s;
    margin-top: auto;
  }

  .card button:hover {
    background-color: #c1a978;
  }

  /* BTI 타입 설명 스타일 */
  .btitypes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 15px;
  }

  .type-item {
    background-color: #f3e6d5;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
  }

  .type-item strong {
    font-size: 1.5rem;
    color: #6b4b2c;
    display: block;
  }

  .type-item p {
    font-size: 0.9rem;
    color: #8b5e3c;
    margin: 5px 0 0;
  }
</style>