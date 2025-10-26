<template>
  <div class="terms-page">
    <div class="content">
      <div class="content-box">
        <h1 class="page-title">용어 설명</h1>
        
        <section class="section">
          <h2 class="section-title">📖 주요 용어</h2>
          <div class="terms-list">
            <div class="term-item">
              <h3 class="term-name">술BTI</h3>
              <p class="term-definition">
                "술 Beer Type Indicator"의 약자로, 여러 질문을 통해 자신의 술 성향을 분석하는 테스트입니다. 
                당신의 성격과 취향에 맞는 술을 추천해드립니다.
              </p>
            </div>

            <div class="term-item">
              <h3 class="term-name">술 월드컵</h3>
              <p class="term-definition">
                다양한 술들을 두 가지씩 비교하여 자신이 더 좋아하는 술을 선택해 최종적으로 최애 술을 찾는 게임입니다. 
                재미있게 당신만의 술 취향을 파악해보세요.
              </p>
            </div>

            <div class="term-item">
              <h3 class="term-name">라운지</h3>
              <p class="term-definition">
                사용자들이 자유롭게 맛집 정보를 공유하고, 술과 음식에 대한 이야기를 나누는 커뮤니티 공간입니다.
              </p>
            </div>

            <div class="term-item">
              <h3 class="term-name">술안주</h3>
              <p class="term-definition">
                술과 함께 먹는 음식을 말합니다. 각 술의 종류에 따라 어울리는 안주가 다르며, 
                우리 서비스에서는 이런 궁합을 추천해드립니다.
              </p>
            </div>

            <div class="term-item">
              <h3 class="term-name">스크랩</h3>
              <p class="term-definition">
                관심 있는 맛집 정보를 저장하여 나중에 쉽게 다시 볼 수 있는 기능입니다.
              </p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">🍺 술의 종류</h2>
          <div class="alcohol-types">
            <div class="type-card">
              <h3>맥주</h3>
              <p>가볍고 달콤한 맛으로 대중적인 술. 튀김류와 잘 어울림</p>
            </div>
            <div class="type-card">
              <h3>소주</h3>
              <p>한국의 대표 증류주. 구이류와 찜과 찰떡궁합</p>
            </div>
            <div class="type-card">
              <h3>막걸리</h3>
              <p>발효주로 부드러운 맛. 파전, 해물 등과 잘 어울림</p>
            </div>
            <div class="type-card">
              <h3>와인</h3>
              <p>레드/화이트 와인. 치즈, 파스타, 스테이크와 궁합</p>
            </div>
            <div class="type-card">
              <h3>고량주</h3>
              <p>중국 전통 증류주. 중국요리와 함께 즐김</p>
            </div>
            <div class="type-card">
              <h3>샴페인</h3>
              <p>경쾌한 탄산감. 디저트, 카나페와 어울림</p>
            </div>
            <div class="type-card">
              <h3>하이볼</h3>
              <p>위스키 베이스 칵테일. 가볍고 시원하게 즐길 수 있음</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">💡 꿀팁</h2>
          <ul class="tips-list">
            <li>🍻 안주와 술의 궁합을 잘 맞추면 더욱 맛있게 즐길 수 있습니다.</li>
            <li>🥂 적정량을 지켜 즐기시기 바랍니다.</li>
            <li>🍽️ 맛집 후기는 다른 사용자들에게 큰 도움이 됩니다.</li>
            <li>🤝 서로 예의를 지키며 커뮤니티를 함께 만들어가요!</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  background: #fafafa;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-box {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #3b2e1e;
  margin-bottom: 40px;
  text-align: center;
}

.section {
  margin-bottom: 50px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #dabb8b;
}

.terms-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.term-item {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #dabb8b;
}

.term-name {
  font-size: 18px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 12px;
}

.term-definition {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
  margin: 0;
}

.alcohol-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.type-card {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.type-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 8px;
}

.type-card p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  padding: 12px 0;
  padding-left: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.tips-list li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .alcohol-types {
    grid-template-columns: 1fr;
  }

  .content-box {
    padding: 24px;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
