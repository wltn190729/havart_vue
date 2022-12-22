<template>
  <div>
    <filter-box @submit="GetList">
      <v-row>
        <div style="width:120px">
          <v-subheader>검색어 입력</v-subheader>
        </div>
        <v-text-field hide-details outlined dense small v-model="filters.search_value" placeholder="검색어 입력 (작품 이름, 회원 이름)" />
      </v-row>
    </filter-box>

    <v-card class="mt-2" dense outlined >
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">일반 문의 게시판</v-toolbar-title>
        <v-spacer />
        <v-radio-group dense hide-details v-model="listData.pageRows" row>
          <v-radio v-for="item in ['10','25','50','100']" :key="`page-rows-${item}`" :label="item" :value="item" />
        </v-radio-group>
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W50">글번호</th>
          <th class="W50">문의자</th>
          <th class="W150">그림 제목</th>
          <th class="W80">전화번호</th>
          <th class="W100">상태</th>
          <th class="W80">문의 날짜</th>
          <th class="W80">마지막 메모</th>
          <th class="W80">관리</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in listData.result">
          <tr :key="`item-${index}`">
            <td>{{item.id}}</td>
            <td>{{item.user.nickname}}</td>
            <td>{{item.item.title}}</td>
            <td>{{item.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}}</td>
            <td v-if="item.state === 'progress'">상담 중</td>
            <td v-else-if="item.state === 'wait'"><strong>대기중</strong></td>
            <td v-else-if="item.state === 'done'">완료</td>
            <td v-else-if="item.state === 'cancel'">취소</td>
            <td>{{(new Date(item.writeAt)).dateFormat('yyyy-MM-dd HH:mm')}}</td>
            <td>{{item.last_comment[0] ? item.last_comment[0].comment : ''}}</td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item)">문의 정보</v-list-item>
                  <v-divider />
                  <v-list-item link @click="ChangeStatus(item.id, 'D')" v-if="item.state!=='done' && item.state !=='cancel'">답변 완료</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'P')" v-if="item.state!=='done' && item.state !=='cancel'">상담 진행</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'W')" v-if="item.state==='done' || item.state==='cancel'">답변 대기 중</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'C')" v-if="item.state!=='done' && item.state !=='cancel'">답변 취소</v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
        <tr v-if="listData.result.length===0">
          <td colspan="10">등록된 작가가 없습니다.</td>
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

import FilterBox from "@/views/BackOffice/Components/FilterBox";
import BoardModel from "@/models/boards.model";
import BoardForm from "@/views/BackOffice/Boards/BoardForm";
import BoardMemoForm from "@/views/BackOffice/Boards/BoardMemoForm";

export default {
  name: 'AdminBoardList',
  components: {BoardForm, BoardMemoForm, FilterBox},
  data () {
    return {
      filters: {
        search_key: '',
        search_value: '',
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
      }
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
    GetList() {
      BoardModel
          .GetBoardList()
          .then(res => {
            this.listData.result = res.data.data;
            this.listData.totalRows = res.data.data.length;
            console.log(this.listData.result);
          });

    },
    ChangeStatus (id, changeStatus) {
      let message = "선택하신 답변의 상태를 " ;
      if(changeStatus === 'C') message += "[취소]"
      else if (changeStatus === 'D') message += "[완료]"
      else if (changeStatus === 'W') message += "[대기]"
      else if (changeStatus === 'P') message += "[상담중]"
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

  }
}

</script>