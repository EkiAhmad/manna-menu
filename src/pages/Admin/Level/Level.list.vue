<template>
  <div class="level-list">
    <!-- start of list product category -->
    <q-table
      title="Level"
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
      <q-td slot="body-cell-nilai_level" slot-scope="props" :props="props" class="vertical-top">
        {{props.value}} %
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
          {{child.id ? 'Ubah Level' : 'Buat Level Baru'}}
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
          <q-field
            class="q-mt-sm"
          >
            <q-input
              stack-label="Nama"
              type="text"
              v-model="child.name"
              disable
            />
          </q-field>
          <q-field
            class="q-mt-sm"
            :error="$v.child.cashback.$error && !$v.child.cashback.$required"
            error-label="Value harus diisi"
          >
            <q-input
              stack-label="Value (Dalam %)"
              type="number"
              v-model="child.cashback"
              @blur="$v.child.cashback.$touch"
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
            @click="saveLevel"
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

const role = "admin";
const resource = "point";
const baseRoute = `/${role}/${resource}`;

export default {
  mounted() {
    this.getData();
    this.data.cols_visible = ["id", "nama_level", "nilai_level"];
  },
  validations: {
    child: {
      cashback: { required },
    }
  },
  data() {
    return {
      role,
      resource,
      baseRoute,
      loading: false,
      mdGroup: false,
      mdFormChild: false,
      level: "",
      pagination: {
        sortBy: null,
        rowsPerPage: 10 // current rows per page being displayed
      },
      child: {
        id: "",
        name: "",
        cashback: "",
      },
      data: {
        result: [],
        loading: true,
        filter: "",
        cols_visible: ["id", "nama_level", "nilai_level"],
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
            name: "nama_level",
            label: "Nama",
            align: "center",
            field: "name",
            sortable: true
          },
          {
            name: "nilai_level",
            label: "Value",
            align: "left",
            field: "cashback",
            sortable: true
          },
           
        ]
      }
    };
  },
  async created() {},
  methods: {
    async getData() {
      this.data.loading = true;
      try {
        this.data.result = []
        const id = this.level ? this.level : ''
        const { data } = await this.$axios.get(`/${this.resource}/level/${id}`);
        this.data.loading = false;
        this.data.result = data.level;
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
      this.child.cashback = dataEdit.row.cashback;
      this.child.name = dataEdit.row.name;
      this.$refs.mdChild.show();
    },
     
    hideChild() {
      this.child.id = "";
      this.child.cashback = "";
      this.child.name = "";
      this.$v.child.$reset();
    },
    async saveLevel() {
      await this.$refs.mdLoading.show()
      try {
        if (this.child.id) {
          await this.$axios.put(`/${this.resource}/level/${this.child.id}`, this.child);
          await this.getData();
          await this.$refs.mdLoading.hide()
          await this.$refs.mdChild.hide();
          await this.alert("success", "Ubah Level Sukses");
        } else {
          await this.$axios.post(`/${this.resource}/level`, this.child);
          await this.getData();
          await this.$refs.mdLoading.hide()
          await this.$refs.mdChild.hide();
          await this.alert("success", "Buat Level Baru Sukses");
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
