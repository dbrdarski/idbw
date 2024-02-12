import { auth } from "src/stores/atoms/auth"
import { PERMISSIONS } from "/../common/auth/permissions.mjs"
const routes = [
  {
    name: "login",
    path: "/login",
    beforeEnter(to, from, next) {
      auth.isAuthenticated ? next(from) : next()
    },
    component: () => import("pages/Login.vue"),
  },
  {
    path: "/",
    beforeEnter (to, from, next) {
      auth.resumeSession(next)
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "posts",
        path: "posts",
        component: () => import("/src/modules/content/views/Posts.vue")
      },
      {
        name: "new-post",
        path: "posts/new",
        props: { key: "new" },
        component: () => import("/src/modules/content/views/Post.vue")
      },
      {
        name: "edit-post",
        path: "posts/:id",
        props: route => ({ id: route.params.id, key: "edit" }),
        component: () => import("/src/modules/content/views/Post.vue")
      },
      {
        name: "edit-post-revision",
        path: "posts/:id/edit/:revisionId",
        props: route => ({ id: route.params.id, key: "revision", revisionId: route.params.revisionId }),
        component: () => import("/src/modules/content/views/Post.vue")
      },
      {
        name: "tags",
        path: "tags",
        props: { type: "tag", key: "tag", title: "Tags" },
        component: () => import("/src/modules/taxonomy/views/Taxonomies.vue")
      },
      {
        name: "categories",
        path: "categories",
        props: { type: "category", key: "category", title: "Categories" },
        component: () => import("/src/modules/taxonomy/views/Taxonomies.vue")
      },
      {
        name: "users",
        path: "users",
        beforeEnter (to, from, next) {
          auth.isAdmin() ? next() : next(from ?? { name: "dashboard" })
          // return auth.requirePermissions(
          //   next,
          //   PERMISSIONS.MANAGE_USERS
          // ) || next(from ?? { name: "dashboard" })
        },
        component: () => import("/src/modules/users/views/Users.vue")
      },
      {
        name: "dashboard",
        path: "/",
        component: () => import("/src/pages/Dashboard.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
]

export default routes
