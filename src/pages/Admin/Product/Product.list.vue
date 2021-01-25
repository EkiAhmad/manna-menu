<template>
  <div class="admin_categories-list">
    <q-table
      title="Products"
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
          <q-btn round color="secondary" class="q-mr-xs" icon="add" @click="doEdit(false)">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Product</q-tooltip>
          </q-btn>
          <q-btn round color="secondary" icon="refresh" @click="getData">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
          </q-btn>
        </div>
        <q-td slot="body-cell-id" slot-scope="props" :props="props">
          <q-btn size="sm" round dense color="primary" icon="edit" @click="doEdit(props.value)">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
          </q-btn>
          &nbsp;
          <q-btn size="sm" round dense color="negative" icon="delete" @click="doDelete(props.value)">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
          </q-btn>
        </q-td>
        <q-td slot="body-cell-product" slot-scope="props" :props="props" class="vertical-top">
          <p class="text-faded q-mb-xs">{{props.row.category}}</p>
          <strong>{{props.value}}</strong>
        </q-td>
        <q-td slot="body-cell-image" slot-scope="props" :props="props">
          <img v-if="!props.value" width="100" alt="Surprize logo" src="statics/no-image.png">
          <img v-else width="100" :src="props.value">
        </q-td>
        <q-td slot="body-cell-price" slot-scope="props" :props="props" class="vertical-top">
          Rp {{props.row.price | rupiah }}<br/>
          <span v-if="props.row.is_non_ppn==='ppn'"><small class="text-faded">(non PB1)</small></span>
          <span v-else><small class="text-faded">(inc. PB1)</small></span>
        </q-td>
        <q-td slot="body-cell-source" slot-scope="props" :props="props" class="vertical-top">
          <div v-if="props.row.store">
            {{props.row.store}}<br/>
            <small class="text-faded">(Store)</small>
          </div>
          <div v-else>
            {{props.row.merchant}}<br/>
            <small class="text-faded">(Merchant)</small>
          </div>
        </q-td>
    </q-table>
  </div>
</template>

<script>
import { size } from 'lodash'

const role = 'admin'
const resource = 'products'
const baseRoute = `/${role}/${resource}`

export default {
  async mounted () {
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
        cols_visible: ['id', 'image', 'sku', 'product', 'price', 'source'],
        cols: [
          {
            name: 'id',
            label: '',
            align: 'center',
            field: 'id',
            style: 'width:50px',
            classes: 'vertical-top'
          },
          {
            name: 'image',
            label: 'Image',
            align: 'left',
            field: 'image',
            sortable: false,
            classes: 'vertical-top'
          },
          {
            name: 'sku',
            label: 'SKU',
            align: 'left',
            field: 'sku',
            sortable: true,
            classes: 'vertical-top'
          },
          {
            name: 'product',
            label: 'Category/Product',
            align: 'left',
            field: 'name',
            sortable: true,
            classes: 'vertical-top'
          },
          {
            name: 'price',
            label: 'Selling Price',
            align: 'right',
            field: 'price',
            sortable: true,
            classes: 'vertical-top'
          },
          {
            name: 'source',
            label: 'Source',
            align: 'left',
            field: 'merchant',
            sortable: false,
            classes: 'vertical-top'
          },
        ],
      },
    }
  },
  filters: {
    rupiah: function(value) {
      let money = 0;
      if (value) {
        const reverse = value
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
      return money;
    }
  },
  methods: {
    async getData() {
      this.dt.loading = true;
      try {
        const {data} = await this.$axios.get(`/${resource}`)
        this.dt.loading=false
        this.result = data.products
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
            this.dt.loading = true;
            this.getData();
            this.$refs.mdLoading.hide();
            this.alert("success", "Hapus Kategori Sukses");
          })
          .catch(() => {
            this.errorMsg(true)
          })
        }
      }).catch(() => {
        this.alert("error", "Kategori tidak bisa di hapus");
      })
    },
    alert(type, msg) {
      this.$q.notify({
        message: msg,
        position: "top",
        type: type === "success" ? "positive" : "negative",
        timeout: 1500
      });
    }
  }
}
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
