<template>
  <div>

    <form @submit.prevent="GetList(true)">
      <table class="tb">
        <tr>
          <th>상태</th>
          <td colspan="3">
            <label class="chk" v-for="(item,index) in searchStates" :key="`state-${index}`">
              <input type="checkbox" :value="item.value" v-model="filters.state">
              <span class="chk-label">{{item.key}}</span>
            </label>
          </td>
        </tr>
        <tr>
          <th>장르</th>
          <td colspan="3">
            <label class="chk" v-for="(item,index) in genres" :key="`state-${index}`">
              <input type="checkbox" :value="item.genreName" v-model="filters.genre">
              <span class="chk-label">{{item.genreName}}</span>
            </label>
          </td>
        </tr>
        <tr>
          <th>검색</th>
          <td class="W120">
            <select class="form-input" v-model="filters.search_key">
              <option value="">전체</option>
              <option value="title">작품명</option>
              <option value="name">작가</option>
              <option value="itemNumber">작품코드</option>
            </select>
          </td>
          <td class="W200">
            <input class="form-input" v-model.trim="filters.search_value" />
          </td>
          <td>
            <v-btn type="submit" elevation="0" color="secondary"><v-icon>mdi-magnify</v-icon> 검색적용</v-btn>
          </td>
        </tr>
      </table>
    </form>

    <!--

    <v-card class="mx-auto" outlined>
      <v-container>

        <v-row>
          <v-col>
            <v-select label="상태" :items="searchStates" v-model="selectedStates" dense item-text="value" item-value="key" solo hide-details
                      style="margin-top:0;" />
          </v-col>
          <v-col>
            <v-select label="장르" :items="genres" v-model="selectedGenres" dense item-text="genreName" item-value="genreName" solo hide-details
              style="margin-top:0;" />
          </v-col>
          <v-col>
            <v-select :items="searchItems" v-model="selectedItems" label="작품" dense item-text="value" item-value="key" solo hide-details
              style=" margin-top:0; " />
          </v-col>
          <v-col>
            <v-text-field v-model="filters.search_value" dense style=" flex:4;" solo hide-details label="검색 키워드"
              full-width />
          </v-col>
          <v-col>

            <v-btn @click="SearchStart" style="height: 100%;">
              검색
            </v-btn>

          </v-col>
        </v-row>

      </v-container>


    </v-card>
-->
    <v-card class="mt-2" dense outlined>
      <v-app-bar flat dense height="40">
        <!-- <v-toolbar-title dense style="font-size: 1rem"
          >작품 목록</v-toolbar-title
        > -->
        <v-spacer />
        <v-radio-group hide-details v-model="filters.type" :column=false >
          <v-radio
              v-for="n in searchSort"
              :key="n.key"
              :label="n.key"
              :value="n.value"
              style="margin-right: 15px;"
          ></v-radio>
        </v-radio-group>

        <span style="margin-right: 15px;">/</span>

        <v-radio-group hide-details v-model="filters.order" :column=false >
          <v-radio
              v-for="n in searchSortType"
              :key="n.key"
              :label="n.key"
              :value="n.value"
              style="margin-right: 15px;"
          ></v-radio>
        </v-radio-group>



        <v-btn class="ml-2" small color="primary" outlined @click="ApproveItems(true)"><v-icon small>mdi-check</v-icon>
          작품 승인</v-btn>
        <v-btn class="ml-2" small color="primary" outlined @click="ApproveItems(false)"><v-icon small>mdi-minus</v-icon>
          작품 거절</v-btn>
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm('')"><v-icon small>mdi-plus</v-icon> 작품
          추가</v-btn>
      </v-app-bar>
      <table class="grid">
        <thead>
          <tr>
            <th class="W30">
              <v-checkbox class="d-inline-flex" v-model="selectAll"></v-checkbox>
            </th>
            <th class="W40">번호</th>
            <th class="W70">작품 코드</th>
            <th class="W50">이미지</th>
            <th class="W50">작가</th>
            <th class="W100">작품명</th>
            <th class="W40">제작연도</th>
            <th class="W90">장르</th>
            <th class="W50">가격</th>
            <th class="W50">승인/상태</th>
            <th class="W50">등록일</th>
            <th class="W50">좋아요</th>
            <th class="W30">관리</th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-for="(item, index) in listData.result" :key="`list-${index}`">
              <td class="text-center">
                <v-checkbox class="d-inline-flex" v-model="approval_items" :value="item.item_id" />
              </td>
              <td class="text-center">{{ item.order }}</td>
              <td class="text-center">{{ item.itemNumber }}</td>
              <td class="text-center">
                <div style="text-align: -webkit-center">

                  <v-img v-if="(item.images.length > 0)" :lazy-src="item.images[0].url" :src="item.images[0].url"
                    width="50" height="50" :alt="item.name">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="blue lighten-1"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <v-img v-else width="50" height="50" :src="require('@/assets/default_image.png')" />


                </div>
              </td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.title }}</td>
              <td class="text-center">{{ (item.create_at).slice(0, 4) }}</td>
              <td class="text-center">{{ item.genreName }}</td>
              <td class="text-center">{{ String(item.price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') }}</td>
              <td class="text-center">
                <div class="text-center">{{ (item.certification == 1 ? '승인' : '대기') }}</div>
                <div v-if="!stateEdit" class="text-center" style="font-size:small; color:silver;">({{ item.itemState ?? item.state }})
                </div>
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
              <td class="text-center">{{ (item.create_at).slice(0, 10) }}</td>
              <td class="text-center">{{ item.likeItemCount === null ? 0 : item.likeItemCount }}</td>
              <td>
                <v-menu dense>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                  </template>
                  <v-list small dense>
                    <v-list-item link @click="OpenForm(item.item_id)">작품 수정</v-list-item>
                    <v-list-item link @click="OpenState(item)">상태 변경</v-list-item>
                    <v-list-item link @click="DeleteItem(item.item_id)">작품 삭제</v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
          <tr v-if="listData.result.length === 0">
            <td colspan="10">등록된 작품이 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <item-form v-if="formData.isOpened" :id="formData.userId" @update="GetList" @close="CloseForm">
      </item-form>
      <state-select v-if="stateEdit" @close="CloseSelect" @save="UpdateItems" :id="stateItem"></state-select>
      <v-pagination
          v-model="listData.page"
          :length="listData.pageRows===0?1:Math.ceil(  listData.totalRows / listData.pageRows )"
          :total-visible="7"
          @input="GetList"
      ></v-pagination>
    </v-card>
  </div>
</template>

<script>
import ItemModel from "@/models/items.model";
import AtistModel from '@/models/artists.model'
import ItemForm from "@/views/BackOffice/Items/ItemForm";
import StateSelect from "./StateSelect.vue";
import BoardModel from "@/models/boards.model";

export default {
  name: "AdminItemList",
  components: { ItemForm, StateSelect},
  data() {
    return {
      checkboxList: ['genreName', 'material', 'size', 'title', 'name'],
      test: [
        'test1',
        'test2',
        'test3',
        'test4',
      ],
      genres: [],
      themes: [],
      sizes: [],
      formData: {
        isOpened: false,
        userId: '',
      },
      filters: {
        type: 1,
        order: 'ASC',
        search_key: '',
        search_value: '',
        state: [],
        genre: []
      },
      passwordFormData: {
        isOpened: false,
        userId: 0,
      },
      approval_items: [],
      update_items: [],
      listData: {
        result: [],
        page: 1,
        pageRows: 10,
        totalRows: 0,
      },
      stateEdit: false,
      stateItem: '',
      isActive: false,
      alignments: [
        'start',
        'center',
        'end',
      ],
      searchItems: [
        {
          key: '',
          value: '전체'
        },
        {
          key: 'title',
          value: '작품명'
        },
      ],
      searchStates: [
        {
          key: '판매중',
          value: '판매중'
        },
        {
          key: '판매완료',
          value: '판매완료'
        },
        {
          key: '대기중',
          value: '대기중'
        },
        {
          key: '전시중',
          value: '전시중'
        },
      ],
      searchSort: [
        {
          key: '주문순',
          value: 1
        },
        {
          key: '방문순',
          value: 2
        },
        {
          key: '좋아요순',
          value: 3
        },
      ],
      searchSortType: [
        {
          key: '내림차순',
          value: 'DESC'
        },
        {
          key: '올림차순',
          value: 'ASC'
        },
      ],

      selectedGenres: '',
      selectedThemes: '',
      selectedItems: '',
      selectedStates: '',

    };
  },
  mounted() {
    this.GetList(true);
    this.GetGenres();
    this.GetThemes();
    this.GetSizes();

  },
  computed: {
    selectAll: {
      get() {
        return this.listData.result ? (this.approval_items ? (this.listData.result.length === this.approval_items.length) : false) : false;
      },
      set(value) {
        const selected = [];

        if (value) {
          this.listData.result.forEach((com) => {
            selected.push(com.item_id);
          });
        }

        this.approval_items = selected;
      }
    }
  },
  watch: {
    'filters.type'() {
      this.GetList(true);
    },

    'filters.order'() {
      this.GetList(true);
    },
  },
  methods: {
    OpenForm(id) {
      this.formData.isOpened = true;
      this.formData.userId = id;
    },
    OpenState(item) {
      this.stateEdit = true;
      this.stateItem = item;
      this.update_items.push(item.item_id);
    },
    CloseForm() {
      // console.log(e)
      this.formData.userId = '';
      this.formData.isOpened = false;
    },
    CloseSelect() {
      this.stateEdit = !this.stateEdit;
    },
    /*장르 목록 가져오기*/
    GetGenres() {
      AtistModel.GetGenres().then(res => {
        // console.log(res.data, '장르');
        this.genres = res.data
      })
    },
    //테마 가져오기
    GetThemes() {
      AtistModel.GetThemes().then(res => {
        // console.log(res, 'themes');
        this.themes = res.data
      })
    },
    /**size 가져오기 */
    GetSizes() {
      AtistModel.GetSizes().then(res => {
        console.log(res.data, 'sizes')
      })
    },
    
    /*승인 상태 변경 함수 */
    ApproveItems(bool) {
      if (this.approval_items.length === 0) {
        return this.$swal({
          title: '한 개 이상의 작품을 선택해주세요.',
          confirmButtonText: '확인',
          width: 600
        })
      }

      console.log(this.approval_items);

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

              this.approval_items = [];

              this.GetList(false);

              this.approval_items = [];
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
    GetList(refreshPage) {
      refreshPage = typeof refreshPage !== 'undefined' && refreshPage === true;



      let formData = this.filters
      formData.page = this.listData.page;
      formData.pageRows = this.listData.pageRows;


      if(refreshPage) {
        this.listData.page = 1
      }

      ItemModel
          .GetItemsList(formData)
          .then(res => {
            this.listData.result = res.data.data;
            this.listData.totalRows = res.data.totalRawCount;
            this.approval_items = [];
          });

    },

    DeleteItem(id) {
      this.$swal({
        title: '작품 삭제',
        text: `선택하신 작품을 삭제 처리 하시겠습니까?`,
        icon: 'question',
        confirmButtonText: '삭제하기',
        cancelButtonText: '취소하기',
        showCancelButton: true,
        showConfirmButton: true
      }).then(res => {
        if (res.isConfirmed) {
          ItemModel
              .deleteItem(id)
              .then(res => {
                if (res.data.code === '202') {
                  this.GetList();
                }
              });
        }
      });

    },

  },

};
</script>

<style lang="scss" scoped>

</style>