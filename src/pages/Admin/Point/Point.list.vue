<template>
  <div class="point-list">
    <q-card class="q-mb-sm">
      <q-card-main class="q-pt-none">
        <div class="row items-end">
          <div class="col-xs-12 col-lg-2 q-pa-sm">
            <q-datetime stack-label="Start Date" v-model="filter.start_date" type="date" />
          </div>
          <div class="col-xs-12 col-lg-2 q-pa-sm">
            <q-datetime stack-label="End Date" v-model="filter.end_date" type="date" />
          </div>
          <div class="col-xs-12 col-lg-3 q-pa-sm">
            <q-select
              filter
              filter-placeholder="Search Store point..."
              stack-label="Store"
              v-model="filter.store"
              :popup-cover="false"
              :options="store_option"
            />
          </div>
          <div class="col-xs-12 col-lg-3 q-pa-sm">
            <q-select
              filter
              filter-placeholder="Search Status point..."
              stack-label="Status"
              v-model="filter.status"
              :popup-cover="false"
              :options="status_option"
            />
          </div>
          <div class="col-xs-12 col-lg-2 q-pa-sm">
            <q-btn color="secondary" class="full-width" icon="filter_list" @click="getData">Filter</q-btn>
          </div>
        </div>
      </q-card-main>
    </q-card>
    <!-- start of list product category -->
    <q-table
      title="Point"
      :data="data.result"
      :columns="data.cols"
      row-key="id"
      :loading="data.loading"
      :filter="data.filter"
      :visible-columns="data.cols_visible"
      :pagination.sync="pagination"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="secondary" v-model="data.filter" placeholder="Cari..." />
      </template>
      <div slot="top-left" slot-scope="props">
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="cloud_download" @click="download">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Download to Excel</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props">
        <q-btn
          size="sm"
          round
          dense
          color="primary"
          icon="edit"
          @click="doEdit(props)"
        >
          <q-tooltip  anchor="top middle" self="bottom middle" :offset="[10,10]">Ubah</q-tooltip>
        </q-btn>
      </q-td> 
      <q-td slot="body-cell-bukti_redeem" slot-scope="props" :props="props">
        <img v-if="!props.value" width="100" alt="Surprize logo" src="statics/no-image.png">
        <img v-else width="100" :src="props.value">
      </q-td>
      <q-td slot="body-cell-status_redeem" slot-scope="props" :props="props">
        <p v-if="props.value == 0" >Proses</p>
        <p v-else >Sukses</p>
      </q-td>
    </q-table>
    <!-- stop of list product category -->
 
    <!-- start of modal Category -->
    <q-modal
      ref="mdChild"
      v-model="mdFormChild"
      minimized
      :content-css="{padding: '5px', minWidth: '50vw', minHeight: '30vh'}"
      @hide="hideChild()"
    >
      <q-card class="full-width">
        <q-card-title class="bg-primary text-white">
          {{child.id ? 'Ubah Point' : 'Buat Point Baru'}}
          <div slot="right" class="row items-center">
            <q-btn
              flat
              round
              icon="close"
              text-color="white"
              size="sm"
              @click="mdFormChild = false"
            />
          </div>
        </q-card-title>
        <q-card-main>
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

                  
                <div class="row q-mt-sm" >
                  <div v-if="this.child.bukti_redeem" class="col-xs-12 col-sm-6">
                    <p class="q-caption" style="color:#979797">Select new image to replace old image</p>
                  </div>
                  <div :class="this.child.bukti_redeem?'col-xs-12 col-sm-6':'col-xs-12'">
                    <p class="q-caption">
                      Image format: JPEG, JPG, or PNG
                      <br />Maximum image size: 500kb
                    </p>
                  </div>
                </div>
                
              </div>
              <q-card v-if="this.child.bukti_redeem" style="width:150px;">
                  <q-card-media>
                    <img :src="this.child.bukti_redeem" style="height: auto; width:150px;"/>
                  </q-card-media>
                </q-card>
          <q-field
            class="q-mt-sm"
          >
            <q-input
              stack-label="Store"
              type="text"
              v-model="child.name"
              disable
            />
          </q-field>
          <q-field
            class="q-mt-sm"
            :error="$v.child.status_redeem.$error && !$v.child.status_redeem.$required"
            error-label="Value harus diisi"
          > 
            <q-select
              filter
              class="q-mt-sm"
              stack-label="Status"
              v-model="child.status_redeem"
              :popup-cover="false"
              :options="status_redeem_option"
              @blur="$v.child.status_redeem.$touch"
            />
          </q-field>
        </q-card-main>
        <q-card-actions align="end" class="bg-indigo-2">
          <q-btn 
            text-color="white"
            color="primary"
            icon="save"
            label="simpan"
            :disable="$v.child.$invalid"
            @click="savePoint"
          />
        </q-card-actions>
      </q-card>
    </q-modal>
    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Mohon menunggu...</span>
    </q-modal>
    <!-- stop of modal Add Product -->
  </div>
</template>

<script>
import { filter, find, findIndex, size, orderBy } from "lodash";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import { date } from "quasar";
import XLSX from "xlsx";

const role = "admin";
const resource = "point";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {},
  mounted() {
    this.getData();
    this.data.cols_visible = ["id", "name", "total_point_redeem", "status_redeem", "bukti_redeem","date_request","date_success"];
  },
  validations: {
    child: {
      status_redeem: { required },
    }
  },
  async created() {
    this.filter.start_date = date.buildDate({ date: 1 });
    this.filter.end_date = new Date();
    this.status_option = [...this.status_option, {value: "0",label: "Proses"},{value: "1",label: "Sukses"}];
    try {
      const { data } = await this.$axios.get(`/${resource}/select_store`);
      this.store_option = [...this.store_option, ...data.stores];
    } catch (e) {}
  },
  data() {
    return {
      role,
      url: `${this.$axios.defaults.baseURL}/${resource}`,
      resource,
      baseRoute,
      loading: false,
      mdGroup: false,
      mdFormChild: false,
      method: "POST",
      productImage: "",
      point: "",
      pagination: {
        sortBy: null,
        rowsPerPage: 10 // current rows per page being displayed
      },
      store_option: [
        {
          value: "0",
          label: "Semua"
        },
      ],
      filter: {
        start_date: "",
        end_date: "",
        store: "0",
        status: "2"
      },
      status_option: [
        {
          value: "2",
          label: "Semua"
        },
      ],
      status_redeem_option: [
        {
          value: "0",
          label: "Proses"
        },
        {
          value: "1",
          label: "Sukses"
        },
      ],
      child: {
        id: "",
        name: "",
        total_point_redeem: "",
        status_redeem: "",
        bukti_redeem: "",
      },
      
      data: {
        result: [],
        loading: true,
        filter: "",
        cols_visible: ["id","bukti_redeem", "name", "total_point_redeem", "status_redeem","date_request","date_success"],
        cols: [
          {
            name: "id",
            label: "",
            align: "left",
            field: "id",
            sortable: false,
            style: "width:50px",
          },
          {
            name: "bukti_redeem",
            label: "Bukti",
            align: "left",
            field: "bukti_redeem",
            sortable: true
          },
          {
            name: "name",
            label: "Store",
            align: "center",
            field: "name",
            sortable: true
          },
          {
            name: "total_point_redeem",
            label: "Total",
            align: "left",
            field: row => {
              let money = "0";
              if (row.total_point_redeem) {
                const reverse = row.total_point_redeem
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
            name: "date_request",
            label: "Tanggal Request Redeem",
            align: "left",
            field: "date_request",
            sortable: true
          },
          {
            name: "date_success",
            label: "Tanggal Request Redeem Sukses",
            align: "left",
            field: "date_success",
            sortable: true
          },
          {
            name: "status_redeem",
            label: "Status",
            align: "left",
            field: "status_redeem",
            sortable: true
          },
           
        ]
      }
    };
  }, 
  methods: {
    async getData() {
      this.data.loading = true;
      try {
        this.data.result = []
        const { start_date, end_date, store, status } = this.filter;
        const params = {
          start_date,
          end_date,
          store,
          status,
        };
        const id = this.point ? this.point : ''
        const { data } = await this.$axios.get(`/${this.resource}/${id}`, { params });
        this.data.loading = false;
        if(data.bukti_redeem){
          this.productImage = data.bukti_redeem
        }
        this.data.result = data.point;
      } catch (e) {
        this.data.loading = false;
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
        }
      }
    },
     
    doEdit(dataEdit) {
      this.child.id = dataEdit.row.id;
      this.child.name = dataEdit.row.name;
      this.child.total_point_redeem = dataEdit.row.total_point_redeem;
      this.child.status_redeem = dataEdit.row.status_redeem;
      this.child.bukti_redeem = dataEdit.row.bukti_redeem;
      this.url = `${this.$axios.defaults.baseURL}/${resource}/${dataEdit.row.id}`;
      this.$refs.mdChild.show();
    },
     
    hideChild() {
      this.child.id = "";
      this.child.name = "";
      this.child.total_point_redeem = "";
      this.child.status_redeem = "";
      this.child.bukti_redeem = "";
      this.$v.child.$reset();
    },
    async importSuccess(file, xhr) {
      await this.$refs.mdLoading.hide();
      if (this.$route.params.id) {
        await this.alert("success", "Update Request Success");
      } else {
        await this.alert("success", "Update Request Success");
      }
      await this.getData();
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
          value: JSON.stringify(this.child)
        }
      ];
    },
    download() {
      if (this.data.result.length) {
        let periodeData = [
          {
            title: "Tanggal Awal",
            value: date.formatDate(this.filter.start_date, "YYYY-MM-DD")
          },
          {
            title: "Tanggal Akhir",
            value: date.formatDate(this.filter.end_date, "YYYY-MM-DD")
          },
        ];

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

        let excelData = this.data.result.map(r => {
          let statuses = 'Proses'
          if (r.status_redeem == 1) {
              statuses = 'Sukses'
          }
          return {
            Toko: r.name,
            Point: r.total_point_redeem,
            
            "Tanggal Request": r.date_request,
            "Tanggal Sukses": r.date_success,
            "Status": statuses,
          };
        });

        let _sheet = XLSX.utils.json_to_sheet(periodeData, {
          skipHeader: true
        });
        // XLSX.utils.sheet_add_json(_sheet, summaryData, {
        //   origin: "A4",
        //   skipHeader: true
        // });
        XLSX.utils.sheet_add_json(_sheet, excelData, { origin: "A4" });

        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new(); // make Workbook of Excel

        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, _sheet, "report");

        // export Excel file
        XLSX.writeFile(wb, "report_point.xlsx");
      } else {
        this.alert("error", "Data kosong");
      }
    },
    async savePoint() {
      await this.$refs.mdLoading.show()
      try {
        if (this.child.id) {
          if (!this.$refs.productImage.files.length) {
            await this.$axios.post(`/${this.resource}/${this.child.id}`, this.child);
          } else {
            await this.$refs.productImage.upload();
          }
          await this.getData();
          await this.$refs.mdLoading.hide()
          await this.$refs.mdChild.hide();
          await this.alert("success", "Ubah Request Sukses");
        } else {
          await this.$axios.post(`/${this.resource}`, this.child);
          await this.getData();
          await this.$refs.mdLoading.hide()
          await this.$refs.mdChild.hide();
          await this.alert("success", "Buat Request Baru Sukses");
        }
      } catch (e) {
        await this.$refs.mdLoading.hide()
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
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
