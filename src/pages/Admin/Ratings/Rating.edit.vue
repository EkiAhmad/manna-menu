<template>
  <div class="users-edit">
    <q-card>
      <q-card-title>Rating</q-card-title>
      <q-card-main>
        <q-field
          :error="$v.data.category.$error && !$v.data.category.$required"
          error-label="Category Name can't be empty"
        >
          <q-input
            @blur="$v.data.category.$touch"
            stack-label="Category Name"
            v-model.trim="data.category"
          />
        </q-field>
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
const resource = "ratings";
const baseRoute = `/${role}/${resource}`;

export default {
  created() {
    
  },
  async mounted() {

    await this.$refs.mdLoading.show();

    let [ratings] = [null, null, null];

    try {
      if (this.$route.params.id) {
        const _ratings = await this.$axios.get(
          `/${resource}/${this.$route.params.id}`
        );
        if (size(_ratings.data)) {
          Object.assign(this.data, _ratings.data);
        }
      }

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
          category: { required }
        }
      };
    } else {
      return {
        data: {
          category: { required }
        }
      };
    }
  },
  data() {
    return {
      baseRoute,
      today: null,
      edit: false,
      loading: false,
      resource,
      sources: [],
      data: {
        category: ""
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
    async save() {
      try {
        await this.$refs.mdLoading.show();
        if (this.$route.params.id) {
          const id = this.$route.params.id;
          const resp = await this.$axios.put(
            `/${this.resource}/${id}`,
            this.data
          );
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Update Rating Success");
        } else {
          const resp = await this.$axios.post(`/${this.resource}`, this.data);
          await this.$refs.mdLoading.hide();
          await this.alert("success", "Create Rating Success");
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
</style>
