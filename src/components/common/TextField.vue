<template>
  <v-text-field
    :model-value="formattedValue" 
    @update:modelValue="updateValue"
    :hide-details="localHideDetails"
    v-bind="{density: localDensity, variant:localVariant, ...$attrs}"
  >
  <!-- append 슬롯을 받아서 v-text-field의 append 슬롯에 전달 -->
    <template v-if="$slots.prepend" v-slot:prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-if="localRequired" v-slot:prepend-inner>
      <span class="text-error">*</span>
    </template>
    <!-- append 슬롯을 받아서 v-text-field의 append 슬롯에 전달 -->
    <template v-if="$slots.append" v-slot:append>
      <slot name="append"></slot>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import * as common from '@/utils/common'

const props = defineProps({
  dataType: {
    type: String,
    default: "String"
  },
  required: {
    type: Boolean,
    default:false
  },
  format: {
    type: String,
    default: ""
  },
  modelValue: {
    type: [String, Number],
    default: ""  // modelValue가 없을 경우 기본값 설정
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

// emit 이벤트 정의
const emit = defineEmits(['update:modelValue']);

const localDataType = ref(props.dataType);
const localFormat = ref(props.format);
const localRequired = ref(props.required);
const localDensity = ref(props.density);
const localHideDetails = ref(props.hideDetails);
const localVariant = ref(props.variant);

// 원본 값 관리
const rawValue = ref(props.modelValue);

// 화면에 표시할 포맷된 값
const formattedValue = computed(() => {
  const type = common.evl(localDataType.value, "").toUpperCase(); 
  let newValue = rawValue.value;

  if(newValue !== "") {
    switch(type) {
        case "NUMBER":
        case "FORMATNUMBER":
          newValue = common.numberFormat(newValue);
          break;
        case "DATE":
          newValue = common.getDateString(newValue, common.evl(localFormat.value, "yyyy-MM-dd"));
          break;
        case "DATETIME":
          newValue = common.getDateString(newValue, common.evl(localFormat.value, "yyyy-MM-dd HH:mm:ss"));
          break;
        case "TIME":
          newValue = common.getTimeString(newValue, common.evl(localFormat.value, "HH:mm:ss"));
          break;
        default:
          break;
    }
  }
  return newValue;
});

// 입력 이벤트 처리
const updateValue = (inputValue) => {
  const type = common.evl(localDataType.value, "").toUpperCase();

  if (inputValue !== rawValue.value) {
    switch(type) {
        case "NUMBER":
        case "FORMATNUMBER":
          rawValue.value = common.cleanNumber(inputValue);
          break;
        case "TIME":
          rawValue.value = inputValue.replace(/[^0-9]/g, '');
          break;
        default:
          rawValue.value = inputValue;  // 부모에서 전달된 modelValue를 업데이트
          break;
    }
  }

  emit("update:modelValue", rawValue.value);  // 부모에 원본 값 전달
};

// watch로 modelValue 변경 감지
watch(() => props.modelValue, (newValue) => {
  
    updateValue(newValue);

}, { immediate: true });  // 최초에도 감지하도록 설정

</script>
