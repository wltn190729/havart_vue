<template>
  <div>
    <form @submit.prevent="onSubmit">
      <h1 class="form-title">회원가입</h1>
      <div class="flex-box">
        <div>
          <span class="form-label">닉네임*</span>
          <input type="text" v-model.trim="formData.name" placeholder="예) 홍길동" class="form-control" maxlength="15">
        </div>
        <br>
        <div>
          <span class="form-label">이메일*</span>
          <input type="email" v-model.trim="formData.loginId" placeholder="예) kimchi@kimchi.co.kr" class="form-control">
        </div>
        <br>
        <div class="form-icon">
          <span class="form-label">비밀번호*</span>
          <input :type="loginPassVisible?'text':'password'" v-model.trim="formData.loginPass" placeholder="비밀번호 (8자 이상)" class="form-control">
          <i class="icon mdi" :class="{'mdi-eye-outline':!loginPassVisible, 'mdi-eye-off':loginPassVisible}" @click="loginPassVisible=!loginPassVisible"></i>
        </div>
        <br>
        <div class="form-icon">
          <span class="form-label">비밀번호 확인*</span>
          <input :type="loginPassConfirmVisible?'text':'password'" v-model.trim="formData.loginPassConfirm" class="form-control">
          <i class="icon mdi" :class="{'mdi-eye-outline':!loginPassConfirmVisible, 'mdi-eye-off':loginPassConfirmVisible}" @click="loginPassConfirmVisible=!loginPassConfirmVisible"></i>
        </div>
      </div>
      <button type="submit" class="btn btn-confirm" :disabled="isLoginDisabled">확인</button>

    </form>
  </div>
</template>
<style lang="scss" scoped>
input {border:1px solid #000;}
button {border:1px solid #000;}
</style>
<script>
import userModel from "@/models/users.model";

export default {
  components: {},
  data () {
    return {
      formData: {
        name:'',
        loginId: '',
        loginPass: '',
        loginPassConfirm: '',
        isAgreePrivacy: false,
        isAgreeMarketing: false
      },
      loginPassVisible: false,
      loginPassConfirmVisible: false,
      passwordRegex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      emailRegex: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
    }
  },
  computed: {
    isLoginDisabled () {
      if(this.formData.name.length < 2 || this.formData.name.length > 15 ) {
        return true
      }

      if(this.formData.loginId.length === 0 ) {
        return true
      }

      if(!this.emailRegex.test(this.formData.loginId)) {
        return true
      }

      if(!this.passwordRegex.test(this.formData.loginPass)) {
        return true
      }

      if(this.formData.loginPass !== this.formData.loginPassConfirm) {
        return true
      }

      return false;
    }
  },
  methods: {
    onSubmit () {
      console.log(11)
      if(this.formData.name.length < 2 || this.formData.name.length > 15 ) {
        this.$swal('입력오류', '이름은 최소 2글자에서 15글자까지 입력하셔야 합니다.', 'error')
        return false
      }

      if(this.formData.loginId.length === 0 ) {
        this.$swal('입력오류', 'E-mail 주소를 입력하셔야 합니다.', 'error')
        return false
      }

      if(!this.emailRegex.test(this.formData.loginId)) {
        this.$swal('입력오류', '올바른 형식의 이메일 주소가 아닙니다.', 'error')
        return false
      }

      if(!this.passwordRegex.test(this.formData.loginPass)) {
        this.$swal('입력오류', '비밀번호는 최소 8자리, 하나이상의 문자및 숫자, 특수문자로 이루어져야 합니다.', 'error')
        return false
      }

      if(this.formData.loginPass !== this.formData.loginPassConfirm) {
        this.$swal('입력오류', '비밀번호와 비밀번호 확인이 서로 다릅니다', 'error')
        return false
      }

      userModel.registerProcess({
        name: this.formData.name,
        loginId: this.formData.loginId,
        loginPass: this.formData.loginPass,
        agreePrivacy: this.formData.isAgreePrivacy ? 'Y' : 'N',
        agreeMarketing: this.formData.isAgreeMarketing ? 'Y' : 'N'
      }).then(() => {
        this
            .$swal('사용자등록 완료', '사용자 등록이 완료되었습니다. 로그인 화면으로 이동합니다','success')
            .then(() => {
              this.$router.push('/sign-in')
            })
      })

    }
  }
}
</script>