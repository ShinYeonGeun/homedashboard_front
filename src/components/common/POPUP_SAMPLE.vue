<template>
  <div>
    <!-- <v-btn @click="sendDataAndClose">Close with Data</v-btn> -->
    <!-- <v-text-field
    label="txt1"
    modelValue="txt">
    </v-text-field> -->
    
     <v-text-field 
  label="Enter your text"
  hide-details="auto"
></v-text-field>
  </div>
</template>

<script setup>
import { defineEmits, ref, defineExpose, shallowRef ,markRaw, onBeforeUnmount } from "vue";

 
const textFieldRef = shallowRef(null); // shallowRef로 텍스트 필드 참조
const inputValue = ref('');


// emits 선언
const emit = defineEmits(["close"]);

// 메서드 정의
const sendDataAndClose = () => {
  // txt.value = "123123123";
  emit("close", {asdas:'123'}); // 데이터 전달
};

const childFunction = () => {
  console.log("txt1111");
};
console.log('Child exposed functions:', childFunction);
defineExpose({
  childFunction, 
});
</script>
