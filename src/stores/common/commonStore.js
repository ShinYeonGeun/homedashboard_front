import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import * as common from '@/utils/common'

export const useCommonStore = defineStore('common', {
  state: () => ({
    appContext: null,
    commCodeInfo: ref({}),
    loginId: ref('')
  })
  , getters: {

  }
  , actions: {
    setAppContext(context) {
      this.appContext = context;
    },
    setCommCodeInfo(commCodeInfo) {
      this.commCodeInfo = commCodeInfo;
    },
    setLoginId(loginId) {
      this.loginId = loginId;
    },
    getCommCodeData(commonCode) {
      return { ... this.commCodeInfo[commonCode] };
    }
  }
});