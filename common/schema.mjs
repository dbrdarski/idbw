export default function schema({ $or }) {
  console.log("SCHEMA INIT!!!!!!!!!!!!!")
  class EntityHeader {
    title = String
    slug = String
  }
  class Vdom {
    tag = String
    attrs = Object
    children = Array($or(Vdom, String))
  }
  return {
    post({ tag, category }) {
      const Tag = this.belongsToMany({ tag })
      const Category = this.belongsToMany({ category })

      class Taxonomies {
        tags = Array(Tag)
        categories = Array(Category)
      }

      return class Post {
        header = EntityHeader
        body = Array($or(Vdom, String)) // Array(Vdom | String)
        taxonomies = Taxonomies
        options = Object
      }
    },
    category({ post }) {
      this.publish = true // TODO: this needs to be implemented
      this.hasMany({
        post
      }, "category")
      return EntityHeader
    },
    tag({ post }) {
      this.publish = true
      this.hasMany({
        post
      }, "tag")
      return EntityHeader
    },
    // page() {
    //   return class Page {
    //     header = EntityHeader
    //     body = Array(Vdom)
    //   }
    // },
    // pageTree({ page }) {
    //   const Page = this.belongsToMany({ page })
    //   return class Route {
    //     page_id = Page
    //     path = String
    //     children = Array(Route)
    //   }
    // }
    user() {
      return class User {
        name = String
        email = String
        password = String
        role = Number
      }
    },
  }
}
