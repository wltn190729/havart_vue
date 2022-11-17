<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ? '작품 관리' : '작품 생성'" :width="700">
    <form @submit.prevent="OnSubmit">
      <div>
      <table class="tb">
        <tr>
          <td>
            <div style="text-align: -webkit-center; padding: 5px;">
              <v-img
                  v-if="formData.images"
                  :src="formData.images[0]"
                  max-width="360"
              >
              </v-img>
              <v-img
                  v-else :src="require('@/assets/default_image.png')"
                  width="360"
              ></v-img>
              <v-file-input
                  hide-input
                  prepend-icon="mdi-camera"
                  accept="image/*"
                  label="사진을 선택하려면 누르세요."
                  multiple
                  outlined
                  dense
                  v-model="formData.images"
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
                  item-text="name"
                  item-value="artist_id"
                  dense
                  required
                  outlined
              >
              </v-autocomplete>

            </div>
          </td>
        </tr>
        <tr>
          <th>재료</th>
          <td>
            <v-text-field
                outlined
                hide-details
                required
                dense
                v-model="formData.materials"
            />
          </td>
          <th>가격</th>
          <td>
            <v-text-field
                outlined
                hide-details
                required
                dense
                type="number"
                v-model="formData.price"
            />
          </td>
        </tr>
        <tr>
          <th>고유번호</th>
          <td>
            <v-text-field
                outlined
                hide-details
                dense
                required
                v-model="formData.itemCode"
            />
          </td>
          <th rowspan="2">작품명</th>
          <td rowspan="2">
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
          <th>날짜</th>
          <td>
            <v-text-field
                outlined
                hide-details
                dense
                type="number"
                required
                label="년"
                v-model.number="date.YYYY"
            />
            <v-text-field
                outlined
                hide-details
                dense
                required
                type="number"
                label="월"
                v-model.number="date.MM"
            />
            <v-text-field
                outlined
                hide-details
                dense
                required
                type="number"
                label="일"
                v-model.number="date.D"
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
      type: [Number, String, Boolean],
      required: false,
      default: false
    }
  },
  data () {
    return {
      formData: {
        images: '',
        explain: '',
        shortExplain: '',
        price: 0,
        materials: '',
        title: '',
        genre_id: '',
        artist_id: '',
        itemCode: '',
        theme_id: '',
        size_id: '',
        certification: true
      },
      isValidCode: false,
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
      sizeList: {},
      themeList: {},
      genresList: {},
      artistList: {},
    };
  },
  computed: {
    IsEdit () {
      return this.id !== '' && this.id !== false
    },
  },
  mounted () {
    if (this.IsEdit ) {
      console.log('isEdit');
      this.searchData.search_value = this.id;
      this.GetInfo(this.searchData);
    }
    this.GetArtistList();
    this.GetSize();
    this.GetTheme();
    this.GetGenres();
  },
  watch: {
    formData: {
      handler(value) {
        console.log('handler');
        console.log(value);
      },
      deep: true
    }
  },
  methods: {
    OnSubmit() {
      let formData = this.formData;
      formData = this.ConvertFormData(formData);

      if (this.IsEdit) {
        ItemsModel
            .updateItem(this.id, formData)
            .then(res => {
              console.log(res);
              if (res.status === 200) {
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
        ItemsModel
            .registerItem(formData)
            .then(res => {
              if (res.statusCode === 200) {
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

    GetArtistList() {
      ArtistsModel
          .GetArtistList()
          .then(res => {
            console.log(res);
            this.artistList = res.data;
          });
    },

    GetInfo(param) {
      ItemsModel
          .GetItemsSearch(param)
          .then(res => {
            this.formData = res.data[0];
            this.validCode = this.formData.itemCode;
          });
    },

    ConvertFormData(formData) {
      delete formData.createAt;
      delete formData.images;

      formData.price = parseInt(formData.price);
      formData.material = formData.materials;
      formData.images = {};

      formData.createAt = new Date(this.date.YYYY, (this.date.MM) - 1, this.date.D).toUTCString();

      if (formData.itemCode === this.validCode) {
        delete formData.itemCode;
      }

      return formData;
    },

  }
}
</script>