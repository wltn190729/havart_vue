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
          <v-radio-group
            v-model="data"
            column
          >
            <v-radio
              label="판매중"
              value="Y"
            ></v-radio>
            <v-radio
              label="판매완료"
              value="N"
            ></v-radio>
            <v-radio
              label="대기중"
              value="W"
            ></v-radio>
            <v-radio
              label="전시중"
              value="D"
            ></v-radio>
          </v-radio-group>
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
            @click="OnSave"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
</template>
<script>
export default {
  name:'StateSelect',
  props: {
    id: {
      type: [Number, String, Boolean, Object, Array],
      required: false,
      default: false
    }
  },
  data() {
    return {
      data: '',
    }
  },
  methods: {
    OnClose () {
      this.$emit('close')
    },
    OnSave() {
      this.$emit('save', this.data)
    }
  },
  mounted() {
    this.data = this.id.state ?? this.id.itemState;

    switch (this.data) {
      case "판매중":
        this.data = 'Y';
        break;
      case "판매완료":
        this.data = 'N'
        break;
      case "대기중":
        this.data = 'W';
        break;
      case "전시중":
        this.data = 'D';
        break;
    }
  }
}
</script>
<style lang="scss" scoped>
  
</style>