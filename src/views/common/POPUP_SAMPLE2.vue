<script setup>
import { ref } from "vue";
  const test = () => {
    console.log("test");
  };

  //하위 컴포넌트를 상위로 전달
  defineExpose({
    test,
  });
</script>

<template>
      <div>aaaaaaa</div>
</template>
