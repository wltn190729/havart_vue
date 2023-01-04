<template>
  <div>
    <table class="grid">
      <thead>
      <tr>
        <th class="W120">권한이름</th>
        <template v-for="(item,index) in accessList">
          <th class="W80" :key="`auth-th-${index}`">{{item.kr_auth_def}}</th>
        </template>
        <th></th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="(def, defIndex) in accessDefList" :key="`list-${defIndex}`">
        <td>{{def.name}}</td>
        <template v-for="(item,index) in accessList">
          <td class="W80" :key="`auth-td-${defIndex}-${index}`">
            <label class="chk">
              <input type="checkbox" :checked="item.access_list.indexOf(def.key)>=0" @change="onChangeAuth(item.def_name, def.key, !(item.access_list.indexOf(def.key)>=0))">
              <span class="chk-label"></span>
            </label>
          </td>
        </template>
        <td></td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import AccessModel from "@/models/access.model";
import accessModel from "@/models/access.model";

export default {
  name: "AdminAccessList",
  data() {
    return {
      accessList: {},
      accessDefList: []
    };
  },
  mounted() {
    this.GetAccessListDef()
    this.GetList();
  },
  methods: {
    GetAccessListDef() {
      this.accessDefList = [];
      AccessModel
          .GetAccessListDef()
          .then(res => {
            for(let i in res.data[0]) {
              this.accessDefList.push({
                key: res.data[0][i],
                name: res.data[1][i],
              })
            }
          });
    },
    GetList() {
      AccessModel
          .GetAccessList()
          .then(res => {
            this.accessList = res.data;
            for(let i in this.accessList) {
              this.accessList[i].access_list = this.accessList[i].access_list.split(',');
            }
          });
    },
    async onChangeAuth (def_name, auth_name) {
      const t = this.accessList.find(item=>item.def_name === def_name)
      const auth = this.accessDefList.find(item=>item.key === auth_name)
      let isAuth = false;

      if(t !== null && t !== undefined) {
        if(t.access_list.indexOf(auth_name) >= 0) {
          t.access_list.splice( t.access_list.indexOf(auth_name), 1);
          isAuth = false;
        }
        else {
          t.access_list.push(auth_name);
          isAuth = true
        }

        const access_list = t.access_list.join(',');
        await accessModel.PatchAccessListDef(def_name, access_list).then(() => {
          this.$toastr.s(`권한설정이 반영되었습니다 : [${t.kr_auth_def}] - [${auth.name}] > ${isAuth?'권한 적용':'권한 해제'} `);
        })
      }
    }
  }
};
</script>
