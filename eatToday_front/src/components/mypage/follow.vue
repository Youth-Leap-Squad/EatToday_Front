<template>
    <div v-if="open" class="overlay" @click.self="$emit('close')">
      <div class="modal">
        <div class="head">
          <h3 class="title">{{ title }}</h3>
          <button class="close" @click="$emit('close')">
            <img :src="closeImg" alt="close" />
          </button>
        </div>
        <hr class="divider" />
        <ul class="list">
          <li v-for="u in users" :key="u" class="row">
            <div class="left">
              <img class="avatar" :src="userImg" alt="user" />
              <span class="name">{{ u }}</span>
            </div>
            <button class="follow-btn">팔로우</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import closeImg from '@/assets/images/closebutton.png'
  import userImg from '@/assets/images/photo_review/userexample.png'
  
  defineProps({
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    users: { type: Array, required: true }
  })
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.5);
    display: grid;
    place-items: center;
    z-index: 999;
  }
  .modal {
    width: 520px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,.2);
    overflow: hidden;
    border: 3px solid #000000;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 18px;
    position: relative;
    background: #ffffff;
  }
  .title {
    margin: 0;
    font-size: 20px;
    font-weight: 900;
    color: #000000;
    text-align: center;
  }
  .close {
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
  }
  .close img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .divider {
    border: none;
    border-top: 2px solid #000000;
    margin: 0;
  }
  .list {
    max-height: 420px;
    overflow: auto;
    padding: 10px 12px 14px;
    margin: 0;
    list-style: none;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 6px;
    border-radius: 10px;
  }
  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #000000;
    object-fit: cover;
  }
  .name {
    font-size: 20px;
    font-weight: 400;
    color: #000000;
  }
  .follow-btn {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    background: #D2B382;
    border: 1px solid #D2B382;
    color: #0D0C11;
  }
  </style>