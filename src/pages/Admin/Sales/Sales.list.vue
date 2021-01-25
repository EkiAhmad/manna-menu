<template>
  <div class="admin_categories-list">
    <q-table
      title="Stores"
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
        </div>
    </q-table>
  </div>
</template>

<script>
import { size } from 'lodash'

const role = 'admin'
const resource = 'sales'
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
        cols_visible: ['trx_date', 'trx', 'store', 'method', 'qty', 'amount'],
        cols: [
          {
            name: 'trx_date',
            label: 'Trx Date',
            align: 'left',
            field: 'trx_date',
            sortable: true
          },
          {
            name: 'trx',
            label: 'Trx ID',
            align: 'left',
            field: 'trx',
            sortable: true,
          },
          {
            name: 'store',
            label: 'Store',
            align: 'left',
            field: 'store',
            sortable: true
          },
          {
            name: 'method',
            label: 'Payment Method',
            align: 'center',
            field: 'metode',
            sortable: false
          },
          {
            name: 'qty',
            label: 'Total Qty',
            align: 'right',
            field: 'total_quantity',
            sortable: true,
          },
          {
            name: 'amount',
            label: 'Total Amount',
            align: 'right',
            field: 'total_price_sales',
            field: row => {
              let money = '0';
              if (row.total_price_sales) {
                const reverse = row.total_price_sales
                  .toString()
                  .split("")
                  .reverse()
                  .join("");
                money = reverse.match(/\d{1,3}/g);
                money = money
                  .join(".")
                  .split("")
                  .reverse()
                  .join("");
              }
              return 'Rp ' + money;
            },
            sortable: true
          },
        ],
      },
    }
  },
  methods: {
    async getData() {
      try {
        const {data} = await this.$axios.get(`/${resource}`)
        this.dt.loading=false
        this.result = data.sales
      } catch(e) {
        this.dt.loading=false
        if (e.response) {
          await this.alert("error", e.response.data)
        } else {
          await this.alert("error", "No Internet Connection")
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
