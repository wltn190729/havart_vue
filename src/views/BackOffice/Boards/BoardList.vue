<template>
  <div>

    <v-card flat outlined>
      <v-app-bar dense flat>
        <v-toolbar-title>문의 게시판</v-toolbar-title>
        <v-spacer />
        <!-- <v-btn color="primary" small @click="OpenForm"><v-icon small>mdi-plus-circle</v-icon> 신규 게시판 추가</v-btn> -->
      </v-app-bar>
      <table class="grid">
        <thead>
        <tr>
          <th>글번호</th>
          <th>문의자</th>
          <th>그림 제목</th>
          <th>상태</th>
          <th>작성 날짜</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="listData.result.length===0">
          <td colspan="10">생성된 게시판이 없습니다.</td>
        </tr>
        <tr v-for="(item,index) in listData.result" :key="`list-${index}`">
          <td>{{item.id}}</td>
          <td>{{item.user.nickname}}</td>
          <td>{{item.item.title}}</td>
          <td v-if="item.state === 'progress'">진행중</td>
          <td v-else-if="item.state === 'done'">답변완료</td>
          <td v-else-if="item.state === 'cancel'">문의취소</td>
          <td>{{item.writeAt.substr(0,10)}}</td>
        </tr>
        </tbody>
      </table>
    </v-card>

    <board-form
        v-if="formData.isOpened"
        :id="formData.id"
        @close="CloseForm"
        @update="GetList"
    />
  </div>
</template>

<script>
import BoardModel from '@/models/boards.model'
import BoardForm from "@/views/BackOffice/Boards/BoardForm";

export default {
  name: 'BoardList',
  components: {BoardForm},
  data () {
    return {
      listData: {
        result: [],
        totalRows: 0
      },
      formData: {
        isOpened: false,
        id: ''
      }
    }
  },
  mounted() {
    this.GetList()
  },
  methods: {
    OpenForm (id) {
      id = typeof id !== 'undefined' && id > 0 ? id : 0

      this.formData.isOpened = true
      this.formData.id = ''
    },
    CloseForm () {
      this.formData.id = ''
      this.formData.isOpened = false
    },
    GetList() {
      BoardModel
          .GetBoardList()
          .then(res => {
            console.log(res);
            this.listData.result = res.data;
            this.listData.totalRows = res.data.length;
          })
    }
  }
}
</script>
//글번호 ,유저 이름(문의자), 아이템 타이틀, 상태(추가예정 state), 작성일(writeAt), // 디스크립션(text) 클릭 문의내용임... 
//progress 진행중
//done 완료
//cancel 취소