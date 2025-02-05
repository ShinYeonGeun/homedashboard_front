import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import * as common from '@/utils/common'

export const useMainStore = defineStore('main', {
  state: () => ({
    drawer: ref(true),
    tabs: [/*{ name: "Home", path: "/", component: '@/views/' }*/],
    activeTab: ref(0), // 현재 활성화된 탭
    menuList: ref(null),
    drawerWidth: 260
  })
  , getters: {
    //계산되는 내용
    getMenuList: async (data) => {
      if (common.isEmpty(data.menuList)) {
        console.log("common.getLoginId", common.getLoginId());
        await common.sendByTrnCd('MNM00001', { 'uid': common.getLoginId() }, (d, r) => {
          data.menuList = r.payload
        });
      }
      return data.menuList;
    }
  }
  , actions: {
    setMenuList(menuList) {
      this.menuList = menuList;
    },
    setActiveTab(activeTab) {
      this.activeTab = activeTab;
    },
    // 새 탭 요청 처리
    requestTab(newTab) {
      if (!this.tabs.find((tab) => tab.id === newTab.id)) {
        this.tabs.push(newTab);
      }
      this.emitTabRequest(newTab);
    },

    // 새 탭 이벤트
    emitTabRequest(newTab) {
      if (this.tabRequestHandler) {
        this.tabRequestHandler(newTab);
      }
    },

    // 탭 이벤트 핸들러 등록
    onTabRequest(handler) {
      this.tabRequestHandler = handler;
    },
    addOrActivateTab(newTab) {
      const existingTab = this.tabs.find((tab) => tab.id === newTab.id);
      console.log("this.activeTab", this.activeTab);

      if (existingTab) {
        // 이미 있는 탭이면 활성화
        this.activeTab = existingTab.id;//newTab.path;
      } else {
        // 새 탭 추가
        console.log("newTab", newTab);
        this.tabs.push(newTab);
        this.activeTab = newTab.id;//newTab.path;
      }

      console.log("this.activeTab", this.activeTab);
    },
    // 탭 닫기 함수
    removeTab(id) {
      const tabToRemove = this.tabs.find(tab => tab.id === id);
      let idx = -1;
      if (!tabToRemove) return;

      // 탭을 제거
      //this.tabs = this.tabs.filter((tab) => tab.path !== path);
      for (const i in this.tabs) {
        const tab = this.tabs[i];
        if (tab.id === id) {
          idx = i;
          this.tabs.splice(i, 1);
          break;
        }
      }

      // 닫은 탭이 활성화된 탭이라면, 다른 탭을 활성화
      if (this.activeTab === id) {
        //1개는 고정이니까
        if (this.tabs.length > 2) {
          // 남은 탭 중 첫 번째 탭을 활성화
          this.activeTab = this.tabs[--idx].id;
        } else {
          this.activeTab = 0;
        }
      }
    },
  }
});