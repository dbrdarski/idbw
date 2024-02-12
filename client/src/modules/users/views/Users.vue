<template>
  <PageLayout>
    <div class="q-pa-lg" style="max-width: 1200px; margin: auto">
      <UserDialog
        :item="editedItem"
        :active="showDialog"
        @setModal="setDialogVisibility"
        @ok="saveUser"
      />
      <PasswordDialog
        :item="editedItem"
        :active="showPasswordDialog"
        @setModal="setPasswordDialogVisibility"
        @ok="saveUser"
      />
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
          @click="openEditDialog()"
        />
      </div>
      <q-table
        :columns="columns"
        :rows="users"
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
              icon="lock"
              color="grey-8"
              size="sm"
              round
              flat
              @click="openPasswordDialog(props.row)"
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
import UserDialog from "../dialogs/UserDialog.vue"
import PasswordDialog from "../dialogs/PasswordDialog.vue"
import { getOffsetAndLimit } from "/src/common/mixins/pagination.js"
import api from "/src/api/client.js"
import { roles } from "/../common/auth/permissions.mjs"
const { users: userApi } = api

const columns = [
  { name: "name", label: "Name", field: row => row.record.name, width: "40%", align: "left" },
  // { name: "status", label: "Status", field: "title" },
  { name: "email", label: "Email", field: row => row.record.email, width: "40%", align: "left" },
  { name: "role", label: "Role",  field: row => roles[row.record.role]?.label, align: "left"  },
  { name: "actions", label: "Actions",  field: "actions", align: "right" },
]

const filters = {
  active: {
    label: "Active",
    filter: { archived: false }
  },
  archived: {
    label: "Archived",
    filter: { archived: true }
  },
  all: {
    label: "All",
    filter: { archived: null }
  },
}

export default {
  name: "UsersIndex",
  components: {
    UserDialog,
    PasswordDialog
  },
  setup () {
    return {
      title: "Users",
      columns
    }
  },
  data () {
    return {
      users: [],
      filters,
      filter: Object.keys(filters)[0],
      showDialog: false,
      editedItem: null,
      showPasswordDialog: false,
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
    openEditDialog (item = null) {
      this.editedItem = item
      this.setDialogVisibility(true)
    },
    setDialogVisibility (value) {
      this.showDialog = value
    },
    openPasswordDialog (item = null) {
      this.editedItem = item
      this.setPasswordDialogVisibility(true)
    },
    setPasswordDialogVisibility (value) {
      this.showPasswordDialog = value
    },
    async archivePost (item) {
      await userApi.archiveUser(item.document.id, this.filter !== 'archived')
      await this.fetchUsers()
    },
    async onReq ({ pagination }) {
      Object.assign(this.pagination, pagination)
      await this.fetchUsers({ pagination })
    },
    async fetchUsers ({ pagination = this.pagination } = {}) {
      const filter = filters[this.filter].filter
      const {
        meta: { total },
        data: users,
      } = await userApi.fetchUsers({
        ...getOffsetAndLimit(pagination),
        filter
      })
      console.log({ users, total })
      this.pagination.rowsNumber = total
      this.users = users
    },
    async saveUser (data) {
      console.log({ data })
      await this.editedItem
        ? userApi.updateUser({
          ...this.editedItem,
          data
        })
        : userApi.createUser(data)

      this.$q.notify({
        type: "positive",
        message: `User was successfully ${
          this.editedItem
            ? "updated"
            : "created"
        }.`
      })
      await this.fetchUsers()
    }
  },
  watch: {
    filter () {
      this.fetchUsers()
    }
  },
  mounted () {
    this.fetchUsers()
  }
}
</script>
