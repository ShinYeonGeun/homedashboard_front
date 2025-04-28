<template>
  <div>
    <!-- 검색 영역 -->
    <div class="search-area" align="center">
      <v-row justify="center" align="center" class="ml-4">
        <v-col>
            <v-row>
              <TextField
                label="거래코드"
                class="flex-grow-1 me-2 mw150"
                v-model="schTrnCd"
              />
              <TextField
                label="거래명"
                class="flex-grow-1 me-2 mw250"
                v-model="schTrnNm"
              />
              <TextField
                label="서비스명"
                class="flex-grow-1 me-2 mw200"
                v-model="schSvcNm"
              />
              <TextField
                label="메소드명"
                class="flex-grow-1 me-2 mw250"
                v-model="schMtdNm"
              />
              <Selectbox
                :items="delYnItems"
                item-title = "codeValCtnt"
                item-value = "codeVal"
                v-model="schDelYn"
                label="삭제여부"
                class="me-2 mw100"
                emptyText="전체"
                emptyValue=""
              />
          </v-row>
        </v-col>
      </v-row>
        <v-col class="btn-group"> 
          <v-btn
            variant="outlined"
            class="me-2"
            color="primary"
            append-icon="mdi-magnify"
            @click="(e)=>{onSearch(0);}"
          >
            검색
          </v-btn>
          <v-btn
            variant="outlined"
            color="seccondary"
            append-icon="mdi-refresh"
            @click="init"
          >
            초기화
          </v-btn>
        </v-col>
    </div>

    <!-- 본문 영역 -->
    <v-row class="content-area">
      <!-- 왼쪽 데이터 테이블 -->
      <div class="fx1 overflow-hidden" id="trnCdListTableWrapper">
        <div id="trnCdListHeader" class="data-table-header">
          <h2 class="data-table-title">거래코드목록</h2>
          <span class="data-table-header-count">({{pageInfo.count}} / {{pageInfo.totalCnt}})</span>
          <v-spacer></v-spacer>
          <div>
            <v-btn color="primary" class="ml-2" variant="flat" append-icon="mdi-delete" size="small" @click="deleteManyTrnCd">
                  삭제
            </v-btn>
            <v-btn :color="common.colorList.EXCEL_DOWNLOAD" class="ml-2" variant="flat" append-icon="mdi-file-excel-outline" size="small">
                  엑셀 다운로드
            </v-btn>
          </div>
        </div>
        <div class="data-table" id="trnCdListTable" ref="trnCdListTable" @scroll="loadMore">
          <v-data-table-virtual
            :headers="headers"
            :items="trnCdList"
            item-value="trnCd"
            class="fixed-table"
            :loading="gridLoading"
            loading-text="조회중입니다. 잠시만 기다려주세요."
            hide-default-footer
            :key="pageInfo.pageNo"
            show-select
            disable-sort
            v-model="trnCdItemList"
            @click:row="onRowClick"
            height="630"
          >            
            <template v-slot:[`item._row`]="{ item, index }">
              <span>{{index + 1}}</span>
            </template>
            <template v-slot:[`item.tmotMs`]="{ item }">
              <span>{{common.numberFormat(item.tmotMs)}}</span>
            </template>
            <template v-slot:[`item.lastLoginDtm`]="{ item }">
              <span>{{ common.getDateString(item.lastLoginDtm, 'yyyy-MM-dd HH:MM:SS', "-") }}</span>
              <v-icon v-if="!common.isEmpty(item.lastLoginDtm)" icon="mdi-calendar-clock-outline" />
            </template>
            <template v-slot:[`item.lastTrnDtm`]="{ item }">
              <span>{{ common.getDateString(item.lastTrnDtm, 'yyyy-MM-dd HH:MM:SS') }}</span>
              <v-icon icon="mdi-calendar-clock-outline" />
            </template>
          </v-data-table-virtual>
        </div>
      </div>
      <v-divider vertical></v-divider>
      <!-- 오른쪽 탭 영역 -->
      <div class="fx1 overflow-overlay d-flex flex-column">
        <v-card flat>
          <v-card-title>
            거래코드상세정보
          </v-card-title>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="primary" 
                    variant="outlined" 
                    append-icon="mdi-content-save" 
                    size="small" 
                    :disabled="!isDupCheck"
                    @click="save">
                  저장
            </v-btn>
            <v-btn color="error" variant="outlined" append-icon="mdi-delete" size="small" @click="deleteTrnCd">
                  삭제
            </v-btn>
            <v-btn variant="outlined" size="small" @click="setInitValue">
                  기본값 설정
            </v-btn>
            <v-btn :color="common.colorList.REFRESH_BUTTON" variant="outlined" append-icon="mdi-refresh" size="small" @click="trnCdInfoInit">
                  초기화
            </v-btn>
          </v-card-actions>
          <v-card-text >
            <v-row>
              <v-col>
                <!-- 아이디 입력 -->
                <TextField
                  label="거래코드"
                  v-model="trnCdItem.trnCd"
                  :error="errorState.trnCd"
                  dense
                  clearable
                  :readonly="trnCdLock"
                  required
                >
                    <template v-slot:append>
                        <v-btn color="primary" 
                                variant="outlined" 
                                append-icon="mdi-magnify" 
                                :disabled="isDupCheck"
                                @click="dupCheck" :readonly="trnCdLock">
                            중복검사
                      </v-btn>
                    </template>
                </TextField>
              </v-col>
              <v-col>
                <TextField
                  label="거래명"
                  v-model="trnCdItem.trnNm"
                  :error="errorState.trnNm"
                  dense
                  clearable
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <TextField
                  label="서비스명"
                  v-model="trnCdItem.svcNm"
                  :error="errorState.svcNm"
                  dense
                  clearable
                  required
                />
              </v-col>
              <v-col>
                <TextField
                  label="메소드명"
                  v-model="trnCdItem.mtdNm"
                  :error="errorState.mtdNm"
                  dense
                  clearable
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea label="설명"
                            variant="outlined"
                            v-model="trnCdItem.description"
                            :error="errorState.description"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <TextField
                  label="타임아웃(ms)"
                  v-model="trnCdItem.tmotMs"
                  :error="errorState.tmotMs"
                  dataType="formatNumber"
                  dense
                  clearable
                  suffix="(ms)"
                  class="text-right"
                  required
                />
              </v-col>
              <v-col>
                <Selectbox
                  :items="delYnItems"
                  item-title = "codeValCtnt"
                  item-value = "codeVal"
                  v-model="trnCdItem.delYn"
                  :error="errorState.delYn"
                  label="삭제여부"
                  required
                  :readonly="delYnLock"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <TextField
                  label="최종거래일시"
                  dataType="datetime"
                  v-model="trnCdItem.lastTrnDtm"
                  dense
                  append-inner-icon="mdi-calendar-clock-outline"
                  readonly
                ></TextField>
              </v-col>
              <v-col>
                <TextField
                  label="최종거래코드"
                  v-model="trnCdItem.lastTrnCd"
                  dense
                  readonly
                ></TextField>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <TextField
                  label="최종거래사용자"
                  v-model="trnCdItem.lastTrnUid"
                  dense
                  readonly
                ></TextField>
              </v-col>
              <v-col>
                <TextField
                  label="최종거래UUID"
                  v-model="trnCdItem.lastTrnUUID"
                  dense
                  readonly
                ></TextField>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as common from '@/utils/common'
import Selectbox from '@/components/common/Selectbox.vue'
import TextField from '@/components/common/TextField.vue'

const schTrnCd = ref('');
const schTrnNm = ref('');
const schSvcNm = ref('');
const schMtdNm = ref('');
const schDelYn = ref(''); //검색조건 삭제여부
const delYnItems = ref(common.getCommCodeItems('YN'));
const trnCdItemList = ref(null); //그리드에서 체크된 Row의 key 배열
const trnCdListTable = ref(null); //회원목록 <table> ref
const trnCdItem = ref({}); //그리드에서 클릭된 Row의 데이터
const selectedTrnCdItemRow = ref({});
const trnCdLock = ref(false);
const delYnLock = ref(true);
const isDupCheck = ref(false);
const dupCheckTrnCd = ref(''); //중복검사 통과한 ID
const tab = ref(0);
const trnCdList = ref([]);
const gridLoading = ref(false);
const errorState = ref({}); //회원상세 input error state 관리

const pageInfo = ref({
  pageNo: 0,
  pageSize: 20,
  totalPages: 0,
  totalCnt:0,
  count:0,
  first: true,
  last: false
});

const headers = [
  {key:"_row", title:"No",width:60, sortable: false},
  { key: "trnCd", title: "거래코드", width:120, align:'center', headerProps:{'class':'text-center'}},
  { key: "trnNm", title: "거래명", width:160, headerProps:{'class':'text-center'}},
  { key: "svcNm", title: "서비스명", width:160, headerProps:{'class':'text-center'}},
  { key: "mtdNm", title: "메소드명", width:200, headerProps:{'class':'text-center'} },
  { key: "description", title: "설명", width:200, align:'left', headerProps:{'class':'text-center'} },
  { key: "tmotMs", title: "타임아웃(ms)", align:'center', width:200, headerProps:{'class':'text-center'} },
  { key: "delYn", title: "삭제", width:90, align:'center', headerProps:{'class':'text-center'} },
  { key: "lastTrnDtm", title: "최종거래일시", align:'center', width:180, headerProps:{'class':'text-center'} },
  { key: "lastTrnCd", title: "최종거래코드", width:100, headerProps:{'class':'text-center'} },
  { key: "lastTrnUid", title: "최종거래이용자ID", width:200, headerProps:{'class':'text-center'} },
  { key: "lastTrnUUID", title: "최종거래UUID", align:' d-none', width:80 },
];

const loadMore = async (e) => {
  const container = trnCdListTable.value;
  const scrollBottom = container.scrollTop + container.clientHeight;
  const isAtBottom = scrollBottom >= container.scrollHeight; // 약간의 오차 허용

  if (isAtBottom) {
    if (!gridLoading.value && pageInfo.value.pageNo < pageInfo.value.totalPages) {
      await onSearch(++pageInfo.value.pageNo);
    }
  }
  
};

const onSearch = async (pageNo) => {
  const params = {
        'trnCd' : schTrnCd.value
      , 'trnNm' : schTrnNm.value
      , 'svcNm' : schSvcNm.value
      , 'mtdNm' : schMtdNm.value
      , 'delYn': schDelYn.value.codeVal
  };

  if(common.isEmpty(pageNo) || pageNo === 0) {
    pageInfoInit();
    trnCdList.value = [];
  }else{
    pageInfo.value.pageNo = pageNo;
  }

  if(pageInfo.value.last){
    return false;
  }

  Object.assign(params, pageInfo.value);
  
  gridLoading.value = true;

  await common.sendByTrnCd('TRN00R02', params, (req, res)=> {
      if(res.payload.empty){
        common.showSnackbar(`조회된 데이터가 없습니다.`, "primary", 3000);
      } else {
        pageInfo.value.totalCnt = res.payload.totalElements;
        pageInfo.value.totalPages = res.payload.totalPages;
        pageInfo.value.first = res.payload.first;
        pageInfo.value.last = res.payload.last;
        pageInfo.value.count = pageInfo.value.count + res.payload.numberOfElements;
        trnCdList.value.push(... res.payload.trnCdList);
      }
  }, (params, res)=>{
      common.showSnackbar(`거래코드 목록 조회 중 오류가 발생되었습니다.`, "red", 2000);
  });

  gridLoading.value = false;
};

// 행 클릭 이벤트 핸들러
const onRowClick = (event, row) => {
  const className = `bg-${common.colorList.GRID_SELECTED_ROW}`;
  const target = event.target
  let isChanged = false; //row.item.trnCd !== selectedTrnCdItemRow.value.trnCd;
  trnCdItem.value = { ...row.item}; // 클릭된 행 데이터 저장

  if(common.isEmpty(selectedTrnCdItemRow.value.element)) {
    isChanged = true;
  } else {
    isChanged = row.item.trnCd !== selectedTrnCdItemRow.value.item.trnCd
    common.removeClass(selectedTrnCdItemRow.value.element, [className]);
  }

  //선택한 값이 변경되었으면 button readonly 해제
  trnCdLock.value = isChanged;

  if(isChanged) {
    selectedTrnCdItemRow.value.element = target.parentElement;
    selectedTrnCdItemRow.value.id = row.item.trnCd;
    selectedTrnCdItemRow.value.item = { ... row.item};
    common.addClass(selectedTrnCdItemRow.value.element, [className]);
    delYnLock.value = row.item.delYn !== 'Y';
    dupCheckTrnCd.value = row.item.trnCd;
  }else{
    selectedTrnCdItemRow.value = {};
    trnCdItemInit(); //선택된 데이터 초기화
  }
};

const dupCheck = async () => {
  const params = {'trnCd':trnCdItem.value.trnCd}

  if(common.isEmpty(trnCdItem.value.trnCd)) {
    common.errorAlert("거래코드를 확인해주세요.")
    isDupCheck.value = false;
    return false;
  }

  await common.sendByTrnCd('TRN00R03', params, (req,res)=> {
      if(res.payload.count === 0) {
        common.infoAlert('사용 가능한 거래코드입니다.');
        isDupCheck.value = true;
        dupCheckTrnCd.value = req.trnCd;
      } else {
        common.errorAlert('사용할 수 없는 거래코드입니다.');
        isDupCheck.value = false;
      }
  }, (req, res)=>{
      common.errorAlert(res.payload);
  });
};

const init = () => {
  schTrnCd.value = '';
  schTrnNm.value = '';
  schSvcNm.value = '';
  schMtdNm.value = '';
  schDelYn.value = ''; //검색조건 삭제여부 
  trnCdList.value = [];
  trnCdItemList.value = [];
  tab.value = 0;
  gridLoading.value = false

  pageInfoInit();

  trnCdInfoInit();
  errorStateInit();
};

const pageInfoInit = () => {
  pageInfo.value.pageNo = 0;
  pageInfo.value.pageSize = 20;
  pageInfo.value.totalCnt = 0;
  pageInfo.value.totalPages = 0;
  pageInfo.value.count = 0;
  pageInfo.value.first = true;
  pageInfo.value.last = false;
};

const errorStateInit = () => {
  errorState.value = {
                      trnCd:null,
                      trnNm:null,
                      svcNm:null,
                      mtdNm:null,
                      description:null,
                      tmotMs:null,
                      delYn:null,
                    };
}

const trnCdInfoInit = () => {
  trnCdLock.value = false;
  trnCdItemInit();
  //그리드 선택행 css 조정
  if(!common.isEmpty(selectedTrnCdItemRow.value.element)){
    common.removeClass(selectedTrnCdItemRow.value.element, [`bg-${common.colorList.GRID_SELECTED_ROW}`]);
  }
  selectedTrnCdItemRow.value = {}; //선택행 초기화
  isDupCheck.value = false;
  dupCheckTrnCd.value = '';

  errorStateInit();
};

const trnCdInfoErrStateChg = () => {
  if(common.isEmpty(selectedTrnCdItemRow.value)) {
    return;
  }

  const keys = Object.keys(trnCdItem.value);

  for(const k of keys) {
    switch(k){
      case 'trnCd':
      case 'trnNm':
      case 'svcNm':
      case 'mtdNm':
      case 'delYn':
        //변경분 표시
        errorState.value[k] = selectedTrnCdItemRow.value.item[k] !== trnCdItem.value[k];
        break;
      case 'description':
        errorState.value[k] = common.evl(selectedTrnCdItemRow.value.item[k], "") !== common.evl(trnCdItem.value[k], "");
        break;
      case 'tmotMs':
        errorState.value[k] = selectedTrnCdItemRow.value.item[k] != common.cleanNumber(trnCdItem.value[k]);
        break;
      default:break;
    }
  }
};

const save = async () => {
  let msg = "수정";
  let trnCd = "TRN00U01";
  //선택된 아이템이 없으면 등록으로 간주.
  if(common.isEmpty(selectedTrnCdItemRow.value) || 
     (!common.isEmpty(selectedTrnCdItemRow.value) && 
       selectedTrnCdItemRow.value.item.delYn === 'Y' && trnCdItem.value.delYn === 'N')) {
    msg = "등록";
    trnCd = "TRN00I01";
    if(!isDupCheck.value && common.isEmpty(selectedTrnCdItemRow.value)) {
      common.errorAlert("중복검사 후 등록이 가능합니다.");
      return false;
    }
  };

  common.confirm(`${msg}하시겠습니까?`, async () =>{
    await common.sendByTrnCd(trnCd, trnCdItem.value, (req,res)=> {
        common.infoAlert(`${msg}되었습니다.`, trnCdInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
};

const deleteTrnCd = () => {
  if(common.isEmpty(trnCdItem.value)) {
    common.errorAlert("삭제할 거래코드를 선택해주세요.");
    return false;
  }

  common.confirm(`삭제하시겠습니까?`, async () =>{
    await common.sendByTrnCd('TRN00D01', {'trnCd':trnCdItem.value.trnCd}, (req,res)=> {
        common.infoAlert(`삭제되었습니다.`, trnCdInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
}

const deleteManyTrnCd = () => {
  if(common.isEmpty(trnCdItemList.value)) {
    common.errorAlert("삭제할 거래코드를 선택해주세요.");
    return false;
  }

  common.confirm(`삭제하시겠습니까?`, async () =>{
    await common.sendByTrnCd('TRN00D02', {'trnCdList':trnCdItemList.value}, (req,res)=> {
        common.infoAlert(`삭제되었습니다.`, trnCdInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
}

const setInitValue = () => {
  trnCdItem.value.tmotMs = 30000;
  trnCdItem.value.delYn = "N";
  delYnLock.value = true;
};

onMounted(() => {
  init();
});

const needDupCheck = () => dupCheckTrnCd.value !== trnCdItem.value.trnCd;

watch( trnCdItem, (newItem, oldItem) => {

  if(!common.isEmpty(newItem)) {
    trnCdInfoErrStateChg();
  }

  isDupCheck.value = !needDupCheck();
}
,{ deep: true } // 깊은 감시
);

const trnCdItemInit = () => {
  trnCdItem.value = {};
  trnCdItem.value.delYn = "N";
  delYnLock.value = true;
};

</script>

<style scoped>

</style>
