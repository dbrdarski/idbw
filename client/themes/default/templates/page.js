import { h } from 'vue'

let count = 0

export default template => Renderer =>
  template({
    name: 'page' + (++count),
    label: 'Default page' + count
  })({
    components: {
      Renderer
    },
    props: ['data'],
    render () {
      return h('div', {}, [
          h(Renderer, { tag: "h3", children: [ "Insert title" ] }),
          h(Renderer, { tag: "div", children: this.data?.body }),
        ]
      )
    }
  })
