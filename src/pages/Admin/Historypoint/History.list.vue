<template>
  <div class="admin_categories-list">
    <q-card class="q-mb-sm">
      <q-card-main class="q-pt-none">
        <div class="row items-end">
          <div class="col-xs-12 col-lg-3 q-pa-sm">
            <q-datetime stack-label="Start Date" v-model="filter.start_date" type="date" />
          </div>
          <div class="col-xs-12 col-lg-3 q-pa-sm">
            <q-datetime stack-label="End Date" v-model="filter.end_date" type="date" />
          </div>
          <div class="col-xs-12 col-lg-4 q-pa-sm">
            <q-select
              filter
              filter-placeholder="Search type point..."
              stack-label="Type"
              v-model="filter.type"
              :popup-cover="false"
              :options="type_select"
            />
          </div>
          <div class="col-xs-12 col-lg-2 q-pa-sm">
            <q-btn color="secondary" class="full-width" icon="filter_list" @click="getData">Filter</q-btn>
          </div>
        </div>
      </q-card-main>
    </q-card>
    <q-card class="q-mb-xs q-mt-md bg-grey-1">
      <q-card-main class="q-py-sm">
        <div class="row items-center">
          <div class="col-xs-12 col-sm-4 q-pa-sm text-center">
            <div class="q-title">{{summary.trx}}</div>
            <div class="q-caption">TRANSACTION</div>
          </div>
          <div class="col-xs-12 col-sm-4 q-pa-sm text-center">
            <div class="q-title">{{summary.point }}</div>
            <div class="q-caption">TOTAL POINT</div>
          </div>
          <div class="col-xs-12 col-sm-4 q-pa-sm text-center">
            <div class="q-title">{{summary.redeem }}</div>
            <div class="q-caption">TOTAL REDEEM</div>
          </div>
        </div>
      </q-card-main>
    </q-card>
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
        <q-btn round color="secondary" icon="cloud_download" @click="download">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Download to Excel</q-tooltip>
        </q-btn>
      </div>
    </q-table>
    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
  </div>
</template>

<script>
import { size } from "lodash";
import { date } from "quasar";
import XLSX from "xlsx";
import { mapState } from "vuex";

const role = "admin";
const resource = "history";
const baseRoute = `/${role}/${resource}`;

export default {
  async mounted() {
    await this.getData();
  },
  filters: {
    rupiah: function(value) {
      const reverse = value
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
      return "Rp " + money;
    }
  },
  data() {
    return {
      baseRoute,
      resource,
      loading: false,
      filter: {
        start_date: "",
        end_date: "",
        type: "0",
      },
      summary: {
        trx: 0,
        redeem: 0,
        point: 0
      },
      sources: "0",
      type_select: [
        {
          value: "0",
          label: "Semua"
        },
        {
          value: "1",
          label: "Online"
        },
        {
          value: "2",
          label: "Point"
        }
      ],
      pagination: {
        sortBy: null, // String, column "name" property value
        rowsPerPage: 20 // current rows per page being displayed
      },
      result: [],
      dt: {
        loading: true,
        filter: "",
        cols_visible: [
          "trx_date",
          "trx",
          "store",
          "method",
          "qty",
          "amount",
          "modal",
          "point"
        ],
        cols: [
          {
            name: "trx_date",
            label: "Trx Date",
            align: "left",
            field: "trx_date",
            sortable: true
          },
          {
            name: "trx",
            label: "Trx ID",
            align: "left",
            field: "trx",
            sortable: true
          },
          {
            name: "store",
            label: "Store",
            align: "left",
            field: "store",
            sortable: true
          },
          {
            name: "method",
            label: "Payment Method",
            align: "center",
            field: "metode",
            sortable: false
          },
          {
            name: "point",
            label: "Point",
            align: "center",
            field:  row => {
              let money = "0";
              if (row.total_point) {
                const reverse = row.total_point
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
            },
            sortable: true
          },
          {
            name: "modal",
            label: "Total Modal Price",
            align: "right",
            field: row => {
              let money = "0";
              if (row.total_price_product) {
                const reverse = row.total_price_product
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
            },
            sortable: true
          },
          {
            name: "amount",
            label: "Total Price",
            align: "right",
            field: row => {
              let money = "0";
              if (row.total_price_sales) {
                const reverse = row.total_price_sales
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
            },
            sortable: true
          },
          {
            name: "qty",
            label: "Total Qty",
            align: "right",
            field: "total_quantity",
            sortable: true
          }
        ]
      }
    };
  },
  async created() {
    this.filter.start_date = date.buildDate({ date: 1 });
    this.filter.end_date = new Date();
  },
  methods: {
    download() {
      if (this.result.length) {
        let periodeData = [
          {
            title: "Tanggal Awal",
            value: date.formatDate(this.filter.start_date, "YYYY-MM-DD")
          },
          {
            title: "Tanggal Akhir",
            value: date.formatDate(this.filter.end_date, "YYYY-MM-DD")
          }
        ];

        let summaryData = [
          {
            title: "Transaksi",
            value: this.summary.trx
          },
          {
            title: "Point",
            value: this.summary.point
          },
          {
            title: "Redeem",
            value: this.summary.redeem
          }
        ];

        let excelData = this.result.map(r => {
          return {
            Tanggal: r.trx_date,
            "ID Penjualan": r.trx,
            Toko: r.store,
            Pembayaran: r.metode,
            Point: r.total_point,
            "Total Modal": parseInt(r.total_price_product),
            "Total Harga": parseInt(r.total_price_sales),
            "Total Produk": parseFloat(r.total_quantity)
          };
        });

        let _sheet = XLSX.utils.json_to_sheet(periodeData, {
          skipHeader: true
        });
        XLSX.utils.sheet_add_json(_sheet, summaryData, {
          origin: "A4",
          skipHeader: true
        });
        XLSX.utils.sheet_add_json(_sheet, excelData, { origin: "A8" });

        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new(); // make Workbook of Excel

        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, _sheet, "report");

        // export Excel file
        XLSX.writeFile(wb, "report_penjualan.xlsx");
      } else {
        this.alert("error", "Data kosong");
      }
    },
    async getData() {
      this.dt.loading = true;
      try {
        const { start_date, end_date, type } = this.filter;
        const params = {
          start_date,
          end_date,
          type,
        };
        const { data } = await this.$axios.get(`/${resource}`, { params });
        this.dt.loading = false;
        this.result = data.sales;

        this.summary.trx = data.summary.trx;
        this.summary.point = data.summary.point;
        this.summary.redeem = data.summary.redeem;
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
    }
  }
};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
