<template>
  <component :is="tag" v-bind="attrs">
    <template
    v-for="(c, i) in children"
    :key="i"
    >
      {{ isText(c) ? c : "" }}
      <DomRenderer
        v-if="!isText(c)"
        v-bind="c"
      />
    </template>
  </component>
</template>
<script>
export default {
  name: "DomRenderer",
  props: {
    tag: String,
    attrs: Object,
    children: {
      default: []
    }
  },
  methods: {
    isText (node) {
      return typeof node === "string"
    }
  }
}
</script>
