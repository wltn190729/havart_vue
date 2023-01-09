<template>
  <modal-dialog @close="$emit('close')" :title="id !== '' ? '관리자 수정' : '관리자 생성'" :width="400">
    <form @submit.prevent="OnSubmit">
      <table class="tb">
        <tr>
          <th>ID</th>
          <td>
            <v-text-field
                hide-details
                required
                v-model="formData.email"
                
                :rules="emailRules"
            />
          </td>
        </tr>
        <tr>
          <th>이름</th>
          <td>
            <v-text-field
                hide-details
                required
                v-model="formData.nickname"
                
                :rules="nameRules" 
            />
          </td>
        </tr>
        <tr>
          <th>비밀번호</th>
          <td>
            <v-text-field 
            hide-details
            required
            :type="ui.passwordView ? 'text' : 'password'"
            :rules="passwordRules" 
            :append-icon="!ui.passwordView ? 'mdi-eye-outline' : 'mdi-eye-off'"
            @click:append="passVeiw"
            v-model.trim="formData.password" 
              />
          </td>
        </tr>
        <tr>
          <th>권한</th>
          <td>
            <v-radio-group v-model="formData.def_name" row>
              <v-radio v-for="(item,index) in def_Data" :label="item.label" :value="item.value" :key="`radio-${index}`" tooltip="뭐뭐하는 권한입니다." />
            </v-radio-group>
          </td>
        </tr>
      </table>
      <v-btn type="submit" class="mt-2" block large color="primary">{{id !== '' ? '관리자 수정' : '관리자 생성'}}</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import adminModel from "@/models/admins.model";
import userModel from "@/models/users.model"

export default {
  components: {ModalDialog},
  props: {
    id: {
      type: [Number, String, Boolean],
      required: false,
      default: false
    }
  },
  data () {
    return {
      formData : {
        email: '',
        nickname: '',
        password:'',
        def_name: '',
        artist_id: 0,
      },
      def_Data: [],
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
        submitDisable: true,
      },
    };
  },
  computed: {
    isLoginDisabled() {
      if (this.formData.nickname.length < 2 || this.formData.nickname.length > 15) {
        return "닉네임은 최소 2글자에서 15자로 설정하셔야합니다.";
      }

      if (/[`~!@#$%^&*|\\'";:/?]/.test(this.formData.nickname)) {
        return "닉네임은 특수문자가 기입될 수 없습니다.";
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

      return true;
    }
  },
  mounted () {
    this.GetDef();
    if(
      this.formData.email === '' || 
      this.formData.nickname === '' ||
      this.formData.password === '' ||
      this.formData.def_name === ''
    ){
      this.ui.submitDisable = true
    }else {
      this.ui.submitDisable = false
    }
  },
  watch: {
    formCheck() {
      if(
      this.formData.email === '' || 
      this.formData.nickname === '' ||
      this.formData.password === '' ||
      this.formData.def_name === ''
    ){
      this.ui.submitDisable = true
    }else {
      this.ui.submitDisable = false
    }
    }
  },
  methods: {

    OnSubmit() {
      if (this.isLoginDisabled.length > 0) {
        this.$swal("error", this.isLoginDisabled, "error")
        .then((res)=>{ 
          if(res.isConformed) {
            console.log('확인버튼 클릭');          
          }
        })
        //alert(this.isLoginDisabled);
        return;
      }

      if(this.formData.artist_id === 0) {
        delete this.formData.artist_id
      }

      adminModel.AddAdmin(this.formData)
          .then((res) => {
            // console.dir(res)
            this.$swal(
                "사용자등록 완료",
                "사용자 등록이 완료되었습니다.",
                "success"
            )
            this.$emit('close')
          })
          .catch((error) => {
            this.$swal(
                "에러 발생",
                error.response.data.message,
                "error"
            )
            this.$emit('close')
          });

    },

    GetDef() {
      userModel.GetAuthDef().then((res) => {
      // let testData = res.data.map((x) => x.def_name);
      res.data.forEach(item => {
        // if(item.def_name === 'super_manager') return;

        this.def_Data.push(
          {
            label: item.kr_auth_def,
            value: item.def_name.toLowerCase()
          }
        )
        // console.log(item.def_name);
      });

      if(this.formData.def_name === '' && this.def_Data.length > 0) {
        this.formData.def_name = this.def_Data[0].value
      }
      
    })
    },
    passVeiw() {
      this.ui.passwordView = !this.ui.passwordView
    }

  }
}
</script>