<template>
  <div>
    <form @submit.prevent="GetList(true)">
      <table class="tb">
        <tr>
          <th>검색</th>
          <td class="W380">
            <v-radio-group hide-details v-model="filters.search_key" :column=false >
              <v-radio
                  v-for="n in database.searchColumns"
                  :key="n.label"
                  :label="n.label"
                  :value="n.key"
                  style="margin-right: 50px;"
              ></v-radio>
            </v-radio-group>
          </td>
          <td>
            <input class="form-input" v-model.trim="filters.search_value" placeholder="검색어를 입력해주세요" />
          </td>
          <td>
            <v-btn elevation="0" color="primary" type="submit"><v-icon>mdi-magnify</v-icon> 검색</v-btn>
          </td>
        </tr>
      </table>
    </form>

    <table class="tb mt-2">

      <thead>
      <tr>
        <th class="W30">번호</th>
        <th class="W60">프로필</th>
        <th class="">아이디</th>
        <th class="W120">이름</th>
        <th class="W140">전화번호</th>
        <th class="W140">가입일</th>
        <th class="W60">로그인방식</th>
        <th class="W60">상태</th>
        <th class="W60">관리</th>
      </tr>
      </thead>
      <tbody>
      <template v-if="ui.isPageLoading">
        <tr>
          <td colspan="9" class="empty">
            <loading-bar />
          </td>
        </tr>
      </template>
      <template v-else>

        <tr v-for="(item, index) in listData.result" :key="`item-${index}`">
          <td class="text-end" v-if="item.user_id === null">{{ listData.totalRows - ((listData.page-1) * listData.pageRows) - index}}</td>
          <td v-else class="text-center">{{item.user_id}}</td>
          <td class="text-center">
            <v-img  :src="require('@/assets/default_profile.jpg')"
                    max-width="50"></v-img>
          </td>
          <td class="text-left">{{ item.email }}</td>
          <td class="text-center">{{ item.nickname }}</td>
          <td class="text-center">{{ item.phone }}</td>
          <td class="text-center">{{ String(item.create_at).slice(0, 10) }}</td>
          <td class="text-center">{{item.howToLogin}}</td>
          <td class="text-center">{{ item.state === 'yes' ? '정상' : '비활성화' }}</td>
          <td>
            <v-menu dense>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list dense>
                <!-- <v-list-item link @click="OpenCard('user', item.email)">회원 정보</v-list-item> -->
                <!-- <v-list-item link @click="OpenPasswordForm(item.id)">비밀번호 변경</v-list-item> -->
                <!-- <v-list-item link>문의목록 확인</v-list-item>
                <v-list-item link>리뷰목록 확인</v-list-item>
                <v-list-item link>찜 목록 확인</v-list-item>-->
                <v-list-item link @click="OpenCard('likeList', item.itemLike)">좋아요 목록</v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
      <tr v-if="listData.result.length === 0">
        <td colspan="10">등록된 회원이 없습니다.</td>
      </tr>
      </tbody>
    </table>
    <v-pagination v-model="listData.page" :total-visible="7" :length="Math.ceil(listData.totalRows / listData.pageRows)"
                  @input="GetList"/>
    <user-card v-if="ui.UserCardView" cardtype="user" :email="editData" @close="CloseForm" />
    <list-card v-if="ui.ListCardView" :title="listCardData.title" :data="listCardData.data" @close="CloseForm"/>
    <users-form v-if="formData.isOpened" :id="formData.id" @update="GetList" @close="CloseForm" />
  </div>
</template>

<script>

import UsersForm from "@/views/BackOffice/Users/Form/UsersForm";
import UserCard from "./components/UserCard.vue";
import ListCard from "./components/ListCard.vue";
import UserModel from '@/models/users.model'
import LoadingBar from "@/views/BackOffice/Components/LoadingBar";

export default {
  name: 'AdminUsersList',
  components: {LoadingBar, UsersForm, UserCard, ListCard},
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
      database: {
        searchColumns:[
          { label: '전체', key: '' },
          { label: '이름', key: 'nickname' },
          { label : 'ID', key: 'email' }
        ]
      },
      editData: '',
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: []
      },
      listCardData: {
        title: '',
        data:{}
      },
      ui: {
        UserCardView: false,
        ListCardView: false,
        isPageLoading: false
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
    OpenCard(str, data) {
      if(str === 'user') {
        this.ui.UserCardView = true;
        this.editData = data
      }else if(str === 'likeList') {
        this.ui.ListCardView = true;
        this.listCardData.data = data
      }
    },
    CloseForm (str) {
      // console.log(str)
      if(str == 'user') {
        this.ui.UserCardView = false;
      }else if(str === 'likeList') {
        this.ui.ListCardView = false;
      }
      
      this.formData.isOpened = false
      this.formData.email = 0
    },
    GetList(refreshPage) {
      refreshPage = typeof refreshPage !== 'undefined' && refreshPage === true;

      let formData = this.filters
      formData.page = this.listData.page
      formData.pageRows = this.listData.pageRows

      if(refreshPage) {
        formData.page = 1
        this.listData.page = 1
      }
      this.ui.isPageLoading = true;
      UserModel
          .GetUserList(formData)
          .then(res => {
            this.listData.result = res.data.data;
            this.listData.totalRows = res.data.totalRawCount;
            this.ui.isPageLoading = false;
          });
    },
  }
}
</script>

<style lang="scss" scoped>
.v-image {
  display: flex;
  margin: 0 auto;
}
</style>