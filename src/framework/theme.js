import Renderer from "/src/common/components/Renderer.vue"

// export const renderTemplate = template => template(x => x)(Renderer)
console.log(Renderer)
const createTemplateType = renderer => def => {
  const handler = option => component => {
    def.options[option.name] = option
    def.components[option.name] = component
  }
  return componentFactory => {
    return componentFactory(handler)(renderer)
  }
}

export const registerTemplates = (...templates) => {
  const editor = {
    options: {},
    components: {}
  }
  const createEditorTemplate = createTemplateType(Renderer)(editor)
  templates.forEach(createEditorTemplate)
  return {
    editor
  }
}
// export const createPreviewTemplate = def => option => component => {
//   def.options.push(option)
//   def.components[option.name] = component(Renderer)
// }

export const themes = {}
export const createTheme = theme => {
  themes[theme.name] = theme
}
