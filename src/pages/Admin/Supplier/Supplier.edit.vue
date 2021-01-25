<template>
  <div class="products-edit">
    <div class="row full-width">
    <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
    <q-card>
      <q-card-title>Profile</q-card-title>
      <q-card-main>
        <q-field
          class="q-mt-sm"
          :error="$v.dataSupplier.name.$error && !$v.dataSupplier.name.$required"
          error-label="Supplier Name can't be empty"
        >
          <q-input stack-label="Supplier Name" v-model="dataSupplier.name" @blur="$v.dataSupplier.name.$touch" />
        </q-field>
        <q-field class="q-mt-sm"
              :error="$v.dataSupplier.state.$error && !$v.dataSupplier.state.$required"
              error-label="State can't be empty"
            >
              <q-select
                filter
                filter-placeholder="Search..."
                :popup-cover="false"
                @blur="$v.dataSupplier.state.$touch"
                v-model="dataSupplier.state"
                @input="resetCity"
                stack-label="State"
                :options="states"
              />
            </q-field>
            <q-field
            class="q-mt-sm"
              :error="$v.dataSupplier.city.$error && !$v.dataSupplier.city.$required"
              error-label="City can't be empty"
            >
              <q-select
                filter
                filter-placeholder="Search..."
                :popup-cover="false"
                @blur="$v.dataSupplier.city.$touch"
                v-model="dataSupplier.city"
                stack-label="City"
                :options="cities"
              />
            </q-field>
        <q-field
          class="q-mt-sm"
          :error="$v.dataSupplier.address.$error && !$v.dataSupplier.address.$required"
          error-label="Address can't be empty"
        >
          <q-input stack-label="Address" v-model="dataSupplier.address" @blur="$v.dataSupplier.address.$touch" />
        </q-field>
      </q-card-main>
    </q-card>
    </div>
    <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card>
      <q-card-title>Person in Charge (PIC)</q-card-title>
      <q-card-main>
       <q-field
          class="q-mt-sm"
          :error="$v.dataSupplier.fullname.$error && !$v.dataSupplier.fullname.$required"
          error-label="Full Name can't be empty"
        >
          <q-input stack-label="Full Name" v-model="dataSupplier.fullname" @blur="$v.dataSupplier.fullname.$touch" />
        </q-field>
        <q-field
          class="q-mt-sm"
          :error="$v.dataSupplier.phone.$error && !$v.dataSupplier.phone.$required"
          error-label="Phone can't be empty"
        >
          <q-input type="number" stack-label="Phone" v-model="dataSupplier.phone" @blur="$v.dataSupplier.phone.$touch" />
        </q-field>
        <q-field
          class="q-mt-sm"
          :error="$v.dataSupplier.email.$error && !$v.dataSupplier.email.$required"
          error-label="Email can't be empty"
        >
          <q-input type="email" stack-label="Email" v-model="dataSupplier.email" @blur="$v.dataSupplier.email.$touch" />
        </q-field>
        <q-field v-if="edit" helper="Type password to replace current password">
              <q-input v-model.trim="dataSupplier.password" type="password" stack-label="Password" />
            </q-field>
            <q-field v-else :error="$v.dataSupplier.password.$error" error-label="Password can't be empty">
              <q-input
                v-model.trim="dataSupplier.password"
                type="password"
                stack-label="Password"
                @blur="$v.dataSupplier.password.$touch"
              />
            </q-field>
            <q-field
              :class="edit?'q-mt-md':''"
              :error="$v.dataSupplier.rePassword.$error"
              error-label="Password doesn't match"
            >
              <q-input
                type="password"
                v-model.trim="dataSupplier.rePassword"
                stack-label="Re-Password"
                @blur="$v.dataSupplier.rePassword.$touch"
              />
            </q-field>

      </q-card-main>
    </q-card>
    </div>
    </div>
    <!-- Start of stores table -->
    <q-table
      class="q-my-md"
      title="Stores"
      :data="dataSupplier.stores"
      :columns="data.cols"
      row-key="id_store"
      :filter="data.filter"
      no-data-label="Stores empty"
      :pagination.sync="data.pagination"
    >
      <template slot="top-left" slot-scope="props">
        <q-btn round color="secondary" icon="add" @click="mdStores.show = true">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Add Stores</q-tooltip>
        </q-btn>
      </template>
      <template slot="top-right" slot-scope="props">
        <q-search
          class="q-mr-md"
          color="secondary"
          placeholder="Search..."
          v-model="data.filter"
        />
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="action" :props="props" auto-width>
          <q-btn size="sm" @click="remove(props.row.id_merchant_store)" round dense color="negative" icon="delete">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
          </q-btn>
        </q-td>
        <q-td key="name" :props="props">{{props.row.name}}</q-td>
        <q-td key="state" :props="props">{{props.row.state}}</q-td>
        <q-td key="city" :props="props">{{props.row.city}}</q-td>
        <q-td key="address" :props="props">{{props.row.address}}</q-td>
      </q-tr>
    </q-table>
    <!-- end of stores table -->

    <!-- start of modal store -->
    <q-modal
      minimized
      ref="mdStores"
      v-model="mdStores.show"
      :content-css="{padding: '5px', minWidth: '75vw', minHeight: '30vh'}"
      @hide="hide()"
      @show="showStore()"
    >
      <q-card inline class="full-width">
        <q-card-title class="bg-primary text-white">
          Add Stores
          <div slot="right" class="row items-center">
            <q-btn flat round @click="mdStores.show = false" icon="close" text-color="white" size="sm" />
          </div>
        </q-card-title>
      </q-card>
      <q-table
        title="Select Stores"
        :data="mdStores.data"
        :columns="mdStores.cols"
        :loading="mdStores.loading"
        row-key="id_merchant_store"
        :filter="mdStores.filter"
        no-data-label="Stores empty"
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
        <q-td key="id_merchant_store" slot-scope="props" :props="props">
          <span v-html="props.value"></span>
        </q-td>
        <q-td key="name" slot-scope="props" :props="props">
          <span v-html="props.value"></span>
        </q-td>
        <q-td key="state" slot-scope="props" :props="props">
          <span v-html="props.value"></span>
        </q-td>
        <q-td key="city" slot-scope="props" :props="props">
          <span v-html="props.value"></span>
        </q-td>
        <q-td key="address" slot-scope="props" :props="props">
          <span v-html="props.value"></span>
        </q-td>
      </q-table>
    </q-modal>
    <!-- stop of modal store -->

    <q-card class="q-mt-sm" color="indigo-2">
      <q-card-actions align="end">
        <q-btn color="faded" icon="cancel" @click="$router.replace(`${baseRoute}/list`)">Cancel</q-btn>
        <q-btn color="primary" icon="save" :disable="$v.dataSupplier.$invalid" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>

    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
  </div>
</template>

<script>
import { required, numeric, minValue, url, sameAs } from "vuelidate/lib/validators";
import { date, uid } from "quasar";
import { size, cloneDeep } from "lodash";

const role = "admin";
const resource = "suppliers";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    if (this.$route.params.id){
      this.edit = true;
    }
  },
  async mounted() {
    const _states = this.$axios.get(`/states`);
    const _cities = this.$axios.get(`/cities`);
    let [states, cities, suppliers] = [
      null,
      null, null
    ];
    await this.$refs.mdLoading.show();
    try {
      if (this.edit) {
        const _suppliers = this.$axios.get(
          `/${resource}/${this.$route.params.id}`
        );
        [states, cities, suppliers] = await Promise.all([
          _states,
          _cities, _suppliers
        ]);
        if (size(suppliers.data)) {
          suppliers.data = {
            password: "",
            rePassword: "",
            ...suppliers.data
          };
          Object.assign(this.dataSupplier, suppliers.data);
        }
      } else {
        [states, cities] = await Promise.all([_states, _cities]);
      }
      this.states = states.data.states;
      this.cities = cities.data.cities;

      await this.$refs.mdLoading.hide();
    } catch (e) {
      await this.$refs.mdLoading.hide();
      if (e.response) {
        await this.alert("error", e.response.data);
      } else {
        await this.alert("error", "No Internet Connection");
      }
      this.$router.replace(`${this.baseRoute}/list`);
    }
  },
  validations() {
    if (this.edit) {
      return {
        dataSupplier: {
          name: { required },
          city: { required },
          address: { required },
          fullname: { required },
          phone: { required },
          email: { required },
          rePassword: {
            sameAsPassword: sameAs("password")
          },
          state: {required}
        }
      };
    } else {
      return {
        dataSupplier: {
          name: { required },
          city: { required },
          address: { required },
          fullname: { required },
          phone: { required },
          email: { required },
          password: { required },
          rePassword: {
            sameAsPassword: sameAs("password")
          },
          state: {required}
        }
      };
    }
  },
  data() {
    return {
      role,
      resource,
      baseRoute,
      loading: false,
      edit: false,
      states : [],
      cities: [],
      dataSupplier: {
        name: '',
        state: '',
        city: '',
        address: '',
        fullname: '',
        phone: '',
        email: '',
        password: '',
        rePassword: '',
        stores: []
      },
      data: {
          stores: [],
          cols_visible: [
              'id',
              'id_merchant',
              'name',
              'state',
              'city',
              'address'
          ],
          cols: [
              {
                name: "action",
                required: true,
                label: "",
                sortable: true,
                field: "id_merchant_store",
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
                name: "state",
                required: true,
                label: "State",
                sortable: true,
                field: "state",
                align: "left"
              },
              {
                name: "city",
                required: true,
                label: "City",
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
                align: "left"
              },
          ]
      },
      mdStores: {
          data: [],
          show: false,
          cols:[
            {
                name: "id_merchant_store",
                required: true,
                label: "id",
                sortable: true,
                field: "id_merchant_store",
                align: "left"
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
                name: "state",
                required: true,
                label: "State",
                sortable: true,
                field: "state",
                align: "left"
            },
            {
                name: "city",
                required: true,
                label: "City",
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
                align: "left"
            },
          ]

      }

    };
  },
  methods: {
    async getDetil() {
      const idx = this.$route.params.id;
      const result = await this.$axios.get(`${this.resource}/${idx}`);
      this.$set(this, "dataSupplier", result.data);
    },
    async showStore(){
        const idx = this.$route.params.id;
        let { data } = await this.$axios.get(`${this.resource}/stores/`);
        if(size(data)){
          if(this.dataSupplier.stores.length){
              for (const [i, v] of this.dataSupplier.stores.entries()) {
                  const idx = data.stores.findIndex(row => {
                      return  row.id_merchant_store === v.id_merchant_store
                  });
                  if (idx !== -1) {
                      data.stores.splice(idx, 1);
                  }
              }
          }
          this.mdStores.data = data.stores
        }
    },
    select() {
      if (this.dataSupplier.stores.length) {

        this.dataSupplier.stores = [
          ...this.mdStores.selected,
          ...this.dataSupplier.stores
        ]
      } else {
        this.dataSupplier.stores = cloneDeep(this.mdStores.selected);
      }
      this.mdStores.show = false;
    },
     remove(id) {
      let confirmMsg = "Remove Data Store?";
      if (id) {
        this.$q
          .dialog({
            title: "Confirmation",
            message: confirmMsg,
            ok: "Yes",
            cancel: "No"
          })
          .then(() => {
            this.dataSupplier.stores.splice(
              this.dataSupplier.stores.findIndex(row => (row.id_merchant_store === id)),
              1
            );
          })
          .catch(() => {});
      }
    },
    resetCity() {
      this.dataSupplier.city = "";
      if (this.edit) {
        this.$v.dataSupplier.city.$touch()
      }
    },
    hide() {
      this.mdStores.selected = [];
      this.mdStores.data = [];
    },
    async save(){
      const idx = this.$route.params.id;
      if(idx){
        await this.$axios.put(`/${this.resource}`, this.dataSupplier);
        await this.alert("success", "Update Supplier Success");
      }
      else{
        await this.$axios.post(`/${this.resource}`, this.dataSupplier);
        await this.alert("success", "Add New Supplier Success");
      }
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
