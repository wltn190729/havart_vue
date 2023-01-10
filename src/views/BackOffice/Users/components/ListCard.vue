<template>
  <v-dialog persistent :value="true" width="500">
    <v-app-bar flat height="40">
        <v-toolbar-title dense style="font-size:1rem;">{{title}}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="OnClose"><v-icon>mdi-close</v-icon></v-btn>
    </v-app-bar>
    <v-card>
      <table class="grid">
        <thead>
          <tr>
            <th class="W30">번호</th>
            <th class="W60">사진</th>
            <th class="W120">타이틀</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formData" :key="index">
            <td class="text-center">{{item.item_id}}</td>
            <td class="d-flex justify-center">
              <v-img 
                :lazg-src="item.images[0].url"
                :src="item.images[0].url"
                transition="fade-taransition"
                max-width="50"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="blue lighten-3"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </td>
            <td class="text-center">{{item.title}}</td>
          </tr>
        </tbody>
      </table>
    </v-card>
  </v-dialog>
</template>
<script>
import UserModel from "@/models/users.model";

export default {
  name: 'ListCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      formData: {

      }
    }
  },
  mounted() {
    this.GetList();
  },
  methods: {
    OnClose() {
      this.$emit('close', 'likeList')
    },
    GetList() {
      const uid = this.data;
      UserModel
          .GetUserLikeList(uid)
          .then(res => {
            this.formData = res.data.pinList;
          });

    },

  },
}
</script>
<style lang="scss" scoped>
  
</style>