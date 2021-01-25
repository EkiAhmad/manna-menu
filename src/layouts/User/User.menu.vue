<template>
  <div class="user-menu">
    <q-list
      no-border
      link
      inset-delimiter
      >
      <q-list-header>Features</q-list-header>
      <q-item to="/user/dashboard">
        <q-item-side icon="home" />
        <q-item-main label="Home" sublabel="User Dashboard" />
      </q-item>
      <!-- x-next-menu -->
    </q-list>
  </div>
</template>

<script>

export default {
}
</script>

<style  scoped>

</style>
