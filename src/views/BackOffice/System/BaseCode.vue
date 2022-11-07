<template>
  <div>
    <v-row>
      <div style="width:250px;padding:12px;">
        <v-card flat outlined>
          <v-app-bar dense flat>
            <v-toolbar-title>구분</v-toolbar-title>
          </v-app-bar>
          <v-card-text>
            <v-list>
              <v-list-item-group v-model="selectedType">
                <v-list-item v-for="item in typeList" :key="`type-${item}`" link>
                  <v-list-item-content v-text="item" />
                </v-list-item>
              </v-list-item-group>

            </v-list>
          </v-card-text>
        </v-card>
      </div>

      <v-col>
        <v-card flat outlined>
          <v-app-bar dense flat>
            <v-toolbar-title>{{typeList[selectedType]}} 목록 ({{listData.totalRows}})</v-toolbar-title>
          </v-app-bar>
          <v-card-text>
            <table class="grid">
              <thead>
              <tr>
                <th class="W80">번호</th>
                <th>{{typeList[selectedType]}}</th>
                <th class="W140">등록자</th>
                <th class="W200">등록일시</th>
                <th class="W140">최종수정</th>
                <th class="W200">최종수정일시</th>
                <th class="W80">관리</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in listData.result" :key="`list-${index}`">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.regUserName}}</td>
                <td>{{item.regDt.dateFormat('yyyy/MM/dd (e) HH:mm:ss')}}</td>
                <td>{{item.updUserName}}</td>
                <td>{{item.updDt.dateFormat('yyyy/MM/dd (e) HH:mm:ss')}}</td>
                <td>
                  <v-menu dense>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                    </template>
                    <v-list small dense>
                      <v-list-item link>
                        <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
                        <v-list-item-content>정보 수정</v-list-item-content>
                      </v-list-item>
                      <v-list-item link @click="deleteItem(item.id, item.name)">
                        <v-list-item-icon><v-icon>mdi-trash-can</v-icon></v-list-item-icon>
                        <v-list-item-content>삭제</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
              <tr v-if="listData.result.length===0">
                <td colspan="7">등록된 {{typeList[selectedType]}} 자료가 없습니다</td>
              </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import BaseCodeModel from '@/models/basecode.model'
import vue from "vue";
export default {
  name: 'BasecodeList',
  data () {
    return {
      selectedType : 0,
      typeList: ['회원구분','드레스/분위기','드레스/라인별','드레스/비즈','드레스/소재','드레스/가격대'],
      listData: {
        result: [],
        totalRows: 0
      },
      formData: {
        isOpened: false,
        id: 0
      }
    }
  },
  mounted () {
    this.GetList()
  },
  watch: {
    selectedType () {
      this.GetList()
    }
  },
  methods: {
    GetList () {
      BaseCodeModel
        .GetBaseCodeList( encodeURIComponent(this.typeList[this.selectedType]))
        .then(res => {
          this.listData.result = res.data.result
          this.listData.totalRows = res.data.pageInfo.totalRows
        })
    },
    deleteItem (id, title) {
      vue.swal({
        title: this.typeList[this.selectedType] + ' 삭제',
        text: `삭제하시겠습니까? [${title}]`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '삭제하기',
        cancelButtonText: '취소'
      }).then(result => {
        if(result.isConfirmed) {
          BaseCodeModel
            .DeleteBaseCode(encodeURIComponent(this.typeList[this.selectedType]), id)
            .then(() => {
              this.GetList()
            })
        }
      })
    }
  }
}
</script>