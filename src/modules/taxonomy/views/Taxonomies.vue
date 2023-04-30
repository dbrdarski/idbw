<template>
  <PageLayout>
    <div class="q-pa-lg" style="max-width: 1200px; margin: auto">
      <div class="page-title">{{ title }}</div>
      <TaxonomyDialog
        :item="editedItem"
        :type="type"
        :active="showDialog"
        @setModal="setDialogVisibility"
        @ok="saveTaxonomy"
      />
      <div class="row q-py-md">
        <q-btn-group outline>
          <q-btn label="All" outline color="blue-7" />
          <q-separator />
          <q-btn label="Active" outline color="blue-7" />
          <q-separator />
          <q-btn label="Archived" outline color="blue-7" />
        </q-btn-group>
        <q-space />
        <q-btn
          label="Create new"
          noshadow
          color="primary"
          unelevated
          size="md"
          @click="openEditDialog()"
        />
      </div>
      <q-table
        :columns="columns"
        :rows="taxonomies"
        v-model:pagination="pagination"
        no-shadow
        align="left"
        @request="onReq"
      >
      <template v-slot:body-cell-actions="props">
        <q-td align="right">
          <q-btn flat icon="inventory" round size="sm" color="grey-8" />
          <q-btn
            icon="edit"
            color="grey-8"
            size="sm"
            round
            flat
            @click="openEditDialog(props.row)"
          />
        </q-td>
      </template>
      </q-table>
    </div>
  </PageLayout>
</template>

<script>
import { format } from "quasar"
import { getOffsetAndLimit } from "/src/common/mixins/pagination.js"
import TaxonomyDialog from "../dialogs/TaxonomyDialog.vue"

import api from "/src/api/client.js"
console.log(api)
const { capitalize } = format
const { taxonomy: taxonomyApi, entity: contentApi } = api

const columns = [
  { name: "title", label: "Title", field: row => row.record.title, width: "40%", align: "left"  },
  // { name: "status", label: "Status", field: "title" },
  { name: "slug", label: "Slug",  field: row => row.record.slug, align: "left"  },
  { name: "actions", label: "Actions",  field: "actions", align: "right" },
]

export default {
  name: "TaxonomiesIndex",
  components: {
    TaxonomyDialog
  },
  props: {
    title: {
      type: String
    },
    type: {
      default: "tag"
    }
  },
  setup () {
    return {
      columns
    }
  },
  data () {
    return {
      taxonomies: [],
      showDialog: false,
      editedItem: null,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      }
    }
  },
  methods: {
    openEditDialog (item = null) {
      this.editedItem = item
      this.setDialogVisibility(true)
    },
    setDialogVisibility (value) {
      this.showDialog = value
    },
    async onReq ({ pagination }) {
      Object.assign(this.pagination, pagination)
      await this.fetchTaxonomies({ pagination })
    },
    async fetchTaxonomies ({ pagination = this.pagination } = {}) {
      const { data: taxonomies, meta: { total } } = await taxonomyApi.fetchTaxonomies(this.type, getOffsetAndLimit(pagination))
      this.pagination.rowsNumber = total
      this.taxonomies = taxonomies
    },
    async saveTaxonomy (data) {
      await (
        this.editedItem
          ? taxonomyApi.updateTaxonomy(
            this.type,
            { ...this.editedItem, data }
          )
          : taxonomyApi.createTaxonomy(
            this.type, data
          )
      )
      this.$q.notify({
        type: "positive",
        message: `${capitalize(this.type)} was successfully ${
          this.editedItem
            ? "updated"
            : "created"
        }.`
      })
      await this.fetchTaxonomies()
    }
  },
  mounted () {
    this.fetchTaxonomies()
  }
}
</script>
