import { defineStore } from 'pinia'
import { ref } from 'vue';
import * as common from '@/utils/common'


export const useLoginStore = defineStore('Login', {
    state: () => ({
      drawer:null,
      valid:ref(false),
      isLogin:ref(false)
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
        console.log(`Logged in with ID: ${id}`);
        
        // const success = (request, response) => {
        // console.log("success >>> ", response);
        // const data = {
        //       'isLogin':true
        //       , 'expTime':response.payload.expTime
        //       , 'loginId':response.payload.loginId
        //       , 'roles':response.payload.roles
        //   }
        //   sessionStorage.setItem('menuList', JSON.stringify(response.payload.menuList));
        //   this.isLogin = true;
        //   //this.setIsLogin(true);
        //   //common.loadContent(document.getElementById('wrapper'), '/', data);
        // };
        // const fail = (request, response) => {
        //     console.log("fail >>> ", response);
        //     //const message = response.payload.message;
        //     //const msg = `<i class="bi bi-exclamation-circle me-2"></i>${message}`
        //     //common.alert(msg);
        // };
        const data = {
          "loginId":id
        , "pswd":password
      }
        await common.sendByURI('/login', data, success, fail );
      }
    }
});