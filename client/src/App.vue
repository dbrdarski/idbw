<template>
  <router-view v-if="initialized" />
</template>

<script>
import * as socketClient from "/src/api/client.js"
import { defineComponent } from "vue"
import { repository } from "idbx"
import browser from "idbx/src/adapters/browser"
import schema from "/../common/schema.mjs"
import theme from "/themes/default"

async function init () {
  const db = repository(browser)
  const repo = db(schema)

  const connection = await repo[localStorage.hasOwnProperty("Mile") ? "open" : "create"]("Mile")
  // console.log(connection)
  globalThis.$ = connection
  // setAppInstance({ initialized: true })
}

export default defineComponent({
  name: "App",
  data () {
    return {
      initialized: false
    }
  },
  async mounted () {
    await init()
    this.initialized = true
  }
})
</script>
