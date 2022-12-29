<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ? '작품 관리' : '작품 생성'" :width="700">
    <form @submit.prevent="OnSubmit">
      <div>
      <table class="tb">
        <tr>
          <td>
            <div style="text-align: -webkit-center; padding: 5px;">
              <div v-for="(item, index) in profileImage " :key="index">
                <v-img
                    v-if="item"
                    :src="item"
                    max-width="360"
                    contain
                >
                </v-img>
                <v-img
                    v-else :src="require('@/assets/default_image.png')"
                    width="360"
                ></v-img>
              </div>
              <v-file-input
                  hide-input
                  prepend-icon="mdi-camera"
                  accept="image/*"
                  label="사진을 선택하려면 누르세요."
                  multiple
                  outlined
                  dense
                  @change="uploadImg"
              >
              </v-file-input>
            </div>
          </td>
        </tr>

      </table>
      <table class="tb">
        <tr v-if="formData.artist">
          <th>
            작가명
          </th>
          <td>
            {{ formData.artist[0].name }}
          </td>
          <th>작가번호</th>
          <td>
            {{ formData.artist_id }}
          </td>
        </tr>
        <tr>
          <th>사이즈</th>
          <td>
            <div style="transform: translate(0, 25%)">
              <v-autocomplete
                  v-model="formData.size_id"
                  :items="sizeList"
                  item-text="size"
                  item-value="size_id"
                  dense
                  required
                  outlined
              >
              </v-autocomplete>
            </div>
          </td>
          <th rowspan="">테마</th>
          <td rowspan="">
            <div style="transform: translate(0, 25%)">
              <v-autocomplete
                  v-model="formData.theme_id"
                  :items="themeList"
                  item-text="themeName"
                  item-value="theme_id"
                  dense
                  required
                  outlined
              >
              </v-autocomplete>
            </div>
          </td>
        </tr>
        <tr>
          <th>장르</th>
          <td>
            <div style="transform: translate(0, 25%)">
              <v-autocomplete
                  v-model="formData.genre_id"
                  :items="genresList"
                  item-text="genreName"
                  item-value="genre_id"
                  dense
                  required
                  outlined
              >
              </v-autocomplete>

            </div>
          </td>
          <th>작가</th>
          <td>
            <div style="transform: translate(0, 25%)">
              <v-autocomplete
                v-model="formData.artist_id"
                :items="artistList"
                item-text="NAME"
                item-value="artist_id"
                dense
                required
                outlined
              />
            </div>
          </td>
        </tr>
        <tr>
          <th>재료</th>
          <td>
            <div style="transform: translate(0, 25%)">
              <v-autocomplete
                  v-model="formData.material_id"
                  :items="material"
                  item-text="material"
                  item-value="material_id"
                  dense
                  required
                  outlined
              >
              </v-autocomplete>
            </div>
          </td>
          <th>가격</th>
          <td>
            <v-text-field
                outlined
                hide-details
                required
                dense
                type="number"
                v-model.number="formData.price"
            />
          </td>
        </tr>
        <tr>
          <th>작품번호</th>
          <td>
            <v-text-field
                outlined
                hide-details
                dense
                required
                v-model="formData.itemNumber"
            />
          </td>
          <th >작품명</th>
          <td >
            <v-text-field
                outlined
                hide-details
                required
                dense
                v-model="formData.title"
            />
          </td>
        </tr>
        <tr>
          <th>order</th>
          <td colspan="3">
            <v-text-field
              type="text"
                outlined
                hide-details
                dense
                v-model="formData.order"
                required
            />
          </td>
        </tr>
        <tr>
          <th>짧은 설명</th>
          <td colspan="3">
            <v-text-field
                outlined
                hide-details
                dense
                v-model="formData.shortExplain"
            />
          </td>
        </tr>
        <tr>
          <th>설명</th>
          <td colspan="3">
            <v-textarea
                outlined
                hide-details
                required
                dense
                v-model="formData.explain"
            ></v-textarea>
          </td>
        </tr>
        <v-text-field
            type="hidden"
            v-model="formData.artist_id"
        />

      </table>
      </div>
      <v-btn type="submit" class="mt-2" block large color="primary">작품 설정 저장</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import ItemsModel from "@/models/items.model";
import ArtistsModel from "@/models/artists.model";

export default {
  components: {ModalDialog},
  props: {
    id: {
      type: [Number, String, Boolean, Object, Array],
      required: false,
      default: false
    }
  },
  data () {
    return {
      formData: {
        artist_id: '',
        title: '',
        certification: 0,
        explain: '',
        genre_id: '',
        itemNumber: '',
        material: 0,
        price: 0,
        size_id:0,
        itemCode: 0,
        material_id: 0,
        theme_id:0,
        images: [],
        files: [],
        shortExplain: '',
        order:0, //api 저장 해야됨 (id값 줘야됨)
        frame:0, //api 저장 해야됨 (액자 여부)
        tags:'',//사용자가 일일이 넣어야됨
        canvas:1,
      },
      isValidCode: false,
      profileImage: [],
      validCode: '',
      searchData: {
        search_key: 'item_id',
        search_value: ''
      },
      date: {
        YYYY: new Date().getFullYear(),
        MM: new Date().getMonth() + 1,
        D: new Date().getDate()
      },
      sizeList: [],
      themeList: [],
      genresList: [],
      material: [],
      artistList: [],
    };
  },
  computed: {

  },
  mounted () {
    if (this.IsEdit() ) {
      const formData = {};
      formData['item.item_id'] = this.id;
      this.GetInfo(formData);
    }
    this.GetArtistList();
    this.GetSize();
    this.GetTheme();
    this.GetGenres();
    this.GetMaterial();
  },

  methods: {
    OnSubmit() {
      let formData = this.formData;
      formData.material = this.formData.material_id;
      delete formData.material_id;

      if (Object.keys(formData.files).length === 0) {
        delete formData.files;
      }

      if (this.id) {
        ItemsModel
            .updateItem(this.id, formData)
            .then(res => {
              console.log(res);
              if (res.data.code === 204) {
                this.$swal({
                  title: '업데이트 완료',
                  icon: 'success',
                  showConfirmButton: true,
                  showCancelButton: false,
                  confirmButtonText: '확인',
                });
              } else {
                this.$swal({
                  title: '에러',
                  text: res.data.message,
                  icon: 'error',
                  showConfirmButton: true,
                  showCancelButton: false,
                  confirmButtonText: '확인',
                });
              }
            });
      } else {
        console.log(formData);
        ItemsModel
            .registerItem(formData)
            .then(res => {
              if (res.data.code === 204) {
                this.$swal({
                  title: '등록 완료',
                  icon: 'success',
                  showConfirmButton: true,
                  showCancelButton: false,
                  confirmButtonText: '확인',
                });
              }
            });
      }
    },

    GetSize() {
      ItemsModel
          .GetSizeList()
          .then(res => {
            this.sizeList = res.data;
          });
    },

    GetTheme() {
      ItemsModel
          .GetThemeList()
          .then(res => {
            this.themeList = res.data;
          });
    },

    GetGenres() {
      ArtistsModel
          .GetGenres()
          .then(res => {
            this.genresList = res.data;
          });
    },

    GetMaterial() {
      ItemsModel
          .GetMaterial()
          .then((res) => {
            this.material = res.data;
            console.log(this.material);
          });
    },

    GetArtistList() {
      ArtistsModel
          .GetArtistName({
            def_name:'artist'
          })
          .then(res => {
            this.artistList = res.data
          });
    },

    GetInfo(param) {
      ItemsModel
          .GetItemsSearch(param)
          .then(res => {
            for(let key in res.data.data[0]) {
              if(typeof this.formData[key] !== 'undefined') {
                this.formData[key] = res.data.data[0][key]
              }
            }
            this.hasImage();

          });
    },
    uploadImg(e) {
      for (const eKey in e) {
        this.formData.files.push(e[eKey]);
        this.profileImage.push(URL.createObjectURL(e[eKey]));
      }
    },

    IsEdit() {
      return this.id !== '' && this.id !== false;
    },

    hasImage(){
      if (this.formData.images) {
        for (const eKey in this.formData.images) {
          this.profileImage.push(this.formData.images[eKey].url);
        }

      }
    }

   

  }
}
</script>