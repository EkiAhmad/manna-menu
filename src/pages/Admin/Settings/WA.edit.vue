<template>
  <div class="products-edit">
    <q-card>
      <q-card-title>Store WhatsApp Notification</q-card-title>
      <q-card-main>
        <q-field>
          <q-datetime v-model="data.sent_time" type="time" format24h stack-label="Sent Time" />
        </q-field>
        <q-field class="q-mt-lg">
          <q-input
            v-model.trim="data.messages"
            type="textarea"
            stack-label="Messages"
            :max-height="100"
            rows="4"
          />
        </q-field>
        <q-field class="q-mt-lg">
          <p class="q-caption text-faded">Status</p>
          <q-toggle v-model="data.active" true-value="1" false-value="0" :label="statusLabel" />
        </q-field>
      </q-card-main>
    </q-card>
    <q-card class="q-mt-md q-mx-xs" color="blue-2">
      <q-card-actions align="end">
        <q-btn color="primary" icon="save" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30" />
      <span style="margin-left:15px">Please wait...</span>
    </q-modal>
  </div>
</template>

<script>
import { date, uid } from "quasar";
import { size } from "lodash";

const role = "admin";
const resource = "settings";

export default {
  created() {
    this.data.sent_time = date.adjustDate(new Date(), { hours: 1, minutes:0 })
  },
  async mounted() {
    try {
      await this.$refs.mdLoading.show();
      let { data } = await this.$axios.get(
        `/${this.resource}/wa_notif_store`
      );
      if (data.settings) {
        const content = JSON.parse(data.settings.content)
        if (content) {
          this.data.sent_time = content.sent_time
          if (content.messages) {
            this.data.messages = content.messages
          }
        }
        this.data.active = data.settings.active
      }
      await this.$refs.mdLoading.hide();
    } catch (e) {
      await this.$refs.mdLoading.hide();
      if (e.response) {
        await this.alert("error", e.response.data);
      } else {
        await this.alert("error", "Load data failed, contact administrator");
      }
    }
  },
  computed: {
    statusLabel() {
      if (this.data.active === "1") {
        return "Active"
      }
      return "Not Active"
    }
  },
  data() {
    return {
      today: null,
      edit: false,
      loading: false,
      resource,
      sources: [],
      data: {
        messages: "",
        sent_time: null,
        active: "1"
      },
    };
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
        const resp = await this.$axios.post(`/${this.resource}/wa_notif_store`, this.data);
        await this.$refs.mdLoading.hide();
        await this.alert('success', 'Update Data Success')
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
.q-table-container.merchant-stores >>> .q-table-top {
  padding-left: 16px !important;
}
</style>
