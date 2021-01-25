<template>
  <div id="q-app" class="docs-input">
    <router-view />
  </div>
</template>

<script>
import types from 'store/types'

export default {
  name: 'App',
  beforeCreate () {
    this.$store.dispatch(types.INITIALISE_STORE)
  }
}
</script>

<style>
</style>
