<template>
  <div>
    <form @submit.prevent="onSubmit">
      <h1 class="form-title">회원가입</h1>
      <div class="flex-box">
        
        <div>
          <span class="form-label">닉네임*</span>
          <input
            type="text"
            v-model.trim="formData.nickname"
            placeholder="예) 홍길동"
            class="form-control"
            maxlength="15"
          />
        </div>
        <br />
        <div>
          <span class="form-label">이메일*</span>
          <input
            type="email"
            v-model.trim="formData.email"
            placeholder="예) kimchi@gallery.co.kr"
            class="form-control"
          />
        </div>
        <br />
        <div>
          <span class="form-label">권한*</span>
          <v-radio-group v-model="formData.def_name">
            <v-radio
              v-for="(d, i) in testData"
              :key="i"
              :label="`${d.def_name}`"
              :value="d.def_name"
            ></v-radio>
          </v-radio-group>
        </div>
        <br />
        <div class="form-icon">
          <span class="form-label">Artist-ID</span>
          <input
            type="text"
            v-model.trim="formData.artist_id"
            placeholder="작가 id를 입력해주세요"
            class="form-control"
          />
        </div>
        <br />
        <div class="form-icon">
          <span class="form-label">비밀번호*</span>
          <input
            :type="loginPassVisible ? 'text' : 'password'"
            v-model.trim="formData.password"
            placeholder="비밀번호 (8자 이상)"
            class="form-control"
          />
          <i
            class="icon mdi"
            :class="{
              'mdi-eye-outline': !loginPassVisible,
              'mdi-eye-off': loginPassVisible,
            }"
            @click="loginPassVisible = !loginPassVisible"
          ></i>
        </div>
        <br />
        <div class="form-icon">
          <span class="form-label">비밀번호 확인*</span>
          <input
            :type="loginPassConfirmVisible ? 'text' : 'password'"
            v-model.trim="formData.passwordConfirm"
            class="form-control"
          />
          <i
            class="icon mdi"
            :class="{
              'mdi-eye-outline': !loginPassConfirmVisible,
              'mdi-eye-off': loginPassConfirmVisible,
            }"
            @click="loginPassConfirmVisible = !loginPassConfirmVisible"
          ></i>
        </div>
      </div>
      <p>{{ isLoginDisabled }}</p>
      <button
        type="submit"
        class="btn btn-confirm"
        :disabled="isLoginDisabled.length > 0"
      >
        확인
      </button>
    </form>
  </div>
</template>
<style lang="scss" scoped>
input {
  border: 1px solid #000;
}
button {
  border: 1px solid #000;
}
</style>
<script>
import userModel from "@/models/users.model";
import exportObject from "@/models/users.model.js";

export default {
  components: {},
  data() {
    return {
      authData: {},
      testData: [],
      formData: {
        nickname: "",
        email: "",
        def_name: "artist",
        artist_id: "",
        password: "",
        passwordConfirm: "",
      },
      loginPassVisible: false,
      loginPassConfirmVisible: false,
      passwordRegex:
        /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/,
      emailRegex:
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
    };
  },
  mounted() {
    // 페이지 들어올 때 첫 실행(함수)
    exportObject.GetAuthDef().then((res) => {
      // let testData = res.data.map((x) => x.def_name);
      // this.testData = testData;
      let testData = "";
      console.log(res.data, "res.data");
      this.testData = res.data;
      console.log(testData);
    });
  },

  computed: {
    isLoginDisabled() {
      if (
        this.formData.nickname.length < 2 ||
        this.formData.nickname.length > 15
      ) {
        return "닉네임은 최소 2글자에서 15자로 설정하셔야합니다.";
      }

      if (this.formData.uid.length === 0) {
        return "아이디는 최소 2글자에서 15자로 설정하셔야합니다.";
      }

      if (!this.emailRegex.test(this.formData.email)) {
        return "올바른이메일 형식이 아닙니다.";
      }

      if (!this.passwordRegex.test(this.formData.password)) {
        return "비밀번호는 영어대문자,소문자,특수문자를 포함한 8글자 이상이어야합니다.";
      }

      if (this.formData.password !== this.formData.passwordConfirm) {
        return "비밀번호와 비밀번호 확인이 서로 다릅니다";
      }

      return "";
    },
  },
  methods: {
    onSubmit() {
      if (this.isLoginDisabled.length > 0) {
        this.$swal("error", this.isLoginDisabled, "error");
        return;
      }
      console.log(this.formData, "this.formdAta");
      userModel
        .registerProcess({
          uid: this.formData.uid,
          nickname: this.formData.nickname,
          email: this.formData.email,
          password: this.formData.password,
        })
        .then(() => {
          this.$swal(
            "사용자등록 완료",
            "사용자 등록이 완료되었습니다. 로그인 화면으로 이동합니다",
            "success"
          ).then(() => {
            console.log("성공적");
            this.$router.push("/sign-in");
          });
        });
    },
    IsTest() {},
  },
};
</script>
