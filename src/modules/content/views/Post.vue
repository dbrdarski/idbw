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
      <q-btn label="Publish" unelevated filled color="primary" />
    </template>
    <div class="row">
      <div class="content">
        <h1>Edit post</h1>
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
              >
                <template v-slot:append v-if="tagFilter">
                  <q-icon name="add_circle" color="primary" @click="createTag" style="cursor: pointer" />
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
          <q-separator />
          <q-expansion-item
            header-class="sidebar-section-title"
            label="Revisions"
            default-opened
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti.
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
import TaxonomyDialog from "../../taxonomy/dialogs/TaxonomyDialog.vue"

export default {
  name: "EditPost",
  components: {
    TaxonomyDialog
  },
  data () {
    return {
      post: {
        data: {
          header: {
            title: "",
            slug: ""
          },
          body: [],
          taxonomies: {
            tags: [],
            categories: []
          }
        }
      },
      tags: [],
      categories: [],
      tagFilter: "",
      categoryFilter: "",
      showTaxonomyDialog: false
    }
  },
  computed: {
    tagExactMatch () {
      return this.tags
        .find(tag => tag.data.title.toLowerCase() === (this.tagFilter ?? "").toLowerCase())
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
    async fetchCategories () {
      const [_, categories] = await taxonomyApi.fetchTaxonomies("category")
      this.categories = categories
    },
    async fetchTags () {
      const [_, tags] = await taxonomyApi.fetchTaxonomies("tag")
      this.tags = tags
    },
    async saveTaxonomy (data) {
      await taxonomyApi.createTaxonomy("category", data)
      await this.fetchCategories()
    },
    async createTag () {
      const title = this.tagFilter
      const tag = await taxonomyApi.createTaxonomy("tag", { title, slug: "xxx" })
      await this.fetchTags()
      console.log({ tag })
      this.updateTags(tag)
    }
  },
  mounted () {
    this.fetchCategories()
    this.fetchTags()
  }
}
</script>

<style scoped>
.content {
  flex-grow: 1;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
}
.sidebar {
  width: 300px;
  border-left: 1px solid #ccc;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
}

>>> .sidebar-section-title {
  color: rgba(0,0,0,.6);
}

>>> .tag-filter .q-field__append > .q-select__dropdown-icon{
  display: none;
}
</style>
