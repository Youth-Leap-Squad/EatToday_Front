<template>
  <div class="c-wrap">
    <!-- 헤더 -->
    <h3 class="c-title">댓글 <span class="count">{{ comments.length }}</span></h3>

    <!-- 입력 박스 -->
    <div class="c-input">
      <div class="avatar">🙂</div>
      <div class="field">
        <div class="who">
          <span class="who-label">작성자</span>
        </div>
        <div class="compose">
          <input v-model="text" type="text" :placeholder="placeholder" @keyup.enter="submit" />
          <button class="btn-primary" @click="submit">등록</button>
        </div>
      </div>
    </div>

    <!-- 목록 -->
    <ul class="c-list">
      <li v-for="c in localComments" :key="c.id" class="c-row">
        <div class="c-top">
          <div class="meta" @click="$emit('go-user', c.writerId ?? c.memberNo ?? c.memberId)">
            <span class="author">회원#{{ c.writerId ?? '??' }}</span>
            <span v-if="c.isAuthor || (postAuthorNo && c.writerId === postAuthorNo)" class="badge-author">작성자</span>
            <span class="date">{{ c.date || '방금 전' }}</span>
          </div>

          <div class="actions">
            <template v-if="isMe(c)">
              <button class="pill" @click="startEdit(c)">수정</button>
              <button class="pill" @click="$emit('delete', c.id)">삭제</button>
            </template>
            <button class="pill warn" @click="onReport(c)">신고</button>
          </div>
        </div>

        <!-- 본문 / 편집 -->
        <div class="c-body" v-if="editId !== c.id">{{ c.text }}</div>
        <div class="c-edit" v-else>
          <textarea v-model="editText" rows="3" />
          <div class="edit-actions">
            <button class="btn-primary sm" @click="saveEdit(c)">저장</button>
            <button class="pill sm" @click="cancelEdit">취소</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CommentBox",
  props: {
    comments: { type: Array, default: () => [] },
    placeholder: { type: String, default: "댓글을 입력하세요" },
    currentUserNo: { type: [Number, String, null], default: null },
    postAuthorNo: { type: [Number, String, null], default: null },
  },
  emits: ["add", "update", "delete", "report", "go-user"],
  data() {
    return {
      text: "",
      localComments: [],
      editId: null,
      editText: "",
    };
  },
  watch: {
    comments: {
      immediate: true,
      handler(v) {
        this.localComments = (v || []).map(x => ({ ...x }));
      },
    },
  },
  methods: {
    submit() {
      const t = this.text?.trim();
      if (!t) return;
      this.$emit("add", t);
      this.text = "";
    },
    isMe(c) {
      if (this.currentUserNo == null) return true; // 권한 체크를 백엔드에 맡길 경우 항상 노출
      return String(c.writerId ?? "") === String(this.currentUserNo ?? "");
    },
    startEdit(c) {
      this.editId = c.id;
      this.editText = c.text || "";
    },
    cancelEdit() {
      this.editId = null;
      this.editText = "";
    },
    saveEdit(c) {
      const t = (this.editText || "").trim();
      if (!t) return alert("수정할 내용을 입력해주세요.");
      this.$emit("update", { id: c.id, text: t });
      this.cancelEdit();
    },
    onReport(c) {
      this.$emit("report", c);
      // 즉시 사용자 안내
      alert("신고 기능은 개발 중입니다.");
    },
  },
};
</script>

<style scoped>
/* 전체 래퍼 */
.c-wrap { border-top: 1px solid #efe7dc; padding-top: 16px; }

/* 제목 */
.c-title { font-size: 18px; margin: 0 0 12px; color: #3b332c; }
.c-title .count { font-weight: 700; }

/* 입력영역 */
.c-input {
  display: flex; gap: 12px;
  background: #faf6ee; border: 1px solid #efe7dc; border-radius: 16px;
  padding: 12px;
}
.avatar { width: 44px; height: 44px; border-radius: 50%; background: #fff; display:flex;align-items:center;justify-content:center; font-size: 22px; box-shadow: 0 1px 0 rgba(0,0,0,0.04); }
.field { flex: 1; }
.who { margin-bottom: 6px; }
.who-label { display:inline-block; font-size: 14px; color:#6f6257; font-weight:700; }
.compose { display: flex; gap: 8px; }
.compose input {
  flex: 1; border: 1px solid #e9dfd2; background: #fff;
  border-radius: 12px; outline: none; padding: 12px 14px; font-size: 14px;
}
.btn-primary {
  border: none; border-radius: 12px; padding: 12px 14px; cursor: pointer;
  background: #2f2a25; color: #fff; font-weight: 700;
}
.btn-primary.sm { padding: 8px 12px; border-radius: 10px; }

/* 리스트 */
.c-list { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.c-row {
  background: #f9f4ea; border: 1px solid #efe7dc; border-radius: 16px;
  padding: 14px 14px 12px;
}
.c-top { display:flex; align-items:center; justify-content:space-between; gap: 12px; }
.meta { font-size: 13px; color:#6f6257; display:flex; gap:8px; align-items:center; cursor:pointer; }
.author { font-weight: 700; color:#3a342d; }
.badge-author {
  background:#f2e6d5; color:#7a6448; border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight:700;
}
.date { color:#9a8f84; }

/* 액션 버튼(오른쪽) */
.actions { display:flex; gap:6px; }
.pill {
  background:#fff; border:1px solid #e9dfd2; border-radius:999px;
  padding:6px 10px; font-size:12px; cursor:pointer;
}
.pill.sm { padding:6px 10px; }
.pill.warn { background:#fff7f5; border-color:#f0d3cd; }

/* 본문/편집 */
.c-body { margin-top: 8px; white-space: pre-wrap; color:#3b332c; }
.c-edit { margin-top: 10px; }
.c-edit textarea {
  width: 100%; border: 1px solid #e9dfd2; border-radius: 12px; padding: 10px 12px; outline: none; resize: vertical;
  background:#fff;
}
.edit-actions { display:flex; gap:8px; margin-top:8px; }
</style>
