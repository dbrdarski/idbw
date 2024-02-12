<template>
  <q-dialog :model-value="active" @update:model-value="setDialogState">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ action }} user</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-none">
        <q-input
          v-model="password"
          type="password"
          label="New password"
          :width="300"
          class="q-my-md"
          style="min-width: 250px"
          autofocus
          filled
          required
          dense
        />
        <q-input
          v-model="confirm"
          type="password"
          label="Confirm password"
          :width="300"
          class="q-my-md"
          style="min-width: 250px" filled dense required
          :rules="[_ => (confirm != null && confirm === password) || 'Passwords must match.']"
          lazy-rules
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn label="Close" color="primary" outline @click="setDialogState(false)" />
        <q-btn :label="action" color="primary" unelevated @click="create" />
      </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script>
import { roles } from "/../common/auth/permissions.mjs"

const initState = () => ({
  password: "",
  confirm: ""
})

export default {
  name: "PasswordDialog",
  model: {
    prop: "active",
    event: "setModal"
  },
  emits: ["ok", "setModal"],
  props: {
    item: {
      type: Object,
      default: null
    },
    active: {
      type: Boolean
    }
  },
  data() {
    return {
      ...initState(),
      roles
    }
  },
  computed: {
    action() {
      return this.item ? "Update" : "Create"
    }
  },
  methods: {
    create() {
      this.$emit("ok", {
        password: this.password
      })
        this.$emit("setModal", false)
      },
      setDialogState(e) {
        this.$emit("setModal", e)
      }
  },
  watch: {
    active() {
      Object.assign(this, initState())
    }
  }
}
</script>
