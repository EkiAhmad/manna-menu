<template>
  <div class="products-edit">
    <div class="row full-width">
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:486px !important;">
          <q-card-title>Profile</q-card-title>
          <q-card-main>
            <q-field
              :error="$v.data.company.$error && !$v.data.company.$required"
              error-label="Company Name can't be empty"
            >
              <q-input
                @blur="$v.data.company.$touch"
                stack-label="Company Name"
                v-model.trim="data.company"
              />
            </q-field>
            <q-field
              :error="$v.data.companyBusiness.$error && !$v.data.companyBusiness.$required"
              error-label="Business Category can't be empty"
            >
              <q-input
                @blur="$v.data.companyBusiness.$touch"
                stack-label="Business Category"
                v-model.trim="data.companyBusiness"
              />
            </q-field>
            <q-field :error="$v.data.companyWebsite.$error" error-label="Invalid Website">
              <q-input
                @blur="$v.data.companyWebsite.$touch"
                stack-label="Website"
                v-model.trim="data.companyWebsite"
              />
            </q-field>
            <q-field
              :error="$v.data.companyState.$error && !$v.data.companyState.$required"
              error-label="State can't be empty"
            >
              <q-select
                filter
                filter-placeholder="Search..."
                :popup-cover="false"
                @blur="$v.data.companyState.$touch"
                v-model="data.companyState"
                @input="resetCity"
                stack-label="State"
                :options="states"
              />
            </q-field>
            <q-field
              :error="$v.data.companyCity.$error && !$v.data.companyCity.$required"
              error-label="City can't be empty"
            >
              <q-select
                filter
                filter-placeholder="Search..."
                :popup-cover="false"
                @blur="$v.data.companyCity.$touch"
                v-model="data.companyCity"
                stack-label="City"
                :options="filtered_cities"
              />
            </q-field>
            <q-field class="q-mt-sm">
              <q-input
                v-model.trim="data.companyAddress"
                type="textarea"
                stack-label="Address"
                :max-height="50"
                rows="2"
              />
            </q-field>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:475px !important;">
          <q-card-title>Person In Charge (PIC)</q-card-title>
          <q-card-main>
            <q-field
              :error="$v.data.fullname.$error && !$v.data.fullname.$required"
              error-label="Full Name can't be empty"
            >
              <q-input
                @blur="$v.data.fullname.$touch"
                stack-label="Full Name"
                v-model.trim="data.fullname"
              />
            </q-field>
            <q-field
              :error="$v.data.phone.$error && !$v.data.phone.$required"
              error-label="Phone Number can't be empty"
            >
              <q-input
                @blur="$v.data.phone.$touch"
                stack-label="Phone Number"
                v-model.trim="data.phone"
              />
            </q-field>
            <q-field :error="$v.data.email.$error" error-label="Invalid Email">
              <q-input
                v-model.trim="data.email"
                lower-case
                stack-label="Email"
                @blur="$v.data.email.$touch"
              />
            </q-field>
            <q-field v-if="edit" helper="Type password to replace current password">
              <q-input v-model.trim="data.password" type="password" stack-label="Password" />
            </q-field>
            <q-field v-else :error="$v.data.password.$error" error-label="Password can't be empty">
              <q-input
                v-model.trim="data.password"
                type="password"
                stack-label="Password"
                @blur="$v.data.password.$touch"
              />
            </q-field>
            <q-field
              :class="edit?'q-mt-md':''"
              :error="$v.data.repeatPassword.$error"
              error-label="Password doesn't match"
            >
              <q-input
                type="password"
                v-model.trim="data.repeatPassword"
                stack-label="Re-Password"
                @blur="$v.data.repeatPassword.$touch"
              />
            </q-field>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <div class="row full-width">
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:400px !important;">
          <q-card-title>Bank Account</q-card-title>
          <q-card-main>
            <q-field
              :error="$v.data.bank.$error && !$v.data.bank.$required"
              error-label="Bank Name can't be empty"
            >
              <q-input
                @blur="$v.data.bank.$touch"
                stack-label="Bank Name"
                v-model.trim="data.bank"
              />
            </q-field>
            <q-field
              :error="$v.data.accountName.$error && !$v.data.accountName.$required"
              error-label="Account Name can't be empty"
            >
              <q-input
                @blur="$v.data.accountName.$touch"
                stack-label="Account Name"
                v-model.trim="data.accountName"
              />
            </q-field>
            <q-field :error="$v.data.accountNumber.$error" error-label="Invalid Account Number">
              <q-input
                v-model.trim="data.accountNumber"
                stack-label="Account Number"
                @blur="$v.data.accountNumber.$touch"
              />
            </q-field>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:400px !important;">
          <q-card-title>Term of Payment</q-card-title>
          <q-card-main>
            <q-field>
              <q-datetime v-model="data.joinDate" stack-label="Join Date" type="date" />
            </q-field>
            <q-field class="q-mt-lg">
              <q-select
                v-model="data.subscription"
                float-label="Subscription"
                :options="subscriptions"
              />
            </q-field>
            <q-field class="q-mt-lg">
              <q-datetime
                v-model="data.cutoffDate"
                :default-value="today"
                stack-label="Cut-off Date"
                type="date"
              />
            </q-field>
            <q-field
              class="q-mt-lg"
              :error="$v.data.sla.$error && !$v.data.sla.$required"
              error-label="SLA can't be empty"
            >
              <q-input
                v-model.trim="data.sla"
                type="number"
                numeric-keyboard-toggle
                stack-label="SLA"
                @blur="$v.data.sla.$touch"
              />
            </q-field>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <q-card>
      <q-card-title>Settings</q-card-title>
      <q-card-main>
        <q-field
          :error="$v.data.code.$error && !$v.data.code.$required"
          error-label="Company Code can't be empty"
          helper="Used for Store registration (Mobile App)"
        >
          <q-input
            upper-case
            @blur="$v.data.code.$touch"
            max-length="10"
            stack-label="Company Code"
            v-model.trim="data.code"
          />
        </q-field>
        <q-field class="q-mt-lg">
          <q-select
            :disable="edit?true:false"
            v-model="data.product_type"
            float-label="Product Source"
            :options="productTypes"
            :popup-cover="false"
          />
        </q-field>
      </q-card-main>
    </q-card>
    <q-card class="q-mt-md" color="indigo-2">
      <q-card-actions align="end">
        <q-btn color="faded" icon="cancel" @click="$router.replace(`${baseRoute}/list`)">Cancel</q-btn>
        <q-btn color="primary" icon="save" :disable="$v.data.$invalid" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
  </div>
</template>

<script>
import {
  required,
  email,
  url,
  numeric,
  sameAs
} from "vuelidate/lib/validators";
import { date, uid } from "quasar";
import { size } from "lodash";

const role = "admin";
const resource = "merchants";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    this.today = new Date();
    if (this.$route.params.id) {
      this.edit = true;
    } else {
      this.data.joinDate = this.today;
      this.data.cutoffDate = this.today;
    }
  },
  async mounted() {
    await this.$refs.mdLoading.show();

    const _states = this.$axios.get(`/states`);
    const _cities = this.$axios.get(`/cities`);
    let [states, cities, merchants] = [null, null, null];

    try {
      if (this.$route.params.id) {
        const _merchants = this.$axios.get(
          `/${resource}/${this.$route.params.id}`
        );
        [states, cities, merchants] = await Promise.all([
          _states,
          _cities,
          _merchants
        ]);
        if (size(merchants.data)) {
          merchants.data = {
            password: "",
            repeatPassword: "",
            ...merchants.data
          };
          Object.assign(this.data, merchants.data);
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
        data: {
          company: { required },
          code: { required },
          companyBusiness: { required },
          companyState: { required },
          companyCity: { required },
          companyWebsite: { url },
          email: { required, email },
          fullname: { required },
          phone: { required },
          bank: { required },
          accountNumber: { required, numeric },
          accountName: { required },
          sla: { required },
          repeatPassword: {
            sameAsPassword: sameAs("password")
          }
        }
      };
    } else {
      return {
        data: {
          company: { required },
          code: { required },
          companyBusiness: { required },
          companyState: { required },
          companyCity: { required },
          companyWebsite: { url },
          email: { required, email },
          fullname: { required },
          phone: { required },
          bank: { required },
          accountNumber: { required, numeric },
          accountName: { required },
          sla: { required },
          password: { required },
          repeatPassword: {
            sameAsPassword: sameAs("password")
          }
        }
      };
    }
  },
  data() {
    return {
      baseRoute,
      today: null,
      edit: false,
      loading: false,
      resource,
      sources: [],
      states: [],
      cities: [],
      data: {
        company: "",
        code: "",
        companyBusiness: "",
        companyWebsite: "",
        companyAddress: "",
        companyState: "",
        companyCity: "",
        fullname: "",
        phone: "",
        email: "",
        password: "",
        repeatPassword: "",
        bank: "",
        accountName: "",
        accountNumber: "",
        subscription: "0",
        joinDate: null,
        cutoffDate: null,
        sla: 5,
        product_type: "2"
      },
      subscriptions: [
        { value: "0", label: "Monthly" },
        { value: "1", label: "3 Month" },
        { value: "2", label: "6 Month" },
        { value: "3", label: "Others" }
      ],
      productTypes: [
        { value: "1", label: "Product only from Merchant" },
        { value: "2", label: "Product only from Store" }
      ]
    };
  },
  computed: {
    filtered_cities() {
      if (this.data.companyState) {
        return this.cities.filter(row => row.state === this.data.companyState);
      }
      return this.cities;
    }
  },
  methods: {
    resetCity() {
      this.data.companyCity = "";
      if (this.edit) {
        this.$v.data.companyCity.$touch()
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
    async save() {
      try {
        await this.$refs.mdLoading.show();
        if (this.$route.params.id) {
          const id = this.$route.params.id;
          const resp = await this.$axios.put(
            `/${this.resource}/${id}`,
            this.data
          );
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Update Merchant Success");
        } else {
          const resp = await this.$axios.post(`/${this.resource}`, this.data);
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Create Merchant Success");
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

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
.q-table-container.merchant-stores >>> .q-table-top {
  padding-left: 16px !important;
}
</style>
