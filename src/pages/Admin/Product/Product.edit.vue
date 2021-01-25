<template>
  <div class="users-edit">
    <q-card>
      <q-card-main>
        <p class="q-caption q-mb-md" style="color:#979797">Status</p>
        <div class="overflow-hidden">
          <div class="row gutter-x-xl gutter-y-sm">
            <div class="col-xs-12 col-sm-6">
              <span>Show in Menu?</span>
              <q-toggle class="float-right" color="info" v-model="data.is_show_in_menu" true-value="1" false-value="0" :label="data.is_show_in_menu==='1'?'Yes':'No'"/>
            </div>
            <div class="col-xs-12 col-sm-6">
              <span>Enabled</span>
              <q-toggle class="float-right" color="secondary" v-model="data.status" true-value="1" false-value="0" :label="data.status==='1'?'Yes':'No'"/>
            </div>
          </div>
        </div>
      </q-card-main>
      <q-card-main>
        <div class="overflow-hidden">
          <div class="row gutter-x-md">
            <div class="col-12">
              <p v-if="!isEdit" class="q-caption text-faded">Source</p>
              <div v-if="!isEdit" class="no-margin">
                <q-radio
                  @input="productSource"
                  v-model="source"
                  val="merchant"
                  color="secondary"
                  label="Merchant's Product"
                />
                <q-radio
                  @input="productSource"
                  v-model="source"
                  val="store"
                  color="secondary"
                  label="Store's Product"
                  class="q-ml-md"
                />
              </div>
            </div>
            <div class="col-12">
              <q-field
                v-if="source==='merchant'"
                :error="$v.data.id_merchant.$error && !$v.data.id_merchant.isRequired"
                error-label="Please select Merchant"
              >
                <q-select
                  :popup-cover="false"
                  @blur="$v.data.id_merchant.$touch"
                  v-model="data.id_merchant"
                  stack-label="Merchant"
                  :options="merchants"
                  :disable="isEdit"
                  @input="updateSource"
                />
              </q-field>

              <q-field
                v-else
                :error="$v.data.id_merchant_store.$error && !$v.data.id_merchant_store.isRequired"
                error-label="Please select Store"
              >
                <q-select
                  filter
                  filter-placeholder="search..."
                  :popup-cover="false"
                  @blur="$v.data.id_merchant_store.$touch"
                  v-model="data.id_merchant_store"
                  stack-label="Store"
                  :options="stores"
                  :disable="isEdit"
                  @input="updateSource"
                />
              </q-field>
            </div>
            <div class="col-12 q-pb-md">
              <q-uploader
                :method="method"
                @uploaded="importSuccess"
                @fail="importFail"
                :url="url"
                ref="productImage"
                hide-upload-progress
                extensions=".jpg,.jpeg,.png"
                hide-upload-button
                auto-expand
                stack-label="Product Image"
                :additional-fields="uploadAdditional()"
                :headers="uploadHeaders()"
              />

              <div class="row q-mt-sm">
                <div v-if="productImage" class="col-xs-12 col-sm-6">
                  <p class="q-caption" style="color:#979797">Select new image to replace old image</p>
                </div>
                <div :class="productImage?'col-xs-12 col-sm-6':'col-xs-12'">
                  <p class="q-caption">
                    Image format: JPEG, JPG, or PNG
                    <br />Maximum image size: 500kb
                  </p>
                </div>
              </div>

              <q-card v-if="productImage" style="width:150px;">
                <q-card-media>
                  <img :src="productImage" style="height: auto; width:150px;"/>
                </q-card-media>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-field helper="if empty will be set in Others (Lain-lain)">
                <q-select
                  filter
                  filter-placeholder="search..."
                  :popup-cover="false"
                  v-model="data.id_category_product"
                  stack-label="Category"
                  :options="categories"
                />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-field helper="if empty will be set by system">
                <q-input stack-label="SKU" v-model.trim="data.sku" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-field
                :error="$v.data.name.$error && !$v.data.name.$required"
                error-label="Product Name can't be empty"
              >
                <q-input @blur="$v.data.name.$touch" stack-label="Product Name" v-model.trim="data.name" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-field class="q-mb-md">
                <q-input stack-label="Unit" v-model.trim="data.piece" />
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-field
                :error="$v.data.price_modal.$error"
                error-label="Invalid Modal Price"
                :helper="convertRp(data.price_modal)"
              >
                <q-input
                  @blur="$v.data.price_modal.$touch"
                  stack-label="Modal Price"
                  v-model="data.price_modal"
                  type="number"
                />
              </q-field>
              <q-checkbox
                v-model="data.is_modal_non_ppn"
                true-value="0"
                false-value="1"
                label="not included PB1"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-field
                :error="$v.data.price.$error"
                error-label="Invalid Sales Price"
                :helper="convertRp(data.price)"
              >
                <q-input
                  @blur="$v.data.price.$touch"
                  stack-label="Sales Price"
                  v-model.trim="data.price"
                  type="number"
                />
              </q-field>
              <q-checkbox
                v-model="data.is_non_ppn"
                true-value="0"
                false-value="1"
                label="not included PB1"
              />
            </div>
          </div>
        </div>
      </q-card-main>
    </q-card>
    <!-- Start of stores table -->
    <q-table
      class="q-my-md"
      title="Add-ons"
      row-key="__index"
      :data="data.varians"
      :columns="tbVarian.cols"
      :filter="tbVarian.filter"
      no-data-label="Add-ons empty"
      :pagination.sync="tbVarian.pagination"
    >
      <template slot="top-right" slot-scope="props">
        <q-search
          class="q-mr-md"
          color="secondary"
          placeholder="Search..."
          v-model="tbVarian.filter"
        />
        <q-btn round color="secondary" icon="add" @click="mdVarian.show = true">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Add-ons</q-tooltip>
        </q-btn>
      </template>
      <q-td slot="body-cell-action" slot-scope="props" :props="props" auto-width>
        <q-btn
          size="sm"
          round
          dense
          color="primary"
          icon="edit"
          @click="edit('varian', props.row.__index, props.row)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          class="q-ml-xs"
          round
          dense
          color="negative"
          icon="delete"
          @click="remove('varian', props.row.__index)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
        </q-btn>
      </q-td>
      <q-td slot="body-cell-sequence" slot-scope="props" :props="props">
        <q-field>
          <q-input v-model="props.row.order" class="prod-text-center" type="number"/>
        </q-field>
      </q-td>
      <q-td slot="body-cell-required" slot-scope="props" :props="props">
        <q-field>
          <q-checkbox v-model="props.row.is_required" true-value="1" false-value="0" :label="props.row.is_required==='1'?'Yes':'No'"/>
        </q-field>
      </q-td>
      <q-td slot="body-cell-status" slot-scope="props" :props="props">
        <q-field>
          <q-checkbox color="secondary" v-model="props.row.status" true-value="1" false-value="0" :label="props.row.status==='1'?'Active':'Inactive'"/>
        </q-field>
      </q-td>
    </q-table>
    <!-- end of varian table -->

    <!-- start of modal varian -->
    <q-modal
      minimized
      ref="varianMd"
      v-model="mdVarian.show"
      :content-css="{padding: '5px', minWidth: '85vw', minHeight: '30vh'}"
      @hide="hide('varian')"
    >
      <q-card inline class="full-width">
        <q-card-title class="bg-primary text-white">
          {{ mdVarian.action === 'edit' ? 'Edit' : 'Create' }} Add-ons
          <div slot="right" class="row items-center">
            <q-btn
              flat
              round
              @click="mdVarian.show = false"
              icon="close"
              text-color="white"
              size="sm"
            />
          </div>
        </q-card-title>
      </q-card>
      <q-card>
        <q-card-main>
          <div class="overflow-hidden">
            <div class="row gutter-x-md">
              <div class="col-xs-12 col-sm-6">
                <q-field
                  :error="$v.mdVarian.form.name.$error && !$v.mdVarian.form.name.$required"
                  error-label="Add-ons Name can't be empty"
                >
                  <q-input @blur="$v.mdVarian.form.name.$touch" stack-label="Add-ons Name" v-model.trim="mdVarian.form.name" />
                </q-field>
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-field>
                  <q-select :popup-cover="false" v-model="mdVarian.form.type" stack-label="Type" :options="varian_types"/>
                </q-field>
              </div>
            </div>
          </div>
          <q-table
            title="Add-ons Options"
            class="no-shadow q-mt-md"
            row-key="__index"
            style="border:1px solid #e0e0e0 !important;"
            :data="mdVarian.form.options"
            :columns="tbOption.cols"
            :filter="tbOption.filter"
            no-data-label="Add-ons Options empty"
            :pagination.sync="tbOption.pagination"
          >
            <template slot="top-right" slot-scope="props">
              <q-search color="secondary" placeholder="Search..." v-model="tbOption.filter" />
              <q-btn round color="secondary" icon="add" @click="mdOption.show = true">
                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Add-ons Option</q-tooltip>
              </q-btn>
            </template>
            <q-td slot="body-cell-action" slot-scope="props" :props="props" auto-width>
              <q-btn
                size="sm"
                round
                dense
                color="primary"
                icon="edit"
                @click="edit('option', props.row.__index, props.row)"
              >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
              </q-btn>
              <q-btn
                size="sm"
                class="q-ml-xs"
                round
                dense
                color="negative"
                icon="delete"
                @click="remove('option', props.row.__index)"
              >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
              </q-btn>
            </q-td>
            <q-td slot="body-cell-sequence" slot-scope="props" :props="props">
              <q-field>
                <q-input v-model="props.row.order" class="prod-text-center" type="number"/>
              </q-field>
            </q-td>
            <q-td slot="body-cell-status" slot-scope="props" :props="props">
              <q-field>
                <q-checkbox color="secondary" v-model="props.row.status" true-value="1" false-value="0" :label="props.row.status==='1'?'Active':'Inactive'"/>
              </q-field>
            </q-td>
          </q-table>
        </q-card-main>
         <q-card-actions align="end" class="bg-indigo-2">
          <q-btn color="primary" :disable="$v.mdVarian.form.$invalid" icon="save" @click="saveChild('varian')">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>
    <!-- stop of modal store -->
    <q-modal
      minimized
      ref="optionMd"
      v-model="mdOption.show"
      :content-css="{padding: '5px', minWidth: '30vw', minHeight: '30vh'}"
      @hide="hide('option')"
    >
      <q-card inline class="full-width">
        <q-card-title class="bg-primary text-white">
          {{ mdOption.action === 'edit' ? 'Edit' : 'Create' }} Add-ons Option
          <div slot="right" class="row items-center">
            <q-btn
              flat
              round
              @click="mdOption.show = false"
              icon="close"
              text-color="white"
              size="sm"
            />
          </div>
        </q-card-title>
      </q-card>
      <q-card>
        <q-card-main>
          <q-field
            :error="$v.mdOption.form.name.$error && !$v.mdOption.form.name.$required"
            error-label="Option Name can't be empty"
          >
            <q-input @blur="$v.mdOption.form.name.$touch" stack-label="Option Name" v-model.trim="mdOption.form.name" />
          </q-field>

          <q-field
            :error="$v.mdOption.form.price_modal.$error"
            error-label="Invalid Modal Price"
            :helper="convertRp(mdOption.form.price_modal)"
          >
            <q-input
              @blur="$v.mdOption.form.price_modal.$touch"
              stack-label="Modal Price"
              v-model="mdOption.form.price_modal"
              type="number"
            />
          </q-field>
          <q-field class="q-mt-md"
            :error="$v.mdOption.form.price.$error"
            error-label="Invalid Sales Price"
            :helper="convertRp(mdOption.form.price)"
          >
            <q-input
              @blur="$v.mdOption.form.price.$touch"
              stack-label="Sales Price"
              v-model="mdOption.form.price"
              type="number"
            />
          </q-field>
        </q-card-main>
        <q-card-actions align="end" class="bg-indigo-2">
          <q-btn color="primary" :disable="$v.mdOption.form.$invalid" icon="save" @click="saveChild('option')">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>
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
import { filter, find, findIndex, size, cloneDeep, orderBy } from "lodash";
import { required, numeric } from "vuelidate/lib/validators";

const role = "admin";
const resource = "products";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    if (this.$route.params.id) {
      this.isEdit = true;
      this.url = `${this.$axios.defaults.baseURL}/${resource}/${this.$route.params.id}`;
    }
  },
  async mounted() {
    const _merchants = this.$axios.get(`/${this.resource}/merchants`);
    const _stores = this.$axios.get(`/${this.resource}/stores`);
    let [merchants, stores, products] = [null, null, null];
    await this.$refs.mdLoading.show();
    try {
      if (this.$route.params.id) {
        const _products = this.$axios.get(
          `/${this.resource}/${this.$route.params.id}`
        );
        [merchants, stores, products] = await Promise.all([
          _merchants,
          _stores,
          _products
        ]);

        Object.assign(this.data, products.data);

        if (this.data.id_merchant_store) {
          this.source = "store";
        }
        if (this.data.image) {
          this.productImage = this.data.image;
        }
        let params = {};
        if (this.source === "store") {
          params = { id_merchant_store: this.data.id_merchant_store };
        } else {
          params = { id_merchant: this.data.id_merchant };
        }
        const categories = await this.$axios.get(`/productcategories/select`, {
          params
        });
        this.categories = categories.data.categories;
      } else {
        [merchants, stores] = await Promise.all([_merchants, _stores]);
      }
      this.merchants = merchants.data.merchants;
      this.stores = stores.data.stores;

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
  validations: {
    data: {
      id_merchant: {
        isRequired() {
          if (this.source === "merchant") {
            if (!this.data.id_merchant) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      },
      id_merchant_store: {
        isRequired() {
          if (this.source === "store") {
            if (!this.data.id_merchant_store) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      },
      name: { required },
      price: { numeric },
      price_modal: { numeric }
    },
    mdVarian: {
      form: {
        name: { required }
      }
    },
    mdOption: {
      form: {
        name: { required },
        price: { numeric },
        price_modal: { numeric }
      }
    }
  },
  data() {
    return {
      baseRoute,
      resource,
      isEdit: false,
      url: `${this.$axios.defaults.baseURL}/${resource}`,
      varian_types: [
        { value: '1', label: 'Single' },
        { value: '2', label: 'Multiple' },
      ],
      categories: [],
      merchants: [],
      stores: [],
      loading: false,
      isUpload: false,
      uploadData: null,
      fileData: null,
      uploadProcess: false,
      productImage: "",
      source: "merchant",
      method: "POST",
      data: {
        id_merchant: "",
        id_merchant_store: "",
        id_category_product: "",
        sku: "",
        name: "",
        price: 0,
        price_modal: 0,
        is_non_ppn: "0",
        is_modal_non_ppn: "0",
        piece: "Pcs",
        is_show_in_menu: '1',
        status: '1',
        varians: []
      },
      mdVarian: {
        action: 'add',
        idx: -1,
        show: false,
        form: {
          id: '',
          name: '',
          type: '1',
          order: '0',
          is_required: '0',
          options: [],
          status: '1',
        }
      },
      mdOption: {
        action: 'add',
        idx: -1,
        show: false,
        form: {
          name: '',
          price: '0',
          price_modal: '0',
          order: '0',
          status: '1',
        }
      },
      tbVarian: {
        pagination: {
          sortBy: null,
          rowsPerPage: 10
        },
        filter: '',
        cols: [
          {
            name: 'action',
            label: '',
            align: 'center',
            field: 'id',
            style: 'width:50px',
          },
          {
            name: 'name',
            label: 'Add-ons',
            align: 'left',
            field: 'name',
            sortable: false,
            style: "max-width:375px;white-space:normal",
          },
          {
            name: 'type',
            label: 'Type',
            align: 'left',
            field: row => row.type==='1' ? 'Single' : 'Multiple',
            sortable: true,
            style: "width:120px"
          },
          {
            name: 'sequence',
            label: 'Sequence',
            align: 'center',
            field: 'order',
            sortable: true,
            style: "width:120px"
          },
          {
            name: 'required',
            label: 'Required',
            align: 'left',
            field: 'is_required',
            sortable: false,
            style: "width:120px"
          },
          {
            name: 'status',
            label: 'Status',
            align: 'left',
            field: 'status',
            sortable: false,
            style: "width:120px"
          },
        ],
      },
      tbOption: {
        pagination: {
          sortBy: null,
          rowsPerPage: 10
        },
        filter: '',
        cols: [
          {
            name: 'action',
            label: '',
            align: 'left',
            field: 'id',
            sortable: false,
            style: "width:75px"
          },
          {
            name: 'name',
            label: 'Option',
            align: 'left',
            field: 'name',
            sortable: false,
            style: "max-width:375px;white-space:normal",
          },
          {
            name: 'price_modal',
            label: 'Modal Price',
            align: 'right',
            field: row => {
              return this.convertRp(row.price_modal)
            },
            sortable: true,
            style: "width:160px"
          },
          {
            name: 'sales_price',
            label: 'Sales Price',
            align: 'right',
            field: row => {
              return this.convertRp(row.price)
            },
            sortable: true,
            style: "width:160px"
          },
          {
            name: 'sequence',
            label: 'Sequence',
            align: 'center',
            field: 'order',
            sortable: true,
            style: "width:120px"
          },
          {
            name: 'status',
            label: 'Status',
            align: 'left',
            field: 'status',
            sortable: false,
            style: "width:160px"
          },
        ],
      },
    };
  },
  methods: {
    edit (modal, idx, data) {
      if (modal === 'option') {
        this.mdOption.action = 'edit'
        this.mdOption.idx = idx
        this.mdOption.form = { ...data }
        this.mdOption.show = true
      } else {
        this.mdVarian.action = 'edit'
        this.mdVarian.idx = idx
        this.mdVarian.form = { ...data }
        this.mdVarian.show = true
      }
    },
    remove (modal, idx) {
      const message = modal === 'varian' ? 'Remove Add-ons?' : 'Remove Add-ons option?'
      this.$q
          .dialog({
            title: "Confirmation",
            message,
            ok: "Yes",
            cancel: "No"
          })
          .then(() => {
            if (modal === 'varian') {
              this.data.varians.splice(idx, 1)
            } else {
              this.mdVarian.form.options.splice(idx, 1)
            }
          })
          .catch(() => {});
    },
    convertRp(val) {
      val = parseInt(val)
      if (val > 0) {
        const reverse = val
          .toString()
          .split("")
          .reverse()
          .join("");
        let money = reverse.match(/\d{1,3}/g);
        money = money
          .join(".")
          .split("")
          .reverse()
          .join("");
        return `Rp ${money}`;
      }
      return "Rp 0";
    },
    hide (modal) {
      if (modal) {
        if (modal === 'varian') {
          this.mdVarian.action = 'add'
          this.mdVarian.idx = -1
          this.mdVarian.form = {
            id: '',
            name: '',
            type: '1',
            order: '0',
            is_required: '0',
            options: [],
            status: '1',
          }
          this.tbOption.filter = ''
          this.$v.mdVarian.form.$reset()
        } else {
          this.mdOption.action = 'add'
          this.mdOption.idx = -1
          this.mdOption.form = {
            name: '',
            price: '0',
            price_modal: '0',
            order: '0',
            status: '1',
          }
          this.$v.mdOption.form.$reset()
        }
      }
    },
    saveChild(modal) {
      if (modal) {
        if (modal === 'varian') {
          if (!this.mdVarian.form.options.length) {
            this.alert('error', 'Add-ons Options can\'t be empty')
            return
          }
          const { id, name, type, order, is_required, options, status } = this.mdVarian.form
          const _options = options.map(row => {
            delete row.__index
            return row
          })
          if (this.mdVarian.action === 'edit') {
            this.data.varians[this.mdVarian.idx].name = name
            this.data.varians[this.mdVarian.idx].type = type
            this.data.varians[this.mdVarian.idx].options = _options
          } else {
            this.data.varians.push({
              id, name, type, order, is_required, options: _options, status
            })
          }
          this.mdVarian.show = false
        } else {
          const { id, name, price, price_modal, order, status } = this.mdOption.form
          if (this.mdOption.action === 'edit') {
            this.mdVarian.form.options[this.mdOption.idx].name = name
            this.mdVarian.form.options[this.mdOption.idx].price_modal = price_modal
            this.mdVarian.form.options[this.mdOption.idx].price = price
          } else {
            this.mdVarian.form.options.push({
              name, price, price_modal, order, status
            })
          }
          this.mdOption.show = false
        }
      }
    },
    async filterCategories() {
      await this.$refs.mdLoading.show();
      try {
        let params = {};
        if (this.source === "store") {
          params = { id_merchant_store: this.data.id_merchant_store };
        } else {
          params = { id_merchant: this.data.id_merchant };
        }
        const categories = await this.$axios.get(`/productcategories/select`, {
          params
        });
        this.categories = categories.data.categories;

        await this.$refs.mdLoading.hide();
      } catch (e) {
        await this.$refs.mdLoading.hide();
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("error", "No Internet Connection");
        }
      }
    },
    productSource(val) {
      if (val === "merchant") {
        this.data.id_merchant_store = "";
      } else {
        this.data.id_merchant = "";
      }
      this.data.id_category_product = "";
      this.categories = [];
    },
    updateSource(val) {
      this.data.id_category_product = "";
      this.categories = [];
      this.filterCategories();
    },
    async importSuccess(file, xhr) {
      await this.$refs.mdLoading.hide();
      if (this.$route.params.id) {
        await this.alert("success", "Update Product Success");
      } else {
        await this.alert("success", "Create Product Success");
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
    async save() {
      let result = null;
      await this.$refs.mdLoading.show();
      try {
        if (this.$route.params.id) {
          if (!this.$refs.productImage.files.length) {
            const id = this.$route.params.id;
            result = await this.$axios.post(
              `/${this.resource}/${id}`,
              this.data
            );
          } else {
            await this.$refs.productImage.upload();
          }
          if (result) {
            await this.$refs.mdLoading.hide();
            await this.alert("success", "Update Product Success");

            this.$router.replace(`${this.baseRoute}/list`);
          }
        } else {
          if (!this.$refs.productImage.files.length) {
            result = await this.$axios.post(`/${this.resource}`, this.data);
          } else {
            await this.$refs.productImage.upload();
          }
          if (result) {
            await this.$refs.mdLoading.hide();
            await this.alert("success", "Create Product Success");

            this.$router.replace(`${this.baseRoute}/list`);
          }
        }
      } catch (e) {
        await this.$refs.mdLoading.hide();
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("error", "No Internet Connection");
        }
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
.q-if-has-label {
  min-height: 61px;
}
.form-group-error {
  font-size: 12px;
  color: #db2828;
  margin-top: 15px;
}
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
.prod-text-center >>> input {
  text-align: center;
}
</style>
