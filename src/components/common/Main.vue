<script setup>
    import { useMainStore } from '@/stores/common/main' 
    import { useCommonStore } from '@/stores/common/commonStore' 
    import * as common from '@/utils/common'
    import { onMounted, computed, ref, watch  } from 'vue';
    import { useRouter } from 'vue-router';
    import Selectbox from '@/components/common/Selectbox.vue'
    
    const mainStore = useMainStore();
    const commonStore = useCommonStore();
    const router = useRouter();
    const activeTab = "";

    const commCodeInfo = ref({});
    const userState = ref([]);
    const userStateModel = ref({});
    onMounted(async () => {
      // 초기 경로를 설정
      router.push('/');
      common.adjustHeight({ target: "#main-wrap"
                      , base: "#app"
                      , excludes: ["#main-header"] 
                      , reduce:document.querySelector("#main-header").offsetHeight
                      });
      common.adjustHeight({ target: "#content-wrap"
                      , base: "#app"
                      , excludes: ["#main-header"] 
                      , reduce:document.querySelector("#main-header").offsetHeight
                      , isMin:true
                      , isMax:true
                      });

      // window.addEventListener('resize', ()=>{
      //   common.adjustHeight({ target: "#content-wrap"
      //                 , base: "#app"
      //                 , excludes: ["#tab-wrap"] 
      //                 , reduce:document.querySelector("#content-wrap").offsetTop
      //                 });
      // });
      document.querySelector("#main-wrap").style.top = `${document.querySelector("#main-header").offsetHeight}px`;
      //로그인 체크
      //헤더에서해서 굳이 필요 없음.
      // if(!common.loginCheck()) {
      //   router.push({path:'/cmn/Login'});
      // }

      if (common.isEmpty(commonStore.commCodeInfo)) {
        await common.sendByTrnCd('CCD03R01', { }, (d, r) => {
          commonStore.commCodeInfo = r.payload
        });
      }

      //common.hideLoading();
      // activeTab 값이 변경될 때마다 Pinia 상태 갱신
      //공통코드 조회
      commCodeInfo.value = await common.searchComCodeList({codeList:['USER_STATE']});
      userState.value.push(... commCodeInfo.value.USER_STATE.codeList);
    });

    const openSnackbar = () => {
      common.showSnackbar(`gggggg를 확인해주세요.`, "error", 2000);
    };

    const openDialog = () => {
      common.showModal({
        title: "dddd",
        content: "This is a dynamically generated modal.",
        showCloseBtn:false,
        buttons: [
          {
            label: "Confirm",
            props: { color: "grey-lighten-3", variant: "flat", size: "small"},
            onClick: () => common.showModal({content:'aaaa', overlayClose:true
            , buttons: [
              {
                label: "Confirm2",
                props: { color: "secondary", variant: "flat", size: "small" },
                onClick: () => common.showModal({content:'confirm2', overlayClose:true})
              },
              {
                label: "Cancel",
                props: { color: "secondary", variant: "flat" },
                onClick: () => alert("Cancelled!"),
                close: true,
              },
            ]
            }), 
            // close: false,
          },
          {
            label: "Cancel",
            props: { color: "secondary", variant: "flat" },
            onClick: () => alert("Cancelled!"),
            close: true,
          },
        ],
        overlayClose: true,
        onOpen: () => {
          console.log("open~~~~~~~~~~~");
        },
        onClose: () => {
          console.log("close~~~~~~~~~~~");
        }
      });
    }
  const alertClose = () => {
    console.log("alertClose~");
  };

  const confirmYes = () => {
    console.log("confirmYes~");
  };

  const confirmNo = () => {
    console.log("confirmNo~");
  };

  const popupBtn = [
                      {
                        label: "Confirm2 popup",
                        props: { color: "secondary", variant: "flat", size: "small" },
                        onClick: () => common.showModal({content:'confirm2', overlayClose:true}),
                        execFunc:'childFunction'
                      },
                      {
                        label: "Cancel popup",
                        props: { color: "secondary", variant: "flat" },
                        onClick: () => console.log("Cancelled!"),
                        close: true,
                      },
                    ];
  const popupBtn2 = [
                      {
                        label: "Confirm2 popup",
                        props: { color: "secondary", variant: "flat", size: "small" },
                        //onClick: () => common.showModal({content:'confirm2', overlayClose:true}),
                        execFunc:'test'
                      },
                      {
                        label: "Cancel popup",
                        props: { color: "secondary", variant: "flat" },
                        onClick: () => console.log("Cancelled!"),
                        close: true,
                      },
                    ];
</script>

<template>
    <v-main id="main-wrap" class="position-relative"
        :style="{ left: mainStore.drawer ? `${mainStore.drawerWidth}px` : '0px', width: mainStore.drawer ? `calc(100% - ${mainStore.drawerWidth}px)` : '100%' }">
      <div id="tab-wrap">
        <v-tabs v-model="mainStore.activeTab">
            <!-- 고정된 첫 번째 탭 -->
          <v-tab :value="0" color="primary" class="bg-white">
            고정된 탭
          </v-tab>
          <v-tab v-for="tab of mainStore.tabs" :key="tab.id" :value="tab.id" color="primary" class="bg-white">
            {{ tab.name }}
            <v-btn variant="text"
            icon density="compact"
              @click.stop="mainStore.removeTab(tab.id)"
              class="ml-2"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-tab>
        </v-tabs>
      </div>
      <v-divider></v-divider>
      <div id="content-wrap">
        <!-- 탭 내용 -->
        <v-tabs-window v-model="mainStore.activeTab" class="h-100">
        <!-- 고정된 첫 번째 탭의 내용 -->
        <v-tabs-window-item :value="0">
          <div>고정된 탭 내용
            <div class="w300">
              <v-btn
                    block
                    color="primary"
                    class="mt-4"
                    @click="openDialog"
                  >
                    모달 샘플
              </v-btn>
              <v-btn
                    block
                    color="primary"
                    class="mt-4"
                    @click="() => {
                      common.alert('text~~~~', alertClose);
                    }"
                  >
                    alert
              </v-btn>
              <v-btn
                    block
                    color="primary"
                    class="mt-4"
                    @click="() => {
                      common.confirm('text~~~~', confirmYes, confirmNo, alertClose);
                    }"
                  >
                    confirm
              </v-btn>
              <v-btn
                    block
                    color="primary"
                    class="mt-4"
                    @click="() => {
                      common.openPopup('/common/POPUP_SAMPLE'
                                      , popupBtn
                                      , confirmYes
                                      , confirmNo);
                    }"
                  >
                    레이어팝업
              </v-btn>
              <v-btn
                    block
                    color="primary"
                    class="mt-4"
                    @click="() => {
                      common.openPopup('/common/POPUP_SAMPLE2'
                                      , popupBtn2
                                      , confirmYes
                                      , confirmNo);
                    }"
                  >
                    레이어팝업2
              </v-btn>
              <v-btn
                block
                color="primary"
                class="mt-4"
                @click="openSnackbar"
              >
              스낵바 샘플
              </v-btn>
              <Selectbox
                :items="userState"
                item-title = "codeValCtnt"
                item-value = "codeVal"
                variant="outlined"
                density="compact"
                hide-details
                v-model="userStateModel"
              />
              <v-btn block
                color="primary"
                class="mt-4" href="https://vuetifyjs.com/en/components/all/#containment" target="blank">vuetify</v-btn>
            </div>
          </div>
          <v-card text="1. 웹서버만 기동되고 was 기동안되어 있을 때 튕기는 로직 필요함."></v-card>
        </v-tabs-window-item>

        <!-- 동적으로 추가되는 탭들의 내용 -->
        <v-tabs-window-item v-for="tab of mainStore.tabs" :key="tab.id" :value="tab.id"  class="h-100">
          <component :is="tab.component" />
        </v-tabs-window-item>
      </v-tabs-window>
      </div>
    </v-main>
  <!-- </v-app> -->
</template>