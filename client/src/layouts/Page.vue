<template>
  <slot name="default" />
  <Teleport v-if="layout.areas.header && $slots.header" :to="header">
    <slot name="header" />
  </Teleport>
</template>

<script>
import { watchEffect } from "vue"
import { layout } from "/src/common/helpers.js"
export default {
  name: "PageLayout",
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    return {
      layout
    }
  },
  computed: {
    header () {
      return layout.areas.header?.$el
    }
  },
  created () {
    Object.assign(layout.options, this.$props)
  }
}
</script>
