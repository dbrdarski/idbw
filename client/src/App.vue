<template>
  <router-view v-if="initialized" />
</template>

<script>
import { defineComponent } from "vue"
// import theme from "/themes/default"

export default defineComponent({
  name: "App",
  data () {
    return {
      initialized: false
    }
  },
  async mounted () {
    this.initialized = true
  }
})
</script>
