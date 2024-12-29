<script setup>
  import { useMainStore } from '@/stores/common/main' 
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const mainStore = useMainStore();

  onMounted(() => {

    
  });

  const logout = () => {
    const router = useRouter();
    sessionStorage.removeItem('Access-Token');
    router.push('/');
  };
  

</script>
<template>
    <v-app-bar>
      <v-app-bar-nav-icon @click="mainStore.drawer = !mainStore.drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>
</template>