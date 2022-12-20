<template>
  <modal-dialog :value="true" @close="$emit('close')" title="작품리스트 보기" :width="600">
      <table class="tb">
        <tr>
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
    ItemModel.GetItemsSearch({
      search_key: 'artist_id',
      search_value: this.id
    }).then( (res) => {
      this.listData = res.data;

      console.log(this.listData);
    });

  },
}
</script>