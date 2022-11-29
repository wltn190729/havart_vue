<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ?'작가정보 수정':'신규작가 등록'" :width="600">
    <form @submit.prevent="OnSubmit">
      <table class="tb">
        <tr>
          <td rowspan="4" style="width:150px;">
            <v-img
                v-if="profileImage"
                :src="profileImage"
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
                @change="uploadImg"
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
        <!-- <tr>
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
        </tr> -->
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
        name : "",
        genres :[],
        profileImage:{},
        explain: ""
      },
      genres: [],
      userGenres: [],
      searchData: {
        search_key: 'artist_id',
        search_value: ''
      },
      profileImage: '',
    };
  },
  mounted() {
    this.searchData.search_value = this.id

    // console.log(this.formData)

    
      this.GetGenres();
      this.GetUser();
    

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
      // const formData = this.formData;
      
      console.log(this.formData);

      ArtistsModel
        .ArtistAdd(this.formData)
          .then(res => console.log(res))
          .catch(e => console.error(e))


    },
    GetUser() {
      this.formData.name = JSON.parse(localStorage.getItem('userInfo')).nickname
      
     
    },
    GetGenres() {
      ArtistsModel
          .GetGenres()
          .then(res => {
            this.genres = res.data;
            // console.log(this.genres);
          });
    },
    ChangeGenres(e, id) {
      this.formData.genres.push(this.genres.find(item => item.genre_id === id))
      console.log(this.formData);
    },
    uploadImg(e) {
      // console.log(e);
      
      this.formData.profileImage[0] = e[0];
      console.log(this.formData);
      this.profileImage = URL.createObjectURL(e[0])
     
      
    }
  }
}
</script>