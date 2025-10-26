<template>
  <div class="wrap">
    <button class="scrap" :class="{ on: isScrapped }" @click="onClick">
      <span v-if="!isScrapped">📥 스크랩</span>
      <span v-else>✅ 스크랩됨</span>
    </button>

    <ScrapSelectModal
      :open="openSelect"
      :folders="folderOptions"
      :initialSelected="initialSelected"
      @close="openSelect=false"
      @add-folder="onAddFolder"
      @confirm="onConfirmSave"
    />
  </div>
</template>

<script>
import ScrapSelectModal from './ScrapSelectModal.vue';

const SCRAPS_KEY  = 'scraps';
const FOLDERS_KEY = 'scrap_folders';
const LAST_KEY    = 'scrap_last_folder';

export default {
  name: 'ScrapButton',
  components: { ScrapSelectModal },
  props: {
    modelValue: { type: Boolean, default: false },   // v-model
    postId: { type: String, required: true },        // 예: '/post/food/123'
    title: String,
    image: String,
    author: String,
    date: String,
    defaultFolder: { type: String, default: '기본' },
    tags: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue', 'saved', 'removed'],
  data() {
    return {
      isScrapped: !!this.modelValue,
      openSelect: false,
      folders: [],
      lastFolder: '',
      initialSelected: '',
    };
  },
  computed: {
    folderOptions() {
      const set = new Set(this.folders.length ? this.folders : ['기본']);
      if (this.defaultFolder) set.add(this.defaultFolder);
      return Array.from(set);
    },
  },
  mounted() {
    this.syncFromStorage();
    window.addEventListener('storage', this.syncFromStorage); // ✅ 다른 탭/새로고침 동기화
    document.addEventListener('visibilitychange', this.syncFromStorage);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncFromStorage);
    document.removeEventListener('visibilitychange', this.syncFromStorage);
  },
  watch: {
    modelValue(v){ this.isScrapped = !!v; },
    postId(){ this.syncFromStorage(); } // 라우트 변경 시 재동기화
  },
  methods: {
    readScraps() {
      try { return JSON.parse(localStorage.getItem(SCRAPS_KEY) || '[]'); }
      catch { return []; }
    },
    writeScraps(list) {
      localStorage.setItem(SCRAPS_KEY, JSON.stringify(list));
    },
    readFolders() {
      try { return JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]'); }
      catch { return []; }
    },
    writeFolders(list) {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(list));
    },
    syncFromStorage() {
      // 스크랩 상태 동기화
      const list = this.readScraps();
      const exists = list.some(s => s.postId === this.postId);
      this.isScrapped = exists;
      this.$emit('update:modelValue', exists);

      // 폴더/마지막 폴더 로드
      this.folders = this.readFolders();
      try { this.lastFolder = localStorage.getItem(LAST_KEY) || ''; } catch {}
    },

    onClick() {
      if (this.isScrapped) {
        if (confirm('스크랩을 해제할까요?')) {
          const list = this.readScraps().filter(s => s.postId !== this.postId);
          this.writeScraps(list);
          this.isScrapped = false;
          this.$emit('update:modelValue', false);
          this.$emit('removed');
        }
        return;
      }

      // 새 스크랩 → 모달 열기 (선택값: 마지막 폴더 > 기본 폴더)
      this.folders = this.readFolders();
      if (!this.folders.length) this.folders = ['기본'];
      this.initialSelected = this.lastFolder || this.defaultFolder || this.folders[0];
      this.openSelect = true;
    },

    // 모달: 새 폴더 추가 (저장은 하지 않음)
    onAddFolder(name) {
      const list = this.readFolders();
      if (!list.includes(name)) {
        list.push(name);
        this.writeFolders(list);
        this.folders = list.slice(); // 반응성
      }
      // 마지막 폴더 기억 (다음 기본 선택)
      localStorage.setItem(LAST_KEY, name);
      this.lastFolder = name;
    },

    // 모달: 저장 확정
    onConfirmSave(folder) {
      const f = folder || this.lastFolder || this.defaultFolder || '기본';
      let list = this.readScraps();

      // 중복 저장 방지
      if (!list.find(s => s.postId === this.postId)) {
        list.unshift({
          id: `scrap-${Date.now()}`,
          postId: this.postId,
          title: this.title || '',
          image: this.image || '',
          author: this.author || '',
          date: this.date || '',
          folder: f,
          tags: this.tags || [],
          savedAt: Date.now(),
        });
        this.writeScraps(list);
      }

      localStorage.setItem(LAST_KEY, f);
      this.lastFolder = f;

      this.isScrapped = true;
      this.$emit('update:modelValue', true);
      this.$emit('saved', { folder: f });

      this.openSelect = false;
    },
  }
};
</script>

<style scoped>
.wrap{display:inline-block}
.scrap{
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 14px;border-radius:12px;border:1px solid #ddd;
  background:#fff;cursor:pointer
}
.scrap.on{border-color:#111;background:#111;color:#fff}
</style>
