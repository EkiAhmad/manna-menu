<template>
  <q-layout ref="layout" class="flex row justify-center full-height">
    <div class="flex column items-center">
      <h1>Welcome to ASIK!</h1>
      <div class="flex row  justify-center">
        <q-card style="max-width:300px" class="q-ma-sm" v-for="role in roles" :key="role.route">
          <q-card-main class="stat flex column items-center">
            <q-icon name="face" class="icon-big"/>
            <h5>{{ role.title }}</h5>
            <q-btn
              dense
              color="primary"
              size="20px"
              label="Lets GO!"
              @click="$router.push(role.route)"
              />
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-layout>
</template>

<script>

const availableRoles = [
  {
    title: 'Admin',
    role: 'admin',
    route: '/admin'
  },
  {
    title: 'User',
    role: 'user',
    route: '/user'
  } /* next role definition */
]

export default {
  created () {
    this.roles = availableRoles.filter(i => {
      return this.$store.state.roles.indexOf(i.role) > -1
    })
  },
  data () {
    return {
      roles: []
    }
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
