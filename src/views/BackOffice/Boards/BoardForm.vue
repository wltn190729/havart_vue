<template>
  <modal-dialog @close="$emit('close')" title="문의 내용" :width="700">
    <form @submit.prevent="OnSubmit">
      <div>
        <table class="tb">
          <tr>
            <td rowspan="3">
              <div style="text-align: -webkit-center;">
                <v-img
                    v-if="data.item.imageUrl[0].url"
                    :src="data.item.imageUrl[0].url"
                    max-width="120"
                >
                </v-img>
                <v-img
                    v-else :src="require('@/assets/default_profile.jpg')"
                    max-width="120"
                ></v-img>

              </div>
            </td>
            <th>
              작품 이름
            </th>
            <td>
              {{ data.item.title }}
            </td>
            <th>작품 아이디</th>
            <td> {{ data.item.item_id }} </td>
          </tr>
          <tr>
            <th>가격</th>
            <td>{{ data.item.price.toLocaleString() }} 원</td>
            <th>등록일</th>
            <td> {{ data.item.createAt }} </td>
          </tr>
          <tr>
            <th>공유</th>
            <td> {{ data.item.shareCount }} </td>
            <th>방문</th>
            <td> {{ data.item.visitCount }} </td>
          </tr>
        </table>
        <br>
        <hr>
        <br>
        <table class="tb">
          <tr>
            <th>회원명</th>
            <td>{{ data.user.nickname }}</td>
            <th>이메일</th>
            <td>{{ data.user.email }}</td>
          </tr>
          <tr>
            <th>연락가능시간</th>
            <td>{{ data.time }}</td>
            <th>문의 작성일</th>
            <td>{{ data.writeAt }}</td>
          </tr>
          <tr>
            <th>문의 내용</th>
            <td colspan="3">
              <v-textarea
                  outlined
                  hide-details
                  dense
                  readonly
                  :v-model="data.text"
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
import BoardModel from "@/models/boards.model"

export default {
  components: {ModalDialog},
  props: {
    data: {
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
      return this.id !== ''
    }
  },
  mounted () {
    this.formData = this.data
    console.log(this.formData);
  },
  methods: {
    OnSubmit () {
    },

  }
}
</script>