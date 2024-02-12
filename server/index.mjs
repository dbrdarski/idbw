// import apiServer from "../common/api/server.mjs"

import * as ws from "ws"
import WebSocketWrapper from "ws-wrapper"
import path from "path"
import { repository, connect } from "idbx"
import ascii from "idbx/src/adapters/ascii.js"
import schema from "../common/schema.mjs"
import { requirePermissions, PERMISSIONS } from "../common/auth/permissions.mjs"
import { provide, init as initCapsule } from "../common/capsule.mjs"
import * as api from "../common/api.mjs"
import crypto from "crypto"
import auth from "./auth.mjs"

import http from "http"

globalThis.crypto = crypto

const secret = "my_ballz"

const { auth: authActions, users, ...userActions } = api

function parseCookies(rc) {
  const list = {}

  rc && rc.split(';').forEach(cookie => {
    const parts = cookie.split('=')
    list[parts.shift().trim()] = decodeURI(parts.join('='))
  })

  return list
}

async function init() {
  const repo = repository(ascii)(schema)

  console.log(
    path.resolve(process.cwd(), "../../db/test.dbx")
  )

  const db = await repo.open("../db/test.dbx")
  // console.log(connection)
  globalThis.$ = db
  // setAppInstance({ initialized: true })

  provide({
    auth,
    db,
    crypto,
    secret,
  })
  initCapsule()
}

init()

// const wss = new ws.WebSocketServer({ port: 4000 })

const server = http.createServer((req, res) => {
  const cookies = parseCookies(req.headers.cookie)
  if (!cookies.token) {
    res.setHeader('Set-Cookie', `token=${crypto.randomUUID()}; HttpOnly`)
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('')
})

const wss = new ws.WebSocketServer({ noServer: true })

let index = 0

const createContext = (session, rest) => ({
  ...rest,
  get session () {
    return session
  },
  set session (value) {
    session = value
  }
})

wss.on("connection", (ws, { headers }) => {
  const id = index++
  const { token } = parseCookies(headers.cookie)
  const context = createContext(null, {
    auth
  })
  console.log(`Established: ${id}`, token)
  ws = new WebSocketWrapper(ws)
  ws.on("error", console.error)

  ws.on("msg", data => {
    const [a, b, c] = data
    console.log(id, { a, b, c })
    return data
  })

  const requireAuth = (context, next) => {
    console.log("AUTH?", context.session)
    return context.session && next()
  }

  const injectToken = ({ params: [payload] }, next) => {
    payload.cookie = token
    return next()
  }

  const setUserContext = (context, next) => {
    context.session = next()
    return context.session
  }

  const login = connect(
    authActions.login
  )(
    injectToken,
    setUserContext
  )

  const resume = connect(
    authActions.resume
  )(
    injectToken,
    setUserContext
  )

  const logout = connect(
    authActions.logout
  )((context) => {
    const { session } = context
    session && auth.endSession(session.user)
    context.session = null
  })

  const actions = {
    ...connect({
      ...userActions,
      ...connect({
        users
      })(requirePermissions(PERMISSIONS.MANAGE_USERS)),
    })(requireAuth),
    auth: {
      login,
      logout,
      resume
    }
  }

  ws.on("api", data => {
    const [module, method, params] = data
    console.log({ module, method, params })
    let result
    try {
      result = actions[module][method].call(
        Object.create(context, { params: { value: params, enumerable: true } }),
        ...params
      )
    } catch (e) {
      console.error(e)
    }
    console.log(`RESULT: (${id})`, result)
    return result
  })
})

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})

server.listen(4000)
