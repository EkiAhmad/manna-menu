<template>
  <div class="{{ kebabCase role }}_{{ kebabCase name }}">
    <h3>{{ titleCase role }} - {{ titleCase name }}</h3>
    <router-view />
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
