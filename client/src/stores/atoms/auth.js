import api from "src/api/client"
import { requirePermissions, requirePermission } from "/../common/auth/permissions.mjs";
import { PERMISSIONS } from "../../../../common/auth/permissions.mjs";

export const auth = (
  auth => ({
    get isAuthenticated () {
      return auth.user != null
    },
    get user () {
      return auth.user
    },
    async logout() {
      await api.auth.logout()
      auth.user = null
    },
    async resumeSession (next) {
      if (!auth.user) {
        const { user } = await api.auth.resume({ token: auth.token })
        this.setUser(user)
      }
      auth.user ? next() : next({ name: "login" })
    },
    setUser(user) {
      auth.user = user
    },
    setToken(value) {
      auth.token = localStorage.token = value
    },
    isAdmin () {
      return requirePermission(PERMISSIONS.MANAGE_USERS)(auth?.user?.role)
    },
    requirePermission (permission) {
      return requirePermission(permission)(auth?.user?.role)
    },
    requirePermissions (next, ...permissions) {
      return requirePermissions({ session: auth }, next)(permissions)
    }
  })
)({
  user: null,
  token: localStorage.token
})
