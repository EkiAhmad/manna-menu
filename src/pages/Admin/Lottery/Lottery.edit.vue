<template>
  <div class="products-edit">
    <q-card>
      <q-card-title>Lottery</q-card-title>
      <q-card-main>
        <q-field
          :error="$v.dataForm.name.$error && !$v.dataForm.name.$required"
          error-label="Name can't be empty"
        >
          <q-input stack-label="Name" v-model="dataForm.name" @blur="$v.dataForm.name.$touch" />
        </q-field>
        <q-field
          class="q-mt-md"
          :error="$v.dataForm.start_date.$error && !$v.dataForm.start_date.$required"
          error-label="Start Date can't be empty"
        >
          <q-datetime
            format24h
            v-model="dataForm.start_date"
            :default-value="today"
            stack-label="Start Date"
            type="datetime"
            @blur="$v.dataForm.start_date.$touch"
          />
        </q-field>
        <q-field
          class="q-mt-md"
          :error="$v.dataForm.end_date.$error && !$v.dataForm.end_date.$required"
          error-label="End Date can't be empty"
        >
          <q-datetime
            format24h
            v-model="dataForm.end_date"
            :default-value="today"
            stack-label="End Date"
            type="datetime"
            @blur="$v.dataForm.end_date.$touch"
          />
        </q-field>
        <q-field class="q-mt-md">
          <q-input
            v-model="dataForm.desc"
            type="textarea"
            stack-label="Description"
            :max-height="50"
            rows="2"
          />
        </q-field>
      </q-card-main>
    </q-card>

    <!-- Start of stores table -->
    <q-table
      class="q-my-md"
      title="Stores"
      :data="dataForm.stores"
      :columns="dataStore.cols"
      row-key="id_store"
      :filter="dataStore.filter"
      no-data-label="Stores empty"
      :pagination.sync="dataStore.pagination"
    >
      <template slot="top-right" slot-scope="props">
        <q-search
          class="q-mr-md"
          color="secondary"
          placeholder="Search..."
          v-model="dataStore.filter"
        />
        <q-btn round color="secondary" icon="add" @click="mdStores.show = true">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Add Stores</q-tooltip>
        </q-btn>
      </template>
      <q-td slot="body-cell-action" slot-scope="props" :props="props" auto-width>
        <q-btn
          size="sm"
          @click="remove(props.row.id_store)"
          round
          dense
          color="negative"
          icon="delete"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
        </q-btn>
      </q-td>
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
    <!-- end of stores table -->
    <q-card class="q-mt-sm" color="indigo-2">
      <q-card-actions align="end">
        <q-btn color="faded" icon="cancel" @click="$router.replace(`${baseRoute}/list`)">Cancel</q-btn>
        <q-btn color="primary" icon="save" :disable="$v.dataForm.$invalid" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>

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
          Add Stores
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
        title="Select Stores"
        :data="mdStores.data"
        :columns="mdStores.cols"
        :loading="mdStores.loading"
        row-key="id_store"
        :filter="mdStores.filter"
        no-data-label="No stores available"
        selection="multiple"
        :pagination.sync="mdStores.pagination"
        :selected.sync="mdStores.selected"
      >
        <template slot="top-selection" slot-scope="props">
          <q-btn round color="secondary" @click="select()" icon="save" />
        </template>
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

    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { date } from "quasar";
import { cloneDeep } from "lodash";

const role = "admin";
const resource = "lotteries";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    this.today = new Date();
    if (this.$route.params.id) {
      this.edit = true;
    } else {
      this.dataForm.start_date = this.today;
      this.dataForm.end_date = this.today;
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getDetil();
    }
  },
  validations: {
    dataForm: {
      name: { required },
      start_date: { required },
      end_date: { required }
    }
  },
  data() {
    return {
      role,
      resource,
      baseRoute,
      loading: false,

      dataForm: {
        name: "",
        start_date: "",
        end_date: "",
        desc: "",
        stores: []
      },

      dataStore: {
        pagination: {
          sortBy: null,
          rowsPerPage: 10
        },
        filter: "",
        cols: [
          {
            name: "action",
            required: true,
            label: "",
            sortable: true,
            field: "id_store",
            align: "left",
            style: "width:50px"
          },
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
            label: "Address",
            sortable: true,
            field: "address",
            align: "left",
            classes: "vertical-top"
          }
        ]
      },

      mdStores: {
        selected: [],
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
      }
    };
  },
  methods: {
    async getDetil() {
      await this.$refs.mdLoading.show();
      try {
        const id = this.$route.params.id;
        const result = await this.$axios.get(`/${resource}/${id}`);
        //this.dataForm = result.data;
        const { name, start_date, end_date, desc, stores } = result.data;
        this.dataForm.name = name;
        this.dataForm.start_date = start_date;
        this.dataForm.end_date = end_date;
        this.dataForm.desc = desc;
        for (const [i, v] of stores.entries()) {
          this.dataForm.stores.push(v);
        }
        await this.$refs.mdLoading.hide();
      } catch (e) {
        await this.$refs.mdLoading.hide();
        if (e.response) {
          await alert("error", e.response.data);
        } else {
          await alert("No Internet Connection");
        }
      }
    },
    async showStore() {
      this.mdStores.loading = true;
      try {
        let params = {};
        if (this.$route.params.id) {
          params = { id_lottery: this.$route.params.id };
        }
        let { data } = await this.$axios.get(`/${resource}/stores`, { params });
        if (data.stores.length) {
          if (this.dataForm.stores.length) {
            for (const [i, v] of this.dataForm.stores.entries()) {
              const idx = data.stores.findIndex(
                row => row.id_store === v.id_store
              );
              if (idx !== -1) {
                data.stores.splice(idx, 1);
              }
            }
          }
          this.mdStores.data = cloneDeep(data.stores);
        }
        this.mdStores.loading = false;
      } catch (e) {
        this.mdStores.loading = false;
        if (e.response) {
          await alert("error", e.response.data);
        } else {
          await alert("No Internet Connection");
        }
      }
    },
    select() {
      if (this.dataForm.stores.length) {
        this.dataForm.stores = [
          ...this.mdStores.selected,
          ...this.dataForm.stores
        ];
      } else {
        this.dataForm.stores = cloneDeep(this.mdStores.selected);
      }
      this.mdStores.show = false;
    },
    alert(type, msg) {
      this.$q.notify({
        message: msg,
        position: "top",
        type: type === "success" ? "positive" : "negative",
        timeout: 1500
      });
    },
    hide() {
      this.mdStores.selected = [];
      this.mdStores.data = [];
      this.mdStores.filter = "";
      this.mdStores.loading = false;
    },
    remove(id) {
      let confirmMsg = "Remove Store?";
      if (id) {
        this.$q
          .dialog({
            title: "Confirmation",
            message: confirmMsg,
            ok: "Yes",
            cancel: "No"
          })
          .then(() => {
            this.dataForm.stores.splice(
              this.dataForm.stores.findIndex(row => row.id_store === id),
              1
            );
          })
          .catch(() => {});
      }
    },
    async save() {
      if (!this.dataForm.stores.length) {
        await this.alert("error", "Store can't be empty");
        return;
      }
      await this.$refs.mdLoading.show();
      try {
        if (this.$route.params.id) {
          const id = this.$route.params.id;
          const resp = await this.$axios.put(
            `/${this.resource}/${id}`,
            this.dataForm
          );
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Update Lottery Success");
        } else {
          const resp = await this.$axios.post(
            `/${this.resource}`,
            this.dataForm
          );
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Create Lottery Success");
        }
        this.$router.replace(`${this.baseRoute}/list`);
      } catch (e) {
        await this.$refs.mdLoading.hide();
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("error", "No Internet Connection");
        }
      }
    }
  }
};
</script>
