<template>
  <modal-dialog @close="$emit('close')" :title="IsEdit?'게시판 정보 수정':'신규 게시판 생성'" :width="800">
    <form @submit.prevent="OnSubmit">

      <v-card flat dense outlined>
        <v-app-bar flat dense>
          <v-card-title>기본 설정</v-card-title>
        </v-app-bar>
        <v-card-text>
          <v-text-field
              label="게시판 고유 키"
              v-model.trim="formData.key"
              :readonly="IsEdit"
              :required="!IsEdit"
              outlined
              dense
              messages="4~20자의 영어소문자,숫자,하이픈(-)을 사용 가능합니다."
          />

          <v-text-field
              label="게시판 이름"
              v-model.trim="formData.title"
              required
              outlined
              dense
          />

          <v-row>
            <v-subheader class="mt-0 mb-0 pt-0 pb-0">게시판 타입</v-subheader>
            <v-col>
              <v-radio-group v-model="formData.options.BoardType" row hide-details dense class="mt-0">
                <v-radio
                    v-for="(item,index) in dataSet.boardTypeList"
                    name="board_type"
                    :key="`board-type-${index}`"  :value="item.value" :label="item.name" />
              </v-radio-group>
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>

      <v-card flat dense outlined class="mt-2">
        <v-app-bar flat dense>
          <v-card-title>게시판 스킨 설정</v-card-title>
        </v-app-bar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field label="글 목록 스킨" hide-details outlined dense v-model.trim="formData.skins.list" />
            </v-col>
            <v-col>
              <v-text-field label="글 목록 스킨 (모바일)" hide-details outlined dense v-model.trim="formData.skins.listM" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="글 읽기 스킨" hide-details outlined dense v-model.trim="formData.skins.view" />
            </v-col>
            <v-col>
              <v-text-field label="글 읽기 스킨 (모바일)" hide-details outlined dense v-model.trim="formData.skins.viewM" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="글 작성 스킨" hide-details outlined dense v-model.trim="formData.skins.write" />
            </v-col>
            <v-col>
              <v-text-field label="글 작성 스킨 (모바일)" hide-details outlined dense v-model.trim="formData.skins.writeM" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card flat dense outlined class="mt-2">
        <v-app-bar flat dense>
          <v-card-title>게시판 권한 설정</v-card-title>
        </v-app-bar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-select label="글 목록" hide-details outlined dense :items="dataSet.authorizeList" v-model.number="formData.authorize.list" item-text="name" item-value="value" />
            </v-col>
            <v-col>
              <v-select label="글 읽기" hide-details outlined dense :items="dataSet.authorizeList" v-model.number="formData.authorize.view" item-text="name" item-value="value" />
            </v-col>
            <v-col>
              <v-select label="글 작성" hide-details outlined dense :items="dataSet.authorizeList" v-model.number="formData.authorize.write" item-text="name" item-value="value" />
            </v-col>
            <v-col>
              <v-select label="답글 작성" hide-details outlined dense :items="dataSet.authorizeList" v-model.number="formData.authorize.reply" item-text="name" item-value="value" />
            </v-col>
            <v-col>
              <v-select label="댓글 작성" hide-details outlined dense :items="dataSet.authorizeList" v-model.number="formData.authorize.comment" item-text="name" item-value="value" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card flat dense outlined class="mt-2">
        <v-app-bar flat dense>
          <v-card-title>게시판 옵션</v-card-title>
        </v-app-bar>
        <v-card-text>
          <v-checkbox hide-details v-model="formData.options.UseSecret" label="비밀글 기능 사용" />

          <v-checkbox hide-details v-model="formData.options.UseCategory" label="카테고리 기능 사용" />

          <v-checkbox hide-details v-model="formData.options.UsePageLimit" label="페이징 기능 사용" />

        </v-card-text>
      </v-card>

      <template v-if="formData.options.UseCategory">
        <v-card flat dense outlined class="mt-2">
          <v-app-bar flat dense>
            <v-card-title>카테고리 설정</v-card-title>
            <v-spacer />
            <v-btn small color="primary" @click="addCategory"><v-icon small></v-icon> 카테고리 추가</v-btn>
          </v-app-bar>
          <v-card-text>
            <template v-for="(item,index) in formData.categoryList">

              <v-row :key="`category-${index}`">
                <v-col cols="11">
                  <v-text-field v-model="item.title" dense hide-details outlined :placeholder="`카테고리 ${index+1}`" />
                </v-col>
                <v-col cols="1">
                  <v-btn small icon @click="removeCategory(index)"><v-icon small>mdi-trash-can</v-icon></v-btn>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </template>

      <template v-if="formData.options.UsePageLimit">
        <v-card flat dense outlined class="mt-2">
          <v-app-bar flat dense>
            <v-card-title>페이징 옵션</v-card-title>
          </v-app-bar>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                    type="number"
                    min="1"
                    step="1"
                    label="한 목록당 표시 글수"
                    hide-details
                    v-model.number="formData.options.PageRows"
                    required
                    outlined
                    dense
                />
              </v-col>
              <v-col>
                <v-text-field
                    type="number"
                    min="1"
                    step="1"
                    label="모바일"
                    v-model.number="formData.options.PageRowsM"
                    required
                    hide-details
                    outlined
                    dense
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                    type="number"
                    min="1"
                    step="1"
                    label="한번에 표시 페이지수"
                    hide-details
                    v-model.number="formData.options.FixedNums"
                    required
                    outlined
                    dense
                />
              </v-col>
              <v-col>
                <v-text-field
                    type="number"
                    min="1"
                    step="1"
                    label="모바일"
                    hide-details
                    v-model.number="formData.options.FixedNumsM"
                    required
                    outlined
                    dense
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <v-card flat dense outlined class="mt-2">
        <v-app-bar flat dense>
          <v-card-title>추가입력 필드</v-card-title>
          <v-spacer />
          <v-btn small color="primary" @click="addExtraField"><v-icon small></v-icon> 입력필드 추가</v-btn>
        </v-app-bar>
        <v-card-text>
          <template v-for="(item,index) in formData.extraFields">
            <v-row :key="`extra-field-${index}`">
              <v-col cols="3">
                <v-text-field v-model="item.title" dense hide-details outlined :placeholder="`추가입력필드 ${index+1}`" />
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="item.desc" dense hide-details outlined placeholder="설명" />
              </v-col>
              <v-col cols="1">
                <v-btn small icon @click="removeExtraField(index)"><v-icon small>mdi-trash-can</v-icon></v-btn>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>


      <v-btn type="submit" class="mt-2" block large color="primary">게시판 설정 저장</v-btn>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import BoardModel from "@/models/boards.model"

export default {
  components: {ModalDialog},
  props: {
    id: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      dataSet: {
        boardTypeList: [
          {value:'LIST', name:'목록형' },
          {value:'GALLERY', name:'앨범형' },
          {value:'WEBZINE', name:'웹진형' },
        ],
        authorizeList: [
          {value:-1, name:'사용안함'},
          {value:0, name:'비회원'},
          {value:1, name:'회원'},
          {value:10, name:'관리자만'},
        ]
      },
      formData: {
        key: '',
        title: '',
        skins: {
          list: 'basic',
          listM: 'basic',
          write: 'basic',
          writeM: 'basic',
          view: 'basic',
          viewM: 'basic'
        },
        authorize: {
          list: 0,
          view: 0,
          write: 0,
          reply: -1,
          comment: -1
        },
        options: {
          BoardType: 'LIST',
          UseCategory: false,
          UseSecret: false,
          UsePageLimit: true,
          PageRows: 15,
          PageRowsM: 10,
          FixedNums: 10,
          FixedNumsM: 5
        },
        extraFields: [],
        categoryList: []
      }
    }
  },
  computed: {
    IsEdit () {
      return this.id && this.id.length > 0 ? true : false
    }
  },
  mounted () {
    this.formData.key = this.id
  },
  methods: {
    OnSubmit () {
      if(this.formData.key.length === 0) {
        this.$swal('Error', "게시판 고유키를 입력하셔야 합니다.", "error")
        return;
      }

      const keyRegex = /^[a-z]+[a-z0-9_]{3,19}$/;
      if(! keyRegex.test(this.formData.key)) {
        this.$swal('Error', "게시판 고유키는 4~20자리의 영어소문자, 숫자, 언더바(_)만 사용가능합니다.", "error")
        return;
      }

      if(this.formData.title.length ===0) {
        this.$swal('Error', "게시판 이름을 입력하셔야 합니다.", "error")
        return;
      }

      let formData = this.formData

      BoardModel
        .PostBoardInfo(formData, this.IsEdit ? this.formData.key : '')
        .then(res => {
          // 상위 Vue 에 OnUpdate 이벤트를 보낸다
          this.$emit('update')

          // 상위 Vue 에 Close 이벤트를 보낸다
          this.$emit('close')
        })

    },
    addExtraField () {
      this.formData.extraFields.push({
        title: '',
        desc: ''
      })
    },
    removeExtraField (index) {
      this.formData.extraFields.splice(index, 1)
    },
    addCategory () {
      this.formData.categoryList.push('')
    },
    removeCategory (index) {
      this.formData.categoryList.splice(index, 1)
    }
  }
}
</script>