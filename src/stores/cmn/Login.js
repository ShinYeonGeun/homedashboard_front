import { defineStore } from 'pinia'
import { ref } from 'vue';
import * as common from '@/utils/common'


export const useLoginStore = defineStore('Login', {
  state: () => ({
    drawer: null,
    valid: ref(false),
    isLogin: ref(false)
  })
  , getters: {
    //계산되는 내용
  }
  , actions: {
    //메소드
    setValid(valid) {
      this.valid = valid;
    },
    setIsLogin(isLogin) {
      this.isLogin = isLogin;
    },
    // 로그인 액션
    async login(id, password, success, fail) {
      const data = {
        "loginId": id
        , "pswd": password
      }
      await common.sendByURI('/login', data, success, fail);
    }
  }
});