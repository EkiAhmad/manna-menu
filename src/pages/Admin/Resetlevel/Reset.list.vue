<template>
  <div class="admin_categories-list">
    <q-table
      title="Reset"
      :data="result"
      :columns="dt.cols"
      row-key="id"
      :loading="dt.loading"
      :filter="dt.filter"
      :visible-columns="dt.cols_visible"
      :pagination.sync="pagination"
    >
        <template slot="top-right" slot-scope="props">
          <q-search color="secondary" v-model="dt.filter" placeholder="Search..."/>
        </template>
        <div slot="top-left" slot-scope="props">
          <q-btn round color="secondary" icon="refresh" @click="getData">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
          </q-btn>
          <q-btn round color="secondary" class="q-mr-xs" icon="low_priority" @click="doConfirm()">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Reset Loyalty</q-tooltip>
          </q-btn>
        </div>
        <q-td slot="body-cell-id" slot-scope="props" :props="props">
        {{props.row.__index + 1}}
        </q-td>
    </q-table>
  </div>
</template>

<script>
import { size } from 'lodash'

const role = 'admin'
const resource = 'point'
const baseRoute = `/${role}/${resource}`

export default {
  async mounted () {
    this.dt.loading=true
    await this.getData()
  },
  data () {
    return {
      baseRoute,
      resource,
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 20 // current rows per page being displayed
      },
      result: [],
      dt: {
        loading:true,
        filter: '',
        cols_visible: ['id', 'fullname', 'total_point', 'name'],
        cols: [
          {
            name: 'id',
            label: '',
            align: 'left',
            field: 'id',
            sortable: true
          },
          {
            name: 'fullname',
            label: 'Name',
            align: 'left',
            field: 'fullname',
            sortable: true,
          },
          {
            name: 'total_point',
            label: 'Point',
            align: 'left',
            field: 'total_point',
            sortable: true
          },
          {
            name: 'name',
            label: 'Loyalty',
            align: 'center',
            field: 'name',
            sortable: false
          },
        ],
      },
    }
  },
  methods: {
    async getData() {
      try {
        const {data} = await this.$axios.get(`/${resource}/reset`)
        this.dt.loading=false
        this.result = data.member
      } catch(e) {
        this.dt.loading=false
        if (e.response) {
          await this.alert("error", e.response.data)
        } else {
          await this.alert("error", "No Internet Connection")
        }
      }
    },
    doConfirm () {
      const message =   'Reset ALL Loyalty?' 
      this.$q
          .dialog({
            title: "Confirm",
            message,
            ok: "Yes",
            cancel: "No"
          })
          .then(() => { 
              this.doReset();
          })
          .catch(() => {});
    },
    async doReset () {
      try{
        await this.$axios.put(`/${this.resource}/reset/`);
        this.getData();
        await this.alert("success", "Reset Success");
      } catch (e) {
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
        }
      }
    },
    alert(type, msg) {
      this.$q.notify({
        message: msg,
        position: 'top',
        type: type==='success'?'positive':'negative',
        timeout: 1500
      })
    }
  }
}
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
