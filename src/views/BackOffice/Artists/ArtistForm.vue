<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ?'작가정보 수정':'신규작가 등록'" width='600'>
    <form @submit.prevent="OnSubmit">
      <table class="tb">
        <tr>
          <td rowspan="4" style="width:150px;">
            <v-img
                v-if="formData.profileImage"
                :src="formData.profileImage"
                max-width="120"
            >
            </v-img>
            <v-img
                v-else :src="require('@/assets/default_profile.jpg')"
                max-width="120"
            ></v-img>

            <v-file-input
                hide-input
                prepend-icon="mdi-camera"
                accept="image/*"
                label="사진을 선택하려면 누르세요."
                multiple
                outlined
                dense
                v-model="formData.profileImage"
            >
            </v-file-input>
          </td>
          <th>작가 이름</th>
          <td>
            <v-text-field
                outlined
                hide-details
                dense
                v-model="formData.name"
            />
          </td>
        </tr>
        <tr>
          <th>작가 번호</th>
          <td colspan="2">
            <v-text-field
                outlined
                hide-details
                dense
                v-model="formData.artist_id"
                readonly
            />
          </td>
        </tr>
        <tr>
          <th>설명</th>
          <td colspan="2">
            <v-textarea
                outlined
                hide-details
                dense
                v-model="formData.explain"
            />
          </td>
        </tr>
        <tr>
          <th>작품 수</th>
          <td>{{ formData.item.length }}</td>
        </tr>
        <tr>
          <th>장르</th>
          <td colspan="2">
              <v-checkbox
                  v-for="(item,index) in genres" :key="index"
                  dense
                  hide-details
                  @change="ChangeGenres($event, item.genre_id)"
                  v-model="userGenres[item.genre_id]"
                  :label="item.genreName" />
          </td>
        </tr>
      </table>
      <v-btn type="submit" class="mt-2" block large color="primary">회원 저장</v-btn>

      <br>
      <hr>
      <br>
      <h2>작품 목록</h2>
      <br>
      <table
          style="border-top: 0px;"
          class="tb"
        v-for="(item, index) in formData.item" :key="index">
        <tr>
          <td>
            <v-img
                v-if="item.images"
                :src="item.images"
                max-width="120"
            >
            </v-img>
            <v-img
                v-else :src="require('@/assets/default_profile.jpg')"
                max-width="120"
            ></v-img>
          </td>
          <th>작품 이름</th>
          <td colspan="2">{{ item.title }}</td>
        </tr>
        <tr>
          <th>가격</th>
          <td>{{ item.price.toLocaleString() }} 원</td>
          <th>공유 횟수</th>
          <td>{{ item.shareCount }}</td>
        </tr>
        <tr>
          <th>설명</th>
          <td colspan="3">{{ item.explain }}</td>
        </tr>
      </table>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import ArtistsModel from "@/models/artists.model";

export default {
  components: {ModalDialog},
  props: {
      id : {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        requestGenres: []
      },
      genres: [],
      userGenres: [],
      searchData: {
        search_key: 'artist_id',
        search_value: ''
      }
    };
  },
  mounted() {
    this.searchData.search_value = this.id

    if(this.searchData.search_value) {
      this.GetGenres();
      this.GetUser();
    }

  },
  methods: {
    OnSubmit() {
      // this.$swal({
      //   title: '회원정보 등록완료',
      //   icon: 'success',
      //   showConfirmButton: true,
      //   showCancelButton: false,
      //   confirmButtonText: '확인',
      // });
      //
      // this.$emit('update')
      // this.$emit('close')
      const formData = this.formData;

      console.log(formData);

    },
    GetUser() {
      const param = this.searchData;
      param.search_value = this.id;

      ArtistsModel
          .GetArtist(param)
          .then(res => {
            this.formData = res.data[0];
            let obj = {};
            for (const i in this.formData.genres) {
              obj[this.formData.genres[i].genre_id] = this.formData.genres[i].genreName;
            }
            this.userGenres = obj;
          });
    },
    GetGenres() {
      ArtistsModel
          .GetGenres()
          .then(res => {
            this.genres = res.data;
            console.log(this.genres);
          });
    },
    ChangeGenres(e, id) {

    },
  }
}
</script>