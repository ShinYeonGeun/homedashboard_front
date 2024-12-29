<template>
  <v-snackbar
    v-model="isVisible"
    :timeout="timeout"
    :color="color"
    @click:close="handleClose"
  >
    {{ message }}
    <template v-slot:actions>
        <v-btn
          color="gray"
          variant="text"
          @click="handleClose"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";

// props 정의
const props = defineProps({
  message: { type: String, required: true },
  color: { type: String, default: "primary" },
  timeout: { type: Number, default: 3000 },
  modelValue: { type: Boolean, required: true },   // modelValue 받기
});

// emit 정의
const emit = defineEmits(["update:modelValue"]);

// local state로 isVisible 정의
const isVisible = ref(props.modelValue);

// watch를 사용하여 modelValue 값 변경 시 isVisible 업데이트
watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue;
  }
);

// 닫기 버튼 클릭 시 실행되는 함수
function handleClose() {
  isVisible.value = false;
  emit("update:modelValue", false);   // modelValue 값을 false로 업데이트하여 부모로 전달
}
</script>