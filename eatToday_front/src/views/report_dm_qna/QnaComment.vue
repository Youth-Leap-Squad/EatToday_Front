<template>
    <div class="qna-comment">
      <div class="inner">
        <div class="card">
          <div class="card-title">
            <h2 class="title">문의사항</h2>
            <hr class="title-line" />
          </div>
  
          <div class="head">
            <div class="user">
              <img :src="userImg" alt="user" class="avatar" />
              <div class="meta">
                <div class="name">맹구망구</div>
                <div class="subject">이벤트 시작이 안됩니다 ㅡㅡ</div>
              </div>
            </div>
            <div class="date">2025.10.19</div>
          </div>
  
          <div class="body">
            <p>아니 이벤트 참여가 안되잖아요;;</p>
            <p>이벤트 참여 버튼 누르면 계속 렉걸리고 초기 화면으로 넘어와요</p>
            <p>빠른 조치 부탁드립니다;;</p>
          </div>
  
          <hr class="divider" />
  
          <div class="reply">
            <div class="reply-head">
              <div class="reply-title">
                <img :src="arrowImg" class="arrow-img" />
                <span class="label">답변</span>
              </div>
              <div class="reply-date">2025.10.19</div>
            </div>
            <div class="reply-meta">관리자</div>
            <div class="reply-body">
              <p>맹구망구님 죄송합니다...</p>
              <p>저희 사이트를 이용하면서 많은 불편을 느끼셨군요</p>
              <p>빠른 조치 하겠습니다..ㅠㅠ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import userImg from '@/assets/images/photo_review/userexample.png'
  import arrowImg from '@/assets/images/arrow.png'
  </script>
  
  <style scoped>
  .qna-comment {
    background: #FFF7E9;
    min-height: 100vh;
  }
  .inner {
    width: 86%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 22px 0 60px;
  }
  .card {
    background: #F3E7D5;
    border: 1px solid #E2D8C7;
    border-radius: 16px;
    padding: 22px 26px 28px;
  }
  .card-title {
    margin-bottom: 6px;
  }
  .title {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: #5B5B5B;
    margin-top: 20px;
  }
  .title-line {
    border: none;
    border-top: 1px solid #BFBFBF;
    margin: 10px 0 0 0;
  }
  .head {
    display: grid;
    grid-template-columns: 1fr 140px;
    align-items: center;
    column-gap: 12px;
    margin-top: 14px;
  }
  .user {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #E2D8C7;
    background: #fff;
  }
  .meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .name {
    font-size: 18px;
    font-weight: 800;
    color: #2B1F14;
  }
  .subject {
    font-size: 18px;
    font-weight: 800;
    color: #D2B382;
  }
  .date {
    justify-self: end;
    font-size: 15px;
    color: #2B1F14;
  }
  .body {
    margin: 16px 0 6px 58px;
    color: #3b3127;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.9;
  }
  .divider {
    border: none;
    border-top: 1px solid #BFBFBF;
    margin: 18px 0 0 0;
  }
  .reply {
    margin-top: 18px;
    background: transparent;
    border-radius: 12px;
    padding: 16px 6px 0 6px;
  }
  .reply-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 0 10px 8px 10px;
  }
  .reply-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .arrow-img {
    width: 18px;
    height: 18px;
  }
  .label {
    font-size: 18px;
    font-weight: 800;
    color: #2B1F14;
  }
  .reply-meta {
    margin-top: 18px;
    margin-left: 36px;
    font-size: 15px;
    font-weight: 800;
    color: #2B1F14;
    margin-bottom: 8px;
  }
  .reply-body {
    margin-left: 36px;
    color: #000;
    font-weight: 800;
    line-height: 1.9;
  }
  .reply-date {
    font-size: 14px;
    color: #2B1F14;
  }
  @media (max-width: 720px) {
    .head { grid-template-columns: 1fr auto; }
    .body { margin-left: 58px; font-size: 15px; }
    .reply-body { font-size: 15px; }
  }
  </style>