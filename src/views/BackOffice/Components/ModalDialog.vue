<template>
  <v-dialog :value="true" :width="width" persistent>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title v-text="title"/>
        <v-spacer />
        <v-btn icon @click="OnClose"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      required: false,
      default: 400
    },
    title: {
      type: String,
      required: false,
      default: '새로운 윈도우'
    }
  },
  methods: {
    OnClose () {
      this.$emit('close')
    }
  }
}
</script>