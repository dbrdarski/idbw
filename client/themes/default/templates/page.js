import { h } from 'vue'

let counter = 0

export default template => Renderer => {
  const count = ++counter
  return template({
    name: 'page' + (count),
    label: 'Default page' + count
  })({
    components: {
      Renderer
    },
    props: ['data'],
    render () {
      return h('div', {}, [
          h(Renderer, { tag: "h3", children: [ "Insert title" ] }),
          `This is template ${count} of ${counter}!`,
          h(Renderer, { tag: "div", children: this.data?.body }),
        ]
      )
    }
  })
}
