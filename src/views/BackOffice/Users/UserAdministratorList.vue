<template>
  <div>
    <form @submit.prevent="GetList">
      <table class="tb">
        <tr>
          <th>권한목록</th>
          <td>
            <select class="form-input" v-model.trim="filters.def_name">
              <option value="">전체</option>
              <option value="artist">작가</option>
              <option value="super_manager">슈퍼관리자</option>
              <option value="advisor">고객센터</option>
              <option value="client">클라이언트</option>
            </select>
          </td>
          <th>검색</th>
          <td>
            <select class="form-input" v-model.trim="filters.search_key">
              <option value="">전체</option>
              <option value="nickname">이름</option>
              <option value="email">아이디</option>
            </select>
          </td>
          <td>
            <input class="form-input" v-model.trim="filters.search_value" placeholder="검색어를 입력해주세요">
          </td>
          <td>
            <v-btn color="primary" elevation="0" type="submit"><v-icon>mdi-magnify</v-icon> 검색</v-btn>
          </td>
        </tr>
      </table>
    </form>

    <v-card class="mt-2" dense outlined>
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">관리자 목록</v-toolbar-title>
        <v-spacer />
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm('')"><v-icon small>mdi-plus</v-icon> 회원
          추가</v-btn>
      </v-app-bar>
      <table class="tb">

        <thead>
          <tr>
            <th class="W80">권한</th>
            <th class="W80">ID</th>
            <th class="W80">이름</th>
            <!-- <th class="W100">연락처</th> -->
            <th class="W100">등록일</th>
            <th class="W40">회원가입 승인</th>
            <th class="W40">상태</th>
            <th class="W40">관리</th>
          </tr>
        </thead>
        <tbody>
        <template v-if="ui.isPageLoading">
          <tr>
            <td colspan="7" class="empty">
              <loading-bar />
            </td>
          </tr>
        </template>
        <template v-else>
          <template v-if="listData.result.length > 0" >
            <tr v-for="(item, index) in listData.result" :key="`item-${index}`">
              <td class="text-center">{{ item.kr_auth_def }}</td>
              <td class="text-center">{{ item.email }}</td>
              <td class="text-center">{{ item.nickname }}</td>
              <!-- <td class="text-center">{{ item.phone !== undefined ? item.phone : ''}}</td> -->
              <td class="text-center">{{ String(item.createAt).slice(0, 10)}}</td>
              <td class="text-center">{{item.approval == "true" ? '승인' : '대기중'}}</td>
              <td class="text-center">{{ item.state === 'yes' ? '정상' : '비활성화'}}</td>
              <td>
                <v-menu dense>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                  </template>
                  <v-list small dense>
                    <v-list-item v-if="item.state!=='yes'" link @click="DeleteAdmin(item, 'no')">관리자 삭제</v-list-item>
                    <v-list-item v-if="item.state==='yes'" link @click="DeleteAdmin(item, 'hide')">관리자 비활성화</v-list-item>
                    <v-list-item v-if="item.approval !== 'true'" link @click="SignupSuccess(item.email)">가입 승인</v-list-item>
                    <v-list-item v-if="item.approval" link @click="SignupNot(item.email)">가입 비활성화</v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-if="listData.result.length === 0">
              <td colspan="10">등록된 회원이 없습니다.</td>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
      <v-pagination v-model="listData.page" :total-visible="7" :length="Math.ceil(listData.totalRows / listData.pageRows)"
        @input="GetList"/>
    </v-card>

    <admin-form v-if="ui.adminFormOpened" :id="formData.id" @close="CloseForm" />
  </div>
</template>

<script>
import AdminForm from "@/views/BackOffice/Users/Form/UsersAdministratorForm";
import UserModel from '@/models/users.model'
import AdminModel from '@/models/admins.model'
import LoadingBar from "@/views/BackOffice/Components/LoadingBar";

export default {
  name: 'AdminUsersList',
  components: {LoadingBar, AdminForm},
  data () {
    return {
      filters: {
        search_key: '',
        search_value: '',
        def_name: ''
      },
      formData: {
        id: '',
      },
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: []
      },
      ui: {
        adminFormOpened : false,
        isPageLoading: false,
      },
      authList: [
        { label: '전체', key: '' },
        { label: '작가', key: 'artist' },
        { label : '슈퍼관리자', key: 'super_manager' },
        { label : '고객센터', key: 'advisor' },
        { label : '클라이언트', key: 'client' },
      ],
      searchCategory: ['이름', '아이디'],
    }
  },
  mounted () {
    this.GetList();
    this.GetAuthList();
  },
  methods: {
    OpenForm ( id ) {
      if (id !== undefined) {
        this.ui.adminFormOpened = true
        this.formData.id = id
      }
    },
    CloseForm () {
      this.ui.adminFormOpened = false
      this.formData.email = 0
    },
    GetList() {
      let formData = this.filters
      formData.page = this.listData.page
      formData.pageRows = this.listData.pageRows

      this.isPageLoading = true;

      UserModel
          .GetAdminList(formData)
          .then(res => {
            console.log(res, '어드민 목록');
            this.listData.result = res.data.data;
            this.listData.totalRows = res.data.totalRawCount;
            this.isPageLoading = false;
          });

    },

    DeleteAdmin(item, state) {
      const data = {
        name : item.nickname,
        def_name : item.def_name,
        state
      }
      this.$swal({
        title: '정말 삭제 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '삭제',
      })
      .then((result) => {
        //삭제 버튼 눌럿을시 삭제
        if (result.isConfirmed) {
          UserModel.DeleteAdmin(item.email, data)
            .then(res => {
              // console.log(res);
              this.$swal({
                icon: 'success',
                title: res.data,
                showConfirmButton: false,
                timer: 1000
              }).then(() => {
                this.GetList();
              })
            })
        } 
      });

     
    },
    SignupSuccess(email) {
      AdminModel.GetBoardList(email, {approval: 1}).then(() => this.GetList())
    },
    SignupNot(email) {
      AdminModel.GetBoardList(email, {approval: 0}).then(() => this.GetList())
    },


  }
}
</script>
<style lang="scss">

</style>