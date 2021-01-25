<template>
  <div class="admin_categories-edit">
    <q-card>
      <q-card-main>
        <div class="col-12 q-pb-md">
              <q-uploader
                :method="method"
                @uploaded="importSuccess"
                @fail="importFail"
                :url="url"
                ref="promoImage"
                hide-upload-progress
                extensions=".jpg,.jpeg,.png"
                hide-upload-button
                auto-expand
                stack-label="Gambar Produk"
                :additional-fields="uploadAdditional()"
                :headers="uploadHeaders()"
              />

              <div class="row q-mt-sm">
                <div v-if="promoImage" class="col-xs-12 col-sm-6">
                  <p class="q-caption" style="color:#979797">Pilih gambar baru untuk mengubah gambar lama</p>
                </div>
                <div :class="promoImage?'col-xs-12 col-sm-6':'col-xs-12'">
                  <p class="q-caption">
                    Format gambar: JPEG, JPG, or PNG
                    <br />Ukuran gambar maksimal: 500kb
                  </p>
                </div>
              </div>

              <q-card v-if="promoImage" style="width:150px;">
                <q-card-media>
                  <img :src="promoImage" style="height: auto; width:150px;"/>
                </q-card-media>
              </q-card>
            </div>
        <div class="col-xs-6">
          <q-field
            :error="$v.data.link.$error && !$v.data.link.$required"
            error-label="Link can't be empty"
          >
            <q-input
              @blur="$v.data.link.$touch"
              stack-label="Link"
              v-model.trim="data.link"
            />

          </q-field>
        </div>
        <div class="col-xs-12">
          <q-field>
            <q-select
              filter
              filter-placeholder="search..."
              :popup-cover="false"
              v-model="data.id_merchant_store"
              stack-label="Pilih Store"
              :options="store"
            />
          </q-field>
        </div>
        <div class="col-xs-12">
          <q-field>
            <q-input stack-label="Deskripsi Pendek" v-model.trim="data.desc" />
          </q-field>
        </div>
      </q-card-main>
    </q-card>
    <q-card class="q-mt-md" color="indigo-2">
      <q-card-actions align="end">
        <q-btn color="faded" icon="cancel" @click="$router.replace(`${baseRoute}/list`)">Cancel</q-btn>
        <q-btn color="primary" icon="save" :disable="$v.data.$invalid" @click="save">Save</q-btn>
      </q-card-actions>
      <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
    </q-card>

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
const resource = "promosurprise";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    if (this.$route.params.id) {
      this.url = `${this.$axios.defaults.baseURL}/${resource}/${this.$route.params.id}`;
    }
  },
  async mounted() {
    await this.$refs.mdLoading.show();
    const _store = this.$axios.get(`/${this.resource}/store`);
    let [store, promosurprise] = [null, null];
    try {
      
      if (this.$route.params.id) {
        const _promosurprise = await this.$axios.get(
          `/${resource}/${this.$route.params.id}`
        );
        if (_promosurprise.data.image) {
          this.promoImage = _promosurprise.data.image;
        }
        if (size(_promosurprise.data)) {
          [store, promosurprise] = await Promise.all([_store, _promosurprise]);

          Object.assign(this.data, promosurprise.data);
        console.log(promosurprise.data)

        }
      }else {
        [store] = await Promise.all([_store]);
      }
      this.store = store.data.store;

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
          link: { required }
        }
      };
    } else {
      return {
        data: {
          link: { required }
        }
      };
    }
  },
  data() {
    return {
      baseRoute,
      url: `${this.$axios.defaults.baseURL}/${resource}`,
      today: null,
      edit: false,
      loading: false,
      isUpload: false,
      uploadData: null,
      fileData: null,
      uploadProcess: false,
      resource,
      sources: [],
      method: "POST",
      promoImage: "",
      store: [],
      data: {
        link: "",
        desc: "",
        id_merchant_store: "",
      }
    }
  },
  methods: {
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
        await this.alert("success", "Ubah Promo Surprize Sukses");
      } else {
        await this.alert("success", "Buat Promo Surprize Baru Sukses");
      }
      this.$router.replace(`${this.baseRoute}/list`);
    },
    async importFail(file, xhr) {
      await this.$refs.mdLoading.hide();
      if (xhr.response) {
        const errMsg = JSON.parse(xhr.response);
        await this.alert("error", errMsg.message);
      } else {
        await this.alert("error", "Tidak ada koneksi internet");
      }
    },
    async save() {
      try {
        await this.$refs.mdLoading.show();
        if (this.$route.params.id) {
          if (!this.$refs.promoImage.files.length) {
            const id = this.$route.params.id;
            const resp = await this.$axios.post(
              `/${this.resource}/${id}`,
              this.data
            );
            await this.$refs.mdLoading.hide();
            await this.alert("success", "Update Promo Surprize Success");
          } else {
            await this.$refs.promoImage.upload();
          }
        } else {
          if (!this.$refs.promoImage.files.length) {
            const resp = await this.$axios.post(`/${this.resource}`, this.data);
            await this.$refs.mdLoading.hide();
            await this.alert("success", "Create Promo Surprize Success");
          } else {
            await this.$refs.promoImage.upload();
          }
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
    }
  }

};
</script>

<style scoped>
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
