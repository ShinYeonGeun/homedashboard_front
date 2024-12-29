<template>
  <div>
    <input v-model="inputValue" placeholder="Enter some data" />
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props 정의
const props = defineProps({
  modelValue: String,
});

// Emits 정의
const emit = defineEmits(["update:modelValue"]);

// Computed 사용하여 양방향 바인딩 처리
const inputValue = computed({
  get: () => props.modelValue, // props에서 modelValue 참조
  set: (value) => emit("update:modelValue", value),
});
</script>
