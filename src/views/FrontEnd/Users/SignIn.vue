<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="flex-box">
        <div>
          <span class="form-label">이메일</span>
          <input type="email" ref="loginIdInput" v-model.trim="formData.loginId" placeholder="예) kimchi@kimchi.co.kr" class="form-control" autofocus>
        </div>
        <br>
        <div class="form-icon">
          <span class="form-label">비밀번호</span>
          <input :type="ui.passwordView?'text':'password'" v-model.trim="formData.loginPass" placeholder="비밀번호 (8자 이상)" class="form-control">
          <i class="icon mdi" :class="{'mdi-eye-outline':!ui.passwordView, 'mdi-eye-off':ui.passwordView}" @click="ui.passwordView=!ui.passwordView"></i>
        </div>
      </div>
      <button type="submit" class="btn btn-login">사용자 로그인</button>
      <router-link to="/sign-up" class="btn btn-login">회원가입</router-link>
    </form>
  </div>
</template>
<style lang="scss" scoped>
input {border:1px solid #000;}
button {border:1px solid #000;}
</style>
<script>
import userModel from '@/models/users.model'

export default {
  components: {},
  data () {
    return {
      ui: {
        passwordView: false
      },
      formData: {
        loginId: '',
        loginPass: ''
      }
    }
  },
  mounted() {
    this.$nextTick(()=> {
      setTimeout(() => {
        this.$refs.loginIdInput.focus()
      },500)
    })
  },
  methods: {
    onSubmit () {
      userModel.loginProcess({
        loginId: this.formData.loginId,
        loginPass: this.formData.loginPass
      }).then(() => {
        this.$store.commit('authorize/setLogin')
        if(typeof this.$route.query.redirectUri !== 'undefined' && this.$route.query.redirectUri) {
          this.$router.push(this.$route.query.redirectUri)
        }
        else {
          this.$router.push('/')
        }
      })
    }
  }
}
</script>