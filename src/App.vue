<template>
  <div id="app">
    <component v-bind:is="theme" />
  </div>
</template>

<script>
import BackLayout from "@/views/BackOffice/BackLayout";

export default {
  name: 'ApplicationLayout',
  computed: {
    theme () {
      return this.$store.getters["layout/theme"]
    }
  },
  components: {
    "BackOffice" : BackLayout
  }
}
</script>