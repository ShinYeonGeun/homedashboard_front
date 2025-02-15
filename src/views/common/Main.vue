<script setup>
  import * as common from '@/utils/common'
  import Main from '@/components/common/Main.vue'
  import Header from '@/components/common/Header.vue'
  import Navi from '@/components/common/Navi.vue'
  import { ref, onMounted } from "vue";

  const isError = ref(false);

  onMounted(async ()=>{
    try {
      common.sendByURI('/healthCheck');
    } catch(error) {
      isError.value = true; //TODO 오류나면 어떻게하지?
    }
  });
  
</script>

<template>
  <v-app>
    <Header />
    <Navi />
    <Main />
  </v-app>
</template>
