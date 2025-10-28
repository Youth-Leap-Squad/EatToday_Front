<template>
  <div class="up" @dragover.prevent @drop.prevent="onDrop">
    <input ref="file" type="file" accept="image/*" @change="onFile" hidden />
    <!-- <button class="up-btn" type="button" @click="$refs.file.click()">＋ 대표 이미지</button> -->

    <div v-if="preview" class="preview">
      <img :src="preview" alt="preview" />
      <button class="rm" @click="clear">×</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageUploader",
  emits: ["file"],
  data:()=>({ preview:"", blob:null }),
  methods:{
    onFile(e){ this.setFile(e.target.files?.[0]); },
    onDrop(e){ this.setFile(e.dataTransfer.files?.[0]); },
    setFile(file){
      if(!file) return;
      this.blob = file;
      this.preview = URL.createObjectURL(file);
      this.$emit("file", file);
    },
    clear(){
      this.preview=""; this.blob=null; this.$emit("file", null);
    }
  }
};
</script>

<style scoped>
.up{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px}
.up-btn{border:1px dashed #cdbfae;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.preview{position:relative;width:360px;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:#f2ede5}
.preview img{width:100%;height:100%;object-fit:cover;display:block}
.rm{position:absolute;right:8px;top:8px;border:none;background:rgba(0,0,0,.6);color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer}
</style>
