<script setup>
  import { useMainStore } from '@/stores/common/main' 
  import * as common from '@/utils/common'
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const mainStore = useMainStore();

  const loginInfo = ref({});
  const remainTime = ref('');
  let intervalId = null;

  onMounted(() => {
    init();
  });
  

  // 컴포넌트 언마운트 시 타이머 중지
  onUnmounted(() => {
    stopRemainTimeUpdater();
  });

  const init = () => {
    const asseccToken = sessionStorage.getItem('Access-Token');
    
    if(!common.isEmpty(asseccToken)) {
      
      const arr = asseccToken.split(".");

      if(common.isEmpty(arr) || arr.length < 2 ){
        console.log("토큰 확인 필요");
        return false;
      }

      const data = !common.isEmpty(arr[1]) ? JSON.parse(decodeURIComponent(escape(atob(arr[1])))) : {};
      if(!common.isEmpty(data)) {
        for(const key in data){
          switch(key) {
            // case 'loginDtm':
            //   loginInfo.value[key] = new Date(data[key] * 1000);
            //   break;
            default:
              loginInfo.value[key] = data[key];
          }
        }
        startRemainTimeUpdater();
      }
      console.log("data", loginInfo.value);
    }
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((ms % (1000 * 60)) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const updateRemainTime = () => {
    const now = Date.now(); // 현재 시간
    const remainingMs = loginInfo.value.exp * 1000 - now;
    
    if (remainingMs > 0) {
      remainTime.value = formatTime(remainingMs);
    } else {
      remainTime.value = '00:00:00';
      clearInterval(intervalId); // 만료 시 타이머 중지
    }
  };

  const startRemainTimeUpdater = () => {
    updateRemainTime(); // 초기 실행
    intervalId = setInterval(updateRemainTime, 1000); // 1초마다 갱신
  };

  const stopRemainTimeUpdater = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const logout = () => {
    const router = useRouter();
    sessionStorage.removeItem('Access-Token');
    router.push('/');
  };
  

</script>
<template>
    <v-app-bar>
      <v-app-bar-nav-icon @click="mainStore.drawer = !mainStore.drawer"></v-app-bar-nav-icon>

      <v-app-bar-title></v-app-bar-title>
      <v-spacer></v-spacer>

        <v-btn>
          {{loginInfo.sub}}
        </v-btn>
        <span>
          <span class="mdi mdi-alarm"></span>
          <span>{{remainTime}}</span>
        </span>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
    </v-app-bar>
</template>