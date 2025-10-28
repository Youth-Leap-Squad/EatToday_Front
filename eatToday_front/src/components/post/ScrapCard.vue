<template>
  <div class="card" @click="$emit('open', item.id)">
    <div class="thumb-wrap">
      <img class="thumb" :src="item.image || item.cover" alt="" />
      <!-- 선택 체크박스 -->
      <label v-if="selectable" class="chk-wrap" @click.stop>
        <input type="checkbox" :checked="selected" @change="$emit('toggle', item.id)" />
        <span class="fake"></span>
      </label>
      <!-- 개별 삭제 버튼 -->
      <button class="del-btn" @click.stop="$emit('delete', item.id)">삭제</button>
    </div>
    <div class="cap">{{ item.title }}</div>
  </div>
</template>

<script>
export default {
  name:"ScrapCard",
  props:{
    item:{ type:Object, required:true },
    selectable:{ type:Boolean, default:true },
    selected:{ type:Boolean, default:false }
  },
  emits:["open","toggle","delete"]
};
</script>

<style scoped>
.card{
  background:#fff;border:1px solid #e6dccd;border-radius:12px;
  padding:8px;cursor:pointer;transition:.2s; position:relative;
}
.card:hover{background:#faf6ed}
.thumb-wrap{border-radius:10px;overflow:hidden; position:relative}
.thumb{width:100%;height:150px;object-fit:cover;display:block}
.cap{font-size:12px;color:#6f6257;margin-top:6px}

/* 체크박스 */
.chk-wrap{position:absolute;left:8px;top:8px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;z-index:1}
.chk-wrap input{appearance:none;width:0;height:0;margin:0;padding:0;outline:none;border:none}
.chk-wrap .fake{
  width:18px;height:18px;border:1px solid #d2c6b6;border-radius:4px;background:#fff;display:inline-block
}
.chk-wrap input:checked + .fake{background:#111;border-color:#111;box-shadow:inset 0 0 0 3px #fff}

/* 삭제 버튼 (hover 시 노출) */
.del-btn{
  position:absolute; right:8px; top:8px; z-index:1;
  border:none; background:rgba(0,0,0,.6); color:#fff; font-size:12px;
  padding:4px 8px; border-radius:8px; opacity:0; transition:.2s; cursor:pointer;
}
.card:hover .del-btn{ opacity:1 }
</style>
