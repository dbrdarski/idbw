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
          <template
            v-for="(filterItem, filterKey) in filters"
            :key="filterKey"
          >
            <q-separator v-if="filterKey !== Object.keys(filters)[0]" />
            <q-btn
              :label="filterItem.label"
              :outline="filterKey !== filter"
              color="blue-7"
              @click="filter = filterKey"
            />
          </template>
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
          <q-btn
            icon="inventory"
            color="grey-8"
            size="sm"
            round
            flat
            @click="archiveTaxonomy(props.row)"
          />
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
const { taxonomy: taxonomyApi } = api

const columns = [
  { name: "title", label: "Title", field: row => row.record.title, width: "40%", align: "left"  },
  // { name: "status", label: "Status", field: "title" },
  { name: "slug", label: "Slug",  field: row => row.record.slug, align: "left"  },
  { name: "actions", label: "Actions",  field: "actions", align: "right" },
]

const filters = {
  all: {
    label: "All",
    filter: { archived: null }
  },
  active: {
    label: "Active",
    filter: { archived: false }
  },
  archived: {
    label: "Archived",
    filter: { archived: true }
  }
}

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
      filters,
      filter: Object.keys(filters)[0],
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
      const filter = filters[this.filter].filter
      const {
        data: taxonomies,
        meta: { total }
      } = await taxonomyApi.fetchTaxonomies(this.type, {
        ...getOffsetAndLimit(pagination),
        filter
      })
      this.pagination.rowsNumber = total
      this.taxonomies = taxonomies
    },
    async archiveTaxonomy (item) {
      console.log({ item })
      await taxonomyApi.archiveTaxonomy(this.type, item.document.id, this.filter !== 'archived')
      await this.fetchTaxonomies()
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
  watch: {
    filter () {
      this.fetchTaxonomies()
    }
  },
  mounted () {
    this.fetchTaxonomies()
  }
}
</script>
