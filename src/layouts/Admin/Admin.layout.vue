<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <img alt="manna-white-logo" src="statics/logo-dashboard.png" />
        <q-toolbar-title class="text-right" style="font-weight:400">
          {{ getUsername }}
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert">
          <q-popover>
            <q-list link separator class="scroll" style="min-width: 150px">
              <!-- <q-item to="/admin/profile/">
                <q-item-main label="My Profile"/>
              </q-item> -->
              <q-item @click.native="doLogout">
                <q-item-main label="Logout" />
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <!-- <q-layout-footer class="no-shadow">
      <q-toolbar color="indigo-5">
        <q-toolbar-title>
          <p class="q-caption q-ma-none">2019, The Netwerk</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-footer> -->

    <q-layout-drawer
      v-model="leftDrawerOpen"
    >
      <admin-menu />
    </q-layout-drawer>

    <q-page-container>
      <q-page class="q-pa-md">
        <transition
          appear
          enter-active-class="animated fadeIn"
          >
          <router-view />
        </transition>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import types from 'store/types'
import { mapActions, mapState } from 'vuex'
import AdminMenu from './Admin.menu.vue'

export default {
  components: {
    AdminMenu
  },
  name: 'LayoutAdmin',
  computed: {
    ...mapState(['fullname']),
    getUsername() {
      if (this.fullname) {
        return this.fullname.toUpperCase()
      }
    }
  },
  data () {
    return {
      leftDrawerOpen: true
    }
  },
  methods: {
    openURL,
    ...mapActions({
      doLogout: types.DO_LOGOUT
    })
  }
}
</script>

<style>

.q-layout-drawer-left {
  overflow-x: hidden;
}
.sidemenu-bg {
  background-color: #ec6b61 !important;
}

</style>
