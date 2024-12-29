<script setup>
import { getCurrentInstance } from "vue";
  import { useCommonStore } from '@/stores/common/commonStore' 
  import Main from '@/views/common/Main.vue'


  const commonStore = useCommonStore();
  // getCurrentInstance로 appContext를 Pinia에 설정
  const instance = getCurrentInstance();
  commonStore.setAppContext(instance?.appContext);
  
</script>
<template>
  <v-app>
    <router-view/>
  </v-app>
</template>