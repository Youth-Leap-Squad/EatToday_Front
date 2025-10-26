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

    <section class="panel">
      <!-- 상단 탭: 아래 폴더 리스트와 동일 데이터 사용 -->
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

      <!-- 폴더 트리 + 펼침 콘텐츠 -->
      <ScrapFolderList
        :folders="folderList"
        :active="activeFolder"
        :expanded="expanded"
        @select="selectFolder"
        @toggle="toggleExpand"
        @remove="removeFolder"
      >
        <template #content="{ folder }">
          <div v-if="expanded[folder]" class="folder-grid">
            <ScrapCard
              v-for="it in itemsOfFolder(folder)"
              :key="it.id"
              :item="it"
              @open="openPost"
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
    };
  },
  computed: {
    // 상단/좌측 폴더가 공통으로 보는 단일 소스
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
    try { this.scraps = JSON.parse(localStorage.getItem(SCRAPS_KEY)  || "[]"); } catch {}
    try {
      const stored = JSON.parse(localStorage.getItem(FOLDERS_KEY) || "[]");
      this.folders = Array.isArray(stored) && stored.length
        ? stored
        : ["기본"];
    } catch { this.folders = ["기본"]; }

    // (선택) 레거시 키가 있다면 마이그레이션
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

    try {
      const ui = JSON.parse(localStorage.getItem(UIKEY) || "{}");
      this.q = ui.q || "";
      this.activeFolder = ui.activeFolder || "전체";
      if (ui.expanded) this.expanded = ui.expanded;
    } catch {}
  },
  methods: {
    persistUi() {
      localStorage.setItem(UIKEY, JSON.stringify({
        q: this.q, activeFolder: this.activeFolder, expanded: this.expanded
      }));
    },
    persistFolders() {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(this.folders));
    },

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
    removeFolder(name) {
      if (name === "전체" || name === "기본") return;
      if (!confirm(`'${name}' 폴더를 삭제할까요? (스크랩은 유지)`)) return;
      this.folders = this.folders.filter(n => n !== name);
      const { [name]: _, ...rest } = this.expanded;
      this.expanded = rest;
      if (this.activeFolder === name) this.activeFolder = "전체";
      this.persistFolders();
      this.persistUi();
    },

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

/* 상단 탭 - 폴더 리스트와 동기화 */
.pills{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 10px}
.pill{border:none;background:var(--pill);padding:8px 14px;border-radius:20px;cursor:pointer}
.pill.on{background:#111;color:#fff}
.pill .cnt{opacity:.75;margin-left:4px}

/* 펼쳐진 폴더 안 카드 그리드 */
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
