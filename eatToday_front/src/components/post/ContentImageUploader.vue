<template>
  <div class="wrap">
    <div class="toolbar">
      <input ref="multi" type="file" accept="image/*" multiple hidden @change="onPick" />
      <button type="button" class="pick" @click="$refs.multi.click()">＋ 본문 이미지</button>
      <small class="hint">여러 장 선택 가능</small>
    </div>

    <div v-if="items.length" class="grid">
      <div v-for="(it,idx) in items" :key="idx" class="cell">
        <img :src="it.url" alt="" />
        <div class="btns">
          <button @click="$emit('insert', it.url)">본문에 삽입</button>
          <button class="danger" @click="remove(idx)">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"ContentImageUploader",
  emits:["files","insert"],
  data:()=>({ items:[] }),
  methods:{
    onPick(e){
      const files = Array.from(e.target.files || []);
      const mapped = files.map(f=>({ file:f, url:URL.createObjectURL(f) }));
      this.items.push(...mapped);
      this.emitFiles();
    },
    remove(i){
      this.items.splice(i,1);
      this.emitFiles();
    },
    emitFiles(){
      // 부모로 실제 File[] 전달
      this.$emit("files", this.items.map(i=>i.file));
    }
  }
};
</script>

<style scoped>
.wrap{margin:10px 0 6px}
.toolbar{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.pick{border:1px dashed #cdbfae;background:#fff;padding:6px 10px;border-radius:10px;cursor:pointer}
.hint{color:#8a7d6d}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.cell{background:#f7f2e9;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.05)}
.cell img{display:block;width:100%;height:130px;object-fit:cover}
.btns{display:flex;justify-content:space-between;gap:6px;padding:8px}
.btns button{flex:1;border:none;background:#111;color:#fff;padding:6px;border-radius:8px;cursor:pointer}
.btns .danger{background:#d64545}
</style>
