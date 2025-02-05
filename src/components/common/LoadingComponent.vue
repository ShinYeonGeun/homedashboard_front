<template>
  <div class="loading-overlay">
    <v-progress-circular
      indeterminate
      :color="localColor"
      :size="50"
      :width="4"
      :style="{ animationDuration: localSpeed + 's' }"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  speed: {
    type: Number,
    default: 0.8, // 애니메이션 속도 조정 (초 단위)
  },
});

const localColor = ref(props.color);
const localSpeed = ref(props.speed);

</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2); /* 옅은 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 우선순위 설정 */
}
</style>