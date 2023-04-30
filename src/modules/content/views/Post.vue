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
      <div class="content">
        <component :is="selectedTemplateComponent" :data="post.data" />
      </div>
      <!-- <div
        class="content"
        ref="contentEditor"
        contenteditable
      >
      </div> -->
      <div class="sidebar">
        <q-list>
          <q-expansion-item
            header-class="sidebar-section-title"
            label="Summary"
            default-opened
          >
            <q-card>
              <q-card-section class="q-px-none q-pt-none q-pb-sm">
                <q-list dense class="q-pa-none">
                  <q-item>
                    <q-item-section class="input-left">
                      Visibility
                    </q-item-section>
                    <q-item-section class="q-pa-none" dense>
                      <q-input
                        :model-value="post.data.options.visibility"
                        class="input-transparent"
                        dense
                        outlined
                        hide-bottom-space
                        stack-label
                      >
                        <q-popup-proxy ref="visibility_popup">
                          <q-card style="width: 268px">
                            <q-card-section class="text-subtitle2 row q-pt-md">
                              <div>Visibility</div>
                              <q-space />
                              <!-- <q-btn round size="sm" flat> -->
                                <q-icon
                                  name="close"
                                  size="16px"
                                  style="cursor: pointer; padding: 3px 0;"
                                  @click="() => $refs.visibility_popup.hide()"
                                />
                              <!-- </q-btn> -->
                            </q-card-section>
                            <q-card-section class="text-body2 q-pt-none">
                              <p class="q-mb-sm">Control how this post is viewed.</p>
                              <q-list class="text-body2 q-pt-sm">
                                <q-item class="q-px-none">
                                  <q-item-section avatar top style="min-width: 16px; padding-right: 10px;">
                                    <q-radio
                                      v-model="post.data.options.visibility"
                                      val="public"
                                      size="sm"
                                      dense
                                    />
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label>
                                      Public
                                    </q-item-label>
                                    <q-item-label caption class="q-pt-none">
                                      Visible to everyone.
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                                <q-item class="q-px-none">
                                  <q-item-section avatar top style="min-width: 16px; padding-right: 10px;">
                                    <q-radio
                                      v-model="post.data.options.visibility"
                                      dense
                                      size="sm"
                                      val="private"
                                    />
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label>
                                      Private
                                    </q-item-label>
                                    <q-item-label caption class="q-pt-none">
                                      Only visible to site admins and editors.
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                                <q-item class="q-px-none">
                                  <q-item-section avatar top style="min-width: 16px; padding-right: 10px;">
                                    <q-radio
                                      v-model="post.data.options.visibility"
                                      dense
                                      size="sm"
                                      val="password"
                                    />
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label>
                                      Password protected
                                    </q-item-label>
                                    <q-item-label caption class="q-pt-none">
                                      Only those with the password can view this post.
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-card-section>
                          </q-card>
                        </q-popup-proxy>
                      </q-input>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-none">
                    <q-item-section class="q-pa-none input-left" dense>
                      URL
                    </q-item-section>
                    <q-item-section class="q-pa-none" dense>
                      <q-input
                        model-value="Okokokokok"
                        class="input-transparent"
                        dense
                        outlined
                        hide-bottom-space
                        stack-label
                      />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="input-left">
                      Template
                    </q-item-section>
                    <q-item-section class="q-pa-none" dense>
                      <q-select
                        v-model="post.data.options.template"
                        class="input-transparent"
                        dense
                        outlined
                        hide-bottom-space
                        stack-label
                        :options="templateOptions"
                        option-value="name"
                        option-label="label"
                        emit-value
                        :display-value="selectedTemplateLabel"
                      />
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
                    v-model="post.record.taxonomies.categories"
                    :val="categoryExactMatch.document.id"
                    :label="categoryExactMatch.record.title"
                    style="width: 100%"
                    size="xs"
                  />
                  <q-checkbox
                    v-for="category in filteredCategories"
                    :key="category.document.id"
                    v-model="post.record.taxonomies.categories"
                    :val="category.document.id"
                    :label="category.record.title"
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
                  :label="tag.record.title"
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
// import * as taxonomyApi from "../../taxonomy/api.js"
// import * as contentApi from "/src/modules/content/api.js"

import TaxonomyDialog from "../../taxonomy/dialogs/TaxonomyDialog.vue"
// import { NodeList } from "src/common/components/Renderer.js"
import { themes } from "src/framework/theme.js"

import { render, getVNodeTree } from "idbx/src/utils"
import { date } from "quasar"

import api from "/src/api/client.js"

const { taxonomy: taxonomyApi, entity: contentApi } = api

export default {
  name: "EditPost",
  components: {
    TaxonomyDialog,
    ...themes.default.templates.editor.components
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
  setup () {
    return {
      templateOptions: Object.values(themes.default.templates.editor.options),
      templates: themes.default.templates.editor
    }
  },
  data () {
    return {
      post: {
        record: {
          header: {
            title: "",
            slug: ""
          },
          body: [],
          taxonomies: {
            tags: [],
            categories: []
          },
          options: {
            template: themes.default.templates.editor.options.page1.name,
            visibility: "public"
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
    selectedTemplateComponent () {
      return this.templates.components[this.post.data.options.template]
    },
    selectedTemplateLabel () {
      return this.templates.options[this.post.data.options.template]?.label
    },
    formatedRevisions () {
      return this.revisions.map(({
        revision: {
          id,
          published,
          timestamp,
          user
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
        .find(tag => tag.record.title.toLowerCase() === (this.tagFilter ?? "").toLowerCase())
    },
    tagExactMatchAdded () {
      return this.post.record.taxonomies.tags.includes(
        this.tagExactMatch?.document?.id
      )
    },
    categoryExactMatch () {
      return this.categories
        .find(category => category.record.title.toLowerCase() === (this.categoryFilter ?? "").toLowerCase())
    },
    filteredCategories () {
      const filter = (this.categoryFilter ?? "").toLowerCase()
      return filter
        ? this.categories
          .filter(({
            record: { title }
          }) => title.toLowerCase() !== filter.toLowerCase() &&
            title
              .toLowerCase()
              .includes(filter)
          )
        : this.categories
    },
    tagGroups () {
      const { tags } = this.post.record.taxonomies
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
            record: { title }
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
        taxonomies,
        options
      } = this.post.record

      const result = contentApi.createEntry("post", {
        header,
        body,
        taxonomies,
        options
      })

      this.$q.notify({
        type: "positive",
        message: `Post was successfully created.`
      })

      return result
    },
    async updatePost () {
      const result = await contentApi.updateEntry("post", this.post)
      this.$q.notify({
        type: "positive",
        message: `Post was successfully updated.`
      })
      // console.log(result)
      return result
    },
    async publishPost () {
      alert("Temporary disabled!")
      return
      // const { children } = getVNodeTree(this.$refs.contentEditor)

      this.post.record.body = children
      this.post.record.header.title = "Post title"
      this.post.record.header.slug = "post-slug"

      const post = await (
        this.id ? this.updatePost() : this.createPost()
      )
      // console.log({ post })
      this.$router.replace({
        name: "edit-post-revision",
        params: {
          id: post.document.id,
          revisionId: post.revision.id
        }
      })
    },
    openRevision ({ id }) {
      this.$router.replace({
        name: "edit-post-revision",
        params: {
          id: this.id,
          revisionId: id
        }
      })
    },
    tagLabel (tag) {
      return tag?.record?.title
    },
    updateTags (tag) {
      if (tag) {
        this.post.record.taxonomies.tags.push(tag.document.id)
      }
      this.$refs.tagFilter.updateInputValue("")
    },
    removeTag (tag) {
      this.post.record.taxonomies.tags = this.post.record.taxonomies.tags.filter(id => id !== tag.document.id)
    },
    fetchData () {
      this.fetchPost(this.id),
      this.fetchRevisions(this.id)
    },
    async fetchRevision (revisionId) {
      const post = JSON.parse(
        JSON.stringify(
          await contentApi.fetchRevision("post", revisionId)
        )
      )
      this.post = post
      this.renderPost()
      this.fetchRevisions(this.id)
    },
    async fetchRevisions (id) {
      const { data: revisions } = await contentApi.fetchEntryRevisions("post", id)
      this.revisions = revisions
    },
    async fetchCategories () {
      const { data: categories } = await taxonomyApi.fetchTaxonomies("category")
      this.categories = categories
    },
    async fetchTags () {
      const { data: tags } = await taxonomyApi.fetchTaxonomies("tag")
      this.tags = tags
    },
    async fetchPost (id) {
      const post = JSON.parse(
        JSON.stringify(
          await contentApi.fetchEntry("post", id)
        )
      )
      this.post = post
      this.renderPost()
    },
    renderPost () {
      // if (this.post.record.body) {
      //   const { contentEditor } = this.$refs
      //   const renderChild =  render.bind(null, contentEditor)
      //   contentEditor.innerHTML = ""
      //   this.post.record.body.forEach(renderChild)
      // }
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

<style scoped lang="scss">
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

.input-left {
  max-width: 80px;
}

.input-transparent {
  &.q-field--filled , &.q-field--filled ::v-deep .q-field__control {
    background: transparent !important;
  }
  &.q-field--outlined:not(:hover) {
    ::v-deep .q-field__control {
      &:before {
        display: none;
      }
    }
  }
  &.q-field--outlined {
    ::v-deep .q-field__control {
      &:before {
        opacity: .3
      }
    }
  }
}


</style>
