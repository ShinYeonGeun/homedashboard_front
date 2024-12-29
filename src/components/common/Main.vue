<script setup>
    import { useMainStore } from '@/stores/common/main' 
    import * as common from '@/utils/common'
    import { onMounted, computed, ref, watch  } from 'vue';
    import { useRouter } from 'vue-router';
    
    const mainStore = useMainStore();
    const router = useRouter();
    const activeTab = "";//computed(() => mainStore.activeTab);
    // const tabs = computed(() => mainStore.tabs);
    // const activeTab = ref(0); // 기본 활성화 탭 (첫 번째)
    // const activeTab = computed({
    //   get: () => mainStore.activeTab,
    //   set: (value) => mainStore.setActiveTab(value),
    // });

    onMounted(() => {
      // 초기 경로를 설정
      router.push('/');

      //로그인 체크
      if(!common.loginCheck()) {
        router.push({path:'/cmn/Login'});
      }

      //common.hideLoading();
      // activeTab 값이 변경될 때마다 Pinia 상태 갱신

    });

    const openSnackbar = () => {
      common.showSnackbar(`${txt}를 확인해주세요.`, "error", 2000);
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
  //   watch(
  // () => mainStore.activeTab,
  // (newValue) => {
  //   console.log(`activeTab 변경 감지: ${newValue}`);
  // });
  const popupBtn = [
                      {
                        label: "Confirm2 popup",
                        props: { color: "secondary", variant: "flat", size: "small" },
                        onClick: () => common.showModal({content:'confirm2', overlayClose:true})
                      },
                      {
                        label: "Cancel popup",
                        props: { color: "secondary", variant: "flat" },
                        onClick: () => alert("Cancelled!"),
                        close: true,
                      },
                    ];
</script>

<template>
    <v-main>
      <div id="main-wrap">
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
           <v-tabs-window v-model="mainStore.activeTab">
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
                  @click="openSnackbar"
                >
                스낵바 샘플
                </v-btn>
              </div>
            </div>
          </v-tabs-window-item>

          <!-- 동적으로 추가되는 탭들의 내용 -->
          <v-tabs-window-item v-for="tab of mainStore.tabs" :key="tab.id" :value="tab.id">
            <component :is="tab.component" />
          </v-tabs-window-item>
        </v-tabs-window>
        </div>
      </div>
    </v-main>
  <!-- </v-app> -->
</template>