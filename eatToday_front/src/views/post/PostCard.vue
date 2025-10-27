<template>
  <div class="card">
    <img :src="image" alt="post image" class="card-img" />
    <div class="card-content">
      <div class="author">
        <img :src="avatar" alt="author" class="avatar" />
        <span>{{ author }}</span>
      </div>
      <p class="text">{{ text }}</p>
      <div class="likes">❤️ {{ likes }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostCard",
  props: {
    image: String,
    author: String,
    avatar: String,
    text: String,
    likes: Number,
  },
};
</script>

<style scoped>
.card {
  width: 300px;
  background: #fdfaf4;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-content {
  padding: 12px;
}
.author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.text {
  margin: 6px 0;
  color: #333;
}
.likes {
  color: #c44;
  font-weight: 600;
  text-align: right;
}
</style>
