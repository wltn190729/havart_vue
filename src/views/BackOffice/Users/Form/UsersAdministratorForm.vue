<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ? '작품 관리' : '작품 생성'" :width="700">
    <form @submit.prevent="OnSubmit">
      <table class="tb">
        <tr>
          <th>이메일</th>
          <td>
            <v-text-field
                outlined
                hide-details
                required
                dense
                readonly
                v-model="formData.email"
            />
          </td>
          <th>닉네임</th>
          <td>
            <v-text-field
                outlined
                hide-details
                required
                dense
                v-model="formData.nickname"
            />
          </td>
        </tr>
      </table>
      <v-btn type="submit" class="mt-2" block large color="primary">작품 설정 저장</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import authModel from "@/models/authorization.model";

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
      formData : {
        email: '',
        nickname: '',
        create_at: '',
        update_at: '',
        access_list: '',
        def_name: ''
      }
    };
  },
  computed: {
    IsEdit () {
      return this.id !== '' && this.id !== false
    },
  },
  mounted () {
  },
  watch: {
  },
  methods: {
  }
}
</script>