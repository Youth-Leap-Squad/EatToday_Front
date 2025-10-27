<template>
  <teleport to="body">
    <div v-if="open" class="dim" @click.self="$emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="header">
          <h3>폴더 선택</h3>
          <button class="x" @click="$emit('close')" aria-label="닫기">✕</button>
        </header>

        <div class="body">
          <div class="sec-title">저장할 폴더</div>

          <div class="folder-list">
            <label
              v-for="f in folders"
              :key="f"
              class="row"
            >
              <input type="radio" name="folder" :value="f" v-model="selected" />
              <span class="name">{{ f }}</span>
            </label>
          </div>

          <div class="sec-title">새 폴더</div>
          <div class="new">
            <input
              v-model.trim="newFolder"
              class="inp"
              placeholder="새 폴더명 입력"
              @keyup.enter="addFolder"
            />
            <button class="btn" @click="addFolder">추가</button>
          </div>
        </div>

        <footer class="footer">
          <button class="ghost" @click="$emit('close')">취소</button>
          <button class="primary" :disabled="!selected" @click="confirm">저장</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'ScrapSelectModal',
  props: {
    open: { type: Boolean, default: false },
    folders: { type: Array, default: () => [] },
    initialSelected: { type: String, default: '' }, // 기본 선택값
  },
  emits: ['close', 'confirm', 'add-folder'],
  data() {
    return {
      selected: this.initialSelected || (this.folders[0] || '기본'),
      newFolder: '',
    };
  },
  watch: {
    open(v) {
      if (v) {
        this.selected = this.initialSelected || (this.folders[0] || '기본');
        this.newFolder = '';
      }
    },
    folders() {
      if (!this.selected && this.folders.length) {
        this.selected = this.folders[0];
      }
    },
  },
  methods: {
    addFolder() {
      const name = (this.newFolder || '').trim();
      if (!name) return;
      // ✅ 저장은 하지 않고, 상위에 "폴더 추가"만 알림
      this.$emit('add-folder', name);
      this.selected = name;   // 방금 만든 폴더를 선택 상태로
      this.newFolder = '';
    },
    confirm() {
      if (!this.selected) return;
      // ✅ 실제 저장은 상위 컴포넌트에서 수행
      this.$emit('confirm', this.selected);
    },
  },
};
</script>

<style scoped>
.dim{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal{width:420px;max-width:calc(100vw - 32px);background:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);overflow:hidden}
.header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #eee}
.header h3{font-size:18px;margin:0}
.x{border:none;background:transparent;font-size:18px;cursor:pointer}
.body{padding:14px 16px}
.sec-title{font-size:13px;color:#6b6258;margin:10px 0 6px}
.folder-list{max-height:240px;overflow:auto;border:1px solid #eee;border-radius:10px;padding:6px}
.row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;cursor:pointer}
.row:hover{background:#f7f5f1}
.name{font-size:14px}
.new{display:flex;gap:8px;margin-top:6px}
.inp{flex:1;border:1px solid #ddd;border-radius:10px;padding:8px 10px}
.btn{border:1px solid #ddd;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
.footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid #eee}
.ghost{border:1px solid #ddd;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
.primary{border:none;background:#111;color:#fff;border-radius:10px;padding:8px 14px;cursor:pointer}
.primary:disabled{opacity:.4;cursor:not-allowed}
</style>
