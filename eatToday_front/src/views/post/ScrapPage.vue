<template>
  <div class="wrap">
    <h1 class="page-title">스크랩</h1>

    <!-- 검색 -->
    <div class="search">
      <input
        v-model.trim="q"
        class="inp"
        placeholder="게시물 제목 또는 관련어 검색"
        @input="persistUi"
      />
      <button class="btn">검색</button>
    </div>

    <!-- ✅ 선택 액션 바: 폴더/아이템 동시 관리 -->
    <div class="actions" v-if="selectedIds.size || selectedFolderNames.length">
      <span class="sel-info">
        폴더 {{ selectedFolderNames.length }}개 · 항목 {{ selectedIds.size }}개 선택
      </span>
      <button class="danger" @click="deleteSelectedAll">선택 삭제</button>
      <button class="ghost" @click="clearSelectionAll">선택 해제</button>
    </div>

    <section class="panel">
      <!-- 상단 탭 -->
      <div class="pills">
        <button
          v-for="f in folderList"
          :key="f.name"
          class="pill"
          :class="{ on: activeFolder===f.name }"
          @click="selectFromPill(f.name)"
        >
          {{ f.name }} <span class="cnt">({{ f.count }})</span>
        </button>
      </div>

      <!-- 폴더 트리 -->
      <ScrapFolderList
        :folders="folderList"
        :active="activeFolder"
        :expanded="expanded"
        :selected-folders="selectedFolderNames"
        @select="selectFolder"
        @toggle="toggleExpand"
        @toggleFolderSelect="toggleFolderSelect"
      >
        <template #content="{ folder }">
          <div v-if="expanded[folder]" class="folder-grid">
            <ScrapCard
              v-for="it in itemsOfFolder(folder)"
              :key="it.id"
              :item="it"
              :selectable="true"
              :selected="selectedIds.has(it.id)"
              @open="openPost"
              @toggle="toggleSelect"
              @delete="deleteOne"
            />
          </div>
        </template>
      </ScrapFolderList>

      <!-- 새 폴더 추가 -->
      <div class="new-folder">
        <h3 class="sec">새 폴더 추가</h3>
        <input
          v-model.trim="newFolderName"
          class="inp small"
          placeholder="폴더명"
          @keyup.enter="addFolder"
        />
        <button class="add" @click="addFolder"><span class="plus">＋</span>추가</button>
      </div>
    </section>
  </div>
</template>

<script>
import ScrapFolderList from "@/components/post/ScrapFolderList.vue";
import ScrapCard from "@/components/post/ScrapCard.vue";

const SCRAPS_KEY  = "scraps";
const FOLDERS_KEY = "scrap_folders";
const UIKEY       = "scraps_ui";

export default {
  name: "ScrapPage",
  components: { ScrapFolderList, ScrapCard },
  data() {
    return {
      scraps: [],
      folders: [],
      q: "",
      activeFolder: "전체",
      expanded: { 전체: true },
      newFolderName: "",
      selectedIds: new Set(),        // ✅ 선택된 스크랩 항목 ID들
      selectedFolderNames: [],       // ✅ 선택된 폴더 이름들
    };
  },
  computed: {
    folderList() {
      const names = new Set(this.folders);
      this.scraps.forEach(s => names.add(s.folder || "기본"));
      const list = ["전체", ...Array.from(names).filter(n => n !== "전체")];

      const count = {};
      list.forEach(n => (count[n] = 0));
      this.scraps.forEach(s => {
        const f = s.folder || "기본";
        count[f] = (count[f] || 0) + 1;
        count["전체"] = (count["전체"] || 0) + 1;
      });

      return list.map(name => ({ name, count: count[name] || 0 }));
    },
  },
  mounted() {
    this.load();
    // 레거시 마이그레이션
    try {
      const legacy = JSON.parse(localStorage.getItem('food_scraps') || '[]');
      if (Array.isArray(legacy) && legacy.length) {
        const curr = JSON.parse(localStorage.getItem(SCRAPS_KEY) || '[]');
        const all = [...legacy, ...curr].reduce((acc, it) => {
          if (!acc.find(x => x.postId === it.postId)) acc.push(it);
          return acc;
        }, []);
        localStorage.setItem(SCRAPS_KEY, JSON.stringify(all));
        this.scraps = all;
        localStorage.removeItem('food_scraps');
      }
    } catch {}

    // UI 복원
    try {
      const ui = JSON.parse(localStorage.getItem(UIKEY) || "{}");
      this.q = ui.q || "";
      this.activeFolder = ui.activeFolder || "전체";
      if (ui.expanded) this.expanded = ui.expanded;
    } catch {}
  },
  methods: {
    load() {
      try { this.scraps  = JSON.parse(localStorage.getItem(SCRAPS_KEY)  || "[]"); } catch { this.scraps=[]; }
      try {
        const stored = JSON.parse(localStorage.getItem(FOLDERS_KEY) || "[]");
        this.folders = Array.isArray(stored) && stored.length
          ? stored
          : ["기본","소주 관련","내 취향 정리!!","인생조합!!"];
      } catch { this.folders = ["기본"]; }
    },
    persistUi() {
      localStorage.setItem(UIKEY, JSON.stringify({
        q: this.q, activeFolder: this.activeFolder, expanded: this.expanded
      }));
    },
    persistFolders() {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(this.folders));
    },
    persistScraps() {
      localStorage.setItem(SCRAPS_KEY, JSON.stringify(this.scraps));
    },

    /* ===== 폴더/탭/펼침 ===== */
    selectFromPill(name) {
      this.activeFolder = name;
      this.expanded = { ...this.expanded, [name]: true };
      this.persistUi();
    },
    selectFolder(name) {
      this.activeFolder = name;
      this.expanded = { ...this.expanded, [name]: true };
      this.persistUi();
    },
    toggleExpand(name) {
      this.expanded = { ...this.expanded, [name]: !this.expanded[name] };
      this.persistUi();
    },

    /* ===== 필터링 ===== */
    itemsOfFolder(name) {
      let arr = this.scraps.slice();
      if (name !== "전체") arr = arr.filter(s => (s.folder || "기본") === name);
      if (this.q) {
        const q = this.q.toLowerCase();
        arr = arr.filter(s =>
          (s.title||"").toLowerCase().includes(q) ||
          (s.memo||"").toLowerCase().includes(q) ||
          (s.tags||[]).join(",").toLowerCase().includes(q)
        );
      }
      return arr.sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
    },

    /* ===== 폴더 추가 ===== */
    addFolder() {
      const name = this.newFolderName.trim();
      if (!name) return alert("폴더명을 입력하세요.");
      if (name === "전체") return alert("'전체'는 사용할 수 없습니다.");
      if (this.folders.includes(name)) return alert("이미 존재하는 폴더입니다.");
      this.folders = [...this.folders, name];
      this.newFolderName = "";
      this.expanded = { ...this.expanded, [name]: true };
      this.activeFolder = name;
      this.persistFolders();
      this.persistUi();
    },

    /* ===== 폴더 선택/삭제 ===== */
    toggleFolderSelect(name) {
      if (name === '전체') return; // 전체는 선택 불가
      const arr = new Set(this.selectedFolderNames);
      if (arr.has(name)) arr.delete(name); else arr.add(name);
      this.selectedFolderNames = Array.from(arr);
    },

    deleteFolders(names) {
      if (!names.length) return;
      // 폴더별 포함 항목 ID 수집
      const idsInFolders = new Set(
        this.scraps.filter(s => names.includes(s.folder || "기본")).map(s => s.id)
      );
      const cntItems = idsInFolders.size;
      const ok = confirm(
        `선택한 폴더 ${names.length}개를 삭제할까요?\n해당 폴더 안의 ${cntItems}개 스크랩도 함께 삭제됩니다.`
      );
      if (!ok) return;

      // 1) 폴더 목록에서 제거
      this.folders = this.folders.filter(n => !names.includes(n));

      // 2) 해당 폴더 내 스크랩 제거
      this.scraps = this.scraps.filter(s => !names.includes(s.folder || "기본"));

      // 3) 선택/펼침/활성 폴더 정리
      const s = new Set(this.selectedIds);
      idsInFolders.forEach(id => s.delete(id));
      this.selectedIds = s;
      const exp = { ...this.expanded };
      names.forEach(n => delete exp[n]);
      this.expanded = exp;
      if (names.includes(this.activeFolder)) this.activeFolder = "전체";

      // 4) 영속화
      this.persistFolders();
      this.persistScraps();
      this.persistUi();
    },

    /* ===== 카드 선택/삭제 ===== */
    toggleSelect(id) {
      const s = new Set(this.selectedIds);
      if (s.has(id)) s.delete(id); else s.add(id);
      this.selectedIds = s;
    },
    clearSelectionAll() {
      this.selectedIds = new Set();
      this.selectedFolderNames = [];
    },
    deleteOne(id) {
      const it = this.scraps.find(s => s.id === id);
      const title = it?.title ? `\n「${it.title}」` : "";
      if (!confirm(`이 스크랩을 삭제할까요?${title}`)) return;

      this.scraps = this.scraps.filter(s => s.id !== id);
      this.persistScraps();
      const s = new Set(this.selectedIds); s.delete(id); this.selectedIds = s;
    },
    deleteSelectedAll() {
      const folderCnt = this.selectedFolderNames.length;
      const itemCnt   = this.selectedIds.size;
      if (!folderCnt && !itemCnt) return;

      // 폴더 먼저 삭제(포함 항목도 정리)
      if (folderCnt) this.deleteFolders(this.selectedFolderNames);

      // 남은 개별 항목 삭제
      if (itemCnt) {
        const ok = confirm(`선택한 항목 ${this.selectedIds.size}개를 삭제할까요?`);
        if (!ok) return;
        const toDelete = this.selectedIds;
        this.scraps = this.scraps.filter(s => !toDelete.has(s.id));
        this.persistScraps();
      }

      this.clearSelectionAll();
    },

    /* ===== 이동 ===== */
    openPost(id) {
      const it = this.scraps.find(s => s.id === id);
      if (it?.postId) this.$router.push(it.postId);
    },
  }
};
</script>

<style scoped>
:root{ --ink:#2b2b2b; --sub:#6a5d51; --line:#e6dccd; --pill:#efe7d9 }
.wrap{width:980px;margin:0 auto;padding:18px 0 32px;color:var(--ink)}
.page-title{font-size:26px;margin:6px 0 14px}
.search{display:flex;justify-content:flex-end;gap:10px;margin:8px 0 10px}
.inp{width:360px;border:1px solid #d9d2c7;border-radius:10px;padding:8px 12px;background:#fff}
.inp.small{width:200px}
.btn{border:none;background:#111;color:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
.panel{border:1px solid var(--line);background:#f8f2e7;border-radius:14px;padding:14px 18px}

/* 선택 액션 바 */
.actions{
  display:flex;align-items:center;gap:10px;
  margin:8px 0 10px;padding:8px 10px;
  background:#fff7ea;border:1px solid #eadfcd;border-radius:10px
}
.sel-info{color:#6a5d51;font-weight:700}
.danger{border:none;background:#c62828;color:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
.ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}

/* 상단 탭 */
.pills{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 10px}
.pill{border:none;background:var(--pill);padding:8px 14px;border-radius:20px;cursor:pointer}
.pill.on{background:#111;color:#fff}
.pill .cnt{opacity:.75;margin-left:4px}

/* 폴더 콘텐츠 그리드 */
.folder-grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap:18px;
  padding:8px 0 10px 28px;
}
@media (max-width: 980px){ .folder-grid{grid-template-columns: repeat(2, minmax(0,1fr));} }
.new-folder{border-top:1px solid var(--line);margin-top:18px;padding-top:10px;display:flex;align-items:center;gap:10px}
.add{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
.plus{font-weight:700;margin-right:4px}
.sec{font-size:16px;margin:12px 0 10px}
</style>
