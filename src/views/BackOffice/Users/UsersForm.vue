<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ?'회원정보 수정':'신규회원 등록'" width=600>
    <form @submit.prevent="OnSubmit">
      <table class="tb">
        <tr>
          <td rowspan="4" style="width:150px;">
            <v-img
                v-if="formData.profile"
                :src="formData.profile"
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
                v-model="formData.profile"
            >
            </v-file-input>
          </td>
          <th>로그인 이메일</th>
          <td>
            <v-text-field
                outlined
                hide-details
                dense
                readonly
                placeholder="변경이 불가능합니다."
                v-model="formData.email"
            />

          </td>
        </tr>
        <tr>
          <th>회원닉네임</th>
          <td colspan="2">
            <v-text-field
                outlined
                hide-details
                dense
                v-model="formData.nickname"
            />
          </td>
        </tr>
        <tr>
          <th>연락처</th>
          <td colspan="2">
            <v-text-field
                outlined
                dense
                hide-details
                placeholder="번호로 입력바랍니다."
                v-model="formData.phone"
            />
          </td>
        </tr>
      </table>
      <v-btn type="submit" class="mt-2" block large color="primary">회원 저장</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import UserModel from '@/models/users.model'

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
        profile: '',
        email: '',
        nickname: '',
        phone: ''
      },
      searchData: {
        search_key: 'email',
        search_value: ''
      },
    }
  },
  mounted() {
    this.searchData.search_value = this.id

    if(this.searchData.search_value) {
      this.GetUser();
    }

  },
  methods: {
    OnSubmit() {
      const formData = this.formData;
      delete formData.email;
      formData.searchData = this.searchData;
      formData.name = formData.nickname;
      UserModel
          .UpdateUserInfo(formData)
          .then(res => {
            this.$swal({
              title: '회원정보 등록완료',
              icon: 'success',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonText: '확인',
            });

            this.$emit('update')
            this.$emit('close')

          });
    },
    GetUser() {
      UserModel
          .GetUserListSearch(this.searchData)
          .then(res => {
            this.formData = res.data[0];
          });
    },
  }
}
</script>