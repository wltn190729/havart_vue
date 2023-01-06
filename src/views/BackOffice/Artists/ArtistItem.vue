<template>
  <modal-dialog :value="true" @close="$emit('close')" title="작품리스트 보기" :width="600">
      <table class="tb">
        <tr>
          <th>그림</th>
          <th>작품코드</th>
          <th>작품번호</th>
          <th>작품명</th>
        </tr>
        <tr v-for="(item, index) in listData" :key="index">
          <td>
            <v-img
                v-if="item.imageUrl[0].url"
                :src="item.imageUrl[0].url"
                max-width="120"
            >
            </v-img>
            <v-img
                v-else :src="require('@/assets/default_image.png')"
                max-width="120"
            ></v-img>
          </td>
          <td>{{ item.itemCode }}</td>
          <td>{{ item.item_id }}</td>
          <td>{{ item.title }}</td>
        </tr>
      </table>
  </modal-dialog>
</template>
<script>
import ModalDialog from "@/views/BackOffice/Components/ModalDialog";
import ItemModel from '@/models/items.model'
import ArtistsModel from "@/models/artists.model";

export default {
  components: {ModalDialog},
  name: 'ArtistItem',
  props:{
    id:{
      type: [Object, Array],
      require:true,
    }
  },
  data() {
    return {
      listData : []
    }
  },
  methods:{
    OnClose() {
      this.$emit('close')
    },
    OnSubmit() {
    },

  },
  mounted() {
    this.listData = this.id.items;
    console.log(this.listData);
  },
}
</script>