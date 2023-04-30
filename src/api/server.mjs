import * as ws from "ws"
import WebSocketWrapper from "ws-wrapper"
import path from "path"
import { repository } from "idbx"
import ascii from "idbx/src/adapters/ascii.js"
import schema from "../schema.mjs"
import * as api from "../api.mjs"
import crypto from "crypto"

globalThis.crypto = crypto

async function init () {
  const db = repository(ascii)
  const repo = db(schema)

  console.log(
    path.resolve(process.cwd(), "../../db/test.dbx")
  )

  const connection = await repo.open("./db/test.dbx")
  // console.log(connection)
  globalThis.$ = connection
  // setAppInstance({ initialized: true })
}

init()

const wss = new ws.WebSocketServer({ port: 4000 })

wss.on('connection', ws => {
  ws = new WebSocketWrapper(ws);
  ws.on('error', console.error);

  ws.on('msg', data => {
    const [ a,b,c ] = data
    console.log({ a, b, c })
    return data
  });

  ws.on('api', data => {
    const [ module, method, params ] = data
    console.log({ module, method, params })
    let result;
    try {
      result = api[module][method](...params)
    } catch (e) {
      console.error(e)
    }
    return result
  });

  ws.send('something');
});

export default {}
