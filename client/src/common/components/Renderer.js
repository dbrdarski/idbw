import { h } from 'vue'

// const renderNode = node => {
//   console.log({ node }, typeof node !== "string" && Array.isArray(node))
//   return Array.isArray(node)
//     ? node.map(renderNode)
//     : h(Renderer, node)
//   }
const Renderer = {
  name: "Renderer2",
  props: ["tag", "attrs", "children"],
  render () {
    const { tag, attrs = {}, children = [], [editorModeSymbol]: editorMode, [editorOptionsSymbol]: editorOptions, ...rest } = this
    // console.log("QWERTY", { tag, attrs, children, rest }, this)
    return typeof node === "string"
    ? node
    : h(tag, editorMode ? attrs : { ...attrs, contenteditable: true }, children.map((c, i) => { console.log({ c, type: typeof c }); return typeof c === "string" ? c : h(Renderer, { ...c, key: i }) }))
  }
}
// function Renderer (node) {
//   console.log("QWERTY", node)
//   const { tag, attrs = {}, children = [] } = node
//   // console.log({node, tag, attrs, children })
//   return typeof node === "string"
//   ? node
//   : h(tag, attrs, ...children.map(c => { console.log({ c }); return h(Renderer, c) }))
// }
//
// Renderer.props = ['tag', 'attrs', 'children']
export const NodeList = ({ items }) => items.map(renderNode)
export const Editor = {
  name: "EditorRenderer",
  props: ["tag", "attrs", "children"],
  render () {
    return h(Renderer, { ...this, [editorModeSymbol]: true })
  }
}
NodeList.props = ['items']

export default Renderer
