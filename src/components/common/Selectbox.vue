<template>
  <!-- 부모에서 전달된 모든 속성 전달 -->
  <v-select
    v-bind="$attrs"
    :model-value="selectedItem"
    @update:modelValue="updateSelectedItem"
    :items="formattedItems"
  >
    <!-- 아이템 표시 형식 커스터마이징 -->
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :title="formatItem(item)"></v-list-item>
    </template>

    <!-- 선택된 값 커스터마이징 -->
    <!-- <template #selection="{ item }"> -->
    <template v-slot:selection="{ item, index }">
      <!-- item.title !== '[object Object] 왜 이걸로 처음에 세팅됨?-->
      <span v-if="item.title !== '[object Object]'" class="v-select__selection-text">{{formatItem(item)}}</span>
    </template>
  </v-select>
</template>

<script setup>
import { ref, computed, defineProps, watch, onMounted, useAttrs } from 'vue';
import * as common from '@/utils/common'

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
  modelValue: {
    type: [String, Object], // v-model로 전달되는 값의 타입
  },
  emptyText:{
    type: String,
  },
  emptyValue:{
    type: [String, Object],
  },
  emptyMode: {
    type: String,
    default: 'append'
  }
});

// `useAttrs`를 이용하여 $attrs 접근
const attrs = useAttrs();

// 선택된 항목
const selectedItem = ref(props.modelValue);

// emit 이벤트를 정의하여 부모에게 값 전달
const emit = defineEmits(['update:modelValue']);

// `formatter`를 기반으로 항목을 처리
const formattedItems = computed(() => {
  // const title = item[attrs['item-title']];
  // const value = item[attrs['item-value']];
  let emptyItem = {};
  let addEmptyItem = false;
  let items = null;

  if(props.emptyText) {
    addEmptyItem = true;
    emptyItem[attrs['item-title']] = props.emptyText;
    emptyItem[attrs['item-value']] = props.emptyValue;
  }

  if(addEmptyItem) {
    if(props.emptyMode === 'append') {
      items = [... props.items, emptyItem];
    } else {
      items = [emptyItem, ... props.items];
    }
  } else {
    items = props.items;
  }
console.log("items111",items, addEmptyItem);
  //return props.items.map((item) => {
  return items.map((item) => {
    const formattedTitle = formatItem(item);
    console.log("items", item, formattedTitle);
    return {
      ...item,
      formattedTitle, // 포맷팅된 제목 추가
    };
  });
});

// formatter에 따라 항목을 포맷팅하는 함수
const formatItem = (item) => {
  const { title, value } = item;
  console.log("items2", item);
  switch (props.formatter) {
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
watch(() => props.modelValue, (value) => {
  selectedItem.value = value;
});

// 선택된 항목 업데이트
const updateSelectedItem = (value) => {
  selectedItem.value = value;
  emit('update:modelValue', value);  // 부모에게 값 전달
};

</script>
