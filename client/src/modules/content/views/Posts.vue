<template>
  <PageLayout>
    <div class="q-pa-lg" style="max-width: 1200px; margin: auto">
      <div class="page-title">{{ title }}</div>
      <div class="row q-py-md">
        <q-btn-group outline>
          <q-btn label="All" outline color="blue-7" />
          <q-separator />
          <q-btn label="Active" outline color="blue-7" />
          <q-separator />
          <!-- <q-btn label="Drafts" outline color="blue-7" /> -->
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
          @click="openPost()"
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
      taxonomies: [],
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
    async onReq ({ pagination }) {
      Object.assign(this.pagination, pagination)
      await this.fetchEntries({ pagination })
    },
    async fetchEntries ({ pagination = this.pagination } = {}) {
      // const [ total, taxonomies ] = await contentApi.fetchEntries(this.type, getOffsetAndLimit(pagination))
      const { meta: { total }, data: taxonomies, ...rest } = await contentApi.fetchEntries(this.type, getOffsetAndLimit(pagination))
      console.log({ rest })
      this.pagination.rowsNumber = total
      this.taxonomies = taxonomies
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
  mounted () {
    this.fetchEntries()
  }
}
</script>
