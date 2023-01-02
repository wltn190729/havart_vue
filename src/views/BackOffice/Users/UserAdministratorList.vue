<template>
  <div>
    <v-card class="mt-2" outlined>
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">관리자 검색</v-toolbar-title>
        <v-spacer />
      </v-app-bar>
      <div class="d-inline-flex admin-list" style="padding: 1rem;">
        <v-select 
          class="--auth-list"
          style="max-width:150px; margin-right: 50px;"
          :items="authList"
          @change="Selectauth"
          label="권한목록"
          dense
          solo>
        </v-select>
        <v-select
          class="--category-list"
          style="max-width:150px; margin-right: 50px;"
          :items="searchCategory"
          @change="SelectCategory"
          label="선택"
          dense
          solo>
        </v-select>
        <v-text-field solo dense style="width:300px; margin-right: 50px;"
        placeholder="검색어를 입력해주세요"
        v-model="filters.search_value"
        />
        <v-btn @click="Adminsearch">검색</v-btn>
        
      </div>
      
    </v-card>

    <v-card class="mt-2" dense outlined>
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">관리자 목록</v-toolbar-title>
        <v-spacer />
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm('')"><v-icon small>mdi-plus</v-icon> 회원
          추가</v-btn>
      </v-app-bar>
      <table class="grid">

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
          
            <tr v-for="(item, index) in listData.result" :key="`item-${index}`">
              <td class="text-center">{{ item.kr_auth_def }}</td>
              <td class="text-center">{{ item.email }}</td>
              <td class="text-center">{{ item.nickname }}</td>
              <!-- <td class="text-center">{{ item.phone !== undefined ? item.phone : ''}}</td> -->
              <td class="text-center">{{ String(item.createAt).slice(0, 10)}}</td>
              <td class="text-center">{{item.approval === true ? '승인' : '대기중'}}</td>
              <td class="text-center">{{ item.state === 'yes' ? '정상' : '비활성화'}}</td>
              <td>
                <v-menu dense>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                  </template>
                  <v-list small dense>
                    <v-list-item link @click="DeleteAdmin(item, 'no')">관리자 삭제</v-list-item>
                    <v-list-item link @click="DeleteAdmin(item, 'hide')">관리자 비활성화</v-list-item>
                    <v-list-item link @click="SignupSuccess(item.email)">가입 승인</v-list-item>
                    <v-list-item link @click="SignupNot(item.email)">가입 비활성화</v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          
          <tr v-if="listData.result.length === 0">
            <td colspan="10">등록된 회원이 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <v-pagination v-model="listData.page" :total-visible="7" :length="Math.ceil(listData.totalRows / listData.pageRows)"
        @next="pageNext"  @previous="pagePrev" @input="pageSelect"/>
    </v-card>

    <admin-form v-if="ui.adminFormOpened" :id="formData.id" @close="CloseForm" />
  </div>
</template>

<script>
import AdminForm from "@/views/BackOffice/Users/Form/UsersAdministratorForm";
import UserModel from '@/models/users.model'
import AdminModel from '@/models/admins.model'

export default {
  name: 'AdminUsersList',
  components: {AdminForm},
  data () {
    return {
      filters: {
        search_key: '',
        search_value: '',
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
      },
      authList: [],
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
      if (formData.search_value) {
        console.log(formData.search_value);

        UserModel
            .GetUserListSearch(formData)
            .then(res => {
              this.listData.result = res.data;
            });
      } else {
        const params = {
          pageRows: this.listData.pageRows,
          page: this.listData.page
        }
        UserModel
            .GetAdminList(params)
            .then(res => {
              console.log(res, '어드민 목록');
              this.listData.result = res.data.data;
            });
      }
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
    GetAuthList () {
      UserModel.GetAuthDef().then(res => {
        res.data.forEach(item => {
          this.authList.push(item.kr_auth_def)
        })
        // console.log(res, '관리자 권한 목록');
      })
    },
    Selectauth(item){
      if(this.filters.search_key.length > 0 ) {
        this.filters.search_key += ',def_name';
      }else {
        this.filters.search_key += 'def_name';
      }
    },
    SelectCategory(item){
      if(this.filters.search_key.length > 0 ) {
        this.filters.search_key += item == '이름' ? ',nickname' : ',userAuth.email'
      }else {
        this.filters.search_key += item == '이름' ? 'nickname' : 'userAuth.email'
      }
      
    },
    Adminsearch() {
      console.log(this.filters)
      const params = {...this.filters}
      UserModel.GetAdminListSearch(params).then(res => {
        // console.log(res, '관리자 검색 결과')
        this.listData.result = res.data.data
      })
    },
    SignupSuccess(email) {
      AdminModel.GetBoardList(email, {approval: 1}).then(() => this.GetList())
    },
    SignupNot(email) {
      AdminModel.GetBoardList(email, {approval: 0}).then(() => this.GetList())
    },
    pageNext() {
      
      const pageData = {
          pageRows: this.listData.pageRows,
          page: this.listData.currentpage
        }
        UserModel
            .GetAdminList(pageData)
            .then(res => {
              console.log(res.data)
              this.listData.result = res.data.data
              
            });
    },
    pageSelect(index) {
      const pageData = {
          pageRows: this.listData.pageRows,
          page: this.listData.currentpage
        }
        UserModel
            .GetAdminList(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
    },
    pagePrev() {
      const pageData = {
          pageRows: this.listData.pageRows,
          page: this.listData.currentpage
        }
        UserModel
            .GetAdminList(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
    },
  }
}
</script>
<style lang="scss">

</style>