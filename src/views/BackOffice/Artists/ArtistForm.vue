<template>
  <modal-dialog @close="$emit('close')" :title="id !== 0 ?'작가정보 수정':'신규작가 등록'" :width="600">
    <form @submit.prevent="OnSubmit">
      <table class="tb">
        <tr>
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
          <th>노출상태</th>
          <td>
            <v-radio-group dense hide-details v-model="formData.state" row>
              <v-radio value="yes" label="노출" />
              <v-radio value="hide" label="감춤" />
            </v-radio-group>
          </td>
        </tr>
        <tr>
          <th>장르</th>
          <td colspan="2">
            <v-row class="mb-0 mt-0">
              <v-col cols="4" v-for="(item,index) in genres" :key="index" class="pb-0 pt-0">
                <v-checkbox
                    dense
                    hide-details
                    @change="ChangeGenres($event, item.genre_id)"
                    v-model="userGenres[item.genre_id]"
                    :input-value="userGenres[item.genre_id]"
                    :label="item.genreName" />
              </v-col>
            </v-row>

          </td>
        </tr>
        <tr>
          <th>프로필사진</th>
          <td colspan="2">
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
        </tr>
        <tr>
          <th>설명</th>
          <td colspan="2">
            <v-textarea
                outlined
                hide-details
                dense
                v-model="formData.explain"
                @input="patchEx"
            />
          </td>
        </tr>
      </table>
      <v-btn type="submit" class="mt-2" block large color="primary">작가 정보 저장</v-btn>
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
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        name : "",
        genre :[],
        explain: "",
        files: "",
        state: 'yes'
      },
      genres: [],
      userGenres: {},
      searchData: {
        search_key: 'artist_id',
        search_value: ''
      },
      profileImage: '',
      patchData: {
        name: '',
        genre_ids: [],
        explain: '',
        state: ''
      }
    };
  },
  created() {
    this.searchData.search_value = this.id
    this.GetUser();    
  },
  mounted() {
    
    this.GetGenres();

  },
  computed: {
    userGenrescheck: function() {
      return this.userGenres
    }
  },
  methods: {
    OnSubmit() {

      if (Object.keys(this.formData.files).length === 0) {
        delete this.formData.files;
      }

      let genre_ids = [];
      for(let i in this.formData.genres) {
        genre_ids.push(this.formData.genres[i].genre_id);
      }

      let formData =  this.formData;
      formData.genre_ids = genre_ids;

      delete formData.genres;

      if(this.id !== 0) {
        ArtistsModel
          .Artistpatch(this.id, formData)
            .then((res) => {
              this.$emit('update')
              this.$emit('close')
            })
            .catch(e => console.error(e))
        this.$swal({
          title: '작가정보 수정완료',
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: '확인',
        });
      }else {
        ArtistsModel
        .ArtistAdd(formData)
          .then((res) => {
            this.$swal({
              title: '작가정보 등록완료',
              icon: 'success',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonText: '확인',
            });
            this.$emit('update')
            this.$emit('close')

          })
          .catch(e => console.error(e))

      }
      
      //
      // const formData = this.formData;
      
      // console.log(this.formData);
    
      


    },
    GetUser() {

      if(this.id !== 0) {
        ArtistsModel.GetArtist(this.searchData).then(res => {
          //보여주는 데이터
          this.formData.name = res.data.data[0].name
          //수정 했을때 보낼 데이터
          this.patchData.name = res.data.data[0].name
          console.log(res.data.data[0]);
          this.formData.genres = res.data.data[0].genres;
          res.data.data[0].genres.forEach(item => {
            this.userGenres[item.genre_id] = true;
            this.patchData.genre_ids.push(item.genre_id)
          })
          //보여주는 데이터
          this.formData.explain = res.data.data[0].explain;
          //수정 했을때 보낼 데이터
          this.patchData.explain = res.data.data[0].explain;

          this.patchData.state = res.data.data[0].state;
          this.profileImage = res.data.data[0].profileImage
        }).catch(e => console.error(e))
      }else {
        this.formData.name = JSON.parse(localStorage.getItem('userInfo')).nickname
      }
      
    },
    GetGenres() {
        ArtistsModel
          .GetGenres()
          .then(res => {
            this.genres = res.data;
          });
      
      
    },
    ChangeGenres(e, id) {
      // console.log(this.userGenres[id]);
      if(e) {
        this.patchData.genre_ids = [...this.patchData.genre_ids, id];
      }else {
        this.patchData = this.patchData.genre_ids.filter(item => item !== id)
      }

      this.formData.genres.push(this.genres.find(item => item.genre_id === id));
    },
    patchEx(e) {
      // console.log(e)
      this.patchData.explain = e;
    },
    //프로필 이미지 보여주기
    uploadImg(e) {
      this.formData.files = e[0];
      console.log(this.formData);
      this.profileImage = URL.createObjectURL(e[0])
    },

  }
}
</script>