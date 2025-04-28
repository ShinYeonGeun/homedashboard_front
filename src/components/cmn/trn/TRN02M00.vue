<template>
    <div>
        <div class="search-area" align="center">
          <v-row justify="center" align="center" class="ml-4">
            <v-col>
              <v-row>
                <TextField
                    label="그룹코드"
                    class="flex-grow-1 me-2 mw150"
                    v-model="schGrpCd"
                />
                <TextField
                    label="그룹명"
                    class="flex-grow-1 me-2 mw250"
                    v-model="schGrpNm"
                />
                <TextField
                    label="적요"
                    class="flex-grow-1 me-2 mw350"
                    v-model="schRemark"
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
            <div class="fx1 overflow-hidden" id="groupListTableWrapper">
                <div id="svcListHeader" class="data-table-header">
                <h2 class="data-table-title">그룹목록</h2>
                <span class="data-table-header-count">({{pageInfo.count}} / {{pageInfo.totalCnt}})</span>
                <v-spacer></v-spacer>
                <div>
                    <v-btn :color="common.colorList.REFRESH_BUTTON" variant="outlined" append-icon="mdi-refresh" size="small" >
                        새로고침
                    </v-btn>
                </div>
                </div>
                <div class="data-table" id="groupListTable" ref="groupListTable" @scroll="loadMore">
                <v-data-table-virtual
                    :headers="headers"
                    :items="groupList"
                    item-value="grpCd"
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
                </v-data-table-virtual>
                </div>
            </div>
            <v-divider vertical></v-divider>
            <!-- 오른쪽 탭 영역 -->
            <div class="fx1 overflow-overlay d-flex flex-column">
                <v-container class="overflow-overlay" height="700">
                    <v-card flat>
                        <v-card-title>
                        그룹별 거래권한 
                        </v-card-title>
                        <v-card-actions class="d-flex justify-end">
                          <v-btn color="primary" 
                                  variant="outlined" 
                                  append-icon="mdi-content-save" 
                                  size="small" 
                                  @click="save">
                                  저장
                          </v-btn>
                        </v-card-actions>
                        <v-card-text class="overflow-overlay h500" v-if="common.isEmpty(svcList)">
                          그룹 목록에서 그룹을 선택해주세요.
                        </v-card-text>
                        <v-card-text class="overflow-overlay h500" v-if="!common.isEmpty(svcList)">
                            <v-treeview
                            v-model:selected="filteredSvcList"
                            :items="svcList"
                            item-value="trnCd"
                            item-title="svcNm"
                            item-children="children"
                            select-strategy="classic"
                            open-all
                            selectable>
                              <template v-slot:prepend="{ item }">
                                <v-icon
                                  v-if="common.isEmpty(item.children)"
                                  :icon="`mdi-function`"
                                ></v-icon>
                              </template>
                               <template v-slot:title="{ item }">
                                <span>
                                  {{ item.svcNm }} [ {{item.trnNm}} ({{item.trnCd}})]
                                </span>
                              </template>
                            </v-treeview>
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

const groupList = ref([]);
const gridLoading = ref(false);
const svcList  = ref([]);
const groupListTable = ref(null); //그리드 <table> ref
const groupItem = ref({}); //그리드에서 클릭된 Row의 데이터
const selectedGroupItemRow = ref({});
const filteredSvcList = ref([]);
const schGrpCd = ref('');
const schGrpNm = ref('');
const schRemark = ref('');
const schParams = ref({});

const pageInfo = ref({
                    pageNo: 0,
                    pageSize: 15,
                    totalPages: 0,
                    totalCnt:0,
                    count:0,
                    first: true,
                    last: false
                    });

const headers = [
                    {key:"_row", title:"No",width:60, sortable: false},
                    { key: "grpCd", title: "그룹코드", align:'center', width:60, headerProps:{'class':'text-center'}},
                    { key: "grpNm", title: "그룹명", width:150, align:'start', headerProps:{'class':'text-center'}},
                    { key: "path", title: "적요", align:'start', width:200, headerProps:{'class':'text-center'}},
                    { key: "delYn", title: "삭제", width:90, align:'center', headerProps:{'class':'text-center'} },
                ];

onMounted(async()=> {
    init();
    await onSearch();
});

const loadMore = async (e) => {
  const container = groupListTable.value;
  const scrollBottom = container.scrollTop + container.clientHeight;
  const isAtBottom = scrollBottom >= container.scrollHeight; // 약간의 오차 허용

  if (isAtBottom) {
    if (!gridLoading.value && pageInfo.value.pageNo < pageInfo.value.totalPages) {
      await onSearch(++pageInfo.value.pageNo);
    }
  }
  
};

const init = () => {
  schGrpCd.value = '';
  schGrpNm.value = '';
  schRemark.value = '';
  pageInfoInit();
};

const pageInfoInit = () => {
    pageInfo.value.pageNo = 0;
    pageInfo.value.totalCnt = 0;
    pageInfo.value.totalPages = 0;
    pageInfo.value.count = 0;
    pageInfo.value.first = true;
    pageInfo.value.last = false;
    groupList.value = [];
};

const onSearch = async (pageNo) => {
  schParams.value = {
    'grpCd':schGrpCd.value,
    'grpNm':schGrpNm.value,
    'remark':schRemark.value,
  };

  if(common.isEmpty(pageNo) || pageNo === 0) {
    pageInfoInit();
    groupList.value = [];
  }else{
    pageInfo.value.pageNo = pageNo;
  }

  if(pageInfo.value.last){
    return false;
  }

  Object.assign(schParams.value, pageInfo.value);
  
  gridLoading.value = true;

  await common.sendByTrnCd('USR11R01', schParams.value, (req, res)=> {
      if(res.payload.empty){
        common.showSnackbar(`조회된 데이터가 없습니다.`, "primary", 3000);
      } else {
        pageInfo.value.totalCnt = res.payload.totalElements;
        pageInfo.value.totalPages = res.payload.totalPages;
        pageInfo.value.first = res.payload.first;
        pageInfo.value.last = res.payload.last;
        pageInfo.value.count = pageInfo.value.count + res.payload.numberOfElements;
        groupList.value.push(... res.payload.groupList);
      }
  }, (params, res)=>{
      common.showSnackbar(`이용자그룹 목록 조회 중 오류가 발생되었습니다.`, "red", 2000);
  });

  gridLoading.value = false;
};

const save = async() => {
  let params = {
    "grpCd": groupItem.value.grpCd,
    "trnCds":filteredSvcList.value
  };

  await common.sendByTrnCd('TRN00I02', params, (req, res)=> {
    common.showSnackbar(`거래권한을 등록했습니다.`, "primary", 2000);
  }, (params, res)=>{
      common.errorAlert(res.payload);
  });
};

const onRowClick = async (event, row) => {

  const className = `bg-${common.colorList.GRID_SELECTED_ROW}`;
  const target = event.target
  let isChanged = false;
  groupItem.value = { ...row.item};

  if(common.isEmpty(selectedGroupItemRow.value.element)) {
    isChanged = true;
  } else {
    isChanged = row.item.trnCd + "|" + row.item.grpCd !== selectedGroupItemRow.value.id;
    common.removeClass(selectedGroupItemRow.value.element, [className]);
  }

  if(isChanged) {
    selectedGroupItemRow.value.element = target.parentElement;
    selectedGroupItemRow.value.id = row.item.trnCd + "|" + row.item.grpCd;
    selectedGroupItemRow.value.item = { ...row.item};
    common.addClass(selectedGroupItemRow.value.element, [className]);
    
    console.log("##", svcList.value);
  
    await common.sendByTrnCd('TRN00R04', {grpCd:"00"}, (req, res)=> {
          svcList.value = [];
          svcList.value.push(... res.payload.svcList);
          filteredSvcList.value = [... extractIdsFromTree(svcList.value)];
    }, (params, res)=>{
          common.errorAlert(res.payload);
    });
  }else{
    selectedGroupItemRow.value = {};
    groupItem.value = {};
    svcList.value = [];
  }


};

const extractIdsFromTree = (nodes) => {
  const result = [];

  // 재귀적으로 트리를 순회하면서 ids 추출 (grpCd가 있는 경우만)
  function traverse(node) {
    console.log("node", node);
    // grpCd가 있을 때만 처리
    if (!common.isEmpty(node.grpCd)) {
      result.push(node.trnCd);
    }
    if (!common.isEmpty(node.children)) {
      // 자식이 있다면 그 자식들에 대해 재귀적으로 탐색
      // node.children.forEach(child => traverse(child));
      for(const i in node.children) {
          traverse(node.children[i]);
      }
    }

    // 자식 노드가 없는 경우에도 여전히 그룹 코드가 있을 경우 추가됨
  }

  // 모든 노드에 대해 traverse 실행
//   nodes.forEach(node => traverse(node));
  for(const i in nodes) {
      traverse(nodes[i]);
  }

  return result;
}
watch( svcList, (newItem, oldItem) => {
    
    if(newItem.length < 1) {
        filteredSvcList.value = [];
        return false;
    }
});

</script>
