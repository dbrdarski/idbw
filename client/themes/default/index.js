import { createTheme, registerTemplates } from "/src/framework/theme.js"
import Page from "./templates/page.js"

export default createTheme({
  name: "default",
  label: "Default theme",
  templates: registerTemplates(Page, Page, Page)
})
