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

        <!-- ✅ 이미지 아이콘 교체 -->
        <div class="food-icons">
          <img :src="shrimpImg" class="side-icon" alt="shrimp" />
          <img :src="trophyImg" class="center-icon" alt="cup" />
          <img :src="pizzaImg" class="side-icon" alt="pizza" />


          <img :src="ramenImg" class="side-icon" alt="ramen" />
          <img :src="chickenImg" class="side-icon" alt="chicken" />
        </div>

        <!-- ✅ 라우터 이동 유지 -->
        <button @click="$router.push('/event/worldcup')">월드컵 게임 시작하기</button>
      </div>

        <!-- 술BTI 카드 -->
        <div class="card">
          <!-- ✅ 제목 + 요약 설명 버튼 -->
          <div class="title-area">
            <h2>나의 술BTI는?</h2>

            <div class="info-btn" @click="showModal = true">
              요약 설명
              <span>ⓘ</span> 
            </div>
          </div>        
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
          <div class="type-item classic"><strong>클래식</strong><p>전통 조합 선호</p></div>
        </div>

        <!-- ✅ 라우터 이동 유지 -->
        <!-- <button @click="$router.push('/event/event_albti')">술BTI 검사 시작하기</button> -->
        <button @click="$router.push('/event/albti/survey')">술BTI 검사 시작하기</button>
      </div>
    </div>


        <!-- ✅ 모달 -->
    <div class="modal-bg" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <h3>술BTI 유형 요약표</h3>
        <table>
          <thead>
            <tr>
              <th>타입</th>
              <th>키워드</th>
              <th>한줄요약</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>활발함</td><td>시끌, 밝음, 파티</td><td>분위기 메이커</td></tr>
            <tr><td>차분함</td><td>조용, 안정</td><td>조용히 음미하는 주당</td></tr>
            <tr><td>전통파</td><td>한국 술 선호</td><td>소주와 파전이 편안한 사람</td></tr>
            <tr><td>도전적</td><td>새로운 술 도전</td><td>새로운 술 먼저 시도하는 사람</td></tr>
            <tr><td>감성파</td><td>분위기 중요</td><td>음악 + 무드 중요</td></tr>
            <tr><td>로맨틱</td><td>분위기 + 감성</td><td>분위기 + 설렘 + 감정형</td></tr>
            <tr><td>정열파</td><td>강한 술 + 매운 음식</td><td>화끈 + 매운맛 + 강한 술</td></tr>
            <tr><td>힐링러</td><td>편안한 한 잔</td><td>조용히 쉬는 술자리</td></tr>
            <tr><td>테이스팅러버</td><td>향미, 분석</td><td>향미 깊게 분석하는 타입</td></tr>
            <tr><td>클래식</td><td>전통 조합 선호</td><td>가장 익숙한 조합을 사랑하는 타입</td></tr>
          </tbody>
        </table>

        <button class="close-btn" @click="showModal = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventHome",
  data() {
    return {
      showModal: false,
      shrimpImg: new URL("@/assets/icons/shrimp.png", import.meta.url).href,
      pizzaImg: new URL("@/assets/icons/pizza.png", import.meta.url).href,
      trophyImg: new URL("@/assets/icons/cup.png", import.meta.url).href,
      ramenImg: new URL("@/assets/icons/ramen.png", import.meta.url).href,
      chickenImg: new URL("@/assets/icons/chicken.png", import.meta.url).href
    };
  }
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

  .card h2,
  .title-area h2 {
    margin-top: 0;   /* 위 여백 없애기 */
    margin-bottom: 12px; /* 아래 여백 고정 */
  }

  .card {
  padding-top: 30px; /* ✅ 두 카드 제목 같은 위치로 정렬 */
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
    min-height: 60px; /* ✅ 카드 높이 통일 */
    display: flex;
    flex-direction: column;
    justify-content: center;
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

  /* ✅ 클래식만 가운데 정렬 */
  .classic {
    grid-column: 2;
  }

  /* ✅ 제목 & 요약 설명 버튼 배치 */
  .title-area {
    position: relative;
    text-align: center;
    margin-bottom: 8px;
  }

  .title-area h2 {
    margin: 0 auto;
    font-size: 1.4rem;
    color: #8b5e3c;
  }

  .info-btn {
    position: absolute;
    right: 0; /* ✅ 카드 오른쪽 정렬 */
    top: 50%; /* 제목 라인 중앙에 맞추기 */
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    gap: 4px;

    background: #ecd9ba;
    padding: 5px 9px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    color: #6b4b2c;
    transition: 0.2s;
  }

  .info-btn span {
    font-size: 1rem;
  }

  .info-btn:hover {
    background: #d6c2a0;
  }

  /* ====== (모달) 요약설명 아이콘 스타일 ====== */
  .title-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }

  .info-icon {
    cursor: pointer;
    font-size: 1.1rem;
    padding: 4px 6px;
    border-radius: 6px;
    background-color: #ecd9ba;
    transition: 0.2s;
  }
  .info-icon:hover {
    background-color: #d6c2a0;
  }

  /* ====== 모달 ====== */
  .modal-bg {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
  }

  .modal {
    background: #fff8f0;
    padding: 25px 35px;
    text-align: center;
    border-radius: 15px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    animation: fadeIn 0.25s ease;
    font-size: 1.2rem; /* ✅ 글자 크기 증가 */
    font-weight: bold; /* ✅ 강조감 추가 (선택) */
  }

  .modal table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
  }
  .modal th, .modal td {
    border-bottom: 1px solid #d9c9ac;
    padding: 8px;
    text-align: left;
    color: #6b4b2c;
    font-size: 0.95rem;
  }

  .close-btn {
    display: block;
    margin: 18px auto 0 auto; /* 가운데 정렬 */
    background-color: #c1a978;
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }
  .close-btn:hover {
    background-color: #a88c5a;
  }

  /* 모달 등장 애니메이션 */
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  .food-icons {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3열 */
    grid-template-rows: repeat(2, auto);  /* 2행 */
    justify-items: center;
    align-items: center;
    margin: 30px 0;
    row-gap: 35px;
    column-gap: 60px;
  }

  /* 중앙 컵 (정확히 1행 2열 위치 고정) */
  .center-icon {
    width: 150px;
    grid-column: 2;
    grid-row: 1;
  }

  /* 사이드 음식 */
  .side-icon {
    width: 90px;
  }

  /* 각 이미지 위치 명확히 지정 */
  .food-icons img:nth-child(1) { grid-column: 1; grid-row: 1; } /* shrimp */
  .food-icons img:nth-child(2) { grid-column: 2; grid-row: 1; } /* trophy */
  .food-icons img:nth-child(3) { grid-column: 3; grid-row: 1; } /* pizza */

  .food-icons img:nth-child(4) { grid-column: 1; grid-row: 2; } /* ramen */
  .food-icons img:nth-child(5) { grid-column: 3; grid-row: 2; } /* chicken */
</style>