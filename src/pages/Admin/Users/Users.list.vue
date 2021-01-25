<template>
  <div class="admin_categories-list">
    <q-table
          title="Users"
          :data="result"
          :columns="dt.cols"
          row-key="id"
          :loading="dt.loading"
          :filter="dt.filter"
          :visible-columns="dt.cols_visible"
          :pagination.sync="pagination"
        >
            <template slot="top-right" slot-scope="props">
              <q-search color="secondary" v-model="dt.filter" placeholder="Cari user..." />
            </template>
            <div slot="top-left" slot-scope="props">
              <q-btn round color="secondary" icon="add" @click="doEdit(false)"/>&nbsp;
              <q-btn round color="secondary" icon="refresh" @click="getData" />
            </div>
            <q-td slot="body-cell-id" slot-scope="props" :props="props">
              <q-btn size="sm" round dense color="primary" icon="edit" @click="doEdit(props.value)" class="q-mr-xs" />
<!--
              <q-btn size="sm" round dense color="red-12" icon="delete" @click="doDelete(props.value)"/>
-->
            </q-td>
            <q-td slot="body-cell-status" slot-scope="props" :props="props">
              <q-chip v-if="props.value==='Aktif'" small color="secondary">{{ props.value }}</q-chip>
              <q-chip v-else small color="light">{{ props.value }}</q-chip>
            </q-td>
        </q-table>
  </div>
</template>

<script>
const role = 'admin'
const resource = 'users'
const baseRoute = `/${role}/${resource}`

export default {
  mounted () {
    this.getData()
  },
  data () {
    return {
      baseRoute,
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 50 // current rows per page being displayed
      },
      resource,
      result: [],
      dt: {
        loading:true,
        filter: '',
        cols_visible: ['id', 'name', 'email', 'status'],
        cols: [
          {
            name: 'id',
            label: '',
            align: 'center',
            field: 'user_id',
            style: 'width:50px'
          },
          {
            name: 'name',
            label: 'Nama Lengkap',
            align: 'left',
            field: 'user_fullname',
            sortable: true
          },
          {
            name: 'email',
            label: 'Email',
            align: 'left',
            field: 'user_email',
            sortable: true
          },
          {
            name: 'status',
            label: 'Status',
            align: 'left',
            field: 'status_txt',
            sortable: true
          },
        ],
      },
    }
  },
  methods: {
    getData() {
      this.dt.loading=true
      this.$axios.get(`/${this.resource}/`).then(({data}) => {
        this.dt.loading=false
        this.result = data.data
      })
      .catch(() => {
        this.dt.loading=false
        this.errorMsg()
      })
    },
    errorMsg(isDelete) {
      let errMsg = isDelete ? 'Error while removing data' : 'Error, failed get data'
      this.$q.notify({
        color: 'negative',
        position: 'top',
        message: errMsg,
        icon: 'report_problem'
      })
    },
    doEdit (id) {
      const idx = id ? id : ''
      this.$router.push(`${this.baseRoute}/edit/${idx}`)
    },
    doDelete (id) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Delete this data?',
        ok: 'YES',
        cancel: 'NO'
      }).then(() => {
        if (id) {
          this.$axios.delete(`${this.resource}/${id}`)
          .then(resp => {
            this.getData()
          })
          .catch(() => {
            this.errorMsg(true)
          })
        }
      }).catch(() => {

      })
    },

  }
}
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
