<template>
  <div class="tree">
    <h3 class="title">스크랩 폴더</h3>

    <ul class="ul">
      <li v-for="f in folders" :key="f.name" class="row">
        <button
          class="folder"
          :class="{ active: active===f.name }"
          @click="$emit('select', f.name)"
        >
          <span class="caret" @click.stop="$emit('toggle', f.name)">
            <span :class="['tri', expanded[f.name] ? 'open' : '']"></span>
          </span>
          <span class="box"></span>
          <span class="name">{{ f.name }}</span>
          <span class="cnt">({{ f.count }})</span>
        </button>

        <button
          v-if="f.name!=='전체'"
          class="del"
          @click="$emit('remove', f.name)"
        >삭제</button>

        <div class="slot" v-if="expanded[f.name]">
          <!-- slot prop 이름: folder -->
          <slot name="content" :folder="f.name"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:"ScrapFolderList",
  props:{
    folders:{ type:Array,  default:()=>[] },
    active:{  type:String, default:"전체" },
    expanded:{type:Object, default:()=>({}) },
  },
  emits:["select","toggle","remove"]
};
</script>

<style scoped>
.title{font-size:20px;margin:6px 0 8px}
.ul{list-style:none;margin:0;padding:0}
.row{position:relative;padding:6px 0 10px;border-bottom:1px solid #efe5d6}
.row:last-child{border-bottom:0}
.folder{display:flex;align-items:center;gap:8px;background:transparent;border:none;cursor:pointer;color:#2b2b2b;padding:4px 4px;border-radius:8px}
.folder.active{background:#fff3d8}
.caret{display:inline-flex;align-items:center;justify-content:center;width:18px}
.tri{width:0;height:0;border-left:6px solid #b3a79a;border-top:5px solid transparent;border-bottom:5px solid transparent;display:inline-block;transition:.2s}
.tri.open{transform:rotate(90deg)}
.box{width:14px;height:14px;border:1px solid #cdbfae;border-radius:3px;background:#fff}
.name{font-weight:600}
.cnt{margin-left:4px;color:#8a7d6d}
.del{position:absolute;right:0;top:6px;border:none;background:transparent;color:#b4a89c;cursor:pointer}
.slot{margin-left:28px;margin-top:8px}
</style>
