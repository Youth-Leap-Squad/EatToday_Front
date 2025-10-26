<template>
  <div class="card" @click="$emit('open', item.id)">
    <div class="thumb-wrap">
      <img class="thumb" :src="item.image || item.cover" alt="" />
    </div>
    <div class="cap">{{ item.title }}</div>
  </div>
</template>

<script>
export default {
  name:"ScrapCard",
  props:{ item:{ type:Object, required:true }},
  emits:["open"]
};
</script>

<style scoped>
.card{
  background:#fff;border:1px solid #e6dccd;border-radius:12px;
  padding:8px;cursor:pointer;transition:.2s
}
.card:hover{background:#faf6ed}
.thumb-wrap{border-radius:10px;overflow:hidden}
.thumb{width:100%;height:150px;object-fit:cover;display:block}
.cap{font-size:12px;color:#6f6257;margin-top:6px}
</style>
