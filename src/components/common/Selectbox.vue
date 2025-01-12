<template>
<!-- v-bind="$attrs"   부모에서 전달된 모든 속성 전달 -->
  <v-select
    v-bind="$attrs"  
    :model-value="selectedItem"  
    @update:modelValue="updateSelectedItem"
    :items="items"
  >
  <template v-slot:item="{ props, item }">
  <v-list-item v-bind="props">
    <div v-if="item" class="ps-3">
      <div v-if="formatter === 'k:v'">
        <!-- 포맷팅된 값을 title로 설정 -->
        <span>{{ item.value }} : {{ item.title }}</span>
      </div>
      <div v-else-if="formatter === 'v:k'">
        <span>{{ item.value }} : {{ item.title }}</span>
      </div>
      <div v-else-if="formatter === 'k-v'">
        <span>{{ item.title }} - {{ item.value }}</span>
      </div>
      <div v-else-if="formatter === 'v-k'">
        <span>{{ item.value }} - {{ item.title }}</span>
      </div>
      <div v-else>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </v-list-item>
</template>
    <!-- <template #item="{ item }">
      <div v-if="item" class="ps-3">
        <div v-if="formatter === 'k:v'">
            <span>{{ item.value }} : {{ item.title }}</span>
        </div>
        <div v-else-if="formatter === 'v:k'">
            <span>{{ item.value }} : {{ item.title }}</span>
        </div>
        <div v-else-if="formatter === 'k-v'">
            <span>{{ item.title }} - {{ item.value }}</span>
        </div>
        <div v-else-if="formatter === 'v-k'">
            <span>{{ item.value }} - {{ item.title }}</span>
        </div>
        <div v-else>
            <span>{{ item.value }}</span>
        </div>
      </div>
    </template> -->

    <!-- 선택된 값 커스터마이징 -->
    <template #selection="{ item }">
      <div v-if="item">
        <span>{{ item.title }} : {{ item.value }}</span>
      </div>
    </template>
  </v-select>
</template>
<script setup>
import { ref, defineProps, watch , onMounted} from 'vue';

// props 정의
const props = defineProps({
  formatter: {
    type: String,
    default: 'k:v',
  },
  items: {
    type: Array,
    required: true,
  },
});

// 선택된 항목을 저장하는 변수
const selectedItem = ref(null);
const title = ref('');

// modelValue가 변경되었을 때 호출되는 함수
watch(() => props.modelValue, (value) => {
  selectedItem.value = value;
});

// 선택된 항목을 업데이트하는 함수
const updateSelectedItem = (value) => {
  selectedItem.value = value;
};

// 컴포넌트가 마운트 되었을 때 실행되는 로직
onMounted(() => {
  console.log('컴포넌트가 마운트되었습니다');
});
</script>

// <script>
// export default {
//   name: 'Selectbox',
//   props: {
//     formatter: {
//       type: String,
//       default: "k:v",
//     },
//     items: {
//       type: Array,
//       required: true
//     }
//   },
//   data() {
//     return {
//       selectedItem: null,  // 선택된 항목을 저장하는 변수
//     };
//   },
//   methods: {
//     // modelValue가 변경되었을 때 호출되는 함수
//     updateSelectedItem(value) {
//       this.selectedItem = value;  // 선택된 항목을 업데이트
//     }
//   }
// };
// </script>
