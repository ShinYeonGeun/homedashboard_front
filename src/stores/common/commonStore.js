import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'

export const useCommonStore = defineStore('common', {
  state: () => ({
    appContext: null,
  })
  , getters: {
    getAppContext() {
      return this.appContext;
    }
  }
  , actions: {
    setAppContext(context) {
      this.appContext = context;
    },
  }
});