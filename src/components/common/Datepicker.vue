<template>
  <span class="position-relative">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="slide-y-transition"
      location="bottom"
      style="transform: scale(0.95); transform-origin: top left;"
      offset-y
    >
    <!-- style="transform: scale(0.9); transform-origin: top left;" 크기조절-->
      <template #activator="{ props }">
        <v-text-field
        :model-value="formattedDate"
        @update:modelValue="updateValue"
        :hide-details="localHideDetails"
        append-inner-icon="mdi-calendar-month-outline"
        label="localLabel"
        @blur="syncInputToPicker"
        v-bind="{ density: localDensity, variant: localVariant, ...props, ...$attrs }"
        >
          <template v-if="$slots.prepend" v-slot:prepend>
            <slot name="prepend"></slot>
          </template>
          <template v-if="localRequired" v-slot:prepend-inner>
            <span class="text-error">*</span>
          </template>
          <template v-if="$slots.append" v-slot:append>
            <slot name="append"></slot>
          </template>
          <template v-slot:label>
            {{localLabel}}
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        v-model="selectedDate"
        @update:modelValue="onDateSelected"
      ></v-date-picker>
    </v-menu>
  </span>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import * as common from '@/utils/common'
import { format, isValid, parse } from 'date-fns'

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
    default:"yyyy-MM-dd"
  },
  modelValue: {
    type: [String, Date],
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
  },
  icon: {
    type:String,
    default:"mdi-calendar-clock-outline"
  },
  label: {
    type:String,
    default:""
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
const localLabel = ref(props.label);
const menu = ref(false);
const selectedDate = ref(null);
const formattedDate = ref('');

// 원본 값 관리
const rawValue = ref(props.modelValue);

onMounted(()=> {
  // console.log("datepicker", props.modelValue);
  //  if(!common.isEmpty(rawValue.value)) {
      
  //  }
  // updateValue(props.modelValue);
});

// 입력 이벤트 처리
const updateValue = (inputValue) => {
  rawValue.value = common.evl(inputValue, "").replace(/[^0-9]/g, '');
  
  if(isValid(inputValue)) {
    formattedDate.value = common.getDateFormat(inputValue, localFormat.value);
  }else if(rawValue.value.length === 8) {
    formattedDate.value = common.getDateString(rawValue.value, localFormat.value);
  }else{
    formattedDate.value = rawValue.value;
  }
  menu.value = false;;
  emit("update:modelValue", rawValue.value);  // 부모에 원본 값 전달
};

const onDateSelected = (value) => {
  updateValue(value);
}

// watch로 modelValue 변경 감지
watch(() => props.modelValue, (newValue, oldValue) => {
  updateValue(newValue);
 
 }
, { immediate: true }
);  // 최초에도 감지하도록 설정

// 사용자가 텍스트 필드에 입력 후 포커스 벗어났을 때
function syncInputToPicker() {
  if(rawValue.length != 8) {
    return false;
  }
  const parsedDate = parse(formattedDate.value, localFormat.value, new Date());
  if (!isNaN(parsedDate)) {
    selectedDate.value = parsedDate;
  }
}

</script>
