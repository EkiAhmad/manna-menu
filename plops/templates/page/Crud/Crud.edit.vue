<template>
  <div class="products-edit">
    <q-card>
      <q-card-main>
        <q-btn flat @click="$router.replace(baseRoute + '/list')">Back to List</q-btn>
      </q-card-main>
      <q-card-main>
        <q-input stack-label="Text" v-model="data.text" ></q-input>
      </q-card-main>
      <q-card-separator />
      <q-card-actions align="end">
        <q-btn color="primary" @click="save">Save</q-btn>
      </q-card-actions>

    </q-card>
  </div>
</template>

<script>

import { CrudEdit } from 'src/components/crud.mixin.js'

const role = '{{ kebabCase role }}'
const resource = '{{ kebabCase name }}'
const baseRoute = `/${role}/${resource}`

export default {
  mixins: [CrudEdit(resource)],
  mounted () {
    const id = this.$route.params.id
    if (id) {
      this.doGet(id)
    }
  },
  data () {
    return {
      baseRoute
    }
  },
  methods: {
    save () {
      if (this.$route.params.id) {
        this
          .doPatch(this.$route.params.id)
          .then(() => {
            this.$router.go(-1)
          })
      } else {
        this
          .doPost()
          .then(() => {
            this.$router.go(-1)
          })
      }
    }
  }
}
</script>

<style scoped>
.q-if-has-label {
            min-height: 61px;
          }
</style>
