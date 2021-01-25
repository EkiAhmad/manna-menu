<template>
<div class="row">
  <q-card inline style="width:375px;max-width:90vw;">
    <q-card-title class="bg-secondary text-white">
      <strong>Sales Report</strong>
      <span slot="subtitle" class="text-grey-2">Send sales summary to WhatsApp</span>
      <q-icon slot="right" class="text-warning" name="phonelink_ring" />
    </q-card-title>
    <q-card-main class="q-pb-md">
      <q-field class="q-mt-md" :error="$v.phone.$error" error-label="Invalid phone number">
        <q-input @blur="$v.phone.$touch" v-model.trim="phone" stack-label="Phone Number" />
      </q-field>
    </q-card-main>
    <q-card-actions align="end">
      <q-btn :disable="!sending && $v.phone.$invalid" :loading="sending" class="q-mb-xs full-width" color="tertiary" icon-right="send" @click="send">
        Send
        <span slot="loading">
          <q-spinner class="on-left" />Sending...
        </span>
      </q-btn>
    </q-card-actions>
  </q-card>
</div>
</template>

<script>

import { required, numeric } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      phone: '',
      sending: false
    }
  },
  validations: {
    phone: {required, numeric }
  },
  methods: {
    async send () {
      this.sending = true
      try {
        const {data} = await this.$axios.get(`/test/wa?phone=${this.phone}`)
        this.sending = false
        await this.alert("success", "Report sales sent successfully")
      } catch(e) {
        this.sending=false
        if (e.response) {
          await this.alert("error", e.response.data)
        } else {
          await this.alert("error", "No Internet Connection")
        }
      }
    },
    alert (type, msg) {
      this.$q.notify({
        message: msg,
        position: 'top',
        type: type==='success'?'positive':'negative',
        timeout: 1500
      })
    },
  }
}
</script>

<style>

.icon-big {
 font-size:3rem;
}

.stat h4, .stat h5  {
 margin:0;
}

.stat h4 {
 font-weight: bold;
}

</style>
