<template>

  <v-form @submit.prevent="OnSubmit">
    <v-card dense outlined style="border-bottom:0; border-bottom-right-radius: 0; border-bottom-left-radius: 0">
      <v-app-bar flat dense height="40">
        <v-toolbar-title dense v-text="title" style="font-size:1rem" />
        <v-spacer></v-spacer>
        <v-btn type="submit" outlined color="primary" small><v-icon small>mdi-magnify</v-icon> 필터적용</v-btn>
      </v-app-bar>
      <v-card-text v-if="isFilterOpened"><slot /></v-card-text>
    </v-card>
    <v-btn color="light" elevation="0" text tile outlined block @click="isFilterOpened=!isFilterOpened" style="border-top:0; margin-top:-1px;" small>
      {{isFilterOpened?'닫기':'열기'}} <v-icon v-text="isFilterOpened?'mdi-chevron-up':'mdi-chevron-down'" />
    </v-btn>
  </v-form>

</template>


<script>
export default {
  name: 'FilterBox',
  props: {
    title: {
      type: String,
      required: false,
      default: '검색 필터'
    }
  },
  data () {
    return {
      isFilterOpened: true
    }
  },
  methods: {
    OnSubmit () {
      console.log('hahaha')
      this.$emit('submit')
    }
  }
}
</script>