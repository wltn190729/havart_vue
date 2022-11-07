<template>
  <modal-dialog @close="$emit('close')" :title="id>0?'회원정보 수정':'신규회원 등록'">

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
  methods: {
  }
}
</script>