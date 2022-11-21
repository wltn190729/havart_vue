<template>
  <modal-dialog @close="$emit('close')" title="대분류 권한 수정" width='600'>
    <form @submit.prevent="OnSubmit">
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">

            </th>
            <th class="text-left">
              내용
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, i) in accessDefList[1]"
              :key="i"
          >
            <td>
              <v-checkbox @change="ChangePermission(accessDefList[0][i], i)" :input-value="accessList.kr_access_list" :value="item"></v-checkbox>
            </td>
            <td>{{ item }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </form>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import AccessModel from "@/models/access.model";

export default {
  components: {ModalDialog},
  props: {
      id : {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      accessDefList: {},
      accessList: {},
      accessChangeList: []
    };
  },
  mounted() {
    this.GetAccessListDef();
    this.GetList();
  },
  methods: {
    OnSubmit() {
    },
    GetAccessListDef() {
      AccessModel
          .GetAccessListDef()
          .then(res => {
            this.accessDefList = res.data;
          });
    },

    GetList() {
      AccessModel
          .GetAccessList()
          .then(res => {
            let accessList = res.data;

            for (const i in accessList) {
              if (accessList[i].def_name === this.id) {
                this.accessList = accessList[i];
              }
            }
            console.log(this.accessList);
          });
    },

    ChangePermission(key) {
      let access_list = this.accessList.access_list;
      access_list = access_list.split(",");

      if (access_list.indexOf(key) === -1) {
        access_list = access_list.join(',').concat(',', key);
      } else {
        access_list = access_list.join(',').replace(key, '').replace(',,', '');
        access_list = access_list.replace(',,', '');
      }

      this.accessList.access_list = access_list;

      console.log(this.accessList.access_list);
    },
  }
}
</script>