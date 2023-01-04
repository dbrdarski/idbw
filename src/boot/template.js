import { boot } from 'quasar/wrappers'
import Page from "/src/layouts/Page.vue"
export default boot(({ app }) => {
  app.component("PageLayout", Page)
})
