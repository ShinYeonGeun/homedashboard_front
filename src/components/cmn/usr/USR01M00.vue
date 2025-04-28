<template>
  <div>
    <!-- 검색 영역 -->
    <div class="search-area" align="center">
      <v-row justify="center" align="center" class="ml-4">
        <v-col>
            <v-row>
              <TextField
                label="이용자 ID"
                class="flex-grow-1 me-2 mw300"
                v-model="schUid"
              />
              <Selectbox
                :items="userStateItems" 
                item-title = "codeValCtnt"
                item-value = "codeVal"
                v-model="schUserState"
                label="이용자상태"
                class="me-2 mw200"
                emptyText="전체"
                emptyValue=""
              />
              <Selectbox
                :items="delYnItems"
                item-title = "codeValCtnt"
                item-value = "codeVal"
                v-model="schDelYn"
                label="삭제여부"
                class="me-2 mw200"
                emptyText="전체"
                emptyValue=""
              />
        </v-row>
      </v-col> 
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
      </v-row>
    </div>

    <!-- 본문 영역 -->
    <v-row class="content-area">
      <!-- 왼쪽 데이터 테이블 -->
      <div class="fx1 overflow-hidden" id="userListTableWrapper">
        <div id="userListHeader" class="data-table-header">
          <h2 class="data-table-title">회원목록</h2>
          <span class="data-table-header-count">({{pageInfo.count}} / {{pageInfo.totalCnt}})</span>
          <v-spacer></v-spacer>
          <div>
            <v-btn color="primary" class="ml-2" variant="flat" append-icon="mdi-delete" size="small" @click="deleteManyUser">
                  삭제
            </v-btn>
            <v-btn :color="common.colorList.EXCEL_DOWNLOAD" class="ml-2" variant="flat" append-icon="mdi-file-excel-outline" size="small">
                  엑셀 다운로드
            </v-btn>
          </div>
        </div>
        <div class="data-table" id="userListTable" ref="userListTable" @scroll="loadMore">
          <v-data-table-virtual
            :headers="headers"
            :items="userList"
            item-value="uid"
            class="fixed-table"
            :loading="gridLoading"
            loading-text="조회중입니다. 잠시만 기다려주세요."
            hide-default-footer
            :key="pageInfo.pageNo"
            show-select
            disable-sort
            v-model="userItemList"
            @click:row="onRowClick"
            height="630"
          >
            <template v-slot:[`item.pswdErrCnt`]="{ item }">
              <span>{{ common.evl(item.pswdErrCnt, 0) }}</span>
            </template>
            <template v-slot:[`item.userState`]="{ item }">
              <Selectbox
              :items="userStateItems"
              item-title = "codeValCtnt"
              item-value = "codeVal"
              v-model="item.userState"
              formatter="v:t"
              readonly
              />
            </template>
            <template v-slot:[`item._row`]="{ item, index }">
              <span>{{index + 1}}</span>
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
          <v-container class="overflow-overlay" height="700">
          <v-card flat>
            <v-card-title>
              회원상세정보
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
              <v-btn color="error" variant="outlined" append-icon="mdi-delete" size="small" @click="deleteUser">
                    삭제
              </v-btn>
              <v-btn variant="outlined" size="small" @click="setInitValue">
                    기본값 설정
              </v-btn>
              <v-btn variant="outlined" size="small">
                    비밀번호 초기화
              </v-btn>
              <v-btn :color="common.colorList.REFRESH_BUTTON" variant="outlined" append-icon="mdi-refresh" size="small" @click="userInfoInit">
                    초기화
              </v-btn>
            </v-card-actions>
            <v-card-text>
              <v-row>
                <v-col>
                  <!-- 아이디 입력 -->
                  <TextField
                    label="이용자 ID"
                    v-model="userItem.uid"
                    :error="errorState.uid"
                    dense
                    clearable
                    :readonly="userIdLock"
                    required
                  >
                      <template v-slot:append>
                          <v-btn color="primary" 
                                  variant="outlined" 
                                  append-icon="mdi-magnify" 
                                  :disabled="isDupCheck"
                                  @click="dupCheck" :readonly="userIdLock">
                              중복검사
                        </v-btn>
                      </template>
                  </TextField>
                  <p class="text-grey-darken-1 mt-2">
                    &#42; 아이디는 영문 또는 영어, 숫자, 특수문자 중 2가지 조합으로 구성, 특수문자는 !,@,#,$,%,^,&amp;,*,-_. 만 허용되며 동일문자 4회 이상 불가능합니다.
                  </p>
                  <p class="text-error mt-2">
                    {{uidValidMsg}}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <TextField
                    label="이름"
                    v-model="userItem.name"
                    :error="errorState.name"
                    dense
                    clearable
                  />
                </v-col>
                <v-col>
                  <TextField
                    label="비밀번호 오류횟수"
                    v-model="userItem.pswdErrCnt"
                    dataType="formatNumber"
                    dense
                    clearable
                    suffix="(회)"
                    class="text-right"
                    readonly
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <Selectbox
                    :items="userStateItems"
                    item-title = "codeValCtnt"
                    item-value = "codeVal"
                    v-model="userItem.userState"
                    :error="errorState.userState"
                    label="이용자상태"
                    formatter="v:t"
                    emptyText=" "
                    emptyValue=""
                    emptyMode="prepend"
                    required
                    />
                </v-col>
                <v-col>
                  <Selectbox
                    :items="delYnItems"
                    item-title = "codeValCtnt"
                    item-value = "codeVal"
                    v-model="userItem.delYn"
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
                    label="최종로그인일시"
                    v-model="userItem.lastLoginDtm"
                    dataType="datetime"
                    dense
                    append-inner-icon="mdi-calendar-clock-outline"
                    readonly
                  ></TextField>
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <TextField
                    label="최종거래일시"
                    dataType="datetime"
                    v-model="userItem.lastTrnDtm"
                    dense
                    append-inner-icon="mdi-calendar-clock-outline"
                    readonly
                  ></TextField>
                </v-col>
                <v-col>
                  <TextField
                    label="최종거래코드"
                    v-model="userItem.lastTrnCd"
                    dense
                    readonly
                  ></TextField>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <TextField
                    label="최종거래사용자"
                    v-model="userItem.lastTrnUid"
                    dense
                    readonly
                  ></TextField>
                </v-col>
                <v-col>
                  <TextField
                    label="최종거래UUID"
                    v-model="userItem.lastTrnUUID"
                    dense
                    readonly
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
                  class="w-100">
            <ul>
              <li>
                <span>
                  1. 최초 회원 등록 시 초기 비밀번호는 [이용자ID]와 동일하고 최초 로그인 시 변경하도록 안내됩니다.
                </span>
              </li>
              <li>
                <span>
                  2. 최초 회원 등록 시 [일반사용자] 역할이 자동으로 부여되며 추가로 역할을 설정하는 경우 역할정보 화면을 이용하세요.
                </span>
              </li>
              <li>
                <span>
                  3. 회원목록의 체크박스는 다건 삭제 용도입니다. 선택된 데이터 삭제는 우측 상세정보에 있는 삭제를 이용해주세요.
                </span>
              </li>
            </ul>
          </v-alert>
        </v-container>
      </div>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as common from '@/utils/common'
import Selectbox from '@/components/common/Selectbox.vue'
import TextField from '@/components/common/TextField.vue'

const schUid = ref(''); //검색조건 이용자ID
const schUserState = ref(''); //검색조건 이용자상태
const schDelYn = ref(''); //검색조건 삭제여부
const userStateItems = ref(common.getCommCodeItems('USER_STATE'));
const delYnItems = ref(common.getCommCodeItems('YN'));
const userItemList = ref(null); //그리드에서 체크된 Row의 key 배열
const userListTable = ref(null); //회원목록 <table> ref
const userItem = ref({}); //그리드에서 클릭된 Row의 데이터
const selectedUserItemRow = ref({});
const userIdLock = ref(false);
const delYnLock = ref(true);
const isDupCheck = ref(false);
const dupCheckUid = ref(''); //중복검사 통과한 ID
const tab = ref(0);
const userList = ref([]);
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

const uidValidMsg = ref('미입력');

const headers = [
  {key:"_row", title:"No",width:60, sortable: false},
  { key: "uid", title: "이용자ID", align:'start', width:150, headerProps:{'class':'text-center'}},
  { key: "name", title: "이름", width:150, align:'start', headerProps:{'class':'text-center'}},
  { key: "pswdErrCnt", title: "PW오류(건)", align:' d-none', width:80},
  { key: "userState", title: "상태", width:160, headerProps:{'class':'text-center'}},
  { key: "lastLoginDtm", title: "최종로그인일자", align:'center', width:200, headerProps:{'class':'text-center'} },
  { key: "delYn", title: "삭제", width:90, align:'center', headerProps:{'class':'text-center'} },
  { key: "lastTrnDtm", title: "최종거래일시", align:'center', width:180, headerProps:{'class':'text-center'} },
  { key: "lastTrnCd", title: "최종거래코드", width:100, headerProps:{'class':'text-center'} },
  { key: "lastTrnUid", title: "최종거래이용자ID", width:200, headerProps:{'class':'text-center'} },
  { key: "lastTrnUUID", title: "최종거래UUID", align:' d-none', width:80 },
];

const loadMore = async (e) => {
  const container = userListTable.value;
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
      'uid': schUid.value
      , 'userState': schUserState.value.codeVal
      , 'delYn': schDelYn.value.codeVal
  };

  if(common.isEmpty(pageNo) || pageNo === 0) {
    pageInfoInit();
    userList.value = [];
  }else{
    pageInfo.value.pageNo = pageNo;
  }

  if(pageInfo.value.last){
    return false;
  }

  Object.assign(params, pageInfo.value);
  
  gridLoading.value = true;

  await common.sendByTrnCd('USR00R02', params, (req,res)=> {
      if(res.payload.empty){
        common.showSnackbar(`조회된 데이터가 없습니다.`, "primary", 3000);
      } else {
        pageInfo.value.totalCnt = res.payload.totalElements;
        pageInfo.value.totalPages = res.payload.totalPages;
        pageInfo.value.first = res.payload.first;
        pageInfo.value.last = res.payload.last;
        pageInfo.value.count = pageInfo.value.count + res.payload.numberOfElements;
        userList.value.push(... res.payload.userList);
      }
  }, (params, res)=>{
      common.showSnackbar(`사용자 목록 조회 중 오류가 발생되었습니다.`, "red", 2000);
  });

  gridLoading.value = false;
};

// 행 클릭 이벤트 핸들러
const onRowClick = (event, row) => {
  const className = `bg-${common.colorList.GRID_SELECTED_ROW}`;
  const target = event.target
  let isChanged = false;
  userItem.value = { ...row.item}; // 클릭된 행 데이터 저장

  if(common.isEmpty(selectedUserItemRow.value.element)) {
    isChanged = true;
  } else {
    isChanged = row.item.uid !== selectedUserItemRow.value.id;
    common.removeClass(selectedUserItemRow.value.element, [className]);
  }

  //선택한 값이 변경되었으면 button readonly 해제
  userIdLock.value = isChanged;

  if(isChanged) {
    selectedUserItemRow.value.element = target.parentElement;
    selectedUserItemRow.value.id = row.item.uid;
    selectedUserItemRow.value.item = { ...row.item};
    common.addClass(selectedUserItemRow.value.element, [className]);
    delYnLock.value = row.item.delYn !== 'Y';
    dupCheckUid.value = row.item.uid;
  }else{
    selectedUserItemRow.value = {};
    userItemInit(); //선택된 데이터 초기화
  }

};

const dupCheck = async () => {
  const params = {'uid':userItem.value.uid}

  if(!uidRegexCheck()) {
    common.errorAlert("이용자ID를 확인해주세요.")
    isDupCheck.value = false;
    return false;
  }

  await common.sendByTrnCd('USR00R03', params, (req,res)=> {
      if(res.payload.count === 0) {
        common.infoAlert('사용가능한 ID입니다.');
        uidValidMsg.value = "등록가능";
        isDupCheck.value = true;
        dupCheckUid.value = req.uid;
      } else {
        common.errorAlert('사용할 수 없는 ID입니다.');
        uidValidMsg.value = "등록불가(중복ID 존재)";
        isDupCheck.value = false;
      }
  }, (req, res)=>{
      common.errorAlert(res.payload);
  });
};

const init = () => {
  schUid.value = ''; //검색조건 이용자ID
  schUserState.value = ''; //검색조건 이용자상태
  schDelYn.value = ''; //검색조건 삭제여부 
  userList.value = [];
  userItemList.value = [];
  tab.value = 0;
  gridLoading.value = false
  pageInfoInit();

  userInfoInit();
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
                      uid:null,
                      name:null,
                      userState:null,
                      delYn:null,
                    };
}

const userInfoInit = () => {
  userItemInit();
  //그리드 선택행 css 조정
  if(!common.isEmpty(selectedUserItemRow.value.element)){
    common.removeClass(selectedUserItemRow.value.element, [`bg-${common.colorList.GRID_SELECTED_ROW}`]);
  }
  selectedUserItemRow.value = {}; //선택행 초기화
  
  errorStateInit();
};

const userInfoErrStateChg = () => {
  // errorState.value.uid = common.isEmpty(userItem.value.uid) ? null:common.isEmpty(userItem.value.uid);
  // errorState.value.name = common.isEmpty(userItem.value.name) ? null:common.isEmpty(userItem.value.name);
  // errorState.value.userState = common.isEmpty(userItem.value.userState) ? null:common.isEmpty(userItem.value.userState);
  // errorState.value.delYn = common.isEmpty(userItem.value.delYn) ? null:common.isEmpty(userItem.value.delYn);
  
  if(common.isEmpty(selectedUserItemRow.value)) {
    return;
  }
  
  const keys = Object.keys(userItem.value);

  for(const k of keys) {
    switch(k){
      case 'uid':
      case 'name':
      case 'userState':
      case 'delYn':
        //변경분 표시
        errorState.value[k] = selectedUserItemRow.value.item[k] !== userItem.value[k];
        break;
      default:break;
    }
  }
};

const save = async () => {
  let msg = "수정";
  let trnCd = "USR00U01";
  //선택된 아이템이 없으면 등록으로 간주.
  if(common.isEmpty(selectedUserItemRow.value) || 
     (!common.isEmpty(selectedUserItemRow.value) && 
       selectedUserItemRow.value.item.delYn === 'Y' && userItem.value.delYn === 'N')) {
    msg = "등록";
    trnCd = "USR00I01";
    if(!isDupCheck.value  && common.isEmpty(selectedUserItemRow.value)) {
      common.errorAlert("중복검사 후 등록이 가능합니다.");
      return false;
    }
  };
  
  // userInfoErrStateChg();

  common.confirm(`${msg}하시겠습니까?`, async () =>{
    await common.sendByTrnCd(trnCd, userItem.value, (req,res)=> {
        common.infoAlert(`${msg}되었습니다.`, userInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
};

const deleteUser = () => {
  if(common.isEmpty(userItem.value)) {
    common.errorAlert("삭제할 이용자를 선택해주세요.");
    return false;
  }

  common.confirm(`삭제하시겠습니까?`, async () =>{
    await common.sendByTrnCd('USR00D01', {'uid':userItem.value.uid}, (req,res)=> {
        common.infoAlert(`삭제되었습니다.`, userInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
}

const deleteManyUser = () => {
  if(common.isEmpty(userItemList.value)) {
    common.errorAlert("삭제할 이용자를 선택해주세요.");
    return false;
  }

  common.confirm(`삭제하시겠습니까?`, async () =>{
    await common.sendByTrnCd('USR00D02', {'uidList':userItemList.value}, (req,res)=> {
        common.infoAlert(`삭제되었습니다.`, userInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
};

onMounted(() => {
  init();
});

const needDupCheck = () => dupCheckUid.value !== userItem.value.uid;

watch( userItem, (newItem, oldItem) => {

  if(!common.isEmpty(newItem)) {
    userInfoErrStateChg();
  }
  
  isDupCheck.value = !needDupCheck();

  if(common.isEmpty(selectedUserItemRow.value)) {
    //등록
    uidRegexCheck();
    
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

  if(common.evl(userItem.value.uid, '') === "") {
    uidValidMsg.value = "";
    return false;
  }else{
    //동일 문자 4회 이상 불가, 영문으로만 구성
    //영문 + 숫자(or 특수문자) 또는 숫자 + 특수문자로 구성
    //글자수 5이상 30이하 체크
    if(( (regextOnlyEng.test(userItem.value.uid)) ||
        (regexLetter.test(userItem.value.uid) && regexNumber.test(userItem.value.uid)) ||
        (regexLetter.test(userItem.value.uid) && regexSpecialChar.test(userItem.value.uid)) ||
        (regexNumber.test(userItem.value.uid) && regexSpecialChar.test(userItem.value.uid))) &&
        regexLength.test(userItem.value.uid) &&
        !regexRepeat.test(userItem.value.uid)
      ) {
      uidValidMsg.value = "등록가능 (중복검사에서 중복된 데이터 존재 시 등록 불가)"
      return true;
    }else{
      uidValidMsg.value = "등록불가"
      return false;
    }
  }
};

const setInitValue = () => {
  userItem.value.userState = "1";
  userItem.value.delYn = "N";
  delYnLock.value = true;
};

const userItemInit = () => {
  userItem.value = {};
  userItem.value.delYn = "N";
  delYnLock.value = true;
  userIdLock.value = false;
  isDupCheck.value = false;
  dupCheckUid.value = '';
  uidValidMsg.value = '미입력';
}

</script>

<style scoped>

</style>
