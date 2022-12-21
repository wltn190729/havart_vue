<template>
  <modal-dialog @close="$emit('close')" title="메모 내용" width=700>
    <form @submit.prevent="OnSubmit">
      <div>
        <table class="tb">
          <tr>
            <v-textarea
                outlined
                dense
                label="텍스트를 입력하세요."
                v-model="formData.comment"
            ></v-textarea>
          </tr>
        </table>
        <table class="tb">
          <tr class="tr">
            <th>번호</th>
            <th>작성자</th>
            <th>상담내용</th>
            <th>작성일자</th>
          </tr>
          <tr v-for="(item, index) in listData" :key="`list-${index}`">
            <td>{{ (index + 1) }}</td>
            <td>{{ item.user.nickname }}</td>
            <td>{{ item.text }}</td>
            <td>{{ (new Date(item.writeAt)).dateFormat('yyyy-MM-dd HH:mm') }}</td>
          </tr>
        </table>
      </div>
      <v-btn type="submit" class="mt-2" block large color="primary">메모 저장</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import BoardModel from "@/models/boards.model";

export default {
  components: {ModalDialog},
  props: {
    obj: {
      type: Object,
      required: false,
      default() {}
    }
  },
  data () {
    return {
      formData : {
        comment: ''
      },
      listData: [],
    }
  },
  computed: {
    IsEdit () {
      return this.obj !== ''
    }
  },
  mounted () {
    this.GetList();
  },
  methods: {
    OnSubmit () {
      this.formData.uid = this.obj.user.uid;
      this.formData.item_id = this.obj.item.item_id;
      this.formData.inquiry_pt = this.obj.id;
      this.formData.depth = 1;
      this.formData.isAnswer = true;
      this.formData.phone = '';

      BoardModel
          .CreateInquiry(this.formData)
          .then((res) => {
            this.$swal({
              title: '메모 등록완료',
              icon: 'success',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonText: '확인',
            });

            this.formData.comment = '';
            this.GetList();
          });

    },
    GetList() {
      BoardModel
          .GetInquirySearchList(this.obj.id)
          .then((res) => {
            this.listData = res.data;
          });
    },

  }
}
</script>