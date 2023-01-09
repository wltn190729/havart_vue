<template>
  <div style="height:100%;background-image: linear-gradient(to right, #8360c3, #2ebf91); margin:-12px;" >
    <v-dialog persistent :value="true" transition="dialog-top-transition" width="400">
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-card>
          <v-card-text>
            <div class="logo"></div>

            <v-text-field dense type="text" v-model.trim="formData.email" ref="loginIdInput" label="E-mail" required prepend-inner-icon="mdi-account" />

            <div class="d-flex">
              <v-text-field prepend-inner-icon="mdi-lock" :type="ui.passwordView ? 'text' : 'password'"  v-model.trim="formData.password" :rules="passwordRules" label="Password" required
                            :append-outer-icon="ui.passwordView?'mdi-eye-outline':'mdi-eye-off'"
                            @click:append-outer="ui.passwordView = !ui.passwordView"
              />
            </div>
            <div class="text-center mt-2">
                <v-btn color="#F8AF3E" elevation="0" large block type="submit" class="mb-2" :loading="layoutLoading">사용자 로그인</v-btn>
                <v-btn to="/sign-up" elevation="0" block large>회원가입</v-btn>
            </div>

          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>

.logo {
  background-image:url(~@/assets/logo.png);
  width:219px;
  height:48px;
  display:block;
  text-indent:-9999px;
  margin:1rem auto 3rem;
}
</style>
<script>
import userModel from '@/models/users.model';


export default {
  components: {},
  data () {
    return {
      ui: {
        passwordView: false
      },
      formData: {
        email: '',
        password: ''
      },
      emailRules: [
        v => !!v || 'E-mail을 입력해주세요',
        v => /.+@.+\..+/.test(v) || 'E-mail을 입력해주세요',
      ],
      passwordRules: [
        v => !!v || 'PassWord를 입력해주세요'
      ]
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
        email: this.formData.email,
        password: this.formData.password
      }).then(() => {
          this.$router.push('/')
        }).catch(e => {
          console.log(e);
        //setTimeout( () => {this.$router.go(this.$router.currentRoute)}, 1000)
      })
    },
    Close() {

    }
  }
}
</script>