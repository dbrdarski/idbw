<template>
  <q-dialog
    :model-value="active"
    @update:model-value="setDialogState"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ action }} {{ type }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-none">
        <q-input
          v-model="title"
          type="text"
          label="Name"
          autofocus
          filled
          dense
          style="min-width: 250px"
          :width="300"
          class="q-my-md"
        />
        <q-input
          v-model="slug"
          type="text"
          label="Slug"
          autofocus
          filled
          dense
          style="min-width: 280px"
          :width="300"
        />
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
const initState = () => ({
  title: "",
  slug: ""
})

export default {
  name: "CreateTaxonomy",
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
    },
    type: {
      default: "tag"
    }
  },
  data () {
    return initState()
  },
  computed: {
    action () {
      return this.item ? "Update" : "Create"
    }
  },
  methods: {
    create () {
      this.$emit("ok", {
        title: this.title,
        slug: this.slug
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
        this.title = this.item.record.title
        this.slug = this.item.record.slug
      }
    }
  }
}
</script>
