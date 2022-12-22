<template>
  <modal-dialog :value="true" @close="$emit('close')" title="작품리스트 보기" :width="600">
      <table class="tb">
        <tr>
          <th>그림</th>
          <th>작품명</th>
          <th>장르</th>
          <th>사이즈</th>
        </tr>
        <tr v-for="(item, index) in listData" :key="index">
          <td>
            <v-img
                v-if="item.images[0].url"
                :src="item.images[0].url"
                max-width="120"
            >
            </v-img>
            <v-img
                v-else :src="require('@/assets/default_image.png')"
                max-width="120"
            ></v-img>
          </td>
          <td>{{ item.title }}</td>
          <td>{{ item.genreName }}</td>
          <td>{{ item.size }}</td>
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
      type:Number,
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
    const formData = {};
    formData['item.artist_id'] = this.id;
    ItemModel.GetItemsSearch(formData).then( (res) => {
      this.listData = res.data.data;

      console.log(this.listData);
    });

  },
}
</script>