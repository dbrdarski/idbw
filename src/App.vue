<template>
  <router-view v-if="initialized" />
</template>

<script>
import { defineComponent } from "vue"
import { repository } from "idbx"
import browser from "idbx/src/adapters/browser"
import theme from "/themes/default"

async function init() {
  const schema = () => {
    class TaxonomyHead {
      title = String
      slug = String
    }

    class Vdom {
      tag = String
      attrs = Object
      children = Array(window.$or(Vdom, String))
    }

    return {
      user () {
        return class User {
          name = String
          email = String
        }
      },
      post ({ tag, category }) {
        const Tag = this.belongsToMany({ tag })
        const Category = this.belongsToMany({ category })
        class Taxonomies {
          tags = Array(Tag)
          categories = Array(Category)
        }
        return class Post {
          header = TaxonomyHead
          body = Array(window.$or(Vdom, String)) // Array(Vdom | String)
          taxonomies = Taxonomies
          options = Object
        }
      },
      page () {
        return class Page {
          header = TaxonomyHead
          body = Array(Vdom)
        }
      },
      category ({ post }) {
        this.publish = true
        this.hasMany({
          post
        }, "category")
        return TaxonomyHead
      },
      tag ({ post }) {
        this.publish = true
        this.hasMany({
          post
        }, "tag")
        return TaxonomyHead
      },
      pageTree ({ page }) {
        const Page = this.belongsToMany({ page })
        return class Route {
          page_id = Page
          path = String
          children = Array(Route)
        }
      }
    }
  }

  const db = repository(browser)
  const repo = db(schema)

  const connection = await repo[localStorage.hasOwnProperty("Blazo") ? "open" : "create"]("Blazo")
  // console.log(connection)
  window.$ = connection
  // setAppInstance({ initialized: true })
}

export default defineComponent({
  name: "App",
  data () {
    return {
      initialized: false
    }
  },
  async mounted () {
    await init()
    this.initialized = true
  }
})
</script>
