<template>
  <div class="ts" ref="root" :style="{ width }">
    <button
      class="ts-btn"
      type="button"
      @click="open = !open"
      @keydown.down.prevent="openListAndMove(1)"
      @keydown.up.prevent="openListAndMove(-1)"
      @keydown.enter.prevent="commitFocused"
    >
      <span class="ts-value">{{ labelOf(modelValue) || placeholder }}</span>
      <span class="ts-caret" :class="{ open }">▾</span>
    </button>

    <ul v-if="open" class="ts-list">
      <li
        v-for="(opt, i) in options"
        :key="opt.value"
        :class="['ts-item',{ focused: i === focused, selected: opt.value === modelValue }]"
        @mouseenter="focused=i"
        @mousedown.prevent="select(opt.value)"
      >
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ToggleSelect",
  props: {
    modelValue: [String, Number, null],
    options: { type: Array, required: true },
    placeholder: { type: String, default: "선택하세요" },
    width: { type: String, default: "320px" },
  },
  emits: ["update:modelValue"],
  data:()=>({ open:false, focused:0 }),
  mounted() { document.addEventListener("click", this.onDocClick); },
  beforeUnmount() { document.removeEventListener("click", this.onDocClick); },
  methods:{
    onDocClick(e){ if (!this.$refs.root?.contains(e.target)) this.open = false; },
    labelOf(v){ return this.options.find(o=>o.value===v)?.label || ""; },
    select(v){ this.$emit("update:modelValue", v); this.open=false; },
    openListAndMove(delta){
      if(!this.open) { this.open = true; return; }
      const n = this.options.length;
      this.focused = ((this.focused + delta)+n)%n;
    },
    commitFocused(){
      const opt = this.options[this.focused];
      if(opt) this.select(opt.value);
    }
  }
};
</script>

<style scoped>
.ts{position:relative}
.ts-btn{width:100%;height:38px;border-radius:10px;border:1px solid #d9d2c7;background:#fff;
  display:flex;align-items:center;justify-content:space-between;padding:0 12px;cursor:pointer;}
.ts-value{color:#2b2b2b}
.ts-caret{transition:transform .15s ease;opacity:.7}
.ts-caret.open{transform:rotate(180deg)}
.ts-list{position:absolute;top:42px;left:0;right:0;max-height:220px;overflow:auto;background:#fff;
  border:1px solid #d9d2c7;border-radius:10px;z-index:30;box-shadow:0 6px 24px rgba(0,0,0,.08);}
.ts-item{padding:10px 12px;cursor:pointer;font-size:14px;}
.ts-item.focused{background:#f7f2e9}
.ts-item.selected{font-weight:700}
</style>
