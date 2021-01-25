<template>
  <div class="products-edit">
    <div class="row full-width">
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:486px !important;">
          <q-card-title>Profile</q-card-title>
          <q-card-main>
            <q-field
              :error="$v.data.id_merchant.$error && !$v.data.id_merchant.$required"
              error-label="Please select Merchant"
            >
              <q-select
                :disable="edit?true:false"
                :popup-cover="false"
                @blur="$v.data.id_merchant.$touch"
                v-model="data.id_merchant"
                stack-label="Merchant"
                :options="merchants"
              />
            </q-field>
            <q-field
              :error="$v.data.name.$error && !$v.data.name.$required"
              error-label="Store Name can't be empty"
            >
              <q-input
                @blur="$v.data.name.$touch"
                stack-label="Store Name"
                v-model.trim="data.name"
              />
            </q-field>
            <q-field
              :error="$v.data.slug.$error && !$v.data.slug.$isRequired"
              error-label="Invalid URL Alias, format: alphanumeric and dash (-)"
            >
              <q-input lower-case
                @blur="$v.data.slug.$touch"
                stack-label="URL Alias"
                v-model.trim="data.slug"
                :disable="slugOri?true:false"
              />
            </q-field>
            <p v-if="data.slug" class="q-caption" style="color:#979797">
                https://manna.asia/menu/{{data.slug}}
            </p>
            <q-field
              :error="$v.data.business.$error && !$v.data.business.$required"
              error-label="Business can't be empty"
            >
              <q-select
                :popup-cover="false"
                @blur="$v.data.business.$touch"
                v-model="data.business"
                stack-label="Business"
                :options="business"
              />
            </q-field>
            <q-field
              :error="$v.data.state.$error && !$v.data.state.$required"
              error-label="State can't be empty"
            >
              <q-select
                filter
                filter-placeholder="Search..."
                :popup-cover="false"
                @blur="$v.data.state.$touch"
                v-model="data.state"
                @input="resetCity"
                stack-label="State"
                :options="states"
              />
            </q-field>
            <q-field
              :error="$v.data.city.$error && !$v.data.city.$required"
              error-label="City can't be empty"
            >
              <q-select
                filter
                filter-placeholder="Search..."
                :popup-cover="false"
                @blur="$v.data.city.$touch"
                v-model="data.city"
                stack-label="City"
                :options="filtered_cities"
              />
            </q-field>
            <q-field class="q-mt-xs">
              <q-input
                v-model.trim="data.address"
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
          <q-card-title>Owner (PIC)</q-card-title>
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
            <q-field :error="$v.data.phone.$error" error-label="Invalid Phone Number">
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
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:350px !important;">
          <q-card-title>Setting iPay</q-card-title>
          <q-card-main>
            <q-field>
              <q-input
                v-model.trim="data.pos_merchant_code"
                stack-label="Merchant Code"
              />
            </q-field>
            <q-field>
              <q-input
                v-model.trim="data.pos_merchant_key"
                stack-label="Merchant Key"
              />
            </q-field>
            <q-field>
              <q-input
                v-model.trim="data.pos_merchant_code_test"
                stack-label="Merchant Code Testing"
              />
            </q-field>
            <q-field>
              <q-input
                v-model.trim="data.pos_merchant_key_test"
                stack-label="Merchant Key Testing"
              />
            </q-field>
            <br>
            <q-checkbox 
              v-model="data.is_production" 
              color="primary" 
              label="is Production" 
              true-value="1"
              false-value="0"
            />
          </q-card-main>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 q-px-xs q-mb-md">
        <q-card style="min-height:350px !important;">
          <q-card-title>Banner Image Promo Surprize</q-card-title>
          <q-card-main>
            <q-uploader
              :method="method"
              @uploaded="importSuccess"
              @fail="importFail"
              :url="url"
              ref="promoSurpize"
              hide-upload-progress
              extensions=".jpg,.jpeg,.png"
              hide-upload-button
              auto-expand
              stack-label=""
              :additional-fields="uploadAdditional()"
              :headers="uploadHeaders()"
            />

            <div class="row q-mt-sm">
              <div v-if="promoSurpize" class="col-xs-12 col-sm-6">
                <p class="q-caption" style="color:#979797">Select new image to replace old image</p>
              </div>
              <div :class="promoSurpize?'col-xs-12 col-sm-6':'col-xs-12'">
                <p class="q-caption">
                  Image format: JPEG, JPG, or PNG
                  <br />Maximum image size: 500kb
                </p>
              </div>
            </div>

            <q-card v-if="promoSurpize" style="width:150px;">
              <q-card-media>
                <img :src="promoSurpize" style="height: auto; width:150px;"/>
              </q-card-media>
            </q-card>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <q-card class="q-mt-sm" color="indigo-2">
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
const resource = "stores";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    if (this.$route.params.id) {
      this.edit = true;
      this.url = `${this.$axios.defaults.baseURL}/${resource}/store/${this.$route.params.id}`;
      // this.method = 'PUT';
    }
  },
  async mounted() {
    const _merchants = this.$axios.get(`/merchants/select`);
    const _business = this.$axios.get(`/business`);
    const _states = this.$axios.get(`/states`);
    const _cities = this.$axios.get(`/cities`);
    let [merchants, business, states, cities, stores, ipay] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ];
    await this.$refs.mdLoading.show();
    try {
      if (this.$route.params.id) {
        const _stores = this.$axios.get(
          `/${this.resource}/${this.$route.params.id}`
        );
        const _ipay = this.$axios.get(`stores/ipay/${this.$route.params.id}`);
        [merchants, business, states, cities, stores, ipay] = await Promise.all([
          _merchants,
          _business,
          _states,
          _cities,
          _stores,
          _ipay
        ]);

        // this.ipay = ipay.data.ipay;
        // Object.assign(this.data, _ipay.data);
        const data = { password: "", repeatPassword: "", ...stores.data, ...ipay.data };
        Object.assign(this.data, data);
        this.slugOri = data.slug
        if (!this.data.id_merchant) {
          this.$v.data.id_merchant.$touch();
        }
        if (this.data.image) {
          this.promoSurpize = this.data.image;
        }
      } else {
        [merchants, business, states, cities] = await Promise.all([
          _merchants,
          _business,
          _states,
          _cities
        ]);
      }
      this.merchants = merchants.data.merchants;
      this.business = business.data.business;
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
          id_merchant: { required },
          name: { required },
          business: { required },
          state: { required },
          city: { required },
          email: { email },
          fullname: { required },
          phone: { required, numeric },
          repeatPassword: {
            sameAsPassword: sameAs("password")
          },
          repeatCode: {
            sameAsCode: sameAs("code")
          },
          slug: {
            isRequired() {
              return /^[a-z0-9-]+$/.test(this.data.slug)
            }
          },
          pos_merchant_code: { required },
          pos_merchant_key: { required },
          pos_merchant_code_test: { required },
          pos_merchant_key_test: { required }
        }
      };
    } else {
      return {
        data: {
          id_merchant: { required },
          name: { required },
          business: { required },
          state: { required },
          city: { required },
          email: { email },
          fullname: { required },
          phone: { required, numeric },
          password: { required },
          repeatPassword: {
            sameAsPassword: sameAs("password")
          },
          repeatCode: {
            sameAsCode: sameAs("code")
          },
          slug: {
            isRequired() {
              return /^[a-z0-9-]+$/.test(this.data.slug)
            }
          },
          pos_merchant_code: { required },
          pos_merchant_key: { required },
          pos_merchant_code_test: { required },
          pos_merchant_key_test: { required }
        }
      };
    }
  },
  data() {
    return {
      baseRoute,
      edit: false,
      loading: false,
      resource,
      sources: [],
      slugOri: '',
      url: `${this.$axios.defaults.baseURL}/${resource}`,
      method: "POST",
      promoSurpize: "",
      data: {
        id_merchant: "",
        name: "",
        slug: "",
        business: "",
        state: "",
        city: "",
        address: "",
        fullname: "",
        phone: "",
        email: "",
        password: "",
        repeatPassword: "",
        pos_merchant_code: "",
        pos_merchant_key: "",
        pos_merchant_code_test: "",
        pos_merchant_key_test: "",
        is_production: "0"
      },
      merchants: [],
      business: [],
      states: [],
      cities: []
    };
  },
  computed: {
    filtered_cities() {
      if (this.data.state) {
        return this.cities.filter(row => row.state === this.data.state);
      }
      return this.cities;
    }
  },
  methods: {
    resetCity() {
      this.data.city = "";
    },
    alert(type, msg) {
      this.$q.notify({
        message: msg,
        position: "top",
        type: type === "success" ? "positive" : "negative",
        timeout: 1500
      });
    },
    async importSuccess(file, xhr) {
      await this.$refs.mdLoading.hide();
      if (this.$route.params.id) {
        await this.alert("success", "Update Store Success");
      } else {
        await this.alert("success", "Create Store Success");
      }
      this.$router.replace(`${this.baseRoute}/list`);
    },
    async importFail(file, xhr) {
      await this.$refs.mdLoading.hide();
      if (xhr.response) {
        await this.alert("error", JSON.parse(xhr.response));
      } else {
        await this.alert("error", "No Internet Connection");
      }
    },
    uploadHeaders() {
      return {
        Authorization: `${this.$store.state.accessToken}`
      };
    },
    uploadAdditional() {
      return [
        {
          name: "data",
          value: JSON.stringify(this.data)
        }
      ];
    },
    async save() {
      try {
        await this.$refs.mdLoading.show();
        if (this.$route.params.id) {
          if (!this.$refs.promoSurpize.files.length) {
            const id = this.$route.params.id;
            const resp = await this.$axios.post(
              `/${this.resource}/store/${id}`,
              this.data
            );
          }else{
            await this.$refs.promoSurpize.upload();
          }
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Update Store Success");
        } else {
          if (!this.$refs.promoSurpize.files.length) {
            const resp = await this.$axios.post(`/${this.resource}`, this.data);
          }else{
            await this.$refs.promoSurpize.upload();
          }
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Create Store Success");
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
