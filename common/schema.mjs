export default function schema () {
  console.log("SCHEMA INIT!!!!!!!!!!!!!")
  class EntityHeader {
    title = String
    slug = String
  }
  class Vdom {
    tag = String
    attrs = Object
    children = Array(globalThis.$or(Vdom, String))
  }
  return {
    // user () {
    //   return class User {
    //     name = String
    //     email = String
    //   }
    // },
    // author ({ post }) {
    //   const Post = this.belongsToMany({ post })
    //   return class Author {
    //     name = String
    //     address = String
    //     posts = Array(Post)
    //   }
    // },
    num () {
      return class Num {
        x = Number
        y = Number
        z = Number
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
        header = EntityHeader
        body = Array(globalThis.$or(Vdom, String)) // Array(Vdom | String)
        taxonomies = Taxonomies
        options = Object
      }
    },
    page () {
      return class Page {
        header = EntityHeader
        body = Array(Vdom)
      }
    },
    category ({ post }) {
      this.publish = true // TODO: this needs to be implemented
      this.hasMany({
        post
      }, "category")
      return EntityHeader
    },
    tag ({ post }) {
      this.publish = true
      this.hasMany({
        post
      }, "tag")
      return EntityHeader
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
