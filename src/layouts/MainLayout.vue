<template>
  <q-layout view="lHh Lpr lFf">
    <!-- lHh Lpr lFf -->
    <q-header v-show="layout.options.edit">
      <q-toolbar style="height: 60px; border-bottom: 1px solid #ccc" class="bg-white text-black" ref="header">
        <div class="hash-logo">
          <router-link :to="{ name: 'dashboard' }" class="hash-logo-link">
            <h1 class="hash-logo-typography">#</h1>
          </router-link>
        </div>
        <q-space />
        <div></div>
      </q-toolbar>
    </q-header>
    <q-drawer
      :model-value="!layout.options.edit"
      class="side-panel column"
      :width="250"
    >
      <h1 class="logo">#</h1>
      <q-space />
      <q-list class="q-py-lg q-px-lg" dense>
        <q-item-label
          header
        >
        </q-item-label>
        <q-item class="q-pa-none">
          <q-item-section>
           <q-item-label class="menu-item group-title">Content</q-item-label>
         </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
           <q-item-label class="menu-item">
             <router-link to="/posts">
               Posts
             </router-link>
           </q-item-label>
         </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
           <q-item-label class="menu-item">Pages</q-item-label>
         </q-item-section>
        </q-item>
        <q-item class="q-pa-none">
          <q-item-section>
           <q-item-label class="menu-item group-title">Taxonomies</q-item-label>
         </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
           <q-item-label class="menu-item">
             <router-link to="/tags">
               Tags
             </router-link>
           </q-item-label>
         </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
           <q-item-label class="menu-item">
             <router-link to="/categories">
               Categories
             </router-link>
           </q-item-label>
         </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { layout } from "/src/common/helpers.js"

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  setup () {
    return {
      layout
    }
  },
  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  mounted () {
    Object.assign(layout, { areas: this.$refs })
  }
})
</script>


<style lang="scss">
.side-panel {
  background: #09f;
  overflow-x: hidden;
}

.logo {
  font-size: 120px;
  font-weight: 700;
  text-align: center;
  margin: 0.55em 0;
  color: white;
}

.menu-item {
  margin: 0;
  // font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0 12px;
  color: white;
  a {
    color: white;
    text-decoration: none;
  }
  &.group-title {
    margin: 0px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 2.66;
    letter-spacing: 0.08333em;
    text-transform: uppercase;
    margin: 12px -8px 8px;
    padding: 0;
  }
}
.hash-logo {
  display: flex;
  background: #09f;
  width: 60px;
  height: 60px;
  margin-left: -12px;
  justify-content: center;
  align-items: center;
}
.hash-logo-link {
  text-decoration: none;
  color: white;
}
.hash-logo-typography {
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  line-height: 1;
}
</style>
