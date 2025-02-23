<template>
  <div>
    <!-- 검색 영역 -->
    <div class="search-area" align="center">
      <TextField
        label="메뉴명"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schMenuNm"
      />
      <TextField
        label="상위메뉴Id"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schUpperMenuId"
      />
      <TextField
        label="Path"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1 me-2"
        v-model="schPath"
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
      <div class="fx1 overflow-hidden" id="menuListTableWrapper">
        <div id="menuListHeader" class="data-table-header">
          <h2 class="data-table-title">메뉴목록</h2>
          <span class="data-table-header-count">({{pageInfo.count}} / {{pageInfo.totalCnt}})</span>
          <v-spacer></v-spacer>
          <div>
            <v-btn color="primary" class="ml-2" variant="flat" append-icon="mdi-delete" size="small" @click="deleteManyMenu">
                  삭제
            </v-btn>
            <v-btn :color="common.colorList.EXCEL_DOWNLOAD" class="ml-2" variant="flat" append-icon="mdi-file-excel-outline" size="small">
                  엑셀 다운로드
            </v-btn>
          </div>
        </div>
        <div class="data-table" id="menuListTable" ref="menuListTable" @scroll="loadMore">
          <v-data-table-virtual
            :headers="headers"
            :items="menuList"
            item-value="menuId"
            class="fixed-table"
            :loading="gridLoading"
            loading-text="조회중입니다. 잠시만 기다려주세요."
            hide-default-footer
            :items-per-page="pageInfo.pageSize"
            show-select
            disable-sort
            v-model="menuItemList"
            @click:row="onRowClick"
            height="630"
          >
            <template v-slot:[`item._row`]="{ item, index }">
              <span>{{index + 1}}</span>
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
      <div class="fx1 overflow-overlay d-flex flex-column">
          <v-container class="overflow-overlay" height="700">
          <v-card flat>
            <v-card-title>
              메뉴상세정보
            </v-card-title>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="primary" 
                      variant="outlined" 
                      append-icon="mdi-content-save" 
                      size="small" 
                      @click="save">
                    저장
              </v-btn>
              <v-btn color="error" variant="outlined" append-icon="mdi-delete" size="small" @click="deleteMenu">
                    삭제
              </v-btn>
              <v-btn variant="outlined" size="small" @click="setInitValue">
                    기본값 설정
              </v-btn>
              <v-btn :color="common.colorList.REFRESH_BUTTON" variant="outlined" append-icon="mdi-refresh" size="small" @click="menuInfoInit">
                    초기화
              </v-btn>
            </v-card-actions>
            <v-card-text>
              <v-row>
                <v-col>
                  <TextField
                    label="메뉴ID"
                    v-model="menuItem.menuId"
                    :error="errorState.menuId"
                    variant="outlined"
                    dense
                    density="compact"
                    clearable
                    hide-details
                    readonly
                    required
                  />
                </v-col>
                <v-col>
                  <TextField
                    label="상위메뉴ID"
                    v-model="menuItem.upperMenuId"
                    :error="errorState.upperMenuId"
                    variant="outlined"
                    dense
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <TextField
                    label="메뉴명"
                    v-model="menuItem.menuNm"
                    :error="errorState.menuNm"
                    variant="outlined"
                    dense
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>
                <v-col>
                  <TextField
                    label="Path"
                    v-model="menuItem.path"
                    :error="errorState.path"
                    variant="outlined"
                    dense
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <TextField
                    label="순번"
                    v-model="menuItem.seq"
                    :error="errorState.seq"
                    variant="outlined"
                    dense
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>
                <v-col>
                  <Selectbox
                    :items="delYnItems"
                    item-title = "codeValCtnt"
                    item-value = "codeVal"
                    v-model="menuItem.delYn"
                    :error="errorState.delYn"
                    label="삭제여부"
                    variant="outlined"
                    density="compact"
                    hide-details
                    required
                    :readonly="delYnLock"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  
                </v-col>
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <TextField
                    label="최종거래일시"
                    dataType="datetime"
                    v-model="menuItem.lastTrnDtm"
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
                    label="최종거래코드"
                    v-model="menuItem.lastTrnCd"
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
                    label="최종거래사용자"
                    v-model="menuItem.lastTrnmenuId"
                    variant="outlined"
                    dense
                    density="compact"
                    readonly
                    hide-details
                  ></TextField>
                </v-col>
                <v-col>
                  <TextField
                    label="최종거래UmenuId"
                    v-model="menuItem.lastTrnUmenuId"
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

const schMenuNm = ref('');
const schUpperMenuId = ref('');
const schPath = ref('');
const schDelYn = ref('');
const delYnItems = ref(common.getCommCodeItems('YN'));
const menuItemList = ref(null); //그리드에서 체크된 Row의 key 배열
const menuListTable = ref(null); //그리드 <table> ref
const menuItem = ref({}); //그리드에서 클릭된 Row의 데이터
const selectedMenuItemRow = ref({});

const delYnLock = ref(true);
const menuList = ref([]);
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
  { key: "menuId", title: "메뉴ID", align:'end', width:80, headerProps:{'class':'text-center'}},
  { key: "menuNm", title: "메뉴명", width:150, align:'start', headerProps:{'class':'text-center'}},
  { key: "path", title: "경로", width:180, headerProps:{'class':'text-center'}},
  { key: "seq", title: "순번", align:'end', width:80, headerProps:{'class':'text-center'} },
  { key: "upperMenuId", title: "상위메뉴ID", align:'end', width:100},
  { key: "delYn", title: "삭제", width:90, align:'center', headerProps:{'class':'text-center'} },
  { key: "lastTrnDtm", title: "최종거래일시", align:'center', width:180, headerProps:{'class':'text-center'} },
  { key: "lastTrnCd", title: "최종거래코드", width:100, headerProps:{'class':'text-center'} },
  { key: "lastTrnmenuId", title: "최종거래이용자ID", width:200, headerProps:{'class':'text-center'} },
  { key: "lastTrnUmenuId", title: "최종거래UmenuId", align:' d-none', width:80 },
];

const loadMore = async (e) => {
  const container = menuListTable.value;
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
      'menuNm': schMenuNm.value
      , 'upperMenuId': schUpperMenuId.value
      , 'path': schPath.value
      , 'delYn': schDelYn.value.codeVal
  };

  if(common.isEmpty(pageNo) || pageNo === 0) {
    pageInfo.value.pageNo = 0;
    pageInfo.value.totalCnt = 0;
    pageInfo.value.totalPages = 0;
    pageInfo.value.count = 0;
    pageInfo.value.first = true;
    pageInfo.value.last = false;
    menuList.value = [];
  }else{
    pageInfo.value.pageNo = pageNo;
  }

  if(pageInfo.value.last){
    return false;
  }

  Object.assign(params, pageInfo.value);
  
  gridLoading.value = true;

  await common.sendByTrnCd('MNM00R01', params, (d,r)=> {
      if(!r.payload.menuList.empty){
        pageInfo.value.totalCnt = r.payload.totalElements;
        pageInfo.value.totalPages = r.payload.totalPages;
        pageInfo.value.first = r.payload.first;
        pageInfo.value.last = r.payload.last;
        pageInfo.value.count = pageInfo.value.count + r.payload.numberOfElements;
        menuList.value.push(... r.payload.menuList);
      }
  }, (params, res)=>{
      common.showSnackbar(`메뉴 목록 조회 중 오류가 발생되었습니다.`, "red", 2000);
  });

  gridLoading.value = false;
};

// 행 클릭 이벤트 핸들러
const onRowClick = (event, row) => {
  const className = `bg-${common.colorList.GRID_SELECTED_ROW}`;
  const target = event.target
  let isChanged = false;
  menuItem.value = { ...row.item}; // 클릭된 행 데이터 저장

  if(common.isEmpty(selectedMenuItemRow.value.element)) {
    isChanged = true;
  } else {
    isChanged = row.item.menuId !== selectedMenuItemRow.value.id;
    common.removeClass(selectedMenuItemRow.value.element, [className]);
  }

  //선택한 값이 변경되었으면 button readonly 해제
  // userIdLock.value = isChanged;

  if(isChanged) {
    selectedMenuItemRow.value.element = target.parentElement;
    selectedMenuItemRow.value.id = row.item.menuId;
    selectedMenuItemRow.value.item = { ...row.item};
    common.addClass(selectedMenuItemRow.value.element, [className]);
    delYnLock.value = row.item.delYn !== 'Y';
  }else{
    selectedMenuItemRow.value = {};
    menuItemInit(); //선택된 데이터 초기화
  }

};

const init = () => {
  schMenuNm.value = '';
  schUpperMenuId.value = '';
  schPath.value = '';
  schDelYn.value = ''; //검색조건 삭제여부 
  menuList.value = [];
  menuItemList.value = [];
  gridLoading.value = false
  pageInfo.value.pageNo = 0;
  pageInfo.value.pageSize = 20;
  pageInfo.value.totalCnt = 0;
  pageInfo.value.totalPages = 0;
  pageInfo.value.count = 0;
  pageInfo.value.first = true;
  pageInfo.value.last = false;

  menuInfoInit();
  errorStateInit();
};

const errorStateInit = () => {
  errorState.value = {
                      menuId:null,
                      name:null,
                      userState:null,
                      delYn:null,
                    };
}

const menuInfoInit = () => {
  menuItemInit();
  //그리드 선택행 css 조정
  if(!common.isEmpty(selectedMenuItemRow.value.element)){
    common.removeClass(selectedMenuItemRow.value.element, [`bg-${common.colorList.GRID_SELECTED_ROW}`]);
  }
  selectedMenuItemRow.value = {}; //선택행 초기화
  
  errorStateInit();
};

const userInfoErrStateChg = () => {
  // errorState.value.menuId = common.isEmpty(menuItem.value.menuId) ? null:common.isEmpty(menuItem.value.menuId);
  // errorState.value.name = common.isEmpty(menuItem.value.name) ? null:common.isEmpty(menuItem.value.name);
  // errorState.value.userState = common.isEmpty(menuItem.value.userState) ? null:common.isEmpty(menuItem.value.userState);
  // errorState.value.delYn = common.isEmpty(menuItem.value.delYn) ? null:common.isEmpty(menuItem.value.delYn);
  
  if(common.isEmpty(selectedMenuItemRow.value)) {
    return;
  }
  
  const keys = Object.keys(menuItem.value);

  for(const k of keys) {
    switch(k){
      case 'menuId':
      case 'menuNm':
      case 'upperMenuId':
      case 'seq':
      case 'delYn':
        //변경분 표시
        errorState.value[k] = selectedMenuItemRow.value.item[k] !== menuItem.value[k];
        break;
      default:break;
    }
  }
};

const save = async () => {
  let msg = "수정";
  let trnCd = "MNM00U01";
  //선택된 아이템이 없으면 등록으로 간주.
  if(common.isEmpty(selectedMenuItemRow.value) || 
     (!common.isEmpty(selectedMenuItemRow.value) && 
       selectedMenuItemRow.value.item.delYn === 'Y' && menuItem.value.delYn === 'N')) {
    msg = "등록";
    trnCd = "MNM00I01";
  };
  
  // userInfoErrStateChg();

  common.confirm(`${msg}하시겠습니까?`, async () =>{
    await common.sendByTrnCd(trnCd, menuItem.value, (req,res)=> {
        common.infoAlert(`${msg}되었습니다.`, menuInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
};

const deleteMenu = () => {
  if(common.isEmpty(menuItem.value)) {
    common.errorAlert("삭제할 이용자를 선택해주세요.");
    return false;
  }

  common.confirm(`삭제하시겠습니까?`, async () =>{
    await common.sendByTrnCd('MNM00D01', {'menuId':menuItem.value.menuId}, (req,res)=> {
        common.infoAlert(`삭제되었습니다.`, menuInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
}

const deleteManyMenu = () => {
  if(common.isEmpty(menuItemList.value)) {
    common.errorAlert("삭제할 이용자를 선택해주세요.");
    return false;
  }

  common.confirm(`삭제하시겠습니까?`, async () =>{
    await common.sendByTrnCd('MNM00D02', {'menuIdList':menuItemList.value}, (req,res)=> {
        common.infoAlert(`삭제되었습니다.`, menuInfoInit());
    }, (req, res)=>{
        common.errorAlert(res.payload);
    });
  });
};

onMounted(() => {
  init();
});


watch( menuItem, (newItem, oldItem) => {

  if(!common.isEmpty(newItem)) {
    userInfoErrStateChg();
  }
}
,{ deep: true } // 깊은 감시
);


const setInitValue = () => {
  menuItem.value.delYn = "N";
  delYnLock.value = true;
};

const menuItemInit = () => {
  menuItem.value = {};
  menuItem.value.delYn = "N";
}

</script>