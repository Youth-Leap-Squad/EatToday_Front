<template>
  <div class="tree">
    <h3 class="title">스크랩 폴더</h3>

    <ul class="ul">
      <li v-for="f in folders" :key="f.name" class="row">
        <!-- 폴더 한 줄 -->
        <button
          class="folder"
          :class="{ active: active===f.name }"
          @click="$emit('select', f.name)"
        >
          <!-- 펼침 토글 -->
          <span class="caret" @click.stop="$emit('toggle', f.name)">
            <span :class="['tri', expanded[f.name] ? 'open' : '']"></span>
          </span>

          <!-- ✅ 선택 체크박스 -->
          <label class="chk" @click.stop>
            <input
              type="checkbox"
              :disabled="f.name==='전체' || f.name==='기본'"
              :checked="selectedFolders.includes(f.name)"
              @change="$emit('toggleFolderSelect', f.name)"
            />
            <span class="fake"></span>
          </label>

          <!-- 이름 + 갯수 -->
          <span class="name">{{ f.name }}</span>
          <span class="cnt">({{ f.count }})</span>
        </button>

        <!-- 펼친 콘텐츠 -->
        <div class="slot" v-if="expanded[f.name]">
          <slot name="content" :folder="f.name"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ScrapFolderList",
  props: {
    folders: { type: Array, default: () => [] },
    active: { type: String, default: "전체" },
    expanded: { type: Object, default: () => ({}) },
    selectedFolders: { type: Array, default: () => [] },
  },
  emits: ["select", "toggle", "toggleFolderSelect"],
};
</script>

<style scoped>
.title {
  font-size: 20px;
  margin: 6px 0 8px;
}
.ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.row {
  position: relative;
  padding: 6px 0 10px;
  border-bottom: 1px solid #efe5d6;
}
.row:last-child {
  border-bottom: 0;
}
.folder {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #2b2b2b;
  padding: 4px 4px;
  border-radius: 8px;
  width: 100%;
  text-align: left;
}
.folder.active {
  background: #fff3d8;
}
.caret {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
}
.tri {
  width: 0;
  height: 0;
  border-left: 6px solid #b3a79a;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  display: inline-block;
  transition: 0.2s;
}
.tri.open {
  transform: rotate(90deg);
}

/* ✅ 체크박스 */
.chk {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.chk input {
  appearance: none;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
}
.chk .fake {
  width: 16px;
  height: 16px;
  border: 1px solid #cdbfae;
  border-radius: 4px;
  background: #fff;
  display: inline-block;
}
.chk input:checked + .fake {
  background: #111;
  border-color: #111;
  box-shadow: inset 0 0 0 3px #fff;
}
.chk input:disabled + .fake {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 이름 */
.name {
  font-weight: 600;
}
.cnt {
  margin-left: 4px;
  color: #8a7d6d;
}
.slot {
  margin-left: 28px;
  margin-top: 8px;
}
</style>
