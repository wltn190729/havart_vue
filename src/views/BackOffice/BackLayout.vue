<template>
  <v-app id="admin-layout">

    <v-app-bar v-if="isLogin" app clipped-left elevation="0" color="#e2e8ea">
      <v-toolbar-title><router-link class="logo" to="/">관리자 페이지</router-link></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn plain v-bind="attrs" v-on="on" >
            <v-icon>mdi-account</v-icon>
            <span v-if="loginUser.def_name==='super_manager'">슈퍼관리자</span>
            <span v-if="loginUser.def_name==='client'">클라이언트</span>
            <span v-if="loginUser.def_name==='advisor'">고객센터</span>
            <span v-if="loginUser.def_name==='artist'">작가</span>
            /
            {{loginUser.nickname}}
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title type="button" @click="signOut">로그아웃</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-navigation-drawer v-if="isLogin" clipped  app>
      <v-list dense>

        <template v-for="(item,index) in menuList">
          <v-list-group :key="`menu-${index}`" v-if="item.visible" no-action v-model="item.active" :group="item.activePath">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon><v-icon v-text="item.icon" /></v-list-item-icon>
                <v-list-item-content><v-list-item-title v-text="item.title" /></v-list-item-content>
              </v-list-item>
            </template>
            <template v-if="typeof item.items !== 'undefined' && item.items.length > 0">
              <template v-for="(subItem, subIndex) in item.items" >
                <v-list-item :key="`item-${index}-${subIndex}`" v-if="subItem.visible" :link="typeof subItem.link !== 'undefined' && subItem.link.length > 0" :to="subItem.link" exact>
                  <v-list-item-title v-text="subItem.title" />
                </v-list-item>
                <v-divider :key="`item-divider-${index}-${subIndex}`" v-if="typeof subItem.isEndGroup !== 'undefined' && subItem.isEndGroup === true" />
              </template>
            </template>
          </v-list-group>
        </template>

      </v-list>
    </v-navigation-drawer>

    <v-main app>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
#admin-layout {
  font-family: "Roboto", 'Noto Sans KR', sans-serif;

  .logo {
    background-image:url(~@/assets/logo.png);
    width:219px;
    height:48px;
    display:block;
    text-indent:-9999px;
  }
}
</style>

<script>
import BoardModel from '@/models/boards.model'
export default {
  name: 'BackLayout',
  data () {
    return {
      menuList: [
        {
          title: '회원 관리',
          visible: true,
          icon: 'mdi-account-supervisor',
          activePath : '/users',
          items: [
            { title:'일반 회원 목록', visible: true, link: '/users' },
            { title:'관리자 목록', visible: true, link: '/administrator' },
          ]
        },
        
        {
          title: '게시판 관리',
          visible: true,
          icon: 'mdi-tablet-dashboard',
          activePath : '/board',
          items: [
            {title: '일반 문의 게시판', visible: true, link :'/board', isEndGroup:true},
          ]
        },
        {
          title: '작품 관리',
          visible: true,
          icon: 'mdi-wallet-giftcard',
          activePath : '/item',
          items: [
            {title: '작품 관리', visible: true, link :'/item', isEndGroup:true},
            {title: '작가 관리', visible: true, link :'/artist', isEndGroup:true}
          ]
        },
        {
          title: '권한 관리',
          visible: false,
          icon: 'mdi-access-point',
          activePath : '/access',
          items: [
            {title: '대분류 권한', visible: true, link :'/access', isEndGroup:true},
          ]
        },

        // {
        //   title: '시스템 설정',
        //   visible: true,
        //   icon: 'mdi-cogs',
        //   activePath : '/admin/system',
        //   items: [
        //     {title: '기초 코드 관리', visible: true, link:'/admin/system/basecode'},
        //     {title: '사용자 권한 관리' ,visible: true, link:'/admin/authorizes'}
        //   ]
        // }
      ]
    }
  },
  computed : {
    listDataCheck() {
      
      return this.$store.getters['authorize/userInfo'].def_name === 'super_manager' ? true : false
    }
  },
  watch: {
    listDataCheck(value) {
      // console.log(value)
      // 
      this.menuList[3].visible = value
      
    }
  },
  mounted () {
    // console.log(this.listDataCheck)
    this.menuList[3].visible = this.listDataCheck
    // this.GetBoardList ()
  },
  methods: {
    
    // GetBoardList () {
    //   // 기존의 게시판 관리 하위 메뉴들 삭제
    //   const t = this.menuList.find(item => item.title === '게시판 관리')

    //   if(t !== null) {
    //     t.items.splice( 1, t.items.length - 1)
    //   }

    //   BoardModel
    //       .GetBoardList()
    //       .then(res => {
    //         for(let i=0; i<res.data.result.length; i++) {
    //           t.items.push({
    //             title: res.data.result[i].title,
    //             visible: true,
    //             link: `/admin/board/${res.data.result[i].key}`
    //           })
    //         }
    //       })
    // }
  }
}
</script>