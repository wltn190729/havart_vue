<template>
  <div>
    <filter-box @submit="GetList">
      <v-row :style="{ marginTop: '0px' }">
        <v-col cols="12" md="2" />
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            v-model="filters.search_key"
            :items="items"
            item-text="key"
            item-value="value"
            label="검색 조건"
            dense
            solo
            :style="{ width: '90px', marginLeft: '90px', marginTop: '10px' }"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.search_value"
            dense
            outlined
            label="검색 키워드"
            full-width
            :style="{ marginTop: '10px' }"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn type="submit" :style="{ marginTop: '10px' }"
            >검색</v-btn
          >
        </v-col>
        <v-col cols="12" md="3" />
      </v-row>
    </filter-box>

    <v-card class="mt-2" dense outlined >
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size:1rem;">작가 목록(total: {{listData.totalRows}})</v-toolbar-title>
        <v-spacer />
        <!-- <v-radio-group dense hide-details v-model="listData.pageRows" row>
          <v-radio v-for="item in ['10','25','50','100']" :key="`page-rows-${item}`" :label="item" :value="item" />
        </v-radio-group> -->
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm(0)"><v-icon small>mdi-plus</v-icon>작가 추가</v-btn>
      </v-app-bar>
      <table class="grid">

        <thead>
        <tr>
          <th class="W50">번호</th>
          <th class="W50">프로필</th>
          <th class="W120">이름</th>
          <th class="W100">소개글</th>
          <th class="W50">상태</th>
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
            <td class="text-center explain">{{item.explain}}</td>
            <td class="text-center">{{item.state}}</td>
            <td>
              <v-menu dense>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </template>
                <v-list small dense>
                  <v-list-item link @click="OpenForm(item.artist_id)">작가 정보</v-list-item>
                  <v-list-item link @click="OpenSelectBox(item.artist_id)">작품 목록</v-list-item>
                  <v-list-item link @click="OpenDeleteForm(item.artist_id)">삭제</v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
        
        </tbody>
      </table>
      <v-pagination
          v-model="listData.currentpage"
          :total-visible="7"
          :length="Math.ceil(listData.totalRows / listData.pageRows)"
          @next="pageNext"
          @previous="pagePrev"
          @input="pageSelect"
          
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

export default {
  name: 'AdminArtistList',
  components: {ArtistForm, FilterBox, ArtistItem},
  data () {
    return {
      filters: {
        search_key: 'name',
        search_value: '',
      },
      formData: {
        id: 0,
        isOpened: false,
      },
      listData: {
        currentpage:1,
        page: 1,
        pageRows: 10,
        totalRows: 0,
        result: []
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
    GetList() {
      const param = this.filters;
      console.log('작가리스트 검색값',param.search_value);
      if (param.search_value) {
        console.log('여기로 들어오면 안됩니다.');
        ArtistsModel
            .GetArtist(param)
            .then(res => {
              console.log(res)
              this.listData.result = res.data.data;
              this.listData.totalRows = res.data.totalRawCount[0].cnt;
              this.listData.page = res.data.totalRawCount === 0
                  ? 1
                  : Math.ceil(  this.listData.totalRows/ this.listData.pageRows )
              // console.log(this.listData)
            }).catch(e => console.error(e, '검색 에러'));

      } else {
        const pageData = {
          pageRows: 10,
          page: this.listData.currentpage
        }
        // console.log('hohoho')
        ArtistsModel
            .GetArtistList(pageData)
            .then(res => {
              console.log(res)
              // const test = res.data.data
              // test.sort((x,y) => y.state - x.state )
              // console.log(test[0].state, 'hoho')
              
              this.listData.totalRows = res.data.totalRawCount[0].cnt;
              // console.log(this.listData.totalRows, 'total')
              this.listData.result = res.data.data;
              this.listData.result.sort( (x,y) => y.artis_id - x.artis_id)
              this.listData.page = res.data.totalRawCount === 0 
                ? 1
                : Math.ceil(  this.listData.totalRows/ this.listData.pageRows )
              // console.log(this.listData)
            }).catch(e => console.error(e));
      }

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
            .then(res => console.log(res))
            .catch(e => console.error(e));
        } 
      });
    },
    pageNext() {
      
      const pageData = {
          pageRows: this.listData.pageRows,
          page: this.listData.currentpage,
          search_key: this.filters.search_key,
          search_value: this.filters.search_value
        }
      ArtistsModel
            .GetArtist(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
    },
    pageSelect(index) {
      const pageData = {
        pageRows: this.listData.pageRows,
        page: this.listData.currentpage,
        search_key: this.filters.search_key,
        search_value: this.filters.search_value
        }
      ArtistsModel
            .GetArtist(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
    },
    pagePrev() {
      const pageData = {
        pageRows: this.listData.pageRows,
        page: this.listData.currentpage,
        search_key: this.filters.search_key,
        search_value: this.filters.search_value
        }
      ArtistsModel
            .GetArtist(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
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

#admin-layout .grid tr td {
  
  border-bottom: 1px dashed #e6e6e6;
}
</style>