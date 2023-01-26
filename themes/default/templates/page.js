export default template => render =>
  template({
    name: 'page',
    label: 'Default page'
  })({
    components: {
      render
    },
    props: ['data'],
    render () {
      return (
        <div>
          <h4>
            <render :data="data.header.title" />
          </h4>
          <div>
            <render :data="data.body" />
          </div>
        </div>
      )
    }
  })
