<template>
  <div class="comment-wrap">
    <div class="input">
      <input v-model="text" type="text" :placeholder="placeholder" @keyup.enter="submit"/>
      <button @click="submit">등록</button>
    </div>

    <ul class="list">
      <li v-for="c in comments" :key="c.id" class="row">
        <div class="meta">
          <span class="author">{{ c.author }}</span>
          <span class="date">{{ c.date }}</span>
        </div>
        <div class="body">{{ c.text }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CommentBox",
  props: {
    comments: { type: Array, default: () => [] },
    placeholder: { type: String, default: "댓글을 입력하세요" }
  },
  emits: ["add"],
  data:()=>({ text:"" }),
  methods:{
    submit(){
      const t = this.text?.trim();
      if(!t) return;
      this.$emit("add", t);
      this.text = "";
    }
  }
};
</script>

<style scoped>
.comment-wrap{border-top:1px solid #e7e0d5;margin-top:24px;padding-top:16px}
.input{display:flex;gap:8px;background:#faf7f0;border:1px solid #e7e0d5;border-radius:10px;padding:8px}
.input input{flex:1;border:none;background:transparent;outline:none;padding:8px}
.input button{padding:8px 12px;border:none;border-radius:8px;background:#111;color:#fff;cursor:pointer}
.list{margin-top:14px;display:flex;flex-direction:column;gap:14px}
.row{padding:12px 4px;border-bottom:1px dashed #eee}
.meta{font-size:12px;color:#7a6e5f;display:flex;gap:8px;margin-bottom:4px}
.author{font-weight:600;color:#3a342d}
.body{white-space:pre-wrap}
</style>
