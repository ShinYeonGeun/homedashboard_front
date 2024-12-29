<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop :style="style">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button v-if="showCloseBtn" class="close-btn" @click="close">X</button>
      </header>
      <main class="modal-content">
        <!-- 문자열일 경우 -->
        <p v-if="typeof content === 'string'" v-html="content" class="p1"></p>
        <!-- 컴포넌트일 경우 -->
        <component v-else :is="content" 
          ref="contentComponent"
          v-bind="contentProps"
          @close="handleContentClose"></component>
      </main>
      <footer v-if="buttons && buttons.length" class="modal-footer" :class="btnAlign">
        <v-btn
          v-for="(button, index) in buttons"
          :key="index"
          v-bind="button.props"
          @click="handleButtonClick(button)"
        >
          {{ button.label }}
        </v-btn>
      </footer>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";

// Props 정의
const props = defineProps({
  id: { type: String, required: true },
  showCloseBtn: { type: Boolean, default: true },
  title: { type: String, default: "" },
  content: { type: [String, Object], required: false },
  contentProps: { type: Object, default: () => ({}) },
  buttons: { type: Array, default: () => [] },
  btnAlign: { type: String, default: "center" },
  overlayClose: { type: Boolean, default: false },
  width: { type: Number, default: 400 },
  height: { type: Number, default: 0 },
  onClose: { type: Function, required: false },
  onOpen: { type: Function, required: false },
});

// Reactive 상태
const visible = ref(false);
const style = ref({});
const contentComponent = ref(null);

// 컴포넌트 마운트 시 열기
onMounted(() => {
  open(); // 컴포넌트가 마운트되면 자동으로 열림
  console.log("onMounted", contentComponent);
});

// open 메서드
const open = () => {
  visible.value = true;
  style.value.width = `${props.width}px`;

  if (props.height > 0) {
    style.value.height = `${props.height}px`;
  }

  if (props.onOpen) props.onOpen();
};

// close 메서드
const close = (data = {}) => {
  visible.value = false;
  if (props.onClose) props.onClose(data);
  return data;
};

// 하위 컴포넌트에서 데이터를 받아 처리하는 메서드
const handleContentClose = (data) => {
  close(data);
};

// 오버레이 클릭 시 close 호출
const handleOverlayClick = () => {
  if (props.overlayClose) close();
};

// 버튼 클릭 시 처리
const handleButtonClick = (button) => {
  if (button.onClick) button.onClick();
  
   // execFunc 메서드가 존재하는지 확인하고 호출
   console.log("execFunc method", contentComponent.value?.[button.execFunc]);
  if (button.execFunc && contentComponent.value && typeof contentComponent.value[button.execFunc] === 'function') {
    contentComponent.value[button.execFunc](); // 하위 컴포넌트 메서드 호출
  }
  if (button.close) close();
};
</script>
// <script>
// export default {
//   name: "ModalComponent",
//   props: {
//     id: { type: String, required: true },
//     showCloseBtn: {type: Boolean, default: true},
//     title: { type: String, default: "" },
//     content: { type: [String, Object], required: false },
//     contentProps: { type: Object, default: () => ({}) }, // 추가
//     buttons: { type: Array, default: () => [] },
//     btnAlign: { type: String, default: "center" },
//     overlayClose: { type: Boolean, default: false },
//     width: {type: Number, default: 400},
//     height: {type: Number, default: 0},
//     onClose: { type: Function, required: false },
//     onOpen: { type: Function, required: false },
//   },
//   data() {
//     return {
//       visible: false,
//       style:{}
//     };
//   },
//   mounted() {
//     this.open(); // 컴포넌트가 마운트되면 자동으로 열림
//   },
//   methods: {
//     open() {
//       this.visible = true;
//       this.style.width = `${this.width}px`;
      
//       if(this.height > 0) {
//         this.style.height = `${this.height}px`;
//       }

//       if (this.onOpen) this.onOpen();
//     },
//     // close() {
//     //   this.visible = false;
//     //   if (this.onClose) this.onClose();
//     // },
//     close(data) {
//       // data는 호출한 쪽에서 전달받음
//       this.visible = false;
//       if (this.onClose) this.onClose(data); // 데이터를 onClose로 전달
//       return data;
//     },
//     handleContentClose(data) {
//       // 하위 컴포넌트에서 전달받은 데이터로 close 호출
//       this.close(data);
//     },
//     handleOverlayClick() {
//       if (this.overlayClose) this.close();
//     },
//     handleButtonClick(button) {
//       if (button.onClick) button.onClick();
//       if (button.close) this.close();
//     },
//   },
// };
// </script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  max-height: 100%;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.modal-footer {
  display: flex;
  gap: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.modal-footer.center {
  justify-content: center;
}
.modal-footer.left {
  justify-content: flex-start;
}
.modal-footer.right {
  justify-content: flex-end;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
