import { createHmac } from "node:crypto"
import { provide, capsule } from "../common/capsule.mjs"

// Sessions

const byToken = {}
const byUser = {}

const generateSessionToken = (cookie) => {
  const token = crypto.randomUUID()
  return byToken.hasOwnProperty(token+cookie)
    ? generateSessionToken(cookie)
    : token
}

export default {
  endSession(user) {
    const session = byUser[user.username]
    if (session) {
      delete byToken[session.token+session.cookie]
      delete byUser[user.username]
    }
  },
  generateSession(user, duration, cookie) {
    this.endSession(user)
    const token = generateSessionToken(cookie)
    byToken[token+cookie] = byUser[user.username] = {
      cookie,
      token,
      user,
      duration
    }
    return token
  },
  resumeSession({ cookie, token }) {
    const { user } = byToken[token+cookie] ?? {}
    return {
      user,
      token,
    }
  },
  generatePasswordHash(password) {
    return createHmac('sha256', capsule.secret)
      .update(password)
      .digest('hex')
  },
  generateErrorMsg(err) {
    throw Error(err)
  },
  login({ cookie, username, password }) {
    console.log({ cookie, username, password })
    const hash = this.generatePasswordHash(password)
    return globalThis.$.query($ =>
      $.user
        .latest()
        .find(item => item.record.email === username && item.record.password === hash)
        .limit(1)
        .reduce(
          (acc, { record: { password, ...user } }) => acc ?? {
            user,
            token: this.generateSession(user, Infinity, cookie)
          }
        ) ?? this.generateErrorMsg('Invalid username or password')
    ).data
  }
}
