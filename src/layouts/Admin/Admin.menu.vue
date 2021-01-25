<template>
  <div class="column">
    <q-list no-border class="bg-grey-2 q-pt-none" style="height:100vh">
      <!-- <q-list-header class="bg-primary" style="height:50px !important">
        <img alt="Surprize logo" src="statics/logo-dashboard.png" />
      </q-list-header> -->

      <q-item link to="/admin/dashboard" class="q-mt-md">
        <q-item-side color="primary" icon="dashboard" />
        <q-item-main label="Dashboard" />
      </q-item>
      <q-item-separator inset class="bg-primary" />
      <q-item link to="/admin/merchants/">
        <q-item-side color="primary" icon="store" />
        <q-item-main label="Merchant" />
      </q-item>
      <q-item link to="/admin/stores/">
        <q-item-side color="primary" />
        <q-item-main label="Store" />
      </q-item>
      <!-- <q-item link to="/admin/suppliers/">
        <q-item-side color="primary" icon="local_shipping" />
        <q-item-main label="Supplier" />
      </q-item> -->
      <q-item link to="/admin/products/">
        <q-item-side color="primary" icon="fastfood" />
        <q-item-main label="Product" />
      </q-item>
      <q-item link to="/admin/product-categories/">
        <q-item-side color="primary" />
        <q-item-main label="Kategori Produk" />
      </q-item>
      <q-item link to="/admin/ratings/">
        <q-item-side color="primary" icon="star" />
        <q-item-main label="Ratings" />
      </q-item>
      <q-item link to="/admin/promosurprise/">
        <q-item-side color="primary" />
        <q-item-main label="Promo Surprize" />
      </q-item>
      <q-item link to="/admin/historysurprize/">
        <q-item-side color="primary" />
        <q-item-main label="History Member Surprize" />
      </q-item>
      <!-- <q-item link to="/admin/lotteries/">
        <q-item-side color="primary" icon="monetization_on" />
        <q-item-main label="Lottery" />
      </q-item>
      <q-item link to="/admin/product-categories/">
        <q-item-side color="primary" />
        <q-item-main label="Product Category" />
      </q-item>-->
      <!-- <q-item-separator inset class="bg-primary" />
      <q-item>
        <q-item-side color="primary" icon="assessment" />
        <q-item-main label="Report" />
      </q-item>
      <q-item link to="/admin/transactions/">
        <q-item-side color="primary" />
        <q-item-main label="Sales" />
      </q-item>
      <q-item link to="/admin/transactions-product/">
        <q-item-side color="primary" />
        <q-item-main label="Product Sales" />
      </q-item>
      <q-item-separator inset class="bg-primary" />
      <q-item>
        <q-item-side color="primary" icon="settings" />
        <q-item-main label="Settings" />
      </q-item>
      <q-item link to="/admin/settings/wa">
        <q-item-side color="primary" />
        <q-item-main label="WA Notification" />
      </q-item>
      <q-item link to="/admin/tax/">
        <q-item-side color="primary" />
        <q-item-main label="Tax" />
      </q-item> -->
      <q-item-separator inset class="bg-primary" />
      <q-item>
        <q-item-side color="primary" icon="attach_money" />
        <q-item-main label="Point" />
      </q-item>
      <q-item link to="/admin/level/">
        <q-item-side color="primary" />
        <q-item-main label="Level Loyalty" />
      </q-item>
      <q-item link to="/admin/point/">
        <q-item-side color="primary" />
        <q-item-main label="Request Redeem Point" />
      </q-item>
      <q-item link to="/admin/history-point/">
        <q-item-side color="primary" />
        <q-item-main label="History Point" />
      </q-item>
      <q-item link to="/admin/reset/">
        <q-item-side color="primary" />
        <q-item-main label="Reset Level Loyalty" />
      </q-item>
      <!-- x-next-menu -->
    </q-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { date } from "quasar";

let nowday = Date.now();
export default {
  data() {
    return {
      test: "OK",
      nowday: Date.now(),
      footer: ""
    };
  },
  created() {
    this.footer = date.formatDate(nowday, "YYYY") + ", The-Netwerk";
    console.log(this.footer);
  },
  computed: {
    ...mapState(["role", "eksternal", "peneliti", "kegiatan", "internal"])
  }
};
</script>

<style scoped>
.q-list >>> .q-item.router-link-active {
  background-color: #f8d531 !important;
}
</style>
