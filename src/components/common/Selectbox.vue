<template>
  <!-- 부모에서 전달된 모든 속성 전달 -->
  <v-select
    :hide-details="localHideDetails"
    v-bind="{density: localDensity, variant:localVariant, ...$attrs}"
    :model-value="selectedItem"
    @update:modelValue="updateSelectedItem"
    :items="formattedItems"
  >
    
    <!-- 아이템 표시 형식 커스터마이징 -->
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :title="formatItem(item)">
        
      </v-list-item>
    </template>

    <!-- 선택된 값 커스터마이징 -->
    <!-- <template #selection="{ item }"> -->
    <template v-slot:selection="{ item }">
      <span v-if="localRequired" class="text-error pe-2">*</span>
      <span v-if="!common.isEmpty(item.props.title)" class="v-select__selection-text">{{formatItem(item)}}</span>
    </template>
  </v-select>
</template>

<script setup>
import { ref, computed, defineProps, watch, onMounted, useAttrs } from 'vue';
import * as common from '@/utils/common';

// props 정의
const props = defineProps({
  formatter: {
    type: String,
    default: '', // 기본 형식: key:value
  },
  items: {
    type: Array,
    required: true, // 필수 prop
  },
  required: {
    type: Boolean,
    default:false
  },
  modelValue: {
    type: [String, Object], // v-model로 전달되는 값의 타입
  },
  emptyText: {
    type: String,
  },
  emptyValue: {
    type: [String, Object],
  },
  emptyMode: {
    type: String,
    default: 'prepend',
  },
  hideDetails: {
    type:Boolean,
    default: true
  },
  density: {
    type:String,
    default: "compact"
  },
  variant: {
    type:String,
    default: "outlined"
  }
});

// `useAttrs`를 이용하여 $attrs 접근
const attrs = useAttrs();

// localProps를 개별적으로 복사하여 반응형으로 관리
const localFormatter = ref(props.formatter);
const localItems = ref([...props.items]); // 배열은 얕은 복사로 관리
const localModelValue = ref(props.modelValue);
const localRequired = ref(props.required);
const emptyText = ref(props.emptyText);
const emptyValue = ref(props.emptyValue);
const emptyMode = ref(props.emptyMode);
const localDensity = ref(props.density);
const localHideDetails = ref(props.hideDetails);
const localVariant = ref(props.variant);

// 선택된 항목
const selectedItem = ref(localModelValue.value);

// emit 이벤트 정의
const emit = defineEmits(['update:modelValue']);

// `formatter`를 기반으로 항목을 처리
const formattedItems = computed(() => {
  return localItems.value.map((item) => {
    const formattedTitle = formatItem(item);
    return {
      ...item,
      formattedTitle, // 포맷팅된 제목 추가
    };
  });
});

// `formatter`에 따라 항목을 포맷팅하는 함수
const formatItem = (item) => {
  const { title, value } = item;

  if (common.isEmpty(title)) {
    return '';
  }

  switch (localFormatter.value) {
    case 'v':
      return value;
    case 't:v':
      return `${title}:${value}`;
    case 'v:t':
      return `${value}:${title}`;
    case 't-v':
      return `${title}-${value}`;
    case 'v-t':
      return `${value}-${title}`;
    default:
      return title; // 기본적으로 title만 표시
  }
};

// modelValue 변경 시 선택된 항목 업데이트
watch(() => props.modelValue, (newValue) => {
  localModelValue.value = newValue;
  selectedItem.value = newValue;
});

// items가 변경될 때 localItems를 업데이트
watch(() => props.items, (newItems) => {
  localItems.value = [...newItems]; // 배열을 새로 복사하여 반영
}
,{ deep: true } // 깊은 감시
);

// 선택된 항목 업데이트
const updateSelectedItem = (value) => {
  selectedItem.value = value;
  emit('update:modelValue', value); // 부모에게 값 전달
};

onMounted(() => {
  let emptyItem = {};
  let addEmptyItem = false;

  // emptyText가 있을 경우 빈 항목 추가
  if (emptyText.value) {
    addEmptyItem = true;
    emptyItem[attrs['item-title']] = emptyText.value;
    emptyItem[attrs['item-value']] = emptyValue.value;
  }

  if (addEmptyItem) {
    if (emptyMode.value === 'append') {
      localItems.value.push(emptyItem);
    } else {
      localItems.value.unshift(emptyItem);
    }

    if(common.isEmpty(selectedItem.value)) {
      selectedItem.value = emptyValue.value;
    }
  }
});

</script>
