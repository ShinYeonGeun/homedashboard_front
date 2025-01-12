<script setup>
  import { useLoginStore } from '@/stores/cmn/Login' 
  import { useMainStore } from '@/stores/common/main' 
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import * as common from '@/utils/common'

  const mainStore = useMainStore();
  const loginStore = useLoginStore();

  // 로컬 상태
  const id = ref('');
  const password = ref('');
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
    console.log("loadingComponent", loadingComponent);

    loginStore.setValid(valid.value);
    const success = (request, response) => {
      console.log("success >>> ", response);
      const data = {
            'isLogin':true
            , 'expTime':response.payload.expTime
            , 'loginId':response.payload.loginId
            , 'roles':response.payload.roles
        }
      sessionStorage.setItem('menuList', JSON.stringify(response.payload.menuList));
      loginStore.isLogin = true;
      //this.setIsLogin(true);
      //common.loadContent(document.getElementById('wrapper'), '/', data);
    };
    const fail = (request, response) => {
        console.log("fail >>> ", response);
        //useSnackbar().showSnackbar (common.evl(response.payload.message, '오류가 발생하였습니다. 관리자에게 문의해주세요.'), "red", 2000);
        common.showSnackbar(common.evl(response.payload.message, '오류가 발생하였습니다. 관리자에게 문의해주세요.'), "red", 2000);
    };

    await loginStore.login(id.value, password.value, success, fail);
    
    common.hideLoading(loadingComponent);
    console.log("loadingComponent", loadingComponent);

    if(loginStore.isLogin) {
      mainStore.setMenuList(JSON.parse(sessionStorage.getItem('menuList')));
      console.log(">>>>", mainStore.menuList);
      router.push('/');
    }
  } else {
    //alert('Please fill out the form correctly.');
    //await useSnackbar().showSnackbar('dddddddd', "", 3000); // 3초 동안 표시
    let field = '';
    let txt  = '';
    if(common.isEmpty(id.value)) {
      txt = '아이디';
      // id.value?.focus();
    } else {
      txt = '비밀번호';
      //password.value?.focus();
    }
    // common.showLoading();
    // setTimeout(()=>{
    //   common.hideLoading();
    // }, 3000);

  //  common.showSnackbar(`${txt}를 확인해주세요.`, "error", 2000);

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
          <v-text-field
            label="ID"
            v-model="id"
            :rules="[common.rulesReq]"
            variant="outlined"
            dense
            @keydown='doLogin'
          ></v-text-field>

          <!-- 비밀번호 입력 -->
          <v-text-field
            label="Password"
            v-model="password"
            :rules="[common.rulesReq]"
            variant="outlined"
            dense
            type="password"
            @keydown='doLogin'
          ></v-text-field>

          <!-- 로그인 버튼 :disabled="!valid"-->
          <v-btn
            block
            color="primary"
            class="mt-4"
            @click="doLogin"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>