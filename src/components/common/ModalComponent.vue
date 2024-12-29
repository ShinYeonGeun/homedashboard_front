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
        <component v-else :is="content"></component>
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

<script>
export default {
  name: "ModalComponent",
  props: {
    id: { type: String, required: true },
    showCloseBtn: {type: Boolean, default: true},
    title: { type: String, default: "" },
    content: { type: [String, Object], required: false },
    buttons: { type: Array, default: () => [] },
    btnAlign: { type: String, default: "center" },
    overlayClose: { type: Boolean, default: false },
    width: {type: Number, default: 400},
    height: {type: Number, default: 0},
    onClose: { type: Function, required: false },
    onOpen: { type: Function, required: false },
  },
  data() {
    return {
      visible: false,
      style:{}
    };
  },
  mounted() {
    this.open(); // 컴포넌트가 마운트되면 자동으로 열림
  },
  methods: {
    open() {
      this.visible = true;
      this.style.width = `${this.width}px`;
      
      if(this.height > 0) {
        this.style.height = `${this.height}px`;
      }

      if (this.onOpen) this.onOpen();
    },
    close() {
      this.visible = false;
      if (this.onClose) this.onClose();
    },
    handleOverlayClick() {
      if (this.overlayClose) this.close();
    },
    handleButtonClick(button) {
      if (button.onClick) button.onClick();
      if (button.close) this.close();
    },
  },
};
</script>

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
