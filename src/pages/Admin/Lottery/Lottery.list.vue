<template>
  <div class="admin_categories-list">
    <div ref="test"></div>
    <q-table
      title="Lottery"
      :data="datatable.result"
      :columns="datatable.cols"
      row-key="id"
      :loading="datatable.loading"
      :filter="datatable.filter"
      :pagination.sync="pagination"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="secondary" v-model="datatable.filter" placeholder="Search..." />
      </template>
      <div slot="top-left" slot-scope="props">
        <q-btn round color="secondary" class="q-mr-xs" icon="add" @click="doEdit(props.value)">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Lottery</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props">
        <q-btn size="sm" dense round color="tertiary" icon="store" @click="stores(props.row)">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Stores</q-tooltip>
          <q-chip floating color="warning" class="text-black">{{props.row.total_store}}</q-chip>
        </q-btn>
        <q-btn
          size="sm"
          round
          dense
          class="q-ml-md"
          color="primary"
          icon="edit"
          @click="doEdit(props.value)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10,10]">Edit</q-tooltip>
        </q-btn>
      </q-td>
    </q-table>
    <!-- start of modal store -->
    <q-modal
      minimized
      ref="mdStore"
      v-model="mdStores.show"
      :content-css="{padding: '5px', minWidth: '75vw', minHeight: '30vh'}"
      @hide="hide()"
      @show="showStore()"
    >
      <q-card inline class="full-width">
        <q-card-title class="bg-primary text-white">
          Stores
          <div slot="right" class="row items-center">
            <q-btn
              flat
              round
              @click="mdStores.show = false"
              icon="close"
              text-color="white"
              size="sm"
            />
          </div>
        </q-card-title>
      </q-card>
      <q-table
        :title="mdStores.lottery"
        :data="mdStores.data"
        :columns="mdStores.cols"
        :loading="mdStores.loading"
        :filter="mdStores.filter"
        no-data-label="Stores empty"
        :pagination.sync="mdStores.pagination"
      >
        <template slot="top-right" slot-scope="props">
          <q-search color="secondary" placeholder="Search..." v-model="mdStores.filter" />
        </template>
        <q-td slot="body-cell-name" slot-scope="props" :props="props" class="vertical-top">
          <span>
            <strong>{{props.row.name}}</strong>
            <br />
            {{props.row.company}}
          </span>
        </q-td>
        <q-td slot="body-cell-city" slot-scope="props" :props="props" class="vertical-top">
          <span>
            {{props.row.city}}
            <br />
            {{props.row.state}}
          </span>
        </q-td>
      </q-table>
    </q-modal>
    <!-- stop of modal store -->
  </div>
</template>
<script>
import { cloneDeep } from "lodash";

const role = "admin";
const resource = "lotteries";
const baseRoute = `/${role}/${resource}`;

export default {
  mounted() {
    this.getData();
  },
  data() {
    return {
      mdStores: {
        lottery_id: "",
        lottery: "",
        pagination: {
          sortBy: null,
          rowsPerPage: 10
        },
        data: [],
        show: false,
        loading: false,
        filter: "",
        cols: [
          {
            name: "name",
            required: true,
            label: "Store/Merchant",
            sortable: true,
            field: "name",
            align: "left"
          },
          {
            name: "city",
            required: true,
            label: "State/City",
            sortable: true,
            field: "city",
            align: "left"
          },
          {
            name: "address",
            required: true,
            label: "Addresss",
            sortable: true,
            field: "address",
            align: "left",
            classes: "vertical-top"
          }
        ]
      },
      baseRoute,
      resource,
      pagination: {
        sortBy: null,
        rowsPerPage: 10
      },
      datatable: {
        loading: false,
        filter: "",
        result: [],
        cols: [
          {
            name: "id",
            required: true,
            label: "",
            sortable: true,
            field: "id",
            align: "left",
            style: "width:50px"
          },
          {
            name: "name",
            required: true,
            label: "Name",
            sortable: true,
            field: "name",
            align: "left"
          },
          {
            name: "start_date",
            required: true,
            label: "Start Date",
            sortable: true,
            field: "start_date",
            align: "left"
          },
          {
            name: "end_date",
            required: true,
            label: "End Date",
            sortable: true,
            field: "end_date",
            align: "left"
          }
        ]
      }
    };
  },
  methods: {
    async showStore() {
      this.mdStores.loading = true;
      try {
        let { data } = await this.$axios.get(
          `/${resource}/stores/${this.mdStores.lottery_id}`
        );
        if (data.stores.length) {
          this.mdStores.data = cloneDeep(data.stores);
        }
      } catch (e) {
        if (e.response) {
          await alert("error", e.response.data);
        } else {
          await alert("No Internet Connection");
        }
      }
      this.mdStores.loading = false;
    },
    hide() {
      this.mdStores.filter = "";
      this.mdStores.data = [];
      this.mdStores.loading = false;
    },
    stores(data) {
      this.mdStores.lottery_id = data.id;
      this.mdStores.lottery = data.name;
      this.mdStores.show = true;
    },
    async getData() {
      this.datatable.loading = true;
      try {
        const result = await this.$axios.get(`/${resource}`);
        this.datatable.result = result.data.lotteries;
      } catch (e) {
        if (e.response) {
          await alert("error", e.response.data);
        } else {
          await alert("No Internet Connection");
        }
      }
      this.datatable.loading = false;
    },
    doEdit(id) {
      const idx = id ? id : "";
      this.$router.push(`${this.baseRoute}/edit/${idx}`);
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
};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
