<template>
  <modal-dialog @close="$emit('close')" title="문의 내용" width='700'>
    <form @submit.prevent="OnSubmit">
      <div>
        <table class="tb">
          <tr>
            <td rowspan="3">
              <div style="text-align: -webkit-center;">
                <v-img
                    v-if="obj.item.imageUrl[0].url"
                    :src="obj.item.imageUrl[0].url"
                    max-width="120"
                >
                </v-img>
                <v-img
                    v-else :src="require('@/assets/default_image.png')"
                    max-width="120"
                ></v-img>

              </div>
            </td>
            <th>
              작품 이름
            </th>
            <td>
              {{ obj.item.title }}
            </td>
            <th>작품 아이디</th>
            <td> {{ obj.item.item_id }} </td>
          </tr>
          <tr>
            <th>가격</th>
            <td>{{ obj.item.price.toLocaleString() }} 원</td>
            <th>등록일</th>
            <td> {{ (obj.item.createAt).slice(0, 10) }} </td>
          </tr>
          <tr>
            <th>공유</th>
            <td> {{ obj.item.shareCount }} </td>
            <th>방문</th>
            <td> {{ obj.item.visitCount }} </td>
          </tr>
        </table>
        <br>
        <hr>
        <br>
        <table class="tb">
          <tr>
            <th>회원명</th>
            <td>{{ obj.user.nickname }}</td>
            <th>이메일</th>
            <td>{{ obj.user.email }}</td>
          </tr>
          <tr>
            <th>연락가능시간</th>
            <td>{{ obj.time }}</td>
            <th>문의 작성일</th>
            <td>{{ (obj.writeAt).slice(0, 10) }}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td colspan="3">{{obj.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}}</td>
          </tr>
          <tr>
            <th>문의 내용</th>
            <td colspan="3">
              <v-textarea
                  outlined
                  hide-details
                  dense
                  readonly
                  :value="obj.text"
              />
            </td>
          </tr>
        </table>
      </div>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";

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
      }
    }
  },
  computed: {
    IsEdit () {
      return this.obj !== ''
    }
  },
  mounted () {
    this.formData = this.obj
    console.log(this.formData);
  },
  methods: {
    OnSubmit () {
    },

  }
}
</script>