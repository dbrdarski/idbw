const ADMIN = "ADMIN"
const USER = "USER"
const ROLES = [ADMIN, USER]

const MANAGE_USERS = "MANAGE_USERS"
const MANAGE_CONTENT = "MANAGE_CONTENT"

export const PERMISSIONS = { MANAGE_USERS, MANAGE_CONTENT }

const ADMIN_PERMISSIONS = [MANAGE_USERS, MANAGE_CONTENT]
const USER_PERMISSIONS = [MANAGE_CONTENT]

export const ROLE_PERMISSIONS = {
  [ADMIN]: ADMIN_PERMISSIONS,
  [USER]: USER_PERMISSIONS,
}

const getRolePermissions = role => ROLE_PERMISSIONS[ROLES[role]]

export const requirePermission = permission => role =>
  getRolePermissions(role)?.includes(permission)

export const requireRolePermission = role => {
  const permissions = getRolePermissions(role)
  return permission => permissions?.includes(permission)
}

export const requirePermissions = (...permissions) => (ctx, next) => {
  const getPermission = requireRolePermission(ctx.session?.user?.role)
  console.log("SESH", ctx.session, permissions)
  for (const permission of permissions) {
    if (!getPermission(permission)) {
      return false
    }
  }
  return next()
}

const labels = {
  roles: {
    [ADMIN]: "Admin",
    [USER]: "User"
  },
  permissions: {
    [MANAGE_USERS]: "Manage users",
    [MANAGE_CONTENT]: "Manage content"
  }
}

export const roles = ROLES.map((role, value) => ({
  label: labels.roles[role],
  value
}))

export const permissions = Object.keys(PERMISSIONS).map((permission, value) => ({
  label: labels.permissions[permission],
  value
}))
