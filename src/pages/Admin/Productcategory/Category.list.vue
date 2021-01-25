<template>
  <div class="admin_categories-list">
    <!-- start of select category -->
    <!-- <q-card class="q-mb-sm">
      <q-card-main class="q-pt-none">
        <div class="row items-end">
          <div class="col-xs-12 col-lg-4">
            <q-select
              filter
              stack-label="Grup"
              v-model="category"
              :popup-cover="false"
              :options="categories"
              @input="getData"
            />
          </div>
          <div class="col-xs-12 col-lg-4">
            <q-btn v-if="hasAccessProduct && category" dense class="q-ml-md" round color="primary" icon="edit" @click="editGroup()">
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ubah Grup</q-tooltip>
            </q-btn>
            <q-btn v-if="hasAccessProduct" round dense color="secondary" class="q-ml-sm" icon="add" @click="mdGroup=true">
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Buat Grup Baru</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-main>
    </q-card> -->
    <!-- stop of select category -->

    <!-- start of list product category -->
    <q-table
      title="Kategori"
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
        <q-btn round color="secondary" icon="add" class="q-mr-xs" @click="newChild">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Buat Kategori Baru</q-tooltip>
        </q-btn>
        <q-btn round color="secondary" icon="refresh" @click="getData">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Refresh</q-tooltip>
        </q-btn>
      </div>
      <q-td slot="body-cell-id" slot-scope="props" :props="props">
        <q-btn
          size="sm"
          v-if="props.row.label !== 'Tanpa Kategori'"
          round
          dense
          color="primary"
          icon="edit"
          @click="doEdit(props)"

        >
          <q-tooltip  anchor="top middle" self="bottom middle" :offset="[10,10]">Ubah</q-tooltip>
        </q-btn>
        &nbsp;
        <q-btn size="sm" v-if="props.row.label !== 'Tanpa Kategori'" round dense color="negative" icon="delete" @click="doDelete(props.value)">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete</q-tooltip>
        </q-btn>
      </q-td>
      <q-td slot="body-cell-order" slot-scope="props" :props="props" class="vertical-top">
        {{props.row.order}}
        <q-popup-edit v-if="props.row.label !== 'Tanpa Kategori'" v-model="props.row.order" title="Update order" @save="setOrder(props.row.id, props.value)" buttons>
          <q-input type="number" v-model="props.row.order"/>
        </q-popup-edit>
      </q-td>
      <q-td key="label" slot-scope="props" :props="props.value">
        <span v-html="props.value"></span>
      </q-td>
      <q-td slot="body-cell-source" slot-scope="props" :props="props" class="vertical-top">
        <div v-if="props.row.store">
            {{props.row.store}}<br/>
            <small class="text-faded">(Store)</small>
          </div>
      </q-td>
    </q-table>
    <!-- stop of list product category -->

    <!-- start of modal Add Category -->
    <!-- <q-modal
      ref="mdFormGroup"
      v-model="mdGroup"
      minimized
      :content-css="{padding: '5px', minWidth: '50vw', minHeight: '30vh'}"
      @hide="hideMdGroup"
    >
      <q-card class="full-width">
        <q-card-title class="bg-primary text-white">
          {{group.id?'Ubah Grup':'Buat Grup Baru'}}
          <div slot="right" class="row items-center">
            <q-btn flat round icon="close" text-color="white" size="sm" @click="mdGroup=false" />
          </div>
        </q-card-title>
        <q-card-main>
          <q-field
            class="q-mt-sm"
            :error="$v.group.label.$error && !$v.group.label.$required"
            error-label="Nama Grup harus diisi"
          >
            <q-input
              stack-label="Nama Grup Name"
              type="text"
              v-model="group.label"
              @blur="$v.group.label.$touch"
            />
          </q-field>
        </q-card-main>
        <q-card-actions align="end" class="bg-indigo-2">
          <q-btn
            text-color="white"
            color="primary"
            icon="save"
            label="simpan"
            :disable="$v.group.$invalid"
            @click="saveGroup()"
          />
        </q-card-actions>
      </q-card>
    </q-modal> -->
    <!-- stop of modal Group -->

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
          {{child.id ? 'Ubah Kategori' : 'Buat Kategori Baru'}}
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
            :error="$v.child.label.$error && !$v.child.label.$required"
            error-label="Nama Kategori harus diisi"
          >
            <q-input
              stack-label="Nama Kategori"
              type="text"
              v-model="child.label"
              @blur="$v.child.label.$touch"
            />
          </q-field>
          <q-field>
            <q-select
              filter
              filter-placeholder="search store..."
              :popup-cover="false"
              v-model="child.id_merchant_store"
              stack-label="Select Store"
              :options="data.stores"
            />
          </q-field>
        </q-card-main>
        <q-card-actions align="end" class="bg-indigo-2">
          <q-btn
            text-color="white"
            color="primary"
            icon="save"
            label="simpan"
            @click="saveCategory"
          />
        </q-card-actions>
      </q-card>
    </q-modal>
    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Mohon tunggu...</span>
    </q-modal>
    <!-- stop of modal Add Product -->
  </div>
</template>

<script>
import { filter, find, findIndex, size, orderBy } from "lodash";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";

const role = "admin";
const resource = "productcategories";
const baseRoute = `/${role}/${resource}`;

export default {
  computed: {
    ...mapState(["userProductType"]),
    // hasAccessProduct() {
    //   if (this.userProductType === 2) {
    //     return true;
    //   }
    //   return false;
    // }
  },
  mounted() {
    this.data.stores = [];
    this.getData();
    this.data.cols_visible = ["id", "label_parent", "order", "label", "source"];
    // const stores = this.$axios.get(`/${this.resource}/stores`);
    // Object.assign(this.data, stores.data);
  },
  validations: {
    group: {
      label: { required }
    },
    child: {
      id_parent: { required },
      label: { required }
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
      categories: [
        {
          value: "",
          label: "Semua"
        }
      ],
      category: "",
      pagination: {
        sortBy: null,
        rowsPerPage: 10 // current rows per page being displayed
      },
      group: {
        id: "",
        label: ""
      },
      child: {
        id: "",
        id_parent: "",
        label: "",
        id_merchant_store: ""
      },
      categories2: [],
      data: {
        stores: [],
        result: [],
        loading: true,
        filter: "",
        cols_visible: ["id", "order", "label"],
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
            name: "order",
            label: "Order",
            align: "center",
            field: "order",
            sortable: true
          },
          {
            name: "label",
            label: "Kategori",
            align: "left",
            field: "label",
            sortable: true
          },
          {
            name: 'source',
            label: 'Source',
            align: 'left',
            field: 'merchant',
            sortable: false,
            classes: 'vertical-top'
          },
        ]
      }
    };
  },
  async created() {},
  methods: {

    newChild () {
      if (this.category) {
        this.child.id_parent = this.category
      }
      this.mdFormChild = true
    },
    hideMdGroup() {
      this.group.id = "";
      this.group.label = "";
      this.$v.group.$reset();
    },
    editGroup() {
      if (this.category) {
        this.group.id = this.category;
        this.group.label = this.categories.find(
          row => row.value === this.category
        ).label;
        this.$refs.mdFormGroup.show();
      }
    },
    async getGroup() {
      try {
        const data = await this.$axios.get(`/${this.resource}/group`);
        const all = {
          value: "",
          label: "Semua"
        }
        this.categories = [all, ...data.data.categories];
        this.categories2 = data.data.categories;
      } catch (e) {
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
        }
      }
    },
    async getData() {
      this.data.loading = true;
      try {
        this.data.result = []
        this.data.stores = []
        const id = this.category ? this.category : ''
        const { data } = await this.$axios.get(`/${this.resource}/${id}`);
        const stores = await this.$axios.get(`/${this.resource}/stores`);
        this.data.loading = false;
        this.data.result = data.categories;
        this.data.stores = stores.data.stores;
      } catch (e) {
        this.data.loading = false;
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
        }
      }
    },
    async saveGroup() {
      await this.$refs.mdLoading.show()
      try {
        if (this.group.id) {
          await this.$axios.put(`/${this.resource}/group/${this.group.id}`, this.group);
          await this.getGroup();
          await this.getData();
          await this.$refs.mdLoading.hide();
          await this.$refs.mdFormGroup.hide();
          await this.alert("success", "Ubah Grup Sukses");
        } else {
          await this.$axios.post(`/${this.resource}/group`, this.group);
          await this.getGroup();
          await this.$refs.mdLoading.hide();
          await this.$refs.mdFormGroup.hide();
          await this.alert("success", "Buat Grup Baru Sukses");
        }
      } catch (e) {
        await this.$refs.mdLoading.hide();
        if (e.response) {
          await this.alert("error", e.response.data);
        } else {
          await this.alert("Tidak ada koneksi internet");
        }
      }
    },
    doEdit(dataEdit) {
      this.child.id = dataEdit.row.id;
      this.child.id_parent = dataEdit.row.id_parent;
      this.child.label = dataEdit.row.label;
      this.child.id_merchant_store = dataEdit.row.id_merchant_store;
      this.$refs.mdChild.show();
    },
    doDelete (id) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Delete this data?',
        ok: 'YES',
        cancel: 'NO'
      }).then(() => {
          this.$refs.mdLoading.show();
        if (id) {
          this.$axios.delete(`${this.resource}/${id}`)
          .then(resp => {
            this.data.loading = true;
            this.getData();
            this.$refs.mdLoading.hide();
            this.alert("success", "Hapus Kategori Sukses");
          })
          .catch(() => {
            this.errorMsg(true);
            // this.alert("error", "Kategori tidak jadi di hapus");
          })
        }
      }).catch(() => {
        this.alert("error", "Kategori tidak jadi di hapus");
      })
    },
    hideChild() {
      this.child.id = "";
      this.child.id_parent = "";
      this.child.label = "";
      this.child.id_merchant_store = "";
      this.$v.child.$reset();
    },
    async saveCategory() {
      await this.$refs.mdLoading.show()
      try {
        if (this.child.id) {
          await this.$axios.put(`/${this.resource}/${this.child.id}`, this.child);
          await this.getData();
          await this.$refs.mdLoading.hide()
          await this.$refs.mdChild.hide();
          await this.alert("success", "Ubah Kategori Sukses");
        } else {
          await this.$axios.post(`/${this.resource}`, this.child);
          await this.getData();
          await this.$refs.mdLoading.hide()
          await this.$refs.mdChild.hide();
          await this.alert("success", "Buat Kategori Baru Sukses");
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
    async setOrder (id, val) {
      const idx = id ? id : "";
      // this.$refs.mdLoading.show();
      // this.dt.loading=true
      try{
        await this.$axios.put(`/${this.resource}/order/${idx}`, {order:val});
        this.getData();
        // this.$refs.mdLoading.hide();
        // this.dt.loading=false
        await this.alert("success", "Set Order Sukses");
      } catch (e) {
        // this.$refs.mdLoading.hide();
        // this.dt.loading=false
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
