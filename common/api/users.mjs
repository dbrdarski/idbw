import { capsule } from "../capsule.mjs";

const userData = ({
  password,
  ...user
}) => user

export function fetchUsers({ offset, limit, where, filter } = {}) {
  return globalThis.$.query($ => {
    return $.user
      .latest(filter)
      .find(where)
      .skip(offset)
      .limit(limit)
      .meta({
        total: $.user
          .latest(filter)
          .find(where)
          .count()
      })
      .data(userData)
  })
}

export function createUser(payload) {
  return globalThis.$.query($ =>
    $.user.createDocument({
      ...payload,
      password: capsule.auth.generatePasswordHash('')
    })
  )
}

export function updateUser({
  document: { id },
  data: { password, ...record },
  revision: { id: from }
}) {
  return globalThis.$.query($ =>
    $.user.createRevision(
      id,
     {
        ...$.user.latest({ id }).data().record,
        ...record,
        ...password && { password: capsule.auth.generatePasswordHash(password) }
      },
      { from }
    )
  )
}

export function fetchUser(id) {
  return globalThis.$.query($ =>
    $.user
      .latest({ id })
      .data(userData)
  )
}

export function archiveUser(id, archived) {
  return globalThis.$.query($ =>
    $.user
      .archive(id, archived)
  )
}
