<template>
  <PageLayout>
    <div class="q-pa-lg" style="max-width: 1200px; margin: auto">
      <div class="page-title">{{ title }}</div>
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
          @click="openPost()"
        />
      </div>
      <q-table
        :columns="columns"
        :rows="entries"
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
            @click="archivePost(props.row)"
          />
          <q-btn
            icon="edit"
            color="grey-8"
            size="sm"
            round
            flat
            @click="openPost(props.row)"
          />
        </q-td>
      </template>
      </q-table>
    </div>
  </PageLayout>
</template>

<script>
import { getOffsetAndLimit } from "/src/common/mixins/pagination.js"
import api from "/src/api/client.js"
const { entity: contentApi } = api

const columns = [
  { name: "title", label: "Title", field: row => row.record.header.title, width: "40%", align: "left" },
  // { name: "status", label: "Status", field: "title" },
  { name: "slug", label: "Slug",  field: row => row.record.header.slug, align: "left"  },
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
  name: "PostsIndex",
  setup () {
    return {
      type: "post",
      title: "Posts",
      columns
    }
  },
  data () {
    return {
      filters,
      filter: Object.keys(filters)[0],
      entries: [],
      showDialog: false,
      editedItem: null,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: Infinity
      }
    }
  },
  methods: {
    openPost (item = null) {
      this.$router.push(
        item
          ? {
            name: "edit-post",
            params: { id: item.document.id }
          } : {
            name: "new-post"
          }
        )
    },
    async archivePost (item) {
      await contentApi.archiveEntry(this.type, item.document.id, this.filter !== 'archived')
      await this.fetchEntries()
    },
    async onReq ({ pagination }) {
      Object.assign(this.pagination, pagination)
      await this.fetchEntries({ pagination })
    },
    async fetchEntries ({ pagination = this.pagination } = {}) {
      const filter = filters[this.filter].filter
      const {
        meta: { total },
        data: entries,
        ...rest
      } = await contentApi.fetchEntries(this.type, {
        ...getOffsetAndLimit(pagination),
        filter
      })
      console.log({ rest })
      this.pagination.rowsNumber = total
      this.entries = entries
    },
    async saveEntry (data) {
      await this.editedItem ?
        contentApi.updateEntry(this.type, {
          ...this.editedItem,
          data
        }) :
        contentApi.createEntry(this.type, data)
      await this.fetchEntries()
    }
  },
  watch: {
    filter () {
      this.fetchEntries()
    }
  },
  mounted () {
    this.fetchEntries()
  }
}
</script>
