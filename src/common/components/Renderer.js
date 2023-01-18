import { h } from 'vue'

const renderNode = node =>
  typeof node === "string"
    ? node
    : h(Renderer, node)

const Renderer = node => {
  return h(
    node.tag,
    node.attrs,
    ...node.children.map(renderNode)
  )
}

Renderer.props = ['tag', 'attrs', 'children']
export const NodeList = ({ items }) => items.map(renderNode)
NodeList.props = ['items']

export default Renderer
