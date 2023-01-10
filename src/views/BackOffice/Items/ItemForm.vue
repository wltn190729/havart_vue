<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ? '작품 관리' : '작품 생성'" :width="700">
    <form @submit.prevent="OnSubmit">
      <div>
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
          <th>작품코드</th>
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
          <th>정렬</th>
          <td>
            <v-text-field
                type="text"
                outlined
                hide-details
                dense
                v-model="formData.order"
                required
            />
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
        <tr v-if="ui.directInputView">
          <th>재료 직접입력</th>
          <td colspan="3">
            <v-text-field
                outlined
                hide-details
                required
                dense
                v-model="formData.material"
            />
          </td>
        </tr>
        <tr>
          <th>재료</th>
          <td>
              <v-autocomplete
                  v-model="formData.material_id"
                  :items="material"
                  item-text="material"
                  item-value="material_id"
                  dense
                  required
                  outlined
                  hide-details
              >
              </v-autocomplete>

            <input type="text" value="16516" style="margin: 10px 0; width:100%; height: 20px; border-bottom: 1px solid #464646">

          </td>
          <th>가격</th>
          <td>
            <v-text-field
                outlined
                hide-details
                required
                dense
                min="0"
                onkeyup="if(this.value<0){this.value= this.value * -1}"
                type="number"
                v-model.number="formData.price"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="2">사이즈</th>
          <td colspan="3">
            <v-row>
              <v-col
                  cols="12"
                  sm="3">
                <v-text-field
                    outlined
                    hide-details
                    v-model="formData.sizeData.size_width"
                    label="가로"
                    dense
                />
              </v-col>
              <v-col
                  cols="12"
                  sm="1"
              >
                <p class="text-md-center">X</p>
              </v-col>
              <v-col
                  cols="12"
                  sm="3">
                <v-text-field
                    outlined
                    v-model="formData.sizeData.size_height"
                    label="세로"
                    hide-details
                    dense
                />
              </v-col>
              <v-col
                  cols="12"
                  sm="3">
                <v-autocomplete
                    :items="sizeType"
                    label="단위"
                    dense
                    v-model="formData.sizeData.unit"
                    required
                    hide-details
                    outlined/>
              </v-col>

            </v-row>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <v-row>
              <v-col
                  cols="12"
                  sm="3"
              >
                <v-autocomplete
                    :items="sizeList.sizeForms"
                    item-value="size_forms"
                    label="형태"
                    dense
                    required
                    v-model="formData.sizeData.size_form"
                    hide-details
                    outlined/>

              </v-col>

              <v-col
                  cols="12"
                  sm="3"
              >
                <v-autocomplete
                    :items="sizeList.sizeShapes"
                    item-value="size_shape"
                    label="모양"
                    dense
                    required
                    v-model="formData.sizeData.size_shape"
                    hide-details
                    outlined/>

              </v-col>

              <v-col
                  cols="12"
                  sm="3"
              >
                <v-text-field
                    outlined
                    label="호수"
                    hide-details
                    v-model="formData.sizeData.size_num"
                    dense
                />

              </v-col>


            </v-row>
          </td>
        </tr>
        <tr>
          <th>작품 이미지</th>
          <td colspan="3">
            <div style="text-align: -webkit-center; padding: 5px;">
              <template v-if="profileImage.length>0" >
                <div v-for="(item, index) in profileImage " :key="index">
                  <v-img
                      :src="item?item : require('@/assets/default_image.png')"
                      max-width="360"
                      contain
                  />
                </div>
              </template>
              <div v-else>
                <v-img
                    :src="require('@/assets/default_image.png')"
                    max-width="360"
                    contain
                />
                <p class="help-block">등록된 이미지가 없습니다.</p>
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
              />

            </div>
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
        material_id: 0,
        theme_id:0,
        sizeData: {
          size: '',
          size_num: 0,
          size_shape: '',
          size_form: '',
          size_form_etc: '',
          size_height: 0,
          size_width: 0,
          unit: '',
        },
        images: [],
        files: [],
        shortExplain: '',
        order:0, //api 저장 해야됨 (id값 줘야됨)
        frame:0, //api 저장 해야됨 (액자 여부)
        tags:'',//사용자가 일일이 넣어야됨
        canvas:1,
      },
      isMine: false,
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
      sizeType: ['cm', 'in'],
      sizeList: [],
      themeList: [],
      genresList: [],
      material: [],
      artistList: [],
      ui: {
        directInputView: false,
      }
    };
  },
  computed: {

  },
  watch: {
    'formData.material_id' () {
      this.changeDirect();
    }
  },
  async mounted() {
    if (this.IsEdit()) {
      const formData = {};
      formData['item.item_id'] = this.id;
      await this.GetInfo(this.id);
    }
    
    await this.GetArtistList();
    console.log(this.loginUser);
    await this.GetTheme();
    await this.GetGenres();
    await this.GetMaterial();
    await this.GetSizeInfo();
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

                this.$emit('update')
                this.$emit('close')

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
                this.$emit('update')
                this.$emit('close')
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
      }
    },

    GetSizeInfo() {
      ItemsModel
          .GetSizeList()
          .then(res => {
            this.sizeList = res.data;
            console.log(this.sizeList, '사이즈 리스트');
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
        this.isMine = false;
    },

    GetInfo(id) {
      ItemsModel
          .GetItemOne(id)
          .then((res) => {
            console.log(res);
            for(let key in res.data[0]) {
              if(typeof this.formData[key] !== 'undefined') {
                this.formData[key] = res.data[0][key]
              }
            }
            console.log(this.formData);
            this.editSize();
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

    hasImage() {
      if (this.formData.images) {
        for (const eKey in this.formData.images) {
          this.profileImage.push(this.formData.images[eKey].url);
        }

      }
    },
    editSize(){
      const sizeOriginal = this.formData.sizeData.size;
      const size = sizeOriginal.split("x")
      const width = size[0].trim();
      const height = size[1].trim().split(" ")[0];

      this.formData.sizeData.size_width = width;
      this.formData.sizeData.size_height = height;
      this.formData.sizeData.unit = 'cm';
    },
    changeDirect(){
      const material = this.material.filter((v) => v.material === '직접입력')[0];
      this.ui.directInputView = this.formData.material_id === material.material_id;

      console.log(material);
    }


  }
}
</script>