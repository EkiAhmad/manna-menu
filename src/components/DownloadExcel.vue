<template>
  <q-btn :id="idName" @click="generate">
    <slot>
      {{ name }}
    </slot>
  </q-btn>
</template>

<script>

import JsonExcel from 'vue-json-excel'

export default {
  extends: JsonExcel,
  data () {
    return {}
  }
}
</script>

<style>
</style>
