<template>
  <modal-dialog @close="$emit('close')" title="비밀번호변경">
    <form @submit.prevent="OnSubmit">
      <v-text-field
          label="비밀번호"
          :type="visiblePassword?'text':'password'"
          :append-outer-icon="visiblePassword?'mdi-eye-off':'mdi-eye'"
          @click:append-outer="visiblePassword=!visiblePassword" />
      <v-text-field
          label="비밀번호 확인"
          :type="visiblePasswordConfirm?'text':'password'"
          :append-outer-icon="visiblePasswordConfirm?'mdi-eye-off':'mdi-eye'"
          @click:append-outer="visiblePasswordConfirm=!visiblePasswordConfirm" />
      <v-btn color="primary">비밀번호 변경</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
export default {
  components: {ModalDialog},
  props: {
    id : {
      type: [Number,String],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      visiblePassword: false,
      visiblePasswordConfirm: false
    }
  },
  methods: {
    OnSubmit () {

    }
  }
}
</script>