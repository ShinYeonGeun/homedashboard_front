<script setup>
import { ref } from "vue";
  import POPUP from '@/components/common/POPUP_SAMPLE.vue'
  const component = ref(null);
  //하위 컴포넌트를 상위로 전달
  //modalComponent에선 view파일.value.component로 접근해서 함수 사용
  defineExpose({
    component,
  });
</script>

<template>
      <POPUP ref="component" />
</template>
