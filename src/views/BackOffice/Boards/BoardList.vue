<template>
  <div>
    <form @submit.prevent="GetList(true)">
      <table class="tb">
        <tr>
          <th>상태</th>
          <td class="W640" colspan="2">
            <label class="chk" v-for="(item,index) in database.searchColumns" :key="`state-${index}`">
              <input type="checkbox" :value="item.key" @change="chkChange(item.key)">
              <span class="chk-label">{{item.label}}</span>
            </label>

          </td>
        </tr>
        <tr>
          <th>검색</th>
          <td>
            <select class="form-input" v-model.trim="filters.search_key">
              <option value="">전체</option>
              <option value="user.nickname">문의자</option>
              <option value="title">그림 제목</option>
              <option value="inquiry.phone">전화번호</option>
            </select>
          </td>
          <td>
            <input class="form-input" v-model.trim="filters.search_value" placeholder="검색어를 입력해주세요 (작품 이름, 회원 이름)" />
          </td>
          <td>
            <v-btn elevation="0" type="submit" color="primary"><v-icon>mdi-magnify</v-icon> 검색</v-btn>
          </td>
        </tr>
      </table>
    </form>
    <v-card class="mt-2" dense outlined >
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">일반 문의 게시판</v-toolbar-title>
        <v-spacer />
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W50">글번호</th>
          <th class="W100">문의자</th>
          <th class="W200">그림 제목</th>
          <th class="W140">전화번호</th>
          <th class="W100">상태</th>
          <th class="W140">문의 날짜</th>
          <th>마지막 메모</th>
          <th class="W80">관리</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in listData.result">
          <tr :key="`item-${index}`">
            <td class="text-end">{{item.num}}</td>
            <td>{{item.nickname}}</td>
            <td>{{item.title}}</td>
            <td>{{item.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}}</td>
            <td>
              <v-chip dark label small
                  :color="item.inquiryState==='done'?'green': (
                    item.inquiryState==='cancel'?'red': (
                        item.inquiryState==='progress'?'primary': 'secondary'))">
                <template v-if="item.inquiryState==='progress'">진행중</template>
                <template v-else-if="item.inquiryState==='wait'">대기중</template>
                <template v-else-if="item.inquiryState==='done'">완료</template>
                <template v-else-if="item.inquiryState==='cancel'">취소</template>
              </v-chip>
            </td>
            <td>{{(new Date(item.ts_Create_at)).dateFormat('yyyy-MM-dd HH:mm')}}</td>
            <td class="text-start">{{item.last_comment[0] ? item.last_comment[0].comment : ''}}</td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item)">문의 정보</v-list-item>
                  <v-divider />
                  <v-list-item link @click="ChangeStatus(item.inquiry_id, 'D')" v-if="item.inquiryState!=='done' && item.inquiryState !=='cancel'">답변 완료</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.inquiry_id, 'P')" v-if="item.inquiryState!=='done' && item.inquiryState !=='cancel'">상담 진행</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.inquiry_id, 'W')" v-if="item.inquiryState==='done' || item.inquiryState==='cancel'">답변 대기 중</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.inquiry_id, 'C')" v-if="item.inquiryState!=='done' && item.inquiryState !=='cancel'">답변 취소</v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
        <tr v-if="listData.result.length===0">
          <td colspan="10">등록된 문의가 없습니다.</td>
        </tr>
        </tbody>
      </table>
      <v-pagination
          v-model="listData.page"
          :length="listData.pageRows===0?1:Math.ceil(  listData.totalRows / listData.pageRows )"
          :total-visible="7"
      ></v-pagination>
    </v-card>

    <board-form v-if="formData.isOpened" :obj="formData.id"
                 @update="GetList"
                 @close="CloseForm" />

    <board-memo-form v-if="formData.isMemoOpened" :obj="formData.id" @update="GetList" @close="CloseForm"></board-memo-form>
  </div>
</template>
<script>

import BoardModel from "@/models/boards.model";
import BoardForm from "@/views/BackOffice/Boards/BoardForm";
import BoardMemoForm from "@/views/BackOffice/Boards/BoardMemoForm";

export default {
  name: 'AdminBoardList',
  components: {BoardForm, BoardMemoForm},
  data () {
    return {
      filters: {
        search_key: '',
        search_value: '',
        state: []
      },
      formData: {
        id: '',
        isOpened: false,
        isMemoOpened: false
      },
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: []
      },
      database: {
        searchColumns:[
          { label: '진행중', key: 'progress' },
          { label: '대기중', key: 'wait' },
          { label : '취소', key: 'cancel' },
          { label : '완료', key: 'done' }
        ]
      },
      checkAll: false,
    }
  },
  mounted () {
    this.GetList()
  },
  methods: {
    OpenForm ( id ) {
      if (id !== undefined) {
        this.formData.isOpened = true
        this.formData.id = id
      }
    },
    OpenMemoForm ( id ) {
      if (id !== undefined) {
        this.formData.isMemoOpened = true
        this.formData.id = id
      }
    },

    CloseForm () {
      this.formData.isOpened = false
      this.formData.isMemoOpened = false;
      this.formData.email = 0
    },
    GetList(refreshPage) {
      refreshPage = typeof refreshPage !== 'undefined' && refreshPage === true;

      let params = this.filters
      params.page = this.listData.page;
      params.pageRows = this.listData.pageRows;

      if(refreshPage) {
        this.listData.page = 1
      }

      BoardModel
          .GetBoardList(params)
          .then(res => {
            if(this.loginUser.def_name == "artist"){
              this.listData.result = res.data.data.map(e => e.item.artist_id == this.loginUser.artist_id);
            } else {
              this.listData.result = res.data.data;
            }
            this.listData.totalRows = this.listData.result.length;
          });

    },
    ChangeStatus (id, changeStatus) {
      let message = "선택하신 답변의 상태를 " ;
      if(changeStatus === 'C') message += "[취소]"
      else if (changeStatus === 'D') message += "[완료]"
      else if (changeStatus === 'W') message += "[대기]"
      else if (changeStatus === 'P') message += "[진행중]"
      message += "로 변경하시겠습니까?"

      const formData = {};
      formData.state = changeStatus;

      this.$swal({
        title: '답변상태 변경',
        text: message,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '상태변경',
        cancelButtonText: '취소'
      }).then(result => {
        if(result.isConfirmed) {
          BoardModel
              .ChangeInquiryStatus(id, formData)
              .then((res) => {
                this.GetList();
              });
        }
      })
    },

    chkChange (key) {
      if (this.filters.state.includes(key)) {
        this.filters.state = this.filters.state.filter((el) => el !== key);
      } else {
        this.filters.state.push(key);
      }
    }


  }
}

</script>