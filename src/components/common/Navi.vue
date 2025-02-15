<script setup>
  import { useMainStore } from '@/stores/common/main' 
  import { onMounted, ref, computed, defineAsyncComponent, markRaw, nextTick  } from 'vue';
  import * as common from '@/utils/common'

  const mainStore = useMainStore();

  const menuData = ref([]);


  const selectedItem = ref([]);
  // 동적 컴포넌트 로딩을 위한 glob 설정
  const modules = import.meta.glob("/src/views/**/*.vue");

  onMounted(async ()=>{
    if (common.isEmpty(mainStore.menuList)) {
        console.log("common.getLoginId", common.getLoginId());
        await common.sendByTrnCd('MNM01R01', { 'uid': common.getLoginId() }, (d, r) => {
          mainStore.menuList = r.payload
          console.log("MNM01R01", r.payload)
        }, (req, res) => {
          common.errorAlert("@@@@@@@@@@@@@@@@@@@");
        });
      }
    menuData.value = mainStore.menuList;
  });

  const onNodeClick = (activeItems) => {
    
    const clickedItem = findItemById(menuData.value, activeItems.id);

    if (clickedItem && clickedItem.path) {
      const componentPath = `/src/views${clickedItem.path}.vue`; // 동적 경로
      const loadComponent = modules[componentPath];

      if (!loadComponent) {
        console.error(`Component for path "${componentPath}" not found.`);
        return;
      }

      // 이미 탭이 열려있는지 확인
      const existingTab = mainStore.tabs.find((tab) => tab.id === clickedItem.id);

      let newTab = null;
      if (common.evl(existingTab, false)) {
        // 이미 열려있는 탭이면 활성화
        mainStore.setActiveTab(existingTab.id);
        // newTab = existingTab;
      } else {
        // 새 탭 추가
        newTab = {
          id: clickedItem.menuId,
          name: clickedItem.menuNm,
          path: clickedItem.path,
          component: markRaw(defineAsyncComponent(loadComponent)), // 성능 최적화 위해 markRaw 사용
        };
      }
      mainStore.addOrActivateTab(newTab);
    }
  };

// 재귀적으로 노드 검색
const findItemById = (items, id) => {
  for (const item of items) {
    if (item.menuId === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};
</script>

<template>
  <v-navigation-drawer v-model="mainStore.drawer" :width="mainStore.drawerWidth" location="start" style="height:100% !important; top:0px !important">
      <v-btn id ="ci" text elevation="0">
          <v-icon>mdi-view-dashboard</v-icon>
          <span class="ml-2">Dashboard</span>
      </v-btn>
      <v-divider></v-divider>
      <v-treeview
          :items="menuData"
          item-value="menuId"
          item-title="menuNm"
          item-children="children"
          open-on-click
          hide-expand-icon
          @click:select="onNodeClick"
        >
        <template v-slot:label="{ item }">
          <!-- 체크박스를 숨기고, 항목 텍스트만 표시 -->
          <span>{{ item.menuNm }}</span>
        </template>
      </v-treeview>
  </v-navigation-drawer>
</template>
<style scoped>

</style>