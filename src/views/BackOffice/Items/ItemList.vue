<template>
  <div>
    <v-card
    class="mx-auto"
    outlined
    >
      <v-app-bar
      color="deep-purple"
      rounded
      >
       <v-toolbar-title class="white--text">작품 리스트</v-toolbar-title>
      </v-app-bar>
    <v-container>
      
      <v-row 
        class="d-flex "
      >
        <v-col
          sm="1"
          style="background:silver;"
        >
        검색
        </v-col>      
        <v-col
          class="d-flex align-center"
          style="margin-left:60px;"
          sm="9"
        >
          <v-checkbox
            v-model="checkboxList"
            label="장르"
            value="genreName"
            hide-details
            style="margin-top:0;"
          />
          <v-checkbox
            v-model="checkboxList"
            label="재료"
            value="material"
            hide-details
            style="margin-top:0;"
          />
          <v-checkbox
            v-model="checkboxList"
            label="사이즈"
            value="size"
            hide-details
            style="margin-top:0;"
          />
          <v-checkbox
            v-model="checkboxList"
            label="작품명"
            value="title"
            hide-details
            style="margin-top:0;"
          />
          <v-checkbox
            v-model="checkboxList"
            label="작가명"
            value="name"
            hide-details
            style="margin-top:0; margin-right:250px;"
          />
          <v-text-field
            v-model="filters.search_value"
            dense
            outlined
            hide-details
            label="검색 키워드"
            full-width
            
          />
          <v-card-actions>
            <v-btn
              outlined
              text
              @click="SearchStart"
            >
              검색
            </v-btn>
          </v-card-actions>
        </v-col>
      
      </v-row>
    
    </v-container>

      
    </v-card>

    <v-card class="mt-2" dense outlined>
      <v-app-bar flat dense height="40">
        <!-- <v-toolbar-title dense style="font-size: 1rem"
          >작품 목록</v-toolbar-title
        > -->
        <v-spacer />
        
        <v-btn class="ml-2" small color="primary" outlined @click="ApproveItems(true)"
        ><v-icon small>mdi-check</v-icon> 작품 승인</v-btn
        >
        <v-btn class="ml-2" small color="primary" outlined @click="ApproveItems(false)"
        ><v-icon small>mdi-minus</v-icon> 작품 거절</v-btn
        >
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm('')"
          ><v-icon small>mdi-plus</v-icon> 작품 추가</v-btn
        >
      </v-app-bar>
      <table class="grid">
        <thead>
          <tr>
            <th class="W30">
              <v-checkbox 
                class="d-inline-flex"    
              ></v-checkbox></th>
            <th class="W40">번호</th>
            <th class="W70">작품 코드</th>
            <th class="W50">이미지</th>
            <th class="W50">작가</th>
            <th class="W100">작품명</th>
            <th class="W40">제작연도</th>
            <th class="W90">사이즈</th>
            <th class="W50">캔버스</th>
            <th class="W50">재료</th>
            <th class="W50">가격</th>
            <th class="W50">승인/상태</th>
            <th class="W50">등록일</th>
            <th class="W30">관리</th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-for="(item, index) in itemsListData.data" :key="`list-${index}`">
              <td class="text-center">
                <v-checkbox class="d-inline-flex"
                  @click="ChangeCheckBox(item.item_id)"
                ></v-checkbox>
              </td>
              <td class="text-center">{{ item.item_id }}</td>
              <td class="text-center">{{item.itemNumber}}</td>
              <td class="text-center">
                <div style="text-align: -webkit-center">

                    <v-img
                      v-if="(item.images.length > 0)"
                      :lazy-src="item.images[0].url"
                      :src="item.images[0].url"
                      width="50"
                      height="50"
                      :alt="item.name"
                    >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="blue lighten-1"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                    </v-img>
                    <img
                      v-else 
                      :src="require('@/assets/default_image.png')"
                    />
                      

                </div>
              </td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.title }}</td>
              <td class="text-center">{{ (item.create_at).slice(0,4) }}</td>
              <td class="text-center">{{ item.size }}</td>
              <td class="text-center">{{ item.canvas }}</td>
              <td class="text-center">{{ item.material }}</td>
              <td class="text-center">{{ String(item.price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') }}</td>
              <td class="text-center">
                <div class="text-center">{{(item.certification == 1 ? '승인' : '대기')}}</div>
                <div v-if="!stateEdit" class="text-center" style="font-size:small; color:silver;">({{item.itemState}})</div>
                <div v-else class="text-center">
                  <!-- <v-radio-group >
                    <v-radio
                      v-for="n in ['판매중','판매완료','대기중', '전시중']"
                      :key="n"
                      :label="`${n}`"
                      :value="n"
                    ></v-radio>
                  </v-radio-group> -->
                </div>
              </td>
              <td class="text-center">{{ (item.update_at).slice(0,10)}}</td>
              <td>
                <v-menu dense>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                  </template>
                  <v-list small dense>
                    <v-list-item link @click="OpenState(item.item_id)">상태 변경</v-list-item>
                  </v-list>
                </v-menu>  
              </td>
            </tr>
          </template>
          <tr v-if="itemsListData.length === 0">
            <td colspan="10">등록된 회원이 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <item-form v-if="formData.isOpened" :id="formData.userId"
                 @update="GetList"
                 @close="CloseForm">
      </item-form>
      <state-select v-if="stateEdit" @close="CloseForm" @save="UpdateItems"></state-select>
      <v-pagination
          v-model="listData.currentpage"
          :total-visible="listData.page"
          :length="listData.page"
          @next="pageNext"
          @previous="pagePrev"
          @input="pageSelect"
          
      ></v-pagination>
    </v-card>
  </div>
</template>

<script>
import ItemModel from "@/models/items.model";
import AtistModel from '@/models/artists.model'
import ItemForm from "@/views/BackOffice/Items/ItemForm";
import StateSelect from "./StateSelect.vue";
export default {
  name: "AdminItemList",
  components: { ItemForm, StateSelect},
  data() {
    return {
      checkboxList: ['genreName', 'material', 'size', 'title', 'name'],
      genres:{},  
      itemsListData: [],
      formData: {
        isOpened: false,
        userId: '',
      },
      filters: {
        search_key: '',
        search_value: '',
      },
      passwordFormData: {
        isOpened: false,
        userId: 0,
      },
      approval_items: [],
      update_items:[],
      listData: {
        currentpage: 1,
        page: 1,
        pageRows: 10,
        totalRows: 0,
      },
      stateEdit: false,
      isActive: false,
      alignments: [
        'start',
        'center',
        'end',
      ],
    };
  },
  mounted() {
    this.GetList();
    this.GetGenres();

  },
  methods: {
    ChangeCheckBox(id) {
      this.approval_item.push(id);
    },
    OpenForm(id) {
      this.formData.isOpened = true;
      this.formData.userId = id;
    },
    OpenState(item) {
      this.stateEdit = true;
      this.update_items.push(item);
    },
    CloseForm(e) {
      // console.log(e)
      this.stateEdit = !this.stateEdit;
    },
    /*장르 목록 가져오기*/
    GetGenres() {
      AtistModel.GetGenres().then(res => {
        // console.log(res.data, '장르');
        for(let i = 0; i < res.data.length; i++) {
          // this.items.genres.push(res.data[i].genreName)
          this.genres[res.data[i].genreName] = res.data[i].genre_id
        }
      })
    },
    //테마 가져오기
    GetThemes() {
      AtistModel.GetThemes().then(res => {
        // console.log(res, 'themes');
        // res.data.forEach(item => {
        //   // this.items.themes.push(item.themeName)
        // })
      })
    },
    
    /*승인 상태 변경 함수 */
    ApproveItems(bool) {
      const data = {
        approval_def : bool,
        approval_item : this.approval_items

      }

      ItemModel
          .fetchItem(data)
          .then(res => {
            // console.log(res);
            if (res.data.code === '202') {
              this.$swal({
                title: '작품 승인 변경완료',
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: '확인',
              });
              this.GetList();
            }
          });
    },
    /*작품 상태 변경 */
    UpdateItems(str) {
      const data = {
        state_value: str,
        state_item : this.update_items
      }
      this.stateEdit = !this.stateEdit;
      // console.log(str);
      ItemModel
          .updateState(data)
          .then(res => {
            // console.log(res);
            if (res.data.code === '202') {
              this.$swal({
                title: '작품 상태 변경완료',
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: '확인',
              });
              this.GetList();
            }
          });
    },
    /**
     * 작품 목록 가져오기
     */
    GetList() {
      ItemModel.GetItemsList().then((res) => {
        
        console.log(res.data, '작품 목록');
        this.itemsListData = res.data;
        // console.log(this.itemsListData);

        // 내림차순
        this.itemsListData.data.sort((a, b) => b.item_id - a.item_id);

        // this.itemsListData.map(
        //     (x) => (x.createAt = x.createAt.split(/[T,Z,.]/)[0])
        // );
      });
    },

    /**
     * 검색
     */
    SearchStart() {
      const data= this.checkboxList.join(',')
      // console.log(data)
      this.filters.search_key = data;
      ItemModel.SearchItemsList(this.filters).then((res) => {
        this.itemsListData = res.data
        // console.log(res);

       
      });
    },

    DeleteItem(id) {
      ItemModel
          .deleteItem(id)
          .then(res => {
            if (res.data.code === '202') {
              this.$swal({
                title: '삭제 완료',
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: '확인',
              });
            }
          });
    },
    pageNext() {
      
      const pageData = {
          pageRows: this.listData.pageRows,
          page: this.listData.currentpage
        }
      ItemModel
            .GetItemsList(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
    },
    pageSelect(index) {
      const pageData = {
          pageRows: this.listData.pageRows,
          page: this.listData.currentpage
        }
        ItemModel
            .GetItemsList(pageData)
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
        ItemModel
            .GetItemsList(pageData)
            .then(res => {
              // console.log(res.data.data)
              this.listData.result = res.data.data
              
            });
    }
  },

};
</script>
