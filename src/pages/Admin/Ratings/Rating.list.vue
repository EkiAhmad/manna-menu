<template>
  <div class="admin_categories-list">
    <div class="q-pa-md">
      <q-table
        title="Rating Category"
        :data="result"
        :columns="dt.columns"
        row-key="name"
        :loading="dt.loading"
        :filter="dt.filter"
        :visible-columns="dt.cols_visible"
        :pagination.sync="pagination"
      >
        <template slot="top-right" slot-scope="props">
          <q-search color="secondary" v-model="dt.filter" placeholder="Search..." />
        </template>
        <div slot="top-left" slot-scope="props">
          <!-- <q-btn round color="secondary" class="q-mr-xs" icon="add" @click="doEdit(false)">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Ratings</q-tooltip>
          </q-btn> -->
          <q-btn round color="secondary" icon="refresh" @click="getData">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
          </q-btn>
        </div>
        <q-td slot="body-cell-id" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.__index +1}}
        <!-- <q-btn size="sm" round dense color="primary" icon="edit" @click="doEdit(props.value)">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
        </q-btn>
        &nbsp;
        <q-btn size="sm" round dense color="negative" icon="delete" @click="doDelete(props.value)">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
        </q-btn> -->
      </q-td>
      <q-td slot="body-cell-order" slot-scope="props" :props="props" class="vertical-top">
        <!-- {{props.row.order}}
        <q-popup-edit v-model="props.row.order" title="Update order" @save="setOrder(props.row.id, props.value)" buttons>
          <q-input type="number" v-model="props.row.order"/>
        </q-popup-edit> -->
      </q-td>
      </q-table>
    </div>
  </div>
</template>

<script>
import { size } from "lodash";
const role = "admin";
const resource = "ratings";
const baseRoute = `/${role}/${resource}`;
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
        rowsPerPage: 10 // current rows per page being displayed
      },
      result: [],
      dt: {
        loading:true,
        filter: '',
        cols_visible: ['id', 'fullname', 'name','code','value'],
        columns: [
          {
            name: 'id',
            required: true,
            label: 'No',
            align: 'left',
            style: "width:50px",
            field: 'id'
          }, 
          { name: 'fullname', align: 'center', label: 'Name Member', field: 'fullname', sortable: true },
          { name: 'name', align: 'center', label: 'Name Store', field: 'name', sortable: true },
          { name: 'code', label: 'Code', field: 'code', sortable: true, align:'left' },
          { name: 'value', label: 'Value', field: 'value', sortable: true, align:'left' },
          // { name: 'desc', label: 'Description', field: 'desc', sortable: true, align:'left' },
        ],
      },
    }
  },
  methods: {
    async getData() {
      this.dt.loading=true
      try {
        const {data} = await this.$axios.get(`/${resource}`)
        this.dt.loading=false
        this.result = data.ratings
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
    doEdit(id) {
      const idx = id ? id : "";
      this.$router.push(`${this.baseRoute}/edit/${idx}`);
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
    async setOrder (id, val) {
      const idx = id ? id : "";
      // this.$refs.mdLoading.show();
      // this.dt.loading=true
      try{
        await this.$axios.put(`/${this.resource}/order/${idx}`, {order:val});
        this.getData();
        // this.$refs.mdLoading.hide();
        // this.dt.loading=false
        await this.alert("success", "Set Order Sukses");
      } catch (e) {
        // this.$refs.mdLoading.hide();
        // this.dt.loading=false
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
        }
      }
    }
  }
}
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
