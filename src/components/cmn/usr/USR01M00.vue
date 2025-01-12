<template>
  <v-container fluid class="app-container">
    <!-- 검색 영역 -->
    <div class="search-area" align="center">
      <v-text-field
        label="사용자 ID"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schUid"
      />
      <!-- <v-btn icon class="me-2">
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
      <v-select
        :items="userStateItems"
        item-title = "text"
        item-value = "value"
        v-model="userStateItem"
        label="상태"
        variant="outlined"
        density="compact"
        hide-details
        class="me-2"
      />
      <v-select
        :items="delYnItems"
        item-title = "text"
        item-value = "value"
        v-model="delYnItem"
        label="삭제여부"
        variant="outlined"
        density="compact"
        hide-details
        class="me-2"
      />
      <v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        class="me-2"
        @click="(e)=>{onSearch(1);}"
      >
        검색
      </v-btn>
      <v-btn
        variant="outlined"
        color="error"
        @click="resetFields"
      >
        초기화
      </v-btn>
    </div>

    <!-- 본문 영역 -->
    <v-row class="content-area">
      <!-- 왼쪽 데이터 테이블 -->
      <div class="data-table fx1" id="userListTable">
          <div id="userListHeader" class="data-table-header">
            <h2 class="data-table-title">사용자 목록</h2>
            <span class="data-table-header-count">({{pageInfo.count}} / {{pageInfo.totalCnt}})</span>
            <v-spacer></v-spacer>
            <div>
              <v-btn :color="common.colorList.EXCEL_DOWNLOAD" class="ml-2" variant="outlined" append-icon="mdi-file-excel-outline" size="small">
                    엑셀 다운로드
              </v-btn>
              <v-btn :color="common.colorList.DANGER" class="ml-2" variant="outlined" append-icon="mdi-delete" size="small">
                    삭제
              </v-btn>
              <v-btn :color="common.colorList.REFRESH_BUTTON" class="ml-2" variant="outlined" append-icon="mdi-refresh" size="small">
                    초기화
              </v-btn>
            </div>
          </div>
        <v-data-table-virtual
          :headers="headers"
          :items="userList"
          item-value="uid"
          class="fixed-table"
          :loading="loading"
          loading-text="조회중입니다. 잠시만 기다려주세요."
          hide-default-footer
          :items-per-page="pageInfo.pageSize"
          v-on:scroll:bottom="loadMore"
          show-select
          disable-sort
          v-model="userItem"
        >
          <template v-slot:[`item.pswdErrCnt`]="{ item }">
            <span>{{ common.evl(item.pswdErrCnt, 0) }}</span>
          </template>
          <template v-slot:[`item.userState`]="{ item }">
            <Selectbox
            :items="userState"
            item-title = "codeValCtnt"
            item-value = "codeVal"
            v-model="item.userState"
            variant="outlined"
            density="compact"
            hide-details
            readonly
          />
          </template>
          <template v-slot:[`item.lastLoginDtm`]="{ item }">
            <span>{{ common.getDateString(item.lastLoginDtm, 'YYYY-MM-DD HH:MM:SS') }}</span>
            <v-icon icon="mdi-calendar-clock-outline" />
          </template>
          <template v-slot:[`item.lastTrnDtm`]="{ item }">
            <span>{{ common.getDateString(item.lastTrnDtm, 'YYYY-MM-DD HH:MM:SS') }}</span>
            <v-icon icon="mdi-calendar-clock-outline" />
          </template>
        </v-data-table-virtual>
      </div>
      <v-divider vertical></v-divider>
      <!-- 오른쪽 탭 영역 -->
      <div class="tabs-area">
        <v-tabs v-model="tab" grow>
          <v-tab :value="0">탭 1</v-tab>
          <v-tab :value="1">탭 2</v-tab>
          <v-tab :value="2">탭 3</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="0">
            <v-card flat>
              <v-card-text>탭 1 내용

                {{userItem}}
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item :value="1">
            <v-card flat>
              <v-card-text>탭 2 내용</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <v-card flat>
              <v-card-text>탭 3 내용</v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as common from '@/utils/common'
import Selectbox from '@/components/common/Selectbox.vue'

const schUid = ref('');
const commCodeInfo = ref({});
const userState = ref([]);
const userItem = ref({});
const userStateItems = [
                        {text:'전체', value:''}
                        , {text:'사용', value:"1"}
                        , {text:'잠김', value:"5"}
                        , {text:'미사용', value:"9"}
                      ];

const userStateItem = ref({});

const delYnItems = [
                        {text:'전체', value:''}
                        , {text:'Y', value:"Y"}
                        , {text:'N', value:"N"}
                      ];
                      
const delYnItem = ref({});
const tab = ref(0);

const userList = ref([]);
const loading = ref(false);

const pageInfo = ref({
  pageNo: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 0,
  totalCnt:0,
  count:0,
});

const headers = [
  { key: "uid", title: "사용자ID", width:200, headerProps:{'class':'text-center'}},
  { key: "pswdErrCnt", title: "PW오류(건)", align:' d-none', width:80},
  { key: "userState", title: "상태", width:150, headerProps:{'class':'text-center'}},
  { key: "lastLoginDtm", title: "최종로그인일자", align:'center', width:200, headerProps:{'class':'text-center'} },
  { key: "delYn", title: "삭제", width:90, align:'center', headerProps:{'class':'text-center'} },
  { key: "lastTrnUUID", title: "최종거래UUID", align:' d-none', width:80 },
  { key: "lastTrnDtm", title: "최종거래일시", align:'center', width:180, headerProps:{'class':'text-center'} },
  { key: "lastTrnUid", title: "최종거래사용자ID", width:200, headerProps:{'class':'text-center'} },
];

const loadMore = async () => {
  if (!loading.value && pageInfo.value.pageNo < pageInfo.value.totalPages) {
    pageInfo.value.pageNo += 1;
    await search(pageInfo.value.pageNo);
  }
};

const onSearch = async (pageNo) => {

  const params = {
      'uid': schUid.value
      , 'userState': userStateItem.value.value
      , 'delYn': delYnItem.value.value
    };

    if(common.isEmpty(pageNo)) {
      pageInfo.pageNo = 0;
      pageInfo.totalCnt = 0;
      pageInfo.pageCnt = 0;
      pageInfo.count = 0;
      pageInfo.first = true;
      pageInfo.last = false;
    }else{
      pageInfo.pageNo = pageNo;
    }

    if(pageInfo.value.last){
      return false;
    }

    Object.assign(params, pageInfo.value);
    
    await common.sendByTrnCd('USR00001', params, (d,r)=> {
        console.log(r);
        
        if(!r.payload.userList.empty){
          pageInfo.value.totalCnt = r.payload.totalElements;
          pageInfo.value.pageCnt = r.payload.totalPages;
          pageInfo.value.first = r.payload.first;
          pageInfo.value.last = r.payload.last;
          pageInfo.value.count = pageInfo.value.count + r.payload.numberOfElements;
          userList.value.push(... r.payload.userList);
          console.log(">>>userList", userList.value);
        }
    }, (params, res)=>{
        console.log("error", res);
        common.showSnackbar(`사용자 목록 조회 중 오류가 발생되었습니다.`, "red", 2000);
    });
};

const resetFields = () => {
  console.log("검색 필드 초기화");
  pageInfo.value.pageNo = 1;
};

onMounted(async () => {
  userStateItem.value = {text:'전체', value:''};
  delYnItem.value = {text:'전체', value:''};
  common.commonAdjustHeight();
  common.adjustHeight({ target: "#userListTable"
                      , base: ".app-container"
                      , excludes: ["#userListHeader",".search-area"] 
                      , reduce:100
                      });
  //공통코드 조회
  commCodeInfo.value = await common.searchComCodeList({codeList:['USER_STATE']});
  userState.value.push(... commCodeInfo.value.USER_STATE.codeList);
  console.log(">>>commCodeInfo.value", commCodeInfo.value);
  console.log(">>>commCodeInfo.value", userState.value);
});
</script>

<style scoped>
.tabs-area {
  flex: 1;  /* 오른쪽 영역이 50% */
  overflow-y: auto;
}
</style>
