<template>
  <PageLayout :edit="true">
    <TaxonomyDialog
      :item="null"
      type="category"
      :active="showTaxonomyDialog"
      @setModal="value => showTaxonomyDialog = value"
      @ok="saveTaxonomy"
    />
    <template v-slot:header>
      <q-btn label="Save draft" style="margin-right: 10px;" unelevated outline color="primary" />
      <q-btn label="Publish" unelevated filled color="primary" @click="publishPost" />
    </template>
    <div class="row">
      <div
        class="content"
        ref="contentEditor"
        contenteditable
      >

        <!-- <node-list
          :items="post.data.body"
        /> -->
      </div>
      <div class="sidebar">
        <q-list>
          <q-expansion-item
            header-class="sidebar-section-title"
            label="Summary"
            default-opened
          >
            <q-card>
              <q-card-section class="q-px-none q-py-sm">
                <q-list dense class="q-pa-none">
                  <q-item class="q-pa-none">
                    <q-item-section class="q-pa-none" dense>
                      URL
                    </q-item-section>
                    <q-item-section class="q-pa-none" dense>
                      Okokokokok
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      Visibility
                    </q-item-section>
                    <q-item-section class="q-pa-none" dense>
                      Okokokokok
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            v-if="id"
            header-class="sidebar-section-title"
            label="Revisions"
            default-opened
          >
            <q-card>
              <q-card-section class="q-pa-none">
                <!-- Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti. -->
                <q-list
                  class="p-ma-none q-pa-none"
                  :padding="false"
                  style="max-height: 147px; overflow-y: auto; padding: 0 !important"
                >
                  <template
                    v-for="r in formatedRevisions"
                    :key="r.id"
                  >
                    <q-item
                      :active="r.active"
                      clickable
                      ripple
                    >
                      <q-item-section>
                        <q-item-label
                          class="text-caption"
                        >
                          {{ r.date }}
                        </q-item-label>
                        <q-item-label caption>by {{ r.user }}</q-item-label>
                      </q-item-section>
                      <q-item-section avatar style="min-width: 0; margin: 0; padding: 0">
                        <q-btn
                          unelevated
                          round
                          size="sm"
                          @click="() => {}"
                          :class="r.active ? 'text-primary' : 'text-grey-8'"
                        >
                          <q-icon
                            size="sm"
                            name="difference"
                          >
                            <q-tooltip self="bottom start" anchor="center left">
                              Compare with current
                            </q-tooltip>
                          </q-icon>
                        </q-btn>
                      </q-item-section>
                      <q-item-section avatar class="q-pa-none q-ma-none" style="min-width: 0; margin: 0; padding: 0">
                        <q-btn
                          unelevated
                          round
                          size="sm"
                          :class="r.active ? 'text-primary' : 'text-grey-8'"
                          @click="openRevision(r)"
                        >
                          <q-icon
                            size="sm"
                            name="update"
                          >
                            <q-tooltip self="bottom start" anchor="center left">
                              Load revision
                            </q-tooltip>
                          </q-icon>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
                <!-- <div class="row">
                  <q-btn
                    label="Compare revisions"
                    class="q-ma-md"
                    color="grey-8"
                    style="flex-grow: 1"
                    outline
                    dense
                  />
                </div> -->
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            header-class="sidebar-section-title"
            label="Categories"
            default-opened
          >
            <q-card>
              <q-card-section class="q-px-sm q-py-sm">
                <q-input
                  v-model="categoryFilter"
                  placeholder="Search categories"
                  filled
                  dense
                  clearable
                  class="q-pb-xs"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <!-- <q-list>
                </q-list> -->
                <div style="overflow-y: auto; max-height: 120px;" class="q-mа-xs">
                  <div v-if="!categories.length" class="row q-py-xs q-px-sm">
                    No categories are available.
                  </div>
                  <div v-else-if="!filteredCategories.length && !categoryExactMatch" class="row q-py-xs q-px-sm">
                    <div>
                      No matches for '{{ categoryFilter }}'.
                    </div>
                  </div>
                  <q-checkbox
                    v-if="categoryExactMatch"
                    v-model="post.data.taxonomies.categories"
                    :val="categoryExactMatch.document.id"
                    :label="categoryExactMatch.data.title"
                    style="width: 100%"
                    size="xs"
                  />
                  <q-checkbox
                    v-for="category in filteredCategories"
                    :key="category.document.id"
                    v-model="post.data.taxonomies.categories"
                    :val="category.document.id"
                    :label="category.data.title"
                    style="width: 100%"
                    size="xs"
                  />
                </div>
                <div class="row">
                  <q-btn
                    label="Add new category"
                    class="q-ma-sm"
                    color="grey-8"
                    style="flex-grow: 1"
                    unelevated
                    outline
                    dense
                    @click="showTaxonomyDialog = true"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            header-class="sidebar-section-title"
            label="Tags"
            default-opened
          >
          <q-card>
            <q-card-section class="q-px-sm q-py-sm">
              <q-select
                ref="tagFilter"
                class="tag-filter"
                placeholder="Add tag"
                :model-value="tagFilter"
                :options="filteredTags"
                :option-label="tagLabel"
                clearable
                use-input
                filled
                dense
                @update:model-value="updateTags"
                @input-value="value => tagFilter = value"
                @keyup.enter="createTag"
              >
                <template v-slot:append v-if="tagFilter">
                  <q-icon
                    v-if="tagExactMatchAdded"
                    name="check_circle"
                    color="secondary"
                  />
                  <q-icon
                    v-else
                    name="add_circle"
                    color="primary"
                    style="cursor: pointer"
                    @click="createTag"
                  />
                </template>
              </q-select>
              <div v-if="!tagGroups.selected.length" class="q-px-sm q-pt-sm">
                No tags selected.
              </div>
              <div class="q-pt-sm" v-else>
                <q-chip
                  v-for="tag in tagGroups.selected"
                  :key="tag.document.id"
                  :label="tag.data.title"
                  removable
                  @remove="removeTag(tag)"
                  size="md"
                  style="font-size: 12px; padding: 12px; padding-left: 9px; margin: 2px"
                />
              </div>
            </q-card-section>
          </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </PageLayout>
</template>

<script>
import * as taxonomyApi from "../../taxonomy/api.js"
import { createEntry, fetchEntry, updateEntry, fetchEntryRevisions, fetchRevision } from "/src/modules/content/api.js"
import TaxonomyDialog from "../../taxonomy/dialogs/TaxonomyDialog.vue"
// import { NodeList } from "src/common/components/Renderer.js"

import { render, getVNodeTree } from "idbx/src/utils"
import { date } from "quasar"

export default {
  name: "EditPost",
  components: {
    TaxonomyDialog,
    // NodeList
  },
  props: {
    id: {
      type: String,
      default: null
    },
    revisionId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      post: {
        data: {
          header: {
            title: "",
            slug: ""
          },
          body: [{
            tag: "h4",
            attrs: {},
            children: ["Insert post title"]
          }],
          taxonomies: {
            tags: [],
            categories: []
          }
        }
      },
      revisions: [],
      tags: [],
      categories: [],
      tagFilter: "",
      categoryFilter: "",
      showTaxonomyDialog: false
    }
  },
  computed: {
    formatedRevisions () {
      return this.revisions.map(({
        meta: { timestamp, user },
        revision: {
          id,
          published
        },
      }) => ({
        id,
        date: date.formatDate(timestamp, "DD/MM/YYYY HH:mm"),
        user,
        active: this.post.revision.id === id
      })).reverse()
    },
    tagExactMatch () {
      return this.tags
        .find(tag => tag.data.title.toLowerCase() === (this.tagFilter ?? "").toLowerCase())
    },
    tagExactMatchAdded () {
      return this.post.data.taxonomies.tags.includes(
        this.tagExactMatch?.document?.id
      )
    },
    categoryExactMatch () {
      return this.categories
        .find(category => category.data.title.toLowerCase() === (this.categoryFilter ?? "").toLowerCase())
    },
    filteredCategories () {
      const filter = (this.categoryFilter ?? "").toLowerCase()
      return filter
        ? this.categories
          .filter(({
            data: { title }
          }) => title.toLowerCase() !== filter.toLowerCase() &&
            title
              .toLowerCase()
              .includes(filter)
          )
        : this.categories
    },
    tagGroups () {
      const { tags } = this.post.data.taxonomies
      return this.tags.reduce((acc, tag) => {
        acc[tags.includes(tag.document.id) ? "selected" : "available"].push(tag)
        return acc
      }, { selected: [], available: [] })
    },
    filteredTags () {
      const filter = (this.tagFilter ?? "").toLowerCase()
      return filter
        ? this.tagGroups.available
          .filter(({
            data: { title }
          }) => title
            .toLowerCase()
            .includes(filter)
          )
        : this.tagGroups.available
    }
  },
  methods: {
    createPost () {
      const {
        header,
        body,
        taxonomies
      } = this.post.data

      return createEntry("post", {
        header,
        body,
        taxonomies
      })
    },
    updatePost () {
      return updateEntry("post", this.post)
    },
    async publishPost () {
      const { children } = getVNodeTree(this.$refs.contentEditor)

      this.post.data.body = children
      this.post.data.header.title = "Post title"
      this.post.data.header.slug = "post-slug"

      const post = await this.id ? this.updatePost() : this.createPost()
      console.log({ post })

      this.$router.replace({
        name: "edit-post-revision",
        params: {
          id: post.document.id,
          revisionId: post.revision.id
        }
      })
    },
    openRevision ({ id }) {
      this.$router.push({
        name: "edit-post-revision",
        params: {
          id: this.id,
          revisionId: id
        }
      })
    },
    tagLabel (tag) {
      return tag?.data?.title
    },
    updateTags (tag) {
      if (tag) {
        this.post.data.taxonomies.tags.push(tag.document.id)
      }
      this.$refs.tagFilter.updateInputValue("")
    },
    removeTag (tag) {
      this.post.data.taxonomies.tags = this.post.data.taxonomies.tags.filter(id => id !== tag.document.id)
    },
    fetchData () {
      this.fetchPost(this.id),
      this.fetchRevisions(this.id)
    },
    async fetchRevision (revisionId) {
      this.post = JSON.parse(
        JSON.stringify(
          await fetchRevision("post", revisionId)
        )
      )
      this.renderPost()
      this.fetchRevisions(this.id)
    },
    async fetchRevisions (id) {
      const revisions = await fetchEntryRevisions("post", id)
      this.revisions = revisions
    },
    async fetchCategories () {
      const [_, categories] = await taxonomyApi.fetchTaxonomies("category")
      this.categories = categories
    },
    async fetchTags () {
      const [_, tags] = await taxonomyApi.fetchTaxonomies("tag")
      this.tags = tags
    },
    async fetchPost (id) {
      this.post = JSON.parse(
        JSON.stringify(
          await fetchEntry("post", id)
        )
      )
      this.renderPost()
    },
    renderPost () {
      if (this.post.data.body) {
        const { contentEditor } = this.$refs
        const renderChild =  render.bind(null, contentEditor)
        contentEditor.innerHTML = ""
        this.post.data.body.forEach(renderChild)
      }
    },
    async saveTaxonomy (data) {
      await taxonomyApi.createTaxonomy("category", data)
      await this.fetchCategories()
    },
    async createTag (е) {
      const title = this.tagFilter
      if (!title || this.tagExactMatchAdded) return
      const tag = await taxonomyApi.createTaxonomy("tag", { title, slug: "xxx" })
      await this.fetchTags()
      this.updateTags(tag)
    }
  },
  watch: {
    id (id) {
      this.fetchData()
    },
    revisionId (id) {
      this.fetchRevision(id)
    }
  },
  mounted () {
    this.fetchCategories()
    this.fetchTags()
    this.id
      ? this.fetchData()
      : this.renderPost()
  }
}
</script>

<style scoped>
.content {
  flex-grow: 1;
  height: calc(100vh - 60px);
  overflow-y: auto;
  max-width: calc(100vw - 300px);
  padding: 32px 48px;
}
.sidebar {
  width: 300px;
  border-left: 1px solid #ccc;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

::deep .sidebar-section-title {
  color: rgba(0,0,0,.6);
}

::deep .tag-filter .q-field__append > .q-select__dropdown-icon{
  display: none;
}
</style>
