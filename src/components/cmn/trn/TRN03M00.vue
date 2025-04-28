<template>
    <div>
        <div class="search-area" align="center">
            <v-row justify="center" align="center" class="ml-4">
                <v-col>
                    <v-row align="center">
                        <Datepicker label="조회시작일자" v-model="schFromDate" width="150" />
                        <TextField
                            label="HHmmss"
                            class="flex-grow-1 ml-2 mw100"
                            dataType="time"
                            format="HH:mm:ss"
                            v-model="schFromTime"
                        />
                        <span class="ml-4 mr-4"> ~ </span>
                        <Datepicker label="조회종료일자" v-model="schToDate" width="150"/>
                        <TextField
                            label="HHmmss"
                            class="flex-grow-1 ml-2 mw100"
                            dataType="time"
                            format="HH:mm:ss"
                            v-model="schToTime"
                        />
                        <Selectbox
                            :items="reqResDstcd"
                            item-title = "codeValCtnt"
                            item-value = "codeVal"
                            v-model="schReqResDstcd"
                            class="ml-4 mw100"
                            label="요청송신구분"                
                            emptyText="전체"
                            emptyValue=""
                            />
                        <Selectbox
                            :items="resultCd"
                            item-title = "codeValCtnt"
                            item-value = "codeVal"
                            v-model="schResultCd"
                            class="ml-4 mw100"
                            label="결과"                
                            emptyText="전체"
                            emptyValue=""
                            />
                    </v-row>
                    <v-row class="mt-5">
                        <TextField
                            label="거래코드"
                            class="flex-grow-1 mw120"
                            v-model="schTrnCd"
                        />
                        <!-- <TextField
                            label="서비스명"
                            class="flex-grow-1 ml-4 mw150"
                            v-model="schSvcNm"
                        />
                        <TextField
                            label="메소드명"
                            class="flex-grow-1 ml-4 mw200"
                            v-model="schMthNm"
                        /> -->
                        <TextField
                            label="사용자ID"
                            class="flex-grow-1 ml-4 mw120"
                            v-model="schUid"
                        />
                        <TextField
                            label="UUID"
                            class="flex-grow-1 ml-4 mw350"
                            v-model="schUuid"
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
            <div class="fx1 overflow-hidden" id="trnLogListTableWrapper">
                <div id="trnLogListHeader" class="data-table-header">
                <h2 class="data-table-title">거래로그목록</h2>
                <span class="data-table-header-count">({{pageInfo.count}} / {{pageInfo.totalCnt}})</span>
                <v-spacer></v-spacer>
                <div>
                    <v-btn :color="common.colorList.REFRESH_BUTTON" variant="outlined" append-icon="mdi-refresh" size="small" >
                        새로고침
                    </v-btn>
                </div>
                </div>
                <div class="data-table" id="trnLogListTable" ref="trnLogListTable" @scroll="loadMore">
                <v-data-table-virtual
                    :headers="headers"
                    :items="trnLogList"
                    class="fixed-table"
                    :loading="gridLoading"
                    loading-text="조회중입니다. 잠시만 기다려주세요."
                    hide-default-footer
                    disable-sort
                    @click:row="onRowClick"
                    height="600"
                    :key="pageInfo.pageNo"
                >
                    <template v-slot:[`item._row`]="{ item, index }">
                        <span>{{index + 1}}</span>
                    </template>
                    <template v-slot:[`item.lastLoginDtm`]="{ item }">
                    <span>{{ common.getDateString(item.trnDtm, 'yyyy-MM-dd HH:MM:SS', "-") }}</span>
                    <v-icon v-if="!common.isEmpty(item.trnDtm)" icon="mdi-calendar-clock-outline" />
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
                          로그상세
                        </v-card-title>
                        <v-card-actions class="d-flex justify-end">
                            
                        </v-card-actions>
                        <v-card-text class="overflow-overlay">
                            <v-row align="center">
                                <v-col class="mw100 text-right">
                                    거래일시
                                </v-col>
                                <v-col>
                                    <TextField
                                        label="거래일시"
                                        dataType="datetime"
                                        v-model="trnLogItem.trnDtm"
                                        dense
                                        append-inner-icon="mdi-calendar-clock-outline"
                                        readonly
                                    />
                                </v-col>
                                <v-col class="mw100 text-right">
                                    결과
                                </v-col>
                                <v-col>
                                    <Selectbox
                                        :items="resultCd"
                                        item-title = "codeValCtnt"
                                        item-value = "codeVal"
                                        v-model="trnLogItem.resultCd"
                                        class="mw100"
                                        label="결과"     
                                        readonly  
                                        />
                                </v-col>
                            </v-row>
                            <v-row align="center">
                                <v-col class="mw100 text-right">
                                    사용자ID
                                </v-col>
                                <v-col>
                                    <TextField
                                        label="사용자ID"
                                        v-model="trnLogItem.uid"
                                        readonly
                                    />
                                </v-col>
                                <v-col class="mw100 text-right">
                                    요청/응답
                                </v-col>
                                <v-col>
                                    <Selectbox
                                        :items="reqResDstcd"
                                        item-title = "codeValCtnt"
                                        item-value = "codeVal"
                                        v-model="trnLogItem.reqResDstcd"
                                        class="mw100"
                                        label="요청응답구분"   
                                        readonly    
                                        />
                                </v-col>
                            </v-row>
                            <v-row align="center">
                                <v-col class="mw100 text-right">
                                    UUID
                                </v-col>
                                <v-col>
                                    <TextField
                                        label="UUID"
                                        v-model="trnLogItem.uuid"
                                        readonly
                                    />
                                </v-col>
                            </v-row>
                            <v-row align="center" class="h360">
                                <v-col class="mw100 text-right">
                                    내용
                                </v-col>
                                <v-col>
                                    <v-textarea
                                        label="내용"
                                        auto-grow
                                        rows="11"
                                        variant="outlined"
                                        v-model="trnLogItem.content"
                                        style="white-space: pre;"
                                        readonly
                                    />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-container>
            </div>
        </v-row>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, defineComponent} from "vue";
import * as common from '@/utils/common'
import Selectbox from '@/components/common/Selectbox.vue'
import TextField from '@/components/common/TextField.vue'
import Datepicker from '@/components/common/Datepicker.vue'

const trnLogList = ref([]);
const gridLoading = ref(false);
const svcList  = ref([]);
const trnLogListTable = ref(null); //그리드 <table> ref
const groupItem = ref({}); //그리드에서 클릭된 Row의 데이터
const selectedTrnLogItemRow  = ref({});
const menu = ref(false);
const schFromDate = ref('');
const schToDate = ref('');
const schFromTime = ref('');
const schToTime = ref('');
const schReqResDstcd = ref('');
const schResultCd = ref('');
const schTrnCd = ref('');
// const schSvcNm = ref('');
// const schMthNm = ref('');
const schUid = ref('');
const schUuid = ref('');
const formattedDate = ref('');
const commCodeInfo = ref({});
const reqResDstcd = ref(common.getCommCodeItems('REQ_RES_DSTCD')); //요청응답구분코드
const resultCd = ref(common.getCommCodeItems('RESULT_CD')); //결과코드
const trnLogItem = ref({});


const pageInfo = ref(common.newPageInfo());

const headers = [
                    {key:"_row", title:"No",width:60, sortable: false},
                    { key: "trnDtm", title: "거래일시", align:'center', width:220, headerProps:{'class':'text-center'}},
                    { key: "trnCd", title: "거래코드", width:100, align:'center', headerProps:{'class':'text-center'}},
                    { key: "trnNm", title: "거래명", width:150, align:'start', headerProps:{'class':'text-center'}},
                    { key: "reqResDstcd", title: "요청/응답", align:'center', width:80, headerProps:{'class':'text-center'}},
                    { key: "resultCd", title: "결과", width:80, align:'center', headerProps:{'class':'text-center'} },
                    { key: "content", title: "content", width:90, align:' d-none', headerProps:{'class':'text-center'} },
                    { key: "uid", title: "사용자ID", width:90, align:'left', headerProps:{'class':'text-center'} },
                    { key: "uuid", title: "UUID", width:300, align:'left', headerProps:{'class':'text-center'} },
                ];

onMounted(async()=> {
     await init();
    // await onSearch();
});

const onDateSelected = (value) => {
  formattedDate.value = common.getDateString(new Date(value), 'yyyy-MM-dd');
  menu.value = false
};

const init = async () => {
    const today = common.getDateFormat(new Date(), "yyyyMMdd");
    schFromDate.value = today;
    schToDate.value = today;
    schFromTime.value = common.getTimeString("000000", "HH:mm:ss");
    schToTime.value = "235959";
};

const onRowClick = (event, row) => {
  const className = `bg-${common.colorList.GRID_SELECTED_ROW}`;
  const target = event.target
  let isChanged = false; //row.item.trnCd !== selectedTrnLogItemRow.value.trnCd;
  trnLogItem.value = { ...row.item}; // 클릭된 행 데이터 저장

  if(common.isEmpty(selectedTrnLogItemRow.value.element)) {
    isChanged = true;
  } else {
    isChanged = row.item.uuid !== selectedTrnLogItemRow.value.item.uuid
    common.removeClass(selectedTrnLogItemRow.value.element, [className]);
  }


  if(isChanged) {
    selectedTrnLogItemRow.value.element = target.parentElement;
    selectedTrnLogItemRow.value.id = row.item.trnCd;
    selectedTrnLogItemRow.value.item = { ... row.item};
    common.addClass(selectedTrnLogItemRow.value.element, [className]);
  }else{
    selectedTrnLogItemRow.value = {};
    trnLogItemInit(); //선택된 데이터 초기화
  }
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

const onSearch = async (pageNo) => {
  const params = {
        'fromDt' : schFromDate.value
      , 'fromTime' : schFromTime.value
      , 'toDt' : schToDate.value
      , 'toTime' : schToTime.value
      , 'reqResDstcd' : schReqResDstcd.value
      , 'resultCd' : schResultCd.value
      , 'trnCd': schTrnCd.value
      , 'uid': schUid.value
      , 'uuid': schUuid.value
  };

  if(common.isEmpty(pageNo) || pageNo === 0) {
    pageInfoInit();
    trnLogList.value = [];
  }else{
    pageInfo.value.pageNo = pageNo;
  }

  if(pageInfo.value.last){
    return false;
  }

  Object.assign(params, pageInfo.value);
  
  gridLoading.value = true;

  await common.sendByTrnCd('TLG00R01', params, (req, res)=> {
      if(res.payload.empty){
        common.showSnackbar(`조회된 데이터가 없습니다.`, "primary", 3000);
      } else {
        pageInfo.value.totalCnt = res.payload.totalElements;
        pageInfo.value.totalPages = res.payload.totalPages;
        pageInfo.value.first = res.payload.first;
        pageInfo.value.last = res.payload.last;
        pageInfo.value.count = pageInfo.value.count + res.payload.numberOfElements;
        trnLogList.value.push(... res.payload.trnLogList);
      }
  }, (params, res)=>{
      common.showSnackbar(`거래코드 목록 조회 중 오류가 발생되었습니다.`, "red", 2000);
  });

  gridLoading.value = false;
};

const trnLogItemInit = () => {
    trnLogItem.value = {};
};

watch( trnLogItem, (newItem, oldItem) => {

  if(!common.isEmpty(newItem) && !common.isEmpty(newItem)) {
    if(common.isJsonString(newItem.content)) {
        newItem.content = JSON.stringify(JSON.parse(newItem.content, null, 2));
        console.log("w",newItem.content);
    }
  }
}
,{ deep: true } // 깊은 감시
);

</script>
