<template>
  <div>
    <!-- 검색 영역 -->
    <div class="search-area" align="center">
      <TextField
        label="거래코드"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schTrnCd"
      />
      <TextField
        label="거래명"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schTrnNm"
      />
      <TextField
        label="서비스명"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schSvcNm"
      />
      <TextField
        label="메소드명"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schMtdNm"
      />
      <Selectbox
        :items="delYnItems"
        item-title = "codeValCtnt"
        item-value = "codeVal"
        v-model="schDelYn"
        label="삭제여부"
        variant="outlined"
        density="compact"
        hide-details
        class="me-2"
        emptyText="전체"
        emptyValue=""
      />
      <v-spacer></v-spacer>
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
            <v-btn color="primary" class="ml-2" variant="flat" append-icon="mdi-delete" size="small">
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
            :items-per-page="pageInfo.pageSize"
            show-select
            disable-sort
            v-model="trnCdItemList"
            @click:row="onRowClick"
            height="650"
          >            
            <template v-slot:[`item._row`]="{ item, index }">
              <span>{{index + 1}}</span>
            </template>
            <template v-slot:[`item.lastLoginDtm`]="{ item }">
              <span>{{ common.getDateString(item.lastLoginDtm, 'YYYY-MM-DD HH:MM:SS', "-") }}</span>
              <v-icon v-if="!common.isEmpty(item.lastLoginDtm)" icon="mdi-calendar-clock-outline" />
            </template>
            <template v-slot:[`item.lastTrnDtm`]="{ item }">
              <span>{{ common.getDateString(item.lastTrnDtm, 'YYYY-MM-DD HH:MM:SS') }}</span>
              <v-icon icon="mdi-calendar-clock-outline" />
            </template>
          </v-data-table-virtual>
        </div>
      </div>
      <v-divider vertical></v-divider>
      <!-- 오른쪽 탭 영역 -->
        <div class="fx1 overflow-auto d-flex flex-column">
        <v-tabs v-model="tab" grow>
          <v-tab :value="0">회원정보</v-tab>
          <v-tab :value="1">역할정보</v-tab>
          <v-tab :value="2">연락처정보</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab" class="h-100">
          <v-tabs-window-item :value="0" class="h-100 pt-4">
            <v-card flat>
              <v-card-title>
                회원상세정보
              </v-card-title>
              <v-card-actions class="d-flex justify-end">
                <v-btn color="primary" 
                       variant="outlined" 
                       append-icon="mdi-content-save" 
                       size="small" 
                       :disabled="common.isEmpty(selectedTrnCdItemRow) ? !isDupCheck : false"
                       @click="save">
                      저장
                </v-btn>
                <v-btn color="primary" variant="outlined" append-icon="mdi-delete" size="small">
                      삭제
                </v-btn>
                <v-btn color="primary" variant="outlined" append-icon="mdi-lock-reset" size="small">
                      비밀번호 초기화
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
                      variant="outlined"
                      dense
                      density="compact"
                      clearable
                      hide-details
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
                      variant="outlined"
                      dense
                      density="compact"
                      clearable
                      hide-details
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
                      variant="outlined"
                      dense
                      density="compact"
                      clearable
                      hide-details
                      required
                    />
                  </v-col>
                  <v-col>
                    <TextField
                      label="메소드명"
                      v-model="trnCdItem.mtdNm"
                      :error="errorState.mtdNm"
                      variant="outlined"
                      dense
                      density="compact"
                      clearable
                      hide-details
                      required
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <TextField
                      label="타임아웃(ms)"
                      v-model="trnCdItem.tmotMs"
                      :error="errorState.tmotMs"
                      variant="outlined"
                      dataType="formatNumber"
                      dense
                      density="compact"
                      clearable
                      hide-details
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
                      variant="outlined"
                      density="compact"
                      hide-details
                      emptyText=" "
                      emptyValue=""
                      emptyMode="prepend"
                      required
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <TextField
                      label="최종로그인일시"
                      v-model="trnCdItem.lastLoginDtm"
                      dataType="datetime"
                      variant="outlined"
                      dense
                      density="compact"
                      append-inner-icon="mdi-calendar-clock-outline"
                      readonly
                      hide-details
                    ></TextField>
                  </v-col>
                  <v-col>
                    <TextField
                      label="최종거래UUID"
                      v-model="trnCdItem.lastTrnUUID"
                      variant="outlined"
                      dense
                      density="compact"
                      readonly
                      hide-details
                    ></TextField>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <TextField
                      label="최종거래일시"
                      dataType="datetime"
                      v-model="trnCdItem.lastTrnDtm"
                      variant="outlined"
                      dense
                      density="compact"
                      append-inner-icon="mdi-calendar-clock-outline"
                      readonly
                      hide-details
                    ></TextField>
                  </v-col>
                  <v-col>
                    <TextField
                      label="최종거래사용자"
                      v-model="trnCdItem.lastTrnUid"
                      variant="outlined"
                      dense
                      density="compact"
                      readonly
                      hide-details
                    ></TextField>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-alert border="start"
                    border-color="primary"
                    color="primary"
                    icon="$info"
                    variant="outlined"
                    class="position-absolute bottom-0 w-100">
              <ul>
                <li>
                  <span>
                    1. 최초 회원 등록 시 초기 비밀번호는 [이용자ID]와 동일하고 최초 로그인 시 변경하도록 안내됩니다.
                  </span>
                </li>
                <li>
                  <span>
                    2. 최초 회원 등록 시 [일반사용자] 역할이 자동으로 부여되며 추가로 역할을 설정하는 경우 역할정보 탭을 이용하세요.
                  </span>
                </li>
                <li>
                  <span>
                    3. 회원목록의 체크박스는 다건 삭제 용도입니다. 선택된 데이터 삭제는 우측 상세정보에 있는 삭제를 이용해주세요.
                  </span>
                </li>
              </ul>
            </v-alert>
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
const isDupCheck = ref(false);
const dupCheckUid = ref(''); //중복검사 통과한 ID
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
  { key: "trnCd", title: "거래코드", width:200, headerProps:{'class':'text-center'}},
  { key: "trnNm", title: "거래명", align:' d-none', width:80},
  { key: "svcNm", title: "서비스명", width:160, headerProps:{'class':'text-center'}},
  { key: "mtdNm", title: "메소드명", align:'center', width:200, headerProps:{'class':'text-center'} },
  { key: "tmotMs", title: "타임아웃(ms)", align:'center', width:200, headerProps:{'class':'text-center'} },
  { key: "delYn", title: "삭제", width:90, align:'center', headerProps:{'class':'text-center'} },
  { key: "lastTrnUUID", title: "최종거래UUID", align:' d-none', width:80 },
  { key: "lastTrnDtm", title: "최종거래일시", align:'center', width:180, headerProps:{'class':'text-center'} },
  { key: "lastTrnUid", title: "최종거래이용자ID", width:200, headerProps:{'class':'text-center'} },
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
    pageInfo.value.pageNo = 0;
    pageInfo.value.totalCnt = 0;
    pageInfo.value.totalPages = 0;
    pageInfo.value.count = 0;
    pageInfo.value.first = true;
    pageInfo.value.last = false;
    trnCdList.value = [];
  }else{
    pageInfo.value.pageNo = pageNo;
  }

  if(pageInfo.value.last){
    return false;
  }

  Object.assign(params, pageInfo.value);
  
  gridLoading.value = true;

  await common.sendByTrnCd('TRN10001', params, (d,r)=> {
      if(!r.payload.trnCdList.empty){
        pageInfo.value.totalCnt = r.payload.totalElements;
        pageInfo.value.totalPages = r.payload.totalPages;
        pageInfo.value.first = r.payload.first;
        pageInfo.value.last = r.payload.last;
        pageInfo.value.count = pageInfo.value.count + r.payload.numberOfElements;
        trnCdList.value.push(... r.payload.trnCdList);
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
    selectedTrnCdItemRow.value.item = row.item;
    common.addClass(selectedTrnCdItemRow.value.element, [className]);
  }else{
    selectedTrnCdItemRow.value = {};
    trnCdItem.value = {}; //선택된 데이터 초기화
  }
};

const dupCheck = async () => {
  const params = {'uid':trnCdItem.value.trnCd}

  if(!uidRegexCheck()) {
    common.errorAlert("이용자ID를 확인해주세요.")
    isDupCheck.value = false;
    return false;
  }

  await common.sendByTrnCd('USR00003', params, (req,res)=> {
      if(res.payload.count === 0) {
        common.infoAlert('사용가능한 ID입니다.');
        isDupCheck.value = true;
        dupCheckUid.value = req.uid;
      } else {
        common.errorAlert('사용할 수 없는 ID입니다.');
        isDupCheck.value = false;
      }
  }, (req, res)=>{
      common.errorAlert(res.payload);
  });
};

const init = () => {
  // let contentHeight = 0;
  // common.commonAdjustHeight();
//   common.adjustHeight({ target: "#trnCdListTableWrapper"
//                       , base: ".app-container"
//                       , excludes: [".search-area"] 
//                       , reduce:100
//                       });

//   contentHeight = common.adjustHeight({ 
//                         target: "#trnCdListTable"
//                       , base: "#trnCdListTableWrapper"
//                       , excludes: ["#trnCdListHeader"] 
//                       , reduce:50
//                       });
// console.log("h", contentHeight);
//   document.querySelector("#trnCdTabContentWrapper").style.height = `${contentHeight}px`;


  // contentHeight = common.adjustHeight({ 
  //                       target: "#userListTable"
  //                     , base: "#userListTableWrapper"
  //                     , excludes: ["#userListHeader"] 
  //                     , reduce:50
  //                     });

  // document.querySelector("#tabContentWrapper").style.height = `${contentHeight}px`;

  // schTrnCd.value = '';
  // schTrnNm.value = '';
  // schSvcNm.value = '';
  // schMtdNm.value = '';
  // schDelYn.value = ''; //검색조건 삭제여부 
  // trnCdList.value = [];
  // trnCdItemList.value = [];
  // tab.value = 0;
  // gridLoading.value = false
  // pageInfo.value.pageNo = 0;
  // pageInfo.value.pageSize = 20;
  // pageInfo.value.totalCnt = 0;
  // pageInfo.value.totalPages = 0;
  // pageInfo.value.count = 0;
  // pageInfo.value.first = true;
  // pageInfo.value.last = false;

  // trnCdInfoInit();
  // errorStateInit();
};

const errorStateInit = () => {
  errorState.value = {
                      trnCd:null,
                      trnNm:null,
                      svcNm:null,
                      mtdNm:null,
                      delYn:null,
                    };
}

const trnCdInfoInit = () => {
  trnCdLock.value = false;
  trnCdItem.value = {};
  //회원목록 선택행 css 조정
  if(!common.isEmpty(selectedTrnCdItemRow.value.element)){
    common.removeClass(selectedTrnCdItemRow.value.element, [`bg-${common.colorList.GRID_SELECTED_ROW}`]);
  }
  selectedTrnCdItemRow.value = {}; //선택행 초기화
  isDupCheck.value = false;
  dupCheckUid.value = '';

  errorStateInit();
};

const userInfoErrStateChg = () => {
  errorState.value.trnCd = common.isEmpty(trnCdItem.value.trnCd) ? null:common.isEmpty(trnCdItem.value.trnCd);
  errorState.value.trnNm = common.isEmpty(trnCdItem.value.trnNm) ? null:common.isEmpty(trnCdItem.value.trnNm);
  errorState.value.svcNm = common.isEmpty(trnCdItem.value.svcNm) ? null:common.isEmpty(trnCdItem.value.svcNm);
  errorState.value.mtdNm = common.isEmpty(trnCdItem.value.mtdNm) ? null:common.isEmpty(trnCdItem.value.mtdNm);
  errorState.value.delYn = common.isEmpty(trnCdItem.value.delYn) ? null:common.isEmpty(trnCdItem.value.delYn);
};

const save = async () => {
  let msg = "수정";
  let tranCd = "USR00005";
  //선택된 아이템이 없으면 등록으로 간주.
  if(common.isEmpty(selectedTrnCdItemRow.value)) {
    msg = "등록";
    tranCd = "USR00004";
    if(!isDupCheck.value) {
      common.errorAlert("중복검사 후 등록이 가능합니다.");
      return false;
    }
    
    userInfoErrStateChg();

    common.confirm(`${msg}하시겠습니까?`, async () =>{
      await common.sendByTrnCd(tranCd, trnCdItem.value, (req,res)=> {
          common.infoAlert(`${msg}되었습니다.`, trnCdInfoInit());
      }, (req, res)=>{
          common.errorAlert(res.payload);
      });
    });
  }
};

onMounted(() => {
  init();
});

const needDupCheck = () => dupCheckUid.value !== trnCdItem.value.uid;

watch( trnCdItem, (newItem, oldItem) => {

  if(!common.isEmpty(newItem)) {
    userInfoErrStateChg();
  }
  
  if(common.isEmpty(selectedTrnCdItemRow.value)) {
    //등록
    // uidRegexCheck();
    // isDupCheck.value = !needDupCheck();
  } else {

    //수정일 때 변경분 표시
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
        default:break;
      }
    }
  }
}
,{ deep: true } // 깊은 감시
);

const uidRegexCheck = () => {
  const regexLetter = /[a-zA-Z]/;
  const regexNumber = /\d/;
  const regexSpecialChar = /[!@#$%^&*_\-]/;
  const regexLength = /^.{5,30}$/;
  const regextOnlyEng = /^[a-zA-Z]*$/; 

  // (.) → 임의의 한 문자(괄호로 감싸서 캡처)
  // \1 → 첫 번째 캡처한 문자를 참조(백리퍼런스)
  // {2,} → 위의 문자가 3번 이상 반복됨(즉, 총 4회 이상 연속)
  const regexRepeat = /(.)\1{3,}/;

  if(common.evl(trnCdItem.value.trnCd, '') === "") {
    return false;
  }else{
    //동일 문자 4회 이상 불가, 영문으로만 구성
    //영문 + 숫자(or 특수문자) 또는 숫자 + 특수문자로 구성
    //글자수 5이상 30이하 체크
    if(( (regextOnlyEng.test(trnCdItem.value.uid)) ||
        (regexLetter.test(trnCdItem.value.uid) && regexNumber.test(trnCdItem.value.uid)) ||
        (regexLetter.test(trnCdItem.value.uid) && regexSpecialChar.test(trnCdItem.value.uid)) ||
        (regexNumber.test(trnCdItem.value.uid) && regexSpecialChar.test(trnCdItem.value.uid))) &&
        regexLength.test(trnCdItem.value.uid) &&
        !regexRepeat.test(trnCdItem.value.uid)
      ) {
      
      return true;
    }else{
      return false;
    }
  }
};

</script>

<style scoped>

</style>
