<template>
  <v-dialog :value="true" max-width="300px" persistent scrollable>
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>상태 변경</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="OnClose"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text style="height: 200px;">
          
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="OnClose"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import ItemModel from '@/models/items.model'
import ArtistModel from '@/models/artists.model'

export default {
  name: 'ArtistItem',
  props:{
    id:{
      type:String,
      require:true,
    }
  },
  data() {
    return {

    }
  },
  methods:{
    OnClose() {
      this.$emit('close')
    }
  },
  mounted() {
    ItemModel.GetItemsSearch({
      search_key : 'name',
      search_value : this.id
    }).then(res => console.log(res))
  },
}
</script>
<style lang="scss" scoped>
  
</style>