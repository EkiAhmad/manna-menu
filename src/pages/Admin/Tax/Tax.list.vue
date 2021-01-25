<template>
  <div class="admin_categories-list">
    <q-table
      title="Tax"
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
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Tax</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props">
        <q-btn size="sm" round dense color="primary" icon="edit" @click="doEdit(props.value)">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
        </q-btn>
      </q-td>
    </q-table>
    <q-modal
      minimized
      v-model="modal.show"
      ref="mdTax"
      :content-css="{padding: '5px', minWidth: '75vw', minHeight: '30vh'}"
      @hide="hide"
    >
      <q-card inline class="full-width">
        <q-card-title class="bg-primary text-white">
          {{ modal.data.id ? 'Edit Tax' : 'Create Tax' }}
          <div slot="right" class="row items-center">
            <q-btn
              flat
              round
              icon="close"
              text-color="white"
              size="sm"
              @click="modal.show = false"
            />
          </div>
        </q-card-title>
        <q-card-main>
          <q-field class="q-mb-md">
            <q-select
              :popup-cover="false"
              v-model="modal.data.type"
              stack-label="Type"
              :options="typeTax"
            />
          </q-field>
          <q-field
            class="q-mb-sm"
            :error="$v.modal.data.name.$error && !$v.modal.data.name.required"
            error-label="Invalid Name"
          >
            <q-input
              @blur="$v.modal.data.name.$touch"
              stack-label="Name"
              v-model.trim="modal.data.name"
            />
          </q-field>
          <q-field>
            <p style="font-size:0.75rem" class="text-dark q-mb-sm">Value</p>
            <q-radio
              v-model="modal.data.value_type"
              val="percentage"
              label="Percentage"
              class="q-mr-md"
            />
            <q-radio v-model="modal.data.value_type" val="nominal" label="Nominal" />

            <q-input
              type="number"
              v-if="modal.data.value_type==='percentage'"
              suffix="%"
              v-model.trim="modal.data.value"
            />
            <q-input type="number" v-else prefix="Rp" v-model.trim="modal.data.value" />
          </q-field>
        </q-card-main>
        <q-card-actions align="end" class="bg-indigo-2">
          <q-btn color="primary" :disable="$v.modal.data.$invalid" icon="save" @click="save">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>
    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
  </div>
</template>

<script>
const role = "admin";
const resource = "tax";
const baseRoute = `/${role}/${resource}`;

import { required } from "vuelidate/lib/validators";

export default {
  async mounted() {
    await this.getData();
  },
  validations: {
    modal: {
      data: {
        name: { required }
      }
    }
  },
  data() {
    return {
      loading: false,
      baseRoute,
      resource,
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 10 // current rows per page being displayed
      },
      typeTax: [
        {
          value: "tax",
          label: "Tax"
        },
        {
          value: "service",
          label: "Service"
        }
      ],
      modal: {
        show: false,
        data: {
          id: "",
          type: "tax",
          name: "",
          value_type: "percentage",
          value: "0"
        }
      },
      result: [],
      dt: {
        loading: true,
        filter: "",
        cols_visible: ["id", "name", "type", "value"],
        cols: [
          {
            name: "id",
            label: "",
            align: "center",
            field: "id",
            style: "width:50px"
          },
          {
            name: "name",
            label: "Name",
            align: "left",
            field: "name",
            sortable: true
          },
          {
            name: "type",
            label: "Type",
            align: "left",
            field: "type",
            sortable: true
          },
          {
            name: "value",
            label: "Value",
            align: "left",
            field: row => {
              if (row.value_type === "nominal") {
                let money = 0;
                if (row.value) {
                  const reverse = row.value
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
                return "Rp " + money;
              } else {
                return row.value + "%";
              }
            },
            sortable: true
          }
        ]
      }
    };
  },
  methods: {
    hide() {
      this.modal.data = {
        id: "",
        type: "tax",
        name: "",
        value_type: "percentage",
        value: "0"
      };
      this.$v.modal.data.$reset();
    },
    async save() {
      try {
        await this.$refs.mdLoading.show();
        if (this.modal.data.id) {
          const resp = await this.$axios.put(
            `/${this.resource}/${this.modal.data.id}`,
            this.modal.data
          );
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Update Tax Success");
        } else {
          const resp = await this.$axios.post(
            `/${this.resource}`,
            this.modal.data
          );
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Create Tax Success");
        }
        await this.$refs.mdTax.hide();
        this.getData();
      } catch (e) {
        await this.$refs.mdLoading.hide();
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("error", "No Internet Connection");
        }
      }
    },
    async getData() {
      this.dt.loading = true;
      try {
        const { data } = await this.$axios.get(`/${resource}`);
        this.dt.loading = false;
        this.result = data.tax;
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
    async doEdit(id) {
      if (id) {
        await this.$refs.mdLoading.show();
        try {
          const { data } = await this.$axios.get(`/${resource}/${id}`);
          this.modal.data = data;

          await this.$refs.mdLoading.hide();
          await this.$refs.mdTax.show();
        } catch (e) {
          await this.$refs.mdLoading.hide();
          if (e.response) {
            await this.alert("error", e.response.data);
          } else {
            await this.alert("error", "No Internet Connection");
          }
        }
      } else {
        await this.$refs.mdTax.show();
      }
    }
  }
};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
