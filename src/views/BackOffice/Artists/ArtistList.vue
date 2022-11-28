<template>
  <div>
    <filter-box @submit="GetList">
      <v-row>
        <div style="width:120px">
          <v-subheader>검색어 입력</v-subheader>
        </div>
        <v-text-field hide-details outlined dense small v-model="filters.search_value" placeholder="검색어 입력 (이름,작품)" />
      </v-row>
    </filter-box>

    <v-card class="mt-2" dense outlined >
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">작가 목록</v-toolbar-title>
        <v-spacer />
        <v-radio-group dense hide-details v-model="listData.pageRows" row>
          <v-radio v-for="item in ['10','25','50','100']" :key="`page-rows-${item}`" :label="item" :value="item" />
        </v-radio-group>
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm"><v-icon small>mdi-plus</v-icon> 작가 추가</v-btn>
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W50">작가번호</th>
          <th class="W50">프로필</th>
          <th class="W120">이름</th>
          <th class="W300">장르</th>
          <th class="W80">관리</th>
        </tr>
        </thead>
        <tbody>
        <template >
          <tr v-for="(item,index) in listData.result" :key="`item-${index}`" >
            <td class="text-center">{{item.artist_id}}</td>
            <td class="text-center">
              <div class="d-flex justify-center">
                <!-- <v-img
                    v-if="item.profileImage"
                    :src="item.profileImage" max-width="80"></v-img> -->
                <v-img
                    :lazg-src="require('@/assets/default_profile.jpg')"
                    :src="require('@/assets/default_profile.jpg')"
                    max-width="80"
                ></v-img>
              </div>
            </td>
            <td class="text-center">{{item.name}}</td>
            <td class="text-center">{{item.genres.length===0? '' : item.genres.toString()}}</td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item.artist_id)">작가 정보</v-list-item>
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

    <artist-form v-if="formData.isOpened" :id="formData.id"
                @update="GetList"
                @close="CloseForm" />
  </div>
</template>
<script>

import FilterBox from "@/views/BackOffice/Components/FilterBox";
import ArtistsModel from "@/models/artists.model";
import ArtistForm from "@/views/BackOffice/Artists/ArtistForm";

export default {
  name: 'AdminArtistList',
  components: {ArtistForm, FilterBox},
  data () {
    return {
      filters: {
        search_key: 'name,title',
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
      console.log('작가리스트 검색값',param);
      if (param.search_value) {
        
        ArtistsModel
            .GetArtist(param)
            .then(res => {
              console.log(res.data)
              this.listData.result = res.data;
            });

      } else {
        const test = {
          pageRows: this.listData.pageRows,
          page: this.listData.page
        }
        // console.log(test);
        ArtistsModel
            .GetArtistList()
            .then(res => {
              console.log(res.data.data);
              this.listData.result = res.data.data
            }).catch(e => console.error(e));
      }

    }
  }
}

</script>