<template>
  <div class="about-page">
    <div class="content">
      <div class="content-box">
        <h1 class="page-title">프로젝트 소개</h1>
        
        <section class="section">
          <h2 class="section-title">🎉 '오늘 뭐랑?'에 오신 것을 환영합니다!</h2>
          <p class="section-text">
            '오늘 뭐랑?'은 술과 함께 즐기는 맛집 정보를 공유하는 커뮤니티 플랫폼입니다. 
            친구들과 함께 저녁을 즐길 때, 혹은 혼술을 즐기고 싶을 때 맛있는 음식과 잘 어울리는 술을 함께 찾아보세요.
          </p>
        </section>

        <section class="section">
          <h2 class="section-title">🍻 우리의 목표</h2>
          <p class="section-text">
            평범한 저녁을 특별하게 만들어주는 곳, '오늘 뭐랑?'에서는:
          </p>
          <ul class="feature-list">
            <li>✨ 맛있는 음식과 잘 어울리는 술의 궁합을 추천받아보세요</li>
            <li>🍽️ 다양한 맛집 정보를 카테고리별로 쉽게 찾아보세요</li>
            <li>👥 친구들과 맛집 정보를 공유하고 함께 추천을 받아보세요</li>
            <li>🎮 술BTI 테스트와 술 월드컵 등 재미있는 이벤트를 즐겨보세요</li>
          </ul>
        </section>

        <section class="section">
          <h2 class="section-title">🌟 주요 기능</h2>
          <div class="features-grid">
            <div class="feature-card">
              <h3>🍴 맛집 탐색</h3>
              <p>술안주 카테고리별로 맛집을 찾아보고, 리뷰를 확인하세요.</p>
            </div>
            <div class="feature-card">
              <h3>🤝 정보 공유</h3>
              <p>새로운 맛집을 발견했다면 커뮤니티에 공유해보세요.</p>
            </div>
            <div class="feature-card">
              <h3>🎯 맞춤 추천</h3>
              <p>술BTI 테스트를 통해 나에게 맞는 술과 음식을 추천받으세요.</p>
            </div>
            <div class="feature-card">
              <h3>🎮 재미있는 이벤트</h3>
              <p>술 월드컵으로 최애 술을 뽑아보는 재미있는 이벤트에 참여하세요.</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">💬 라운지</h2>
          <p class="section-text">
            자유롭게 맛집 정보를 공유하고, 술과 음식에 대한 이야기를 나눠보세요. 
            함께 만들어가는 맛집 커뮤니티입니다.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-page {
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
  margin-bottom: 40px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 16px;
}

.section-text {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 16px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.feature-list li {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 24px;
}

.feature-card {
  background: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  border-left: 4px solid #dabb8b;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

@media (max-width: 768px) {
  .features-grid {
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
