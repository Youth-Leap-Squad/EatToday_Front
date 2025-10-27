<template>
  <div class="field">
    <label v-if="label" class="label">{{ label }}</label>
    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      v-model="model"
      :maxlength="maxlength"
      :placeholder="placeholder"
      class="input"
      :rows="type === 'textarea' ? rows : undefined"
    />
    <div v-if="maxlength" class="count">{{ model.length }}/{{ maxlength }}</div>
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    type: { type: String, default: "text" },
    maxlength: { type: Number, default: null },
    rows: { type: Number, default: 4 }
  },
  emits: ["update:modelValue"],
  computed:{
    model:{
      get(){return this.modelValue || ""},
      set(v){this.$emit("update:modelValue",v)}
    }
  }
};
</script>

<style scoped>
.field{position:relative;margin-bottom:16px}
.label{display:block;margin-bottom:6px;font-weight:700;color:#3e352b}
.input{width:100%;padding:10px;border:1px solid #d9d2c7;border-radius:10px;background:#fff;resize:vertical}
.count{position:absolute;right:10px;bottom:6px;font-size:12px;color:#8a7d6d}
</style>
