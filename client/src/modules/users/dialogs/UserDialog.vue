<template>
  <q-dialog
    :model-value="active"
    @update:model-value="setDialogState"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ action }} user</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-none">
        <q-input
          v-model="name"
          type="text"
          label="Name"
          :width="300"
          class="q-my-md"
          style="min-width: 250px"
          autofocus
          filled
          dense
        />
        <q-input
          v-model="email"
          type="text"
          label="Email"
          :width="300"
          class="q-my-md"
          style="min-width: 250px"
          filled
          dense
        />
        <q-select
          v-model="role"
          :options="roles"
          label="Role"
          :width="300"
          class="q-my-md"
          style="min-width: 250px"
          filled
          dense
          emit-value
        >
        <template v-slot:selected-item>
          {{ roles[role]?.label }}
        </template>
        </q-select>

      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          label="Close"
          color="primary"
          outline
          @click="setDialogState(false)"
        />
        <q-btn
          :label="action"
          color="primary"
          unelevated
          @click="create"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { roles } from "/../common/auth/permissions.mjs"

const initState = () => ({
  name: "",
  email: "",
  role: null
})

export default {
  name: "CreateUser",
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
  data () {
    return {
      ...initState(),
      roles
    }
  },
  computed: {
    action () {
      return this.item ? "Update" : "Create"
    }
  },
  methods: {
    create () {
      this.$emit("ok", {
        name: this.name,
        email: this.email,
        role: this.role,
      })
      this.$emit("setModal", false)
    },
    setDialogState (e) {
      this.$emit("setModal", e)
    }
  },
  watch: {
    active (value) {
      if (!value) {
        Object.assign(this, initState())
      } else if (this.item) {
        this.name = this.item.record.name
        this.email = this.item.record.email
        this.role = this.item.record.role
      }
    }
  }
}
</script>
