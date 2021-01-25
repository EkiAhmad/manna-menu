<template>
  <div class="admin_categories-list">
    <q-table
      title="Supplier"
      :data="data.result"
      :columns="data.cols"
      row-key="id"
      :loading="data.loading"
      :filter="data.filter"
      :visible-columns="data.cols_visible"
      :pagination.sync="pagination"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="secondary" v-model="data.filter" placeholder="Search..." />
      </template>
      <div slot="top-left" slot-scope="props">
        <q-btn round color="secondary" class="q-mr-xs" icon="add" @click="doEdit(false)">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Supplier</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props" class="vertical-top">
        <q-btn
          size="sm"
          v-if="props.row.id"
          round
          dense
          color="primary"
          icon="edit"
          @click="doEdit(props.value)"
        >
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10,10]">Edit</q-tooltip>
        </q-btn>
      </q-td>
      <q-td key="name" slot-scope="props" :props="props" class="vertical-top">
      </q-td>
      <q-td slot="body-cell-city" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.city}}<br/>
        {{props.row.state}}
      </q-td>
       <q-td slot="body-cell-fullname" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.fullname}}<br/>
        {{props.row.phone}}
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { size } from "lodash";

const role = "admin";
const resource = "suppliers";
const baseRoute = `/${role}/${resource}`;

export default {
  mounted() {
    this.getData();
  },
  data() {
    return {
      baseRoute,
      resource,
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 10 // current rows per page being displayed
      },
      data: {
        result: [],
        loading: false,
        filter: "",
        cols_visible: [
          "id",
          "name",
          "city",
          "address",
          "fullname",
          "total_store"
        ],
        cols: [
          {
            name: "id",
            label: "",
            align: "center",
            field: "id",
            style: "width:50px",
            classes: "vertical-top"
          },
          {
            name: "name",
            label: "Name",
            align: "left",
            field: "name",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "city",
            label: "City/State",
            align: "left",
            field: "city",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "address",
            label: "Address",
            align: "left",
            field: "address",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "fullname",
            label: "Owner (PIC)",
            align: "left",
            field: "fullname",
            sortable: false,
            classes: "vertical-top"
          },
          {
            name: "total_store",
            label: "Total Store",
            align: "left",
            field: "total_store",
            sortable: true,
            classes: "vertical-top"
          }
        ]
      }
    };
  },
  methods: {
    async getData() {
      this.data.loading=true;
      try {
        const { data } = await this.$axios.get(`/${this.resource}`);
        this.data.loading = false;
        this.data.result = data.suppliers;
      } catch (e) {
        this.dt.loading = false;
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("error", "No Internet Connection");
        }
      }
    },
    alert(type, msg) {
      this.$q.notify({
        message: msg,
        position: "top",
        type: type === "success" ? "positive" : "negative",
        timeout: 1500
      });
    },
    doEdit(id) {
      const idx = id ? id : ''
      this.$router.push(`${this.baseRoute}/edit/${idx}`)
    },

  }
};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
