<template>
  <div class="admin_categories-list">
    <q-table
      title="Stores"
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
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Create Store</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-merchant" slot-scope="props" :props="props" class="vertical-top">
        <span v-if="!props.value">
          <small class="text-faded">(unverified)</small>
        </span>
        <span v-else>{{props.value}}</span>
      </q-td>
      <q-td slot="body-cell-id" slot-scope="props" :props="props" class="vertical-top">
        <q-btn
          size="sm"
          round
          dense
          color="primary"
          icon="edit"
          @click="doEdit(props.value)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit</q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          class="q-ml-xs"
          round
          dense
          color="tertiary"
          icon="texture"
          @click="showQR(props.row)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Store QR Code</q-tooltip>
        </q-btn>
      </q-td>
      <q-td slot="body-cell-company" slot-scope="props" :props="props" class="vertical-top">
        {{props.value}}
        <p v-if="props.row.slug" class="q-mb-none q-mt-xs">
          <q-chip @click="accessURLStore(props.row.slug)" class="cursor-pointer" dense detail icon="public">{{props.row.slug}}</q-chip>
        </p>
      </q-td>
      <q-td slot="body-cell-companyCity" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.state}}
        <br />
        {{props.row.city}}
      </q-td>
      <q-td slot="body-cell-pic" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.pic}}
        <br />
        {{props.row.pic_phone}}
        <br />
        {{props.row.pic_email}}
      </q-td>
    </q-table>
    <q-modal
      minimized
      v-model="qr.show"
      @hide="resetQR"
      :content-css="{padding: '5px', minHeight: '10vh'}"
    >
      <q-card class="full-width">
        <q-card-title class="bg-primary text-white">
          {{qr.store}}
          <q-btn icon="print" v-if="qr.url" flat round @click="cetak" />
          <div slot="right" class="row items-center">
            <q-btn
              flat
              round
              @click="qr.show=false"
              icon="close"
              text-color="white"
              size="sm"
            />
          </div>
        </q-card-title>
        <q-card-media v-if="qr.url" class="q-ma-xs">
          <vue-qr :logoSrc="'statics/logo-manna.png'" :correctLevel="2" :text="qr.url" :size="300"></vue-qr>
        </q-card-media>
        <q-card-main v-else class="text-center">
          <p class="q-mt-md q-title text-tertiary">
            URL Alias not set!
          </p>
        </q-card-main>
        <q-card-main v-if="qr.url" class="text-center q-pt-none">
          <p class="text-faded q-mb-xs">
            <strong>{{qr.store}}</strong>
          </p>
          <q-chip v-if="qr.url" detail square dense icon="public">{{qr.url}}</q-chip>
        </q-card-main>
      </q-card>
    </q-modal>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { size } from "lodash";
import VueQr from 'vue-qr'

const role = "admin";
const resource = "stores";
const baseRoute = `/${role}/${resource}`;

export default {
  components: {
    VueQr
  },
  async mounted() {
    await this.getData();
  },
  data() {
    return {
      qr: {
        id: '',
        url: '',
        store: '',
        show: false,
      },
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
          "merchant",
          "company",
          "business",
          "companyCity",
          "pic"
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
            name: "merchant",
            label: "Merchant",
            align: "left",
            field: "merchant_name",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "company",
            label: "Store",
            align: "left",
            field: "company",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "business",
            label: "Business",
            align: "left",
            field: "business",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "companyCity",
            label: "State/City",
            align: "left",
            field: "city",
            sortable: false,
            classes: "vertical-top"
          },
          {
            name: "pic",
            label: "Owner (PIC)",
            align: "left",
            field: "pic",
            sortable: true,
            classes: "vertical-top"
          }
        ]
      }
    };
  },
  methods: {
    cetak () {
      const urlPath = this.$router.resolve({ path: `/qr/${this.qr.id}` });
      openURL(urlPath.href);
    },
    showQR (val) {
      this.qr.id = val.id
      this.qr.store = val.company
      this.qr.url = val.slug
      this.qr.show = true
    },
    resetQR () {
      this.qr.id = ''
      this.qr.store = ''
      this.qr.url = ''
    },
    accessURLStore (url) {
      openURL(url)
    },
    async getData() {
      this.dt.loading = true;
      try {
        const { data } = await this.$axios.get(`/${resource}`);
        this.dt.loading = false;
        this.result = data.stores;
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
