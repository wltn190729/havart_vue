<template>
  <v-dialog :value="true" width="500">
    <v-app-bar flat height="40">
        <v-toolbar-title dense style="font-size:1rem;">{{title}}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="OnClose"><v-icon>mdi-close</v-icon></v-btn>
    </v-app-bar>
    <v-card>
      <v-card-text>
        <!-- <form @submit.prevent="OnSubmit">
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
        <tr>
          <th>장르</th>
          <td colspan="2">
              <v-checkbox
                  v-for="(item,index) in genres" :key="index"
                  dense
                  hide-details
                  @change="ChangeGenres($event, item.genre_id)"
                  v-model="userGenres[item.genre_id]"
                  :input-value="userGenres[item.genre_id]"
                  :label="item.genreName" />
          </td>
        </tr>
      </table>
      <v-btn type="submit" class="mt-2" block large color="primary">회원 저장</v-btn>
    </form> -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import UserModel from '@/models/users.model'


export default {
  name: 'UserCard',
  props: {
    title: {
      type: String,
      required: false,
      default: '유저정보'
    },
    cardtype: {
      type: String,
      required:true,
    },
    email: {
      type: String,
      require:true,
    }
  },
  data() {
    return{

    }
  },
  mounted() {
    UserModel.GetUserListSearch({
      search_key: 'email',
      search_value: this.email,
    }).then(res => console.log(res))    
  },
  methods: {
    OnClose() {
      this.$emit('close', this.cardtype)
    }
  }
}
</script>
<style lang="scss">
  
</style>