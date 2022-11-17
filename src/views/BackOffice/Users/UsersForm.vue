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
      <br>
      <h2>상담 요청 목록</h2>
      <br>
      <table class="tb" v-for="(item, index) in formData.inquiry" :key="index" style="border-top: 0">
        <tr>
          <th>상담번호</th>
          <td>{{ item.inquiry_id }}</td>
          <th>상담현황</th>
          <td v-if="item.state === 'progress'">상담 중</td>
          <td v-else-if="item.state === 'done'">계약</td>
          <td v-else-if="item.state === 'cancel'">취소</td>
          <th>작품 번호</th>
          <td>{{ item.item_id }}</td>
        </tr>
        <tr>
          <th>핸드폰번호</th>
          <td>{{ item.phone }}</td>
          <th>상담가능시간</th>
          <td>{{ item.acceptTime }}</td>
          <th>상담여부</th>
          <td>{{ item.isAnswer === 0 ? 'O' : 'X' }}</td>
        </tr>
        <tr>
          <td colspan="6">
            <v-textarea
                outlined
                hide-details
                dense
                readonly
                :value="item.comment"
            ></v-textarea>
          </td>
        </tr>
      </table>
      <br>
      <h2>찜 목록</h2>
      <br>
      <table class="tb" v-for="(item, index) in formData.itemLike" :key="index" style="border-top: 0">
        <tr>
          <td rowspan="3">
            <v-img
                v-if="item.images"
                :src="item.images"
                max-width="120"
            >
            </v-img>
            <v-img
                v-else :src="require('@/assets/default_image.png')"
                max-width="120"
            ></v-img>
          </td>
          <th>작품 제목</th>
          <td>{{ item.title }}</td>
          <th>작품 번호</th>
          <td>{{ item.item_id}}</td>
        </tr>
      </table>
      <br>
      <h2>팔로우 작가 목록</h2>
      <br>
      <table class="tb" v-for="(item, index) in formData.follower" :key="index" style="border-top: 0">
        <tr>
          <td rowspan="3">
            <v-img
                v-if="item.profileImage"
                :src="item.profileImage"
                max-width="120"
            >
            </v-img>
            <v-img
                v-else :src="require('@/assets/default_image.png')"
                max-width="120"
            ></v-img>
          </td>
          <th>작가 이름</th>
          <td>{{ item.NAME }}</td>
          <th>작가 번호</th>
          <td>{{ item.artist_id}}</td>
        </tr>
      </table>
      <br>
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
        phone: '',
        itemLike: {},
        inquiry: {},
        pinList: {},
        follower: {}
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
            console.log(this.formData);
          });
    },
  }
}
</script>