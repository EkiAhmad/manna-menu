<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header class="no-shadow">
      <q-toolbar color="primary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          WELCOME TO USER PAGE
          <span slot="subtitle">Empowering your days</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="account circle">
          <q-popover>
            <q-list link separator class="scroll" style="min-width: 100px">
              <q-item
                @click.native="$router.push('/user/profile')"
                >
                <q-item-main label="My Profile"/>
              </q-item>
              <q-item
                @click.native="doLogout"
                >
                <q-item-main label="Logout" />
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-footer class="no-shadow">
      <q-toolbar color="primary">
        <q-toolbar-title>
          <p class="q-caption q-ma-none">MGG Software 2018</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-footer>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
    >
      <img alt="logo" src="assets/logo.png" width="100%"/>
      <user-menu />
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
import { mapActions } from 'vuex'
import UserMenu from './User.menu.vue'

export default {
  components: {
    UserMenu
  },
  name: 'LayoutUser',
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

</style>
