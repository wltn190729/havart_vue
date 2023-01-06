<template>
  <div>
    <form @submit.prevent="GetList()">
      <table class="tb">
        <tr>
          <th>검색</th>
          <td class="W270">
            <label class="chk" v-for="(item,index) in database.searchState" :key="`state-${index}`">
              <input type="checkbox" :value="item.key" @change="chkChange(item.key)">
              <span class="chk-label">{{item.label}}</span>
            </label>

          </td>
          <td class="W400">
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

    <v-card class="mt-2" dense outlined >
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">작가 목록 (검색결과 {{numberFormat(listData.totalRows)}}건)</v-toolbar-title>
        <v-spacer />
        <!-- <v-radio-group dense hide-details v-model="listData.pageRows" row>
          <v-radio v-for="item in ['10','25','50','100']" :key="`page-rows-${item}`" :label="item" :value="item" />
        </v-radio-group> -->
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm(0)"><v-icon small>mdi-plus</v-icon>작가 추가</v-btn>
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W60">번호</th>
          <th class="W80">상태</th>
          <th class="W50">프로필</th>
          <th class="W120">이름</th>
          <th class="W200">장르</th>
          <th>소개글</th>
          <th class="W100">등록작품수</th>
          <th class="W80">관리</th>
        </tr>
        </thead>
        <tbody>
        <template >
          <tr v-if="listData.result.length===0">
            <td colspan="10">등록된 작가가 없습니다.</td>
          </tr>
          <tr v-for="(item,index) in listData.result" :key="`item-${index}`" >
            <td class="text-center">{{item.num}}</td>
            <td class="text-center">
              <v-chip small :color="item.state==='yes'?'primary':'danger'">{{item.state === 'yes' ? '노출 ' : '숨김'}}</v-chip>
            </td>
            <td class="text-center">
              <div class="d-flex justify-center">
                <v-img
                    v-if="item.profileImage"
                    :src="item.profileImage" max-width="80" height="48" contain></v-img>
                <v-img
                    v-else
                    :src="require('@/assets/default_profile.jpg')"
                    max-width="80" height="48"
                ></v-img>
              </div>
            </td>
            <td class="text-center">{{item.name}}</td>
            <td class="text-center">
              <v-chip small label class="ma-1" v-for="(genre,gIndex) in item.genres" :key="`list-${index}-${gIndex}`" v-text="genre" color="secondary" />
            </td>
            <td class="text-left"><div class="explain">{{item.explain.substring(0,300)}}</div></td>
            <td class="text-end">{{numberFormat(item.items.length)}}</td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item.artist_id)">작가 정보</v-list-item>
                  <v-list-item link @click="OpenSelectBox(item)">작품 목록</v-list-item>
                  <v-list-item link @click="OpenDeleteForm(item.artist_id)">삭제</v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
        
        </tbody>
      </table>
      <v-pagination
          v-model="listData.page"
          :total-visible="7"
          :length="listData.pageRows===0?1:Math.ceil(  listData.totalRows / listData.pageRows )"
          @input="GetList"
          
      ></v-pagination>
    </v-card>

    <artist-form v-if="formData.isOpened" :id="formData.id"
                @update="GetList"
                @close="CloseForm()" />

    <artist-item v-if="ui.SelectBoxView" @close="CloseForm('SelectBox')" :id="formData.id" />
  </div>
</template>
<script>

import FilterBox from "@/views/BackOffice/Components/FilterBox";
import ArtistsModel from "@/models/artists.model";
import ArtistForm from "@/views/BackOffice/Artists/ArtistForm";
import ArtistItem from "@/views/BackOffice/Artists/ArtistItem";
import ItemModel from "@/models/items.model";

export default {
  name: 'AdminArtistList',
  components: {ArtistForm, ArtistItem},
  data () {
    return {
      filters: {
        state: [],
        search_key: '',
        search_value: '',
      },
      formData: {
        id: 0,
        isOpened: false,
      },
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: []
      },
      database: {
        searchColumns:[
          { label: '전체', key: '' },
          { label: '작가명', key: 'name' },
          { label: '소개글', key: 'explain' },
        ],
        searchState: [
          { label: '노출', key: 'yes' },
          { label: '숨김', key: 'hide' },
        ]
      },
      addData: {
        name : "",
        genres :[],
        profileImage:"",
        explain: ""
      },
      items: [
        { key: "작가 이름", value: "name" },
      ],
      ui: {
        SelectBoxView: false,
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
    CloseForm (str) {
      console.log(str);
      if(str === 'SelectBox') {
        this.ui.SelectBoxView = false;
      }else {
        this.formData.isOpened = false
        this.formData.email = ''
      }
    },
    OpenSelectBox(id) {
      console.log(id);
      this.formData.id = id;
      this.ui.SelectBoxView = true;
    },

    GetList(refreshPage) {
      refreshPage = typeof refreshPage !== 'undefined' && refreshPage === true;

      let formData = this.filters
      formData.page = this.listData.page;
      formData.pageRows = this.listData.pageRows;


      if(refreshPage) {
        this.listData.page = 1
      }

      ArtistsModel
          .GetArtistList(formData)
          .then(res => {
            this.listData.result = res.data.data;
            this.listData.totalRows = res.data.totalRawCount;
          });

    },
    OpenDeleteForm(id) {
      this.$swal({
        title: '정말 삭제 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '삭제',
      })
      .then((result) => {
        //삭제 버튼 눌럿을시 삭제
        if (result.isConfirmed) {
          ArtistsModel
            .ArtistDel(id)
            .then((res) => {
              this.GetList();
            })
            .catch(e => console.error(e));
        } 
      });
    },

    chkChange (key) {
      if (this.filters.state.includes(key)) {
        this.filters.state = this.filters.state.filter((el) => el !== key);
      } else {
        this.filters.state.push(key);
      }
    }

  }
}

</script>

<style lang="scss" scoped>
.v-application .text-center.explain {
  height: 68.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  border-bottom: 1px dashed #e6e6e6;
}

.explain {
  line-height:1.2em;
  height:3.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

#admin-layout .grid tr td {
  
  border-bottom: 1px dashed #e6e6e6;
}
</style>