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
          <v-radio v-for="item in [10,25,50,100]" :key="`page-rows-${item}`" :label="item" :value="item" />
        </v-radio-group>
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W50">글번호</th>
          <th class="W50">문의자</th>
          <th class="W150">핸드폰번호</th>
          <th class="W100">상태</th>
          <th class="W80">문의 날짜</th>
          <th class="W80">관리</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in listData.result">
          <tr :key="`item-${index}`">
            <td>{{item.id}}</td>
            <td>{{item.user.nickname}}</td>
            <td>{{item.item.title}}</td>
            <td v-if="item.state === 'progress'">상담 중</td>
            <td v-else-if="item.state === 'done'">계약</td>
            <td v-else-if="item.state === 'cancel'">취소</td>
            <td>{{item.writeAt}}</td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item)">문의 정보</v-list-item>
                  <!--                  <v-list-item link @click="OpenPasswordForm(item.id)">비밀번호 변경</v-list-item>-->
                  <!--                  <v-divider />-->
                  <!--                  <v-list-item link>포인트 관리</v-list-item>-->
                  <!--                  <v-divider />-->
                  <!--                  <v-list-item link @click="ChangeStatus(item.id, 'D')" v-if="item.status==='Y'">접근 금지 설정</v-list-item>-->
                  <!--                  <v-list-item link @click="ChangeStatus(item.id, 'H')" v-if="item.status==='Y'">휴면 설정</v-list-item>-->
                  <!--                  <v-list-item link @click="ChangeStatus(item.id, 'Y')" v-if="item.status==='H'">휴면 해제 설정</v-list-item>-->
                  <!--                  <v-list-item link @click="ChangeStatus(item.id, 'Y')" v-if="item.status==='D'">접근 금지 해제</v-list-item>-->
                  <!--                  <v-list-item link @click="ChangeStatus(item.id, 'N')" v-if="item.status==='Y'">탈퇴 처리</v-list-item>-->
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
  </div>
</template>
<script>

import FilterBox from "@/views/BackOffice/Components/FilterBox";
import BoardModel from "@/models/boards.model";
import BoardForm from "@/views/BackOffice/Boards/BoardForm";

export default {
  name: 'AdminBoardMatchList',
  components: {BoardForm, FilterBox},
  data () {
    return {
      filters: {
        search_key: '',
        search_value: '',
      },
      formData: {
        id: '',
        isOpened: false,
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
    CloseForm () {
      this.formData.isOpened = false
      this.formData.email = 0
    },
    GetList() {
      const param = this.filters;

      // if (param.search_value) {
      //   BoardModel
      //       .GetArtist(param)
      //       .then(res => {
      //         console.log(res.data)
      //         this.listData.result = res.data;
      //       });
      //
      // } else {
      //   BoardModel
      //       .GetBoardList()
      //       .then(res => {
      //         console.log(res);
      //         this.listData.result = res.data;
      //         this.listData.totalRows = res.data.length;
      //       });
      // }

    }
  }
}

</script>