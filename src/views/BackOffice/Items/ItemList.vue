<template>
  <div>
    <filter-box @submit="GetList">
      <v-row :style="{ marginTop: '0px' }">
        <v-col cols="12" md="2" />
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            v-model="formData.search_key"
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
            v-model="formData.search_value"
            dense
            outlined
            label="검색 키워드"
            full-width
            :style="{ marginTop: '10px' }"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn @click="SearchStart" :style="{ marginTop: '10px' }"
            >검색</v-btn
          >
        </v-col>
        <v-col cols="12" md="3" />
      </v-row>
    </filter-box>

    <v-card class="mt-2" dense outlined>
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense style="font-size: 1rem"
          >작품 목록</v-toolbar-title
        >
        <v-spacer />
        <v-radio-group dense hide-details v-model="listData.pageRows" row>
          <v-radio
            v-for="item in ['10', '25', '50', '100']"
            :key="`page-rows-${item}`"
            :label="item"
            :value="item"
          />
        </v-radio-group>
        <v-btn class="ml-2" small color="primary" outlined @click="ApproveItems(true)"
        ><v-icon small>mdi-check</v-icon> 작품 승인</v-btn
        >
        <v-btn class="ml-2" small color="primary" outlined @click="ApproveItems(false)"
        ><v-icon small>mdi-minus</v-icon> 작품 거절</v-btn
        >
        <v-btn class="ml-2" small color="primary" outlined @click="OpenForm(false)"
          ><v-icon small>mdi-plus</v-icon> 작품 추가</v-btn
        >
      </v-app-bar>
      <table class="grid">
        <thead>
          <tr>
            <th class="W30"></th>
            <th class="W30">작품 번호</th>
            <th class="W120">작품 사진</th>
            <th class="W120">작품 이름</th>
            <th class="W60">작가 이름</th>
            <th class="W100">장르</th>
            <th class="W80">사이즈</th>
            <th class="W110">테마</th>
            <th class="W70">그린 날짜</th>
            <th class="W60">조회수</th>
            <th class="W60">공유 횟수</th>
            <th class="W60">승인</th>
            <th class="W10">관리</th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-for="(item, index) in itemsListData" :key="`list-${index}`">
              <td class="text-center">
                  <v-checkbox
                      :value="item.item_id"
                      @click="ChangeCheckBox(item.item_id)"
                  ></v-checkbox>
              </td>
              <td class="text-center">{{ item.item_id }}</td>
              <td class="text-center">
                <div style="text-align: -webkit-center">
                  <v-img
                      v-if="item.imageUrl"
                      :src="item.imageUrl" max-width="80"></v-img>
                  <v-img
                      v-else :src="require('@/assets/default_image.png')"
                      max-width="80"></v-img>
                </div>
              </td>
              <td class="text-center">{{ item.title }}</td>
              <td class="text-center">{{ item.artist.name }}</td>
              <td class="text-center">{{ item.genre }}</td>
              <td class="text-center">{{ item.size.size }}</td>
              <td class="text-center">{{ item.theme }}</td>
              <td class="text-center">{{ item.createAt }}</td>
              <td class="text-center">{{ item.visitCount }}</td>
              <td class="text-center">{{ item.shareCount }}</td>
              <td class="text-center">{{ item.certification ? '노출' : '미노출' }}</td>
              <td>
                <v-menu dense>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon
                      ><v-icon>mdi-dots-vertical</v-icon></v-btn
                    >
                  </template>
                  <v-list small dense>
                    <v-list-item link @click="OpenForm(item.item_id)"
                      >작품 정보</v-list-item
                    >
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
      <v-pagination
        v-model="listData.page"
        :length="
          listData.pageRows === 0
            ? 1
            : Math.ceil(listData.totalRows / listData.pageRows)
        "
        :total-visible="7"
      ></v-pagination>
    </v-card>
  </div>
</template>

<script>
import FilterBox from "@/views/BackOffice/Components/FilterBox";
import ItemModel from "@/models/items.model.js";
import ItemForm from "@/views/BackOffice/Items/ItemForm";

export default {
  name: "AdminItemList",
  components: { FilterBox, ItemForm },
  data() {
    return {
      items: [
        { key: "전체", value: "genreName, materials, size, NAME, title" },
        { key: "장르", value: "genreName" },
        { key: "재료", value: "materials" },
        { key: "사이즈", value: "size" },
        { key: "작가 이름", value: "NAME" },
        { key: "작품 이름", value: "title" },
      ],
      itemsListData: [],
      formData: {
        isOpened: false,
        userId: '',
        search_key: "",
        search_value: "",
      },
      passwordFormData: {
        isOpened: false,
        userId: 0,
      },
      approvalFormData: {
        approval_def: false,
        approval_item: []
      },
      listData: {
        page: 1,
        pageRows: 10,
        totalRows: 0,
      },
    };
  },
  mounted() {
    this.GetList();
  },
  methods: {
    ChangeCheckBox(id){
      this.approvalFormData.approval_item.push(id);
    },
    OpenForm(id) {
      this.formData.isOpened = true;
      this.formData.userId = id;
    },

    CloseForm() {
      this.formData.isOpened = false;
      this.formData.userId = 0;
    },

    ApproveItems(bool) {
      const formData = this.approvalFormData;
      formData.approval_def = bool;

      ItemModel
          .approvalItem(formData)
          .then(res => {
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
        this.itemsListData = res.data;
        console.log(this.itemsListData);

        // 내림차순
        this.itemsListData.sort((a, b) => b.item_id - a.item_id);

        this.itemsListData.map(
          (x) => (x.createAt = x.createAt.split(/[T,Z,.]/)[0])
        );
      });
    },

    /**
     * 검색
     */
    SearchStart() {
      let search_key = this.formData.search_key;
      let search_value = this.formData.search_value;
      ItemModel.SearchItemsList(search_key, search_value).then((res) => {
        this.itemsListData = res.data;
        console.log(this.itemsListData);

        // this.itemsListData.genre = res.data.map((x) => x.genreName);
        for (const i in res.data) {
          this.itemsListData[i].genre = res.data[i].genreName;
          this.itemsListData[i].artist.name = res.data[i].artist[0].name;
          this.itemsListData[i].theme = res.data[i].theme[0].themeName;
          this.itemsListData[i].material = res.data[i].materials;
          this.itemsListData[i].explain = res.data[i].item_explain;
          this.itemsListData[i].createAt = res.data[i].create_at;
          const obj = {};
          obj["size"] = res.data[i].size;
          this.itemsListData[i].size = obj;
        }
      });
    },
  },
};
</script>
