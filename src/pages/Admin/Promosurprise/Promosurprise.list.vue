<template>
  <div class="admin_categories-list">
    <q-table
      title="Products"
      :data="result"
      :columns="dt.cols"
      row-key="id"
      :loading="dt.loading"
      :filter="dt.filter"
      :visible-columns="dt.cols_visible"
      :pagination.sync="pagination"
      no-data-label="Promo masih kosong"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="secondary" v-model="dt.filter" placeholder="Cari promo..." />
      </template>
      <div slot="top-left" slot-scope="props">
        <q-btn
          round
          color="secondary"
          class="q-mr-xs"
          icon="add"
          @click="doEdit(false)"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Buat Promo Baru</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
        <!-- <q-btn class="q-ml-md" v-if="hasProductAccess" round color="deep-orange" icon="cloud_upload" @click="doImport">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Upload Produk Baru dari Excel</q-tooltip>
        </q-btn> -->
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props">
        <q-btn
          size="sm"
          round
          dense
          color="primary"
          icon="edit"
          @click="doEdit(props.value)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Ubah</q-tooltip>
        </q-btn>
        &nbsp;
        <q-btn size="sm" round dense color="negative" icon="delete" @click="doDelete(props.value)">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
        </q-btn>
      </q-td>
      <q-td slot="body-cell-product" slot-scope="props" :props="props" class="vertical-top">
        <p class="text-faded q-mb-xs">{{props.row.category}}</p>
        <strong>{{props.value}}</strong>
      </q-td>
      <q-td slot="body-cell-image" slot-scope="props" :props="props">
        <img v-if="!props.value" width="100" alt="Surprize logo" src="statics/no-image.png" />
        <img v-else width="100" :src="props.value" />
      </q-td>
      <!-- <q-td slot="body-cell-pricemodal" slot-scope="props" :props="props" class="vertical-top">
        Rp {{props.row.price_modal | rupiah }}
        <br />
        <span v-if="props.row.is_modal_non_ppn==='ppn'">
          <small class="text-faded">(sudah PPN)</small>
        </span>
        <span v-else>
          <small class="text-faded">(belum PPN)</small>
        </span>
      </q-td> -->
      <q-td slot="body-cell-link" slot-scope="props" :props="props" class="vertical-top">
        <q-chip @click="accessURLSurprize(props.row.link)" class="cursor-pointer" dense detail icon="public">{{props.row.link}}</q-chip>
      </q-td>
      <q-td slot="body-cell-desc" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.desc}}
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { size } from "lodash";
import { mapState } from "vuex";

const role = "admin";
const resource = "promosurprise";
const baseRoute = `/${role}/${resource}`;

export default {
  async mounted() {
    // this.dt.loading = true;
    await this.getData();
  },
  data() {
    return {
      loading: false,
      baseRoute,
      resource,
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 20 // current rows per page being displayed
      },
      result: [],
      dt: {
        loading: true,
        filter: "",
        cols_visible: ["id","store", "image", "link", "desc"],
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
            name: "image",
            label: "Gambar",
            align: "center",
            field: "image",
            sortable: false,
            classes: "vertical-top"
          },
          {
            name: "store",
            label: "Store",
            align: "center",
            field: "name",
            sortable: false,
            classes: "vertical-top"
          },
          {
            name: "link",
            label: "Link",
            align: "left",
            field: "link",
            sortable: true,
            classes: "vertical-top"
          },
          {
            name: "desc",
            label: "Deskripsi",
            align: "left",
            field: "desc",
            sortable: true,
            classes: "vertical-top"
          }
        ]
      }
    };
  },
  filters: {
    rupiah: function(value) {
      let money = 0;
      if (value) {
        const reverse = value
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
      return money;
    }
  },
  methods: {
    async getData() {
      this.dt.loading = true;
      try {
        const { data } = await this.$axios.get(`/${resource}`);
        this.dt.loading = false;
        this.result = data.promosurprise;
      } catch (e) {
        this.dt.loading = false;
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("error", "Tidak ada koneksi internet");
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
    accessURLSurprize (url) {
      openURL(url)
    },
    doEdit(id) {
      const idx = id ? id : "";
      this.$router.push(`${this.baseRoute}/edit/${idx}`);
    },
    doDelete (id) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Delete this data?',
        ok: 'YES',
        cancel: 'NO'
      }).then(() => {
        if (id) {
          this.$axios.delete(`${this.resource}/${id}`)
          .then(resp => {
            this.dt.loading = true;
            this.getData()
            this.alert("success", "Hapus Promo Sukses");
          })
          .catch(() => {
            this.errorMsg(true)
          })
        }
      }).catch(() => {

      })
    },
    doImport() {
      this.$router.push(`${this.baseRoute}/import/`);
    }
  }
};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
