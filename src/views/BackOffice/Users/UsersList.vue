<template>
  <div>
    <filter-box @submit="GetList">
      <v-row>
        <div style="width:120px">
          <v-subheader>회원그룹</v-subheader>
        </div>
        <v-col class="pb-0 pt-0" align-self="center">
          <v-row>
            <v-checkbox
                v-for="(item,index) in database.groupList" :key="`filter-group-${index}`"
                dense
                class="mt-0 mr-2"
                hide-details
                v-model="filters.group"
                :value="item"
                :label="item" />
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <div style="width:120px">
          <v-subheader>회원 상태</v-subheader>
        </div>
        <v-col class="pb-0 pt-0" align-self="center">
          <v-row>
            <v-checkbox
                v-for="(item,index) in database.statusList" :key="`filter-status-${index}`"
                dense
                class="mt-0 mr-2"
                hide-details
                v-model="filters.status"
                :value="item.value"
                :label="item.title" />
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <div style="width:120px">
          <v-subheader>검색어 입력</v-subheader>
        </div>
        <v-text-field hide-details outlined dense small v-model="filters.query" placeholder="검색어 입력 (이름,연락처...)" />
      </v-row>
    </filter-box>

    <v-card class="mt-2" dense outlined >
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">회원 목록</v-toolbar-title>
        <v-spacer />
        <v-radio-group dense hide-details v-model="listData.pageRows" row>
          <v-radio v-for="item in ['10','25','50','100']" :key="`page-rows-${item}`" :label="item" :value="item" />
        </v-radio-group>
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm"><v-icon small>mdi-plus</v-icon> 회원 추가</v-btn>
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W80">회원번호</th>
          <th class="W120">회원그룹</th>
          <th class="W120">회원명</th>
          <th class="W240">로그인아이디</th>
          <th class="W140">연락처</th>
          <th class="W100">캐쉬</th>
          <th class="W60">SMS</th>
          <th class="W60">e-mail</th>
          <th>비고</th>
          <th class="W60">관리</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item,index) in listData.result">
          <tr :key="`item-${index}`">
            <td class="text-right">{{item.id}}</td>
            <td class="text-center">{{item.group}}</td>
            <td class="text-center">{{item.nickname}}</td>
            <td>{{item.loginId}}</td>
            <td class="text-center">{{item.phone}}</td>
            <td class="text-right">{{item.cash}}</td>
            <td class="text-center"><v-simple-checkbox :value="item.receiveSms==='Y'" /></td>
            <td class="text-center"><v-simple-checkbox :value="item.receiveEmail==='Y'" /></td>
            <td></td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item.id)">회원 정보</v-list-item>
                  <v-list-item link @click="OpenPasswordForm(item.id)">비밀번호 변경</v-list-item>
                  <v-divider />
                  <v-list-item link>포인트 관리</v-list-item>
                  <v-divider />
                  <v-list-item link @click="ChangeStatus(item.id, 'D')" v-if="item.status==='Y'">접근 금지 설정</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'H')" v-if="item.status==='Y'">휴면 설정</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'Y')" v-if="item.status==='H'">휴면 해제 설정</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'Y')" v-if="item.status==='D'">접근 금지 해제</v-list-item>
                  <v-list-item link @click="ChangeStatus(item.id, 'N')" v-if="item.status==='Y'">탈퇴 처리</v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
        <tr v-if="listData.result.length===0">
          <td colspan="10">등록된 회원이 없습니다.</td>
        </tr>
        </tbody>
      </table>
      <v-pagination
          v-model="listData.page"
          :length="listData.pageRows===0?1:Math.ceil(  listData.totalRows / listData.pageRows )"
          :total-visible="7"
      ></v-pagination>
    </v-card>

    <users-form v-if="formData.isOpened" :id="formData.userId" @close="CloseForm" />
    <user-password-change v-if="passwordFormData.isOpened" :id="passwordFormData.userId" @close="ClosePasswordForm" />
  </div>
</template>

<script>
import FilterBox from "@/views/BackOffice/Components/FilterBox";
import UsersForm from "@/views/BackOffice/Users/UsersForm";
import UserPasswordChange from "@/views/BackOffice/Users/UserPasswordChange";
import UserModel from '@/models/users.model'

export default {
  name: 'AdminUsersList',
  components: {UserPasswordChange, UsersForm, FilterBox},
  data () {
    return {
      filters: {
        group:['하군','플래너','업체','일반'],
        status:['Y'],
        query: ''
      },
      database: {
        groupList: ['하군', '플래너', '업체', '일반'],
        statusList: [{title:'정상',value:'Y'},{title:'휴면',value:'H'},{title:'접근금지',value:'D'},{title:'탈퇴',value:'N'}]
      },
      formData: {
        isOpened: false,
        userId: 0
      },
      passwordFormData: {
        isOpened: false,
        userId: 0
      },
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: [
          {id:1, group:'하군', loginId:'sms6539@hagunlab.com', nickname:'심명식',phone:'010-9597-6539', cash:0, receiveSms:'Y', receiveEmail:'N', status:'Y'}
        ]
      }
    }
  },
  mounted () {
    this.GetList()
  },
  methods: {
    OpenForm ( id ) {
      id = typeof id !== 'undefined' && id > 0 ? id : 0

      this.formData.isOpened = true
      this.formData.userId = id
    },
    CloseForm () {
      this.formData.isOpened = false
      this.formData.userId = 0
    },
    OpenPasswordForm (id) {
      id = typeof id !== 'undefined' && id > 0 ? id : 0

      this.passwordFormData.isOpened = true
      this.passwordFormData.userId = id
    },
    ClosePasswordForm () {
      this.passwordFormData.isOpened = false
      this.passwordFormData.userId = 0
    },

    ChangeStatus (id, changeStatus) {
      let message = "선택하신 회원의 상태를 " ;
      if(changeStatus === 'Y') message += "[정상]"
      else if (changeStatus === 'D') message += "[접근금지]"
      else if (changeStatus === 'H') message += "휴면"
      else if (changeStatus === 'N') message += "[탈퇴처리]"
      message += "로 변경하시겠습니까?"

      this.$swal({
            title: '회원상태 변경',
            text: message,
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '상태변경',
            cancelButtonText: '취소'
        }).then(result => {
            if(result.isConfirmed) {
                // @todo: 회원상태 변경 API 호출
                
            }
        })
    },
    /**
     * 사용자 목록 가져오기
     */
    GetList() {
      let formData = this.filters
      formData.page = this.listData.page
      formData.pageRows = this.listData.pageRows      
      console.log(formData);
      UserModel
        .GetUserList(formData)
        .then(res => {
          console.log(res);
          // this.listData.result = res.data.result
          // this.listData.totalRows = res.data.pageInfo.totalRows
        })
    }
  }
}
</script>