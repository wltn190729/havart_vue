<template>
  <v-row justify="center">
    <v-dialog :value="true" fullscreen hide-overlay transition="dialog-top-transition" style="overflow:hidden;">
      <v-card style="background-image: linear-gradient(to right, #8360c3, #2ebf91);">
        <v-form class="d-flex flex-column justify-center align-center" ref="form" @submit.prevent="onSubmit">
          <v-row style="width: 400px; ">
            <v-col class="d-flex">
              <v-icon>mdi-account</v-icon>
              <!-- <v-text-field type="email" :class="`text-${'h5'}`" v-model="formData.uid" :rules="emailRules"
                label="E-mail" required></v-text-field> -->
                <v-text-field type="text" :class="`text-${'h5'}`" v-model="formData.email" ref="loginIdInput"
                label="E-mail" required></v-text-field>
            </v-col>

          </v-row>
          <v-row style="width: 400px; font-size: 3rem;">
            <v-col class="d-flex align-center">
              <v-icon>mdi-lock</v-icon>
              <v-text-field :class="`text-${'h5'}`" :type="ui.passwordView ? 'text' : 'password'"
                v-model.trim="formData.password" :rules="passwordRules" label="Password" required>
              </v-text-field>
              <v-icon v-if="ui.passwordView" @click="ui.passwordView = !ui.passwordView">mdi-eye-outline</v-icon>
              <v-icon v-else @click="ui.passwordView = !ui.passwordView">mdi-eye-off</v-icon>
            </v-col>

          </v-row>
          <v-row>
            <v-col class="d-flex justify-space-around" style="width:300px;">
              <v-btn color="primary" class="mr-4" type="submit" :loading="layoutLoading" style="font-size:21px;" height="50">
                로그인
              </v-btn>
              <v-btn style="font-size:21px;" height="50">
                <router-link to="/sign-up" class="btn btn-login">회원가입</router-link>
              </v-btn>

            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>


</template>
<style lang="scss" scoped>
form {
  position: absolute;
  width: 500px;
  height: 400px;
  top: 50%;
  left: 50%;

  background-color: #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0 7px 100px -4px rgba(0, 0, 0, .2),
    0 12px 17px 2px rgba(0, 0, 0, .14),
    0 5px 22px 4px rgba(0, 0, 0, .12);
}

.v-input {
  height: auto;
  display: flex;
  align-items: center;
}

.v-icon.mdi-account {
  font-size: 38px;
  margin-right: 15px;

}



.v-icon.mdi-lock {
  font-size: 38px;
  margin-right: 15px;
}



.v-icon.mdi-eye-outline {
  height: auto;
}

.v-icon.mdi-eye-outline::after {
  height: auto;
}

.v-icon.mdi-eye-off {
  height: auto;
}

.v-icon.mdi-eye-off::after {
  height: auto;
}

.btn-login {
  color: #000;
  text-decoration-line: none;
}

.btn-login:active {
  color: #000;
  text-decoration-line: none;
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
        this.$store.commit('authorize/setLogin')
        if(typeof this.$route.query.redirectUri !== 'undefined' && this.$route.query.redirectUri) {
          this.$router.push(this.$route.query.redirectUri)
        }
        else {
          this.$router.push('/')
        }
      }).catch(e => console.log(e))
    },
    Close() {

    }
  }
}
</script>