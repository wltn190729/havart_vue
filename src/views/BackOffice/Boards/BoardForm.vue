<template>
  <modal-dialog @close="$emit('close')" title="문의 내용" :width='700'>
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
        <br>
        <hr>
        <br>

        <div style="display:flex" class="mt-2 mb-2">
          <v-textarea
              outlined
              dense
              hide-details
              label="텍스트를 입력하세요."
              v-model="formData.comment"
              rows="4"
          />
          <v-btn style="align-self: stretch;flex-shrink: 0;height:auto;" type="submit"
                 large
                 tile
                 color="primary">메모 등록</v-btn>
        </div>


        <table class="tb">
          <tr class="tr">
            <th style="width: 5%">번호</th>
            <th style="width: 12%">작성자</th>
            <th style="width: 45%">상담내용</th>
            <th>작성일자</th>
            <th>삭제</th>
          </tr>
          <tr v-for="(item, index) in listData" :key="`list-${index}`">
            <td>{{ (index + 1) }}</td>
            <td>{{ item.user.nickname }}</td>
            <td>
              <v-textarea
                  v-if="item.isEdit"
                  type="text"
                  v-model="item.text"
                  hide-details
                  dense
                  outlined

              />
              <template v-if="!item.isEdit">{{item.text}}</template>

            </td>
            <td>{{ (new Date(item.writeAt)).dateFormat('yyyy-MM-dd HH:mm') }}</td>
            <td class="text-center">
              <v-btn-toggle>
                <v-btn small type="button" @click="toggleItemEdit(item,index)">
                  {{item.isEdit? '저장':'수정'}}
                </v-btn>
                <v-btn v-if="item.isEdit" small type="button" @click="item.isEdit=false">취소</v-btn>
                <v-btn v-else small @click="DeleteComment(item.id)" >삭제</v-btn>
              </v-btn-toggle>

            </td>
          </tr>
        </table>
      </div>

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
        comment: '',
        memo: ''
      },
      listData : []
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
    toggleItemEdit(item, index) {
      if(this.listData[index].isEdit) {
        this.UpdateComment(item, index)
      }
      this.listData[index].isEdit = !this.listData[index].isEdit
      console.log(this.listData[index].isEdit)
    },
    OnSubmit () {
      console.log(this.obj);
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
      console.log(this.obj);
      BoardModel
          .GetInquirySearchList(this.obj.id)
          .then((res) => {
            console.log(res.data);
            for(let i in res.data) {
              res.data[i].isEdit = false
            }
            this.listData = res.data;

          });
    },
    UpdateComment(item, index) {
      const formData = {};
      formData.inquiry_id = item.id;
      formData.comment = item.text;

      BoardModel
          .UpdateComment(formData)
          .then((res) => {
            res.data.isEdit = false

            for(let key in res.data) {
              if(typeof this.listData[index] !== 'undefined') {
                this.listData[index][key] = res.data[key]
              }
            }
            //this.listData[index] = res.data;
          });
    },

    DeleteComment(id) {
      BoardModel
          .DeleteComment(id)
          .then((res) => {
            this.$swal({
              title: '메모 삭제완료',
              icon: 'success',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonText: '확인',
            });

            this.GetList();
          });

    }

  }
}
</script>