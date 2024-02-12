import WebSocketWrapper from "ws-wrapper"
import * as api from "/../common/api.mjs"
const ws = new WebSocketWrapper(
  new WebSocket("ws://localhost:4000")
)

const createAuth = () => {
  const i = document.createElement("img")
  i.src = "http:\\localhost:4000"
  document.body.append(i)
}

createAuth()

// window.ws = ws

const apiHandler = (module, method) => (...args) => ws.request("api", [ module, method, args ]).then(log("SOCKET RETURN: "))

const log = prefix => x => (
  console.log(prefix, x),
  x
)

const createHandlers = (api, handler) => Object.fromEntries(
  Object.entries(api).map(([ key, value ]) => [ key, handler(key, value) ])
)

export default createHandlers(
  api,
  (module, y) => createHandlers(y, (method, y) => apiHandler(module, method))
)
