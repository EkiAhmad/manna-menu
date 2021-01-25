<template>
  <div class="admin_categories-list">
    <q-table
      title="Merchant"
      :data="result"
      :columns="dt.cols"
      row-key="id"
      :loading="dt.loading"
      :filter="dt.filter"
      :visible-columns="dt.cols_visible"
      :pagination.sync="pagination"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="secondary" v-model="dt.filter" placeholder="Search..." />
      </template>
      <div slot="top-left" slot-scope="props">
        <q-btn round color="secondary" class="q-mr-xs" icon="add" @click="doEdit(false)">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Merchant</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props" class="vertical-top">
        <q-btn size="sm" round dense color="primary" icon="edit" @click="doEdit(props.value)">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
        </q-btn>
      </q-td>
      <q-td slot="body-cell-companyCity" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.companyState}}
        <br />
        {{props.row.companyCity}}
      </q-td>
      <q-td slot="body-cell-pic" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.pic}}
        <br />
        {{props.row.pic_email}}
        <br />
        {{props.row.pic_phone}}
      </q-td>
      <q-td slot="body-cell-account" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.accountNumber}}
        <br />
        {{props.row.accountName}}
        <br />
        {{props.row.bank}}
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { size } from "lodash";

const role = "admin";
const resource = "merchants";
const baseRoute = `/${role}/${resource}`;

export default {
  async mounted() {
    this.dt.loading = true;
    await this.getData();
  },
  data() {
    return {
      baseRoute,
      resource,
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 10 // current rows per page being displayed
      },
      result: [],
      dt: {
        loading: true,
        filter: "",
        cols_visible: [
          "id",
          "company",
          "companyBusiness",
          "companyCity",
          "pic",
          "account"
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
            name: "company",
            label: "Company",
            align: "left",
            field: "company",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "companyBusiness",
            label: "Business",
            align: "left",
            field: "companyBusiness",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "companyCity",
            label: "State/City",
            align: "left",
            field: "companyCity",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "pic",
            label: "PIC",
            align: "left",
            field: "pic",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "account",
            label: "Bank Account",
            align: "left",
            field: "account",
            sortable: false,
            classes: "vertical-top"
          }
        ]
      }
    };
  },
  methods: {
    async getData() {
      try {
        const { data } = await this.$axios.get(`/${resource}`);
        this.dt.loading = false;
        this.result = data.merchants;
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
      const idx = id ? id : "";
      this.$router.push(`${this.baseRoute}/edit/${idx}`);
    }
  }
};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
