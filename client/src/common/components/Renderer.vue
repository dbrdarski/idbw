<template>
    <component :is="tag" v-bind="computedAttrs">
        <template v-for="(c, i) in children" :key="i">
            {{ isText(c) ? c : "" }}
            <DomRenderer v-if="!isText(c)" v-bind="c" />
        </template>
    </component>
</template>
<script>
import { editorModeSymbol, editorOptionsSymbol } from "../constants.js"

export default {
    name: "DomRenderer",
    props: {
        tag: String,
        attrs: Object,
        children: {
            default: []
        },
        [editorModeSymbol]: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedAttrs() {
            const editorMode = this[editorModeSymbol]
            return editorMode
                ? { ...this.attrs, contenteditable: true }
                : this.attrs
        }
    },
    methods: {
        isText(node) {
            return typeof node === "string"
        }
    }
}
</script>
