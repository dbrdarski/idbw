import WebSocketWrapper from "ws-wrapper"
import * as api from "/../common/api.mjs"

const ws = new WebSocketWrapper(
	new WebSocket("ws://localhost:4000")
)

ws.on("msg", (from, msg) => {
	console.log(`Received message from ${from}: ${msg}`)
})

window.ws = ws

ws.on("hello", () => {
	console.log(`Hello!`)
})

ws.emit("msg", "my_name", "This is a test message")

const apiHandler = (module, method) => (...args) => ws.request("api", [ module, method, args ]).then(log("SOCKET RETURN: "))

const log = prefix => x => (
  console.log(prefix, x),
  x
)



const createHandlers = (api, handler) => Object.fromEntries(
  Object.entries(api).map(([key, value ]) => [ key, handler(key, value) ])
)

export default createHandlers(
  api,
  (module, y) => createHandlers(y, (method, y) => apiHandler(module, method))
)


// export default api
