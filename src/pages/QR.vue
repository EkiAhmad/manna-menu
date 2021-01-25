<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="row justify-center">
        <div class="row justify-center">
          <div class="col">
            <div v-if="loaded && !qr.url" class="text-center q-title q-pt-none">URL Alias not set!</div>
            <q-card style="width:300px" v-else>
              <q-card-media>
                <vue-qr :correctLevel="2" :logoSrc="'statics/logo-manna.png'" :text="qr.url" :size="300"></vue-qr>
              </q-card-media>
              <q-card-main class="text-center q-pt-none">
                <p class="text-faded q-mb-xs"><strong>{{qr.store}}</strong></p>
                <q-chip detail square dense icon="public">{{qr.url}}</q-chip>
              </q-card-main>
            </q-card>
          </div>
        </div>
        <q-modal v-model="loading" ref="mdLoading" minimized :content-css="{padding: '10px'}">
          <q-spinner :size="30"/><span style="margin-left:15px">Please wait...</span>
        </q-modal>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import VueQr from 'vue-qr'

export default {
  components: {
    VueQr,
  },
  data () {
    return {
      loading:false,
      loaded:false,
      qr: {
        url:'',
        store:''
      }
    }
  },
  async mounted () {
    await this.getQR()
  },
  methods: {
    async getQR(loading) {
      if (this.$route.params.id) {
        try {
          await this.$refs.mdLoading.show()
          const {data} =  await this.$axios.get('stores/'+this.$route.params.id)
          this.qr.store = data.name
          this.qr.url = data.url
          await this.$refs.mdLoading.hide()
          this.loaded=true
        } catch(e) {
          await this.$refs.mdLoading.hide()
          if (e.response) {
            await this.alert("error", e.response.data)
          } else {
            await this.alert("error", "No Internet Connection")
          }
          this.tbStores.store = ''
          this.tbStores.qrValue = ''
          this.loaded=true
        }
      }
    },
    alert(type, msg) {
      this.$q.notify({
        message: msg,
        position: 'bottom',
        type: type==='success'?'positive':'negative',
        timeout: 1500
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-examples
  .q-card
    width 300px
  .bigger
    width 450px
    max-width 90vw
  @media (max-width $breakpoint-xs-max)
    .q-card
      width 100%
</style>
