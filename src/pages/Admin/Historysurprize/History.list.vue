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
        <q-btn round color="secondary" icon="cloud_download" @click="download">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Download to Excel</q-tooltip>
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
      <q-td slot="body-cell-id" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.__index +1}}
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
import XLSX from "xlsx";


const role = "admin";
const resource = "historysurprize";
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
        cols_visible: ["id","store","member", "link","date"],
        cols: [
          {
            name: "id",
            label: "No",
            align: "center",
            field: "id",
            style: "width:50px",
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
            name: "member",
            label: "Member",
            align: "left",
            field: "member",
            sortable: true,
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
            name: "date",
            label: "Date",
            align: "left",
            field: "date",
            sortable: true,
            classes: "vertical-top"
          },
          
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
    download() {
      if (this.result.length) {
        // let periodeData = [
        //   {
        //     title: "Tanggal Awal",
        //     value: date.formatDate(this.filter.start_date, "YYYY-MM-DD")
        //   },
        //   {
        //     title: "Tanggal Akhir",
        //     value: date.formatDate(this.filter.end_date, "YYYY-MM-DD")
        //   }
        // ];

        // let summaryData = [
        //   {
        //     title: "Transaksi",
        //     value: this.summary.trx
        //   },
        //   {
        //     title: "Point",
        //     value: this.summary.point
        //   },
        //   {
        //     title: "Redeem",
        //     value: this.summary.redeem
        //   }
        // ];

        let excelData = this.result.map(r => {
          return {
            Store: r.name,
            Member: r.member,
            Link: r.link,
            Date: r.date,
             
          };
        });

        let _sheet = XLSX.utils.json_to_sheet(excelData);
        // XLSX.utils.sheet_add_json(_sheet, summaryData, {
        //   origin: "A4",
        //   skipHeader: true
        // });
        // XLSX.utils.sheet_add_json(_sheet, excelData, { origin: "A1" });

        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new(); // make Workbook of Excel

        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, _sheet, "report");

        // export Excel file
        XLSX.writeFile(wb, "report_member.xlsx");
      } else {
        this.alert("error", "Data kosong");
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
