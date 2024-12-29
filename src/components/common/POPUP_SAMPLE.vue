<template>
  <div>
    <v-btn @click="sendDataAndClose">Close with Data</v-btn>
    <!-- <v-text-field
            label="txt"
            v-model="txt">
    </v-text-field> -->
  </div>
</template>

<script setup>
import { defineEmits, ref, defineExpose, shallowRef  } from "vue";

// const txt = ref('');

// emits 선언
const emit = defineEmits(["close"]);

// 메서드 정의
const sendDataAndClose = () => {
  emit("close", { key: "value", anotherKey: 123 }); // 데이터 전달
};

const childFunction = () => {
  console.log("txt1111");
};

defineExpose({
  childFunction
});
</script>
