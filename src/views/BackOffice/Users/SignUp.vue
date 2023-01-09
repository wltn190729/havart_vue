<template>
    <div>
      <div style="background-image: linear-gradient(to right, #8360c3, #2ebf91);height:100vh;margin:-12px;overflow:hidden;">
        <v-dialog :value="true" hide-overlay persistent transition="dialog-top-transition" max-width="500">
          <v-card style="">
            <v-form class="d-flex flex-column justify-center align-center" ref="form" @submit.prevent="onSubmit" style="padding:2rem;" >
              <div class="d-flex">
                <v-icon>mdi-account</v-icon>
                  <v-text-field 
                  type="email" 
                  :class="`text-${'Subtitle 1'}`" 
                  v-model="formData.email" 
                  :rules="emailRules"
                  label="E-mail" 
                  required
                  
                  />
              </div>
              <div class="d-flex">
                <v-icon>mdi-alpha-n-box-outline</v-icon>
                  <v-text-field 
                  type="text" 
                  :class="`text-${'Subtitle 1'}`" 
                  v-model="formData.nickname"
                  label="NickName" 
                  required 
                  :rules="nameRules" 
                  />
              </div>
              <div class="d-flex" >
                  <v-icon>mdi-lock</v-icon>
                  <v-text-field :class="`text-${'Subtitle 1'}`" :type="ui.passwordView ? 'text' : 'password'"
                    v-model.trim="formData.password" :rules="passwordRules" label="비밀번호" required />
                  <v-icon v-if="ui.passwordView" @click="ui.passwordView = !ui.passwordView">mdi-eye-outline</v-icon>
                  <v-icon v-else @click="ui.passwordView = !ui.passwordView">mdi-eye-off</v-icon>
              </div>
              <div class="d-flex" >
                  <v-icon>mdi-lock</v-icon>
                  <v-text-field :class="`text-${'Subtitle 1'}`" :type="ui.passwordConfirmView ? 'text' : 'password'"
                    v-model.trim="formData.passwordConfirm" :rules="passwordRules" label="비밀번호확인" required>
                  </v-text-field>
                  <v-icon @click="ui.passwordConfirmView = !ui.passwordConfirmView">{{ui.passwordConfirmView?'mdi-eye-outline':'mdi-eye-off'}}</v-icon>
                </div>
              <div class="d-flex">
                  <v-icon>mdi-account-group</v-icon>
                  <v-radio-group v-model="formData.def_name" row>
                    <v-radio v-for="(item,index) in def_Data" :label="item.label" :value="item.value" :key="`radio-${index}`" tooltip="뭐뭐하는 권한입니다." />
                  </v-radio-group>
              </div>
              <v-row>
                <v-col class="d-flex justify-space-around" style="width:300px;">
                  <v-btn :loading="layoutLoading" x-large color="primary" class="mr-4" type="submit"><v-icon small>mdi-check</v-icon>
                    회원가입
                  </v-btn>
                  <v-btn x-large to="/">
                    취소
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
   
  </div>
  
</template>
<style lang="scss" scoped>

form {
  //position: absolute;
  //width: 30vw;
  //height: 80vh;
  //top: 50%;
  //left: 50%;
  background-color: #fff;
  //transform: translate(-50%, -50%);
  box-shadow: 
    0 7px 100px -4px rgba(0, 0, 0, .2),
    0 12px 17px 2px rgba(0, 0, 0, .14),
    0 5px 22px 4px rgba(0, 0, 0, .12);
    .d-flex {
      width: 100%;
    }
}

.v-input {
  height: auto;
  display: flex;
  align-items: center;

  .v-icon {
    font-size:28px;
  }
}
.v-icon.v-icon {
  font-size: 28px;
  margin-right: 15px;
}
.v-icon.mdi-account {
  font-size: 28px;
  margin-right: 15px;

}

.v-icon.mdi-lock {
  font-size: 28px;
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
import userModel from "@/models/users.model";


export default {
  components: {},
  data() {
    return {
      def_Data: [],
      formData: {
        nickname: "",
        email: "",
        def_name: "",
        artist_id: "",
        password: "",
        passwordConfirm: "",
      },
      loginPassVisible: false,
      loginPassConfirmVisible: false,
      emailRules: [
        v => !!v || 'E-mail을 입력해주세요',
        v => /.+@.+\..+/.test(v) || 'E-mail 형식을 확인해주세요',
      ],
      passwordRules: [
        v => !!v || 'PassWord를 입력해주세요',
        v => /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/.test(v) || '비밀번호는 (특수문자)포함 8자리 이상입니다.'
      ],
      nameRules: [
        v => !!v || '닉네임을 입력해주세요'
      ],
      ui: {
        passwordView: false,
        passwordConfirmView: false
      },
      isLoginDisable: true,
    }
  },
  mounted() {
    // 페이지 들어올 때 첫 실행(함수)
    userModel.GetAuthDef().then((res) => {
      // let testData = res.data.map((x) => x.def_name);
      res.data.forEach(item => {
        if(item.def_name === 'super_manager') return;

        this.def_Data.push(
          {
            label: item.kr_auth_def,
            value: item.def_name.toUpperCase()
          }
        )
        // console.log(item.def_name);
      });

      if(this.formData.def_name === '' && this.def_Data.length > 0) {
        this.formData.def_name = this.def_Data[0].value
      }
      
    })
    
  },
  computed: {
    isLoginDisabled() {
      if (this.formData.nickname.length < 2 || this.formData.nickname.length > 15) {
        return "닉네임은 최소 2글자에서 15자로 설정하셔야합니다.";
      }

      if (this.formData.email.length === 0) {
        return "email 입력해주세요";
      }

      if (!/^[a-zA-Z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(this.formData.email)) {
        return '올바른 형식의 [email]을 입력하셔야 합니다.';
      }

      if (this.formData.password.length === 0) {
        return "비밀번호를 입력해주세요.";
      }

      if (!/^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/.test(this.formData.password)) {
        return '[비밀번호]는 8~20자리의 영문,숫자,특수문자를 포함하여야 합니다.';
      }

      if(this.formData.password !== this.formData.passwordConfirm) {
        // console.log(this.formData);
        return "비밀번호가 다릅니다.";
      }

      
      
      return true;
    }
    

  },
  methods: {
    onSubmit() {
      if (this.isLoginDisabled.length > 0) {
        this.$swal("error", this.isLoginDisabled, "error")
        .then((res)=>{ 
          if(res.isConformed) {
            console.log('확인버튼 클릭');          
          }
        });
        //alert(this.isLoginDisabled);
        return;
      }

      console.log("return이 되는지 확인");
      // console.log(this.formData, "this.formdAta");
      const formData = {
        email: this.formData.email,
        nickname: this.formData.nickname,
        def_name: this.formData.def_name,
        password: this.formData.password,
      }

      userModel
        .registerProcess(formData)
        .then((res) => {
          if (res.state === 'yes') {
            this.$swal(
                "사용자등록 완료",
                "사용자 등록이 완료되었습니다. 로그인 화면으로 이동합니다",
                "success"
            );

            console.log("성공적");
          }
          this.$router.push("/sign-in");
          
        });
    },
    
  }
}
</script>
