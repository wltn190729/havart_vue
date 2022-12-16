<template>
  <div>
    <v-card class="mt-2" outlined>
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">회원 검색</v-toolbar-title>
        <v-spacer />
      </v-app-bar>
      <div class="d-inline-flex align-center admin-list" style="padding: 1rem;">
        <v-radio-group v-model="filters.search_key" :column=false >
          <v-radio
            v-for="n in [{
              label: '전체',
              key: 'total'
              },
              {
                label: '이름',
                key: 'nickname'
              },
              {
                label : 'ID',
                key: 'email'
              }]"
            :key="n.label"
            :label="n.label"
            :value="n.key"
            style="margin-right: 50px;"
          ></v-radio>
        </v-radio-group>
        
        <v-text-field solo style="width:300px; margin-right:50px; "
          placeholder="검색어를 입력해주세요"
          v-model="filters.search_value"
          hide-details
          dense
        />
        <v-btn @click="userSearch">검색</v-btn>
        
      </div>
      
    </v-card>

    <v-card class="mt-2" dense outlined>
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">회원 목록</v-toolbar-title>
        <v-spacer />
        
      </v-app-bar>
      <table class="grid">

        <thead>
          <tr>
            <th class="W30">번호</th>

            <th class="W60">프로필</th>
            <th class="W120">아이디</th>
            <th class="W120">이름</th>
            <th class="W140">전화번호</th>
            <th class="W140">가입일</th>
            <th class="W60">로그인방식</th>
            <th class="W60">상태</th>
            <th class="W60">관리</th>
          </tr>
        </thead>
        <tbody>
          <template>

            <tr v-for="(item, index) in listData.result" :key="`item-${index}`">
              <td v-if="item.user_id === null" class="text-center">{{`${listData.page-1}${index+1} `}}</td>
              <td v-else class="text-center">{{item.user_id}}</td>
              <td class="text-center">
                <v-img  :src="require('@/assets/default_profile.jpg')"
                  max-width="50"></v-img>
              </td>
              <td class="text-center">{{ item.email }}</td>
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
      <v-pagination v-model="listData.page"
        :length="listData.pageRows === 0 ? 1 : Math.ceil(listData.totalRows / listData.pageRows)"
        :total-visible="7"></v-pagination>
    </v-card>
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


export default {
  name: 'AdminUsersList',
  components: {UsersForm, UserCard, ListCard},
  data () {
    return {
      filters: {
        search_key: 'total',
        search_value: '',
      },
      formData: {
        id: '',
        isOpened: false,
      },
      editData: '',
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: [{
          user_id: 1,
          uid: 1,
          email: 'test@gmail.com',
          nickname: '준호',
          Profile: '@/assets/default_profile.jpg',
          create: '2022-08-22',
          state: 'yes',
          phone:'010-3313-4703',
          qna: [],
          follower: [],
          comment: [],
        }]
      },
      listCardData: {
        title: '',
        data:{}
      },
      ui: {
        UserCardView: false,
        ListCardView: false,
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
    GetList() {
      let formData = this.filters
      formData.page = this.listData.page
      formData.pageRows = this.listData.pageRows

      if (this.filters.search_value) {
        console.log(formData.search_value);
        UserModel
            .GetUserListSearch(this.filters)
            .then(res => {
              console.log(res);
              this.listData.result = res.data;
            });
      } else {
        UserModel
            .GetUserList({
              pageRows: this.listData.pageRows,
              page: this.listData.page
            })
            .then(res => {
              console.log(res);
              this.listData.result = res.data.data;
              this.listData.totalRows = res.data.totalRawCount[0].cnt;
            });
      }
    },
    userSearch() {
      if(this.filters.search_key == 'total') {
        this.filters.search_key = '';
      }
      UserModel
        .GetUserListSearch(this.filters)
        .then(res => {
          // console.log(res, 'hoho')
          this.listData.result = res.data.data
          this.filters.search_key = 'total'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-image {
  display: flex;
  margin: 0 auto;
}
</style>