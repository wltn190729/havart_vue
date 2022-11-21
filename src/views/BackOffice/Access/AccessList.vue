<template>
  <div>
    <table class="grid">
      <thead>
      <tr>
        <th class="W80">관리자 정의(한글)</th>
        <th class="W240">접근 권한</th>
        <th class="W50">관리</th>
      </tr>
      </thead>
      <tbody>
      <template>
        <tr v-for="(item, index) in accessList" :key="`list-${index}`">
          <td class="text-center">{{ item.kr_auth_def }}</td>
          <td class="text-center">{{ item.kr_access_list.toString() }}</td>
          <td>
            <v-menu dense>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon
                ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list small dense>
                <v-list-item link @click="OpenForm(item.def_name)"
                >권한 정보</v-list-item
                >
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
      <tr v-if="accessList.length === 0">
        <td colspan="10">등록된 회원이 없습니다.</td>
      </tr>
      </tbody>
    </table>
  <access-form v-if="formData.isOpened" :id="formData.id"
               @update="GetList"
               @close="CloseForm"></access-form>
  </div>
</template>

<script>
import AccessModel from "@/models/access.model";
import AccessForm from "@/views/BackOffice/Access/AccessForm";

export default {
  name: "AdminAccessList",
  components: {AccessForm },
  data() {
    return {
      accessList: {},
      formData : {
        isOpened: false,
        id: '',
      }
    };
  },
  mounted() {
    this.GetList();
  },
  methods: {
    GetList() {
      AccessModel
          .GetAccessList()
          .then(res => {
            this.accessList = res.data;
          });
    },

    OpenForm(id) {
      this.formData.isOpened = true;
      this.formData.id = id;
    },

    CloseForm() {
      this.formData.isOpened = false;
      this.formData.id = 0;
    },

  },

};
</script>
