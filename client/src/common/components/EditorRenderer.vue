<template>
  <renderer v-bind="attrs" />
</template>
<script>
import { editorModeSymbol, editorOptionsSymbol } from "../constants.js"
import Renderer from "./Renderer.vue"

export default {
  components: {
    Renderer
  },
  computed: {
    attrs () {
      return  {
        ...this.$attrs,
        [ editorModeSymbol ]: true
      }
    }
  }
}
</script>
