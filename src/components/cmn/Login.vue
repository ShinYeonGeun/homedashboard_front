<script setup>
  import { useLoginStore } from '@/stores/cmn/Login' 
  import { useMainStore } from '@/stores/common/main' 
  import { useCommonStore } from '@/stores/common/commonStore' 
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import * as common from '@/utils/common'
  import TextField from '@/components/common/TextField.vue'

  const mainStore = useMainStore();
  const loginStore = useLoginStore();
  const commonStore = useCommonStore();

  // 로컬 상태
  const id = ref('');
  const password = ref('');
  const idRef = ref(null);
  const pwdRef = ref(null);
  const valid = ref(false);

  const router = useRouter();

// 유효성 검사 규칙
// const rules = {
//   required: (value) => !!value || 'This field is required',
// };

// 로그인 동작
const doLogin = async (e) => {

  if(common.ignoreEquals(common.evl(e.type, ''), 'keydown') && !common.ignoreEquals(e.key, "enter")) {
    return false;
  }

  let loadingComponent = null;

  if (valid.value) {
    loadingComponent = common.showLoading();

    loginStore.setValid(valid.value);

    const success = (request, response) => {
      const data = {
          'isLogin':true
          , 'expTime':response.payload.expTime
          , 'loginId':response.payload.loginId
          , 'roles':response.payload.roles
      }
      
      loginStore.isLogin = true;
      mainStore.setMenuList(response.payload.menuList);
      commonStore.setCommCodeInfo(response.payload.commCodeInfo);
      commonStore.setLoginId(response.payload.loginId);
      sessionStorage.setItem('Access-Token', response.payload.accessToken);
    };

    const fail = (request, response) => {
        common.errorAlert(common.evl(response.payload, '오류가 발생하였습니다. 관리자에게 문의해주세요.'));
    };

    await loginStore.login(id.value, password.value, success, fail);
    
    common.hideLoading(loadingComponent);

    if(loginStore.isLogin) {
      router.push('/');
    }
  } else {

    let field = '';
    let txt  = '';
    if(common.isEmpty(id.value)) {
      txt = '아이디';
      idRef.value?.focus();
    } else {
      txt = '비밀번호';
      pwdRef.value?.focus();
    }

   common.showSnackbar(`${txt}를 확인해주세요.`, "error", 2000);

  }
};



</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card elevation="3" class="pa-6 w400">
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation id="test">
          <!-- 아이디 입력 -->
          <TextField
            label="ID"
            v-model="id"
            :rules="[common.rulesReq]"
            variant="outlined"
            dense
            ref="idRef"
            @keydown='doLogin'
          ></TextField>

          <!-- 비밀번호 입력 -->
          <TextField
            label="Password"
            v-model="password"
            :rules="[common.rulesReq]"
            variant="outlined"
            dense
            ref="pwdRef"
            type="password"
            @keydown='doLogin'
          ></TextField>

          <!-- 로그인 버튼 :disabled="!valid"-->
          <v-btn
            block
            color="primary"
            class="mt-4"
            clearable
            @click="doLogin"
          >
            Login
          </v-btn>
          <v-btn
            block
            color="primary"
            class="mt-4"
            clearable
            variant="outlined"
          >
            Guest
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>