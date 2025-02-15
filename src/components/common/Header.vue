<script setup>
  import { useMainStore } from '@/stores/common/main' 
  import { useCommonStore } from '@/stores/common/commonStore' 
  import * as common from '@/utils/common'
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const mainStore = useMainStore();
  const commonStore = useCommonStore();
  const loginInfo = ref({});
  const remainTime = ref('');
  let intervalId = null;
  const isTimeLeft = ref(false);
  const isCloseExtensionPopup = ref(false);
  const router = useRouter();

  onMounted(() => {
    init();
  });
  
  // 컴포넌트 언마운트 시 타이머 중지
  onUnmounted(() => {
    stopRemainTimeUpdater();
  });

  const init = async () => {
      if(setLoginInfo()) {
        startRemainTimeUpdater();
        commonStore.setLoginId(loginInfo.value.sub);
      }
  };

  const setLoginInfo = () => {
    const asseccToken = sessionStorage.getItem('Access-Token');
    
    if(common.isEmpty(asseccToken)) {
      loginInfo.value = {};
    }else{
      const arr = asseccToken.split(".");

      if(common.isEmpty(arr) || arr.length < 2 ){
        console.log("토큰 확인 필요");
        return false;
      }

      const data = !common.isEmpty(arr[1]) ? JSON.parse(decodeURIComponent(escape(atob(arr[1])))) : {};
      if(!common.isEmpty(data)) {
        for(const key in data){
          switch(key) {
            case 'loginDtm':
              loginInfo.value[key] = common.getDateString(data[key] * 1000, 'YYYY-MM-DD HH:MM:SS');
              break;
            default:
              console.log("k", key, data[key]);
              loginInfo.value[key] = data[key];
              break;
          }
        }
        return true;
      }
    }

    return false;
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

      if(remainingMs <= 60000) {
        if(!isTimeLeft.value) {
          isTimeLeft.value = true;
        }
        if(!isCloseExtensionPopup.value) {
          changeCloseExtensionPopup();
          common.confirm(`로그인 곧 만료됩니다.<br/> "확인" 버튼을 눌러 연장하거나 우측상단 "연장" 버튼을 눌러 시간을 연장해주세요.`, extensionLogin);
        }
      }

    } else {
      remainTime.value = '00:00:00';
      clearInterval(intervalId); // 만료 시 타이머 중지
      logout();
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
    sessionStorage.removeItem('Access-Token');
    router.push({path:'/cmn/Login'});
  };
  
  const changeCloseExtensionPopup = () => {
    isCloseExtensionPopup.value = !isCloseExtensionPopup.value;
  };

  const extensionLogin = () => {
    const token = sessionStorage.getItem('Access-Token');
    const defOps = {
      method: 'POST'
      , headers: {
        'Content-Type': 'application/json'
        , 'Authorization': `Bearer ${token}`
      }
    };

    const success = (req, res) => {
      sessionStorage.setItem('Access-Token', res.payload.accessToken);
      setLoginInfo();
      isTimeLeft.value = false; //만료인접여부 초기화
      changeCloseExtensionPopup(); //팝업생성여부 초기화
    };
    common.sendByURIWithOption('/extensionJWTPeriod', defOps, {}, success );
  };

</script>
<template>
    <v-app-bar id="main-header" :style="{ left: mainStore.drawer ? `${mainStore.drawerWidth}px` : '0px', width: mainStore.drawer ? `calc(100% - ${mainStore.drawerWidth}px)` : '100%' }">
      <v-app-bar-nav-icon @click="mainStore.drawer = !mainStore.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title></v-app-bar-title>
      <v-spacer></v-spacer>
        <span class="me-4">
          <v-icon icon="mdi-account-circle"></v-icon>
          {{loginInfo.name}} 님
        </span>
        <span>
          <!-- <span class="mdi mdi-alarm"></span>
          <span>{{remainTime}}</span> -->
          <v-btn :variant="isTimeLeft ? 'outlined':'text'" 
                 :color="isTimeLeft ? 'error':'dark'" 
                 prepend-icon="mdi-alarm"
                 @click="extensionLogin">
            {{remainTime}} 연장
          </v-btn>
        </span>
        <v-btn variant="tonal" color="dark" size="small" class="me-2" @click="logout">
          로그아웃
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list class="bg-black opacity-70 w350">
              <v-list-item>
                <v-list-item-title class="text-wrap text-body-2">
                  <v-row align="center">
                    <v-col cols="5" class="text-right">아이디</v-col>
                    <v-divider vertical></v-divider>
                    <v-col>{{loginInfo.sub}}</v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="5" class="text-right">이름</v-col>
                    <v-divider vertical></v-divider>
                    <v-col>{{loginInfo.name}}</v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="5" class="text-right">역할</v-col>
                    <v-divider vertical></v-divider>
                    <v-col>{{loginInfo.roles}}</v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="5" class="text-right">로그인일시</v-col>
                    <v-divider vertical></v-divider>
                    <v-col>{{loginInfo.loginDtm}}</v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
    </v-app-bar>
</template>