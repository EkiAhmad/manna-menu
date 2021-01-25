<template>
  <q-layout ref="layout" class="row bg-warning justify-center items-center">
    <q-card color="grey-3" inline style="width: 300px">
      <q-card-title>
        <img src="statics/logo.png" />
        <span slot="subtitle" class="text-dark">Sign in to your account</span>
      </q-card-title>
      <q-card-separator />
      <q-card-main class="q-pa-none">
        <q-list no-border>
          <q-item>
            <q-item-main>
              <q-field :error="$v.email.$error" error-label="Invalid Email">
                <q-input inverted color="secondary" v-model="email" stack-label="Email" @blur="$v.email.$touch" placeholder="type email here..." :after="[{icon: 'warning', error: true, handler () {}}]"/>
              </q-field>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-field :error="$v.password.$error" error-label="Password can't be empty">
                <q-input inverted color="secondary" v-model="password" type="password" stack-label="Password" @blur="$v.password.$touch" placeholder="type password here..." :after="[{icon: 'warning', error: true, handler () {}}]" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn :loading="loading" color="primary" class="full-width" @click="doLogin()">Login</q-btn>
      </q-card-actions>
    </q-card>
  </q-layout>
</template>

<script>

import types from 'src/store/types'
import { required, email } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      keepMeLogin: false,
      email: '',
      password: '',
      loading: false
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    doLogin () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      //this.$router.replace('/admin/dashboard')
      const { email, password, keepMeLogin } = this

      const strategy = 'local'

      const dataLogin = {
        email,
        password,
        strategy,
        keep: keepMeLogin
      }
      this.loading = true
      this
        .$store
        .dispatch(types.DO_LOGIN, dataLogin, {root: true})
        .catch(err => {
          this.loading = false
          this.$q.notify({
            message: 'Login failed',
            position: 'top',
            type: 'negative'
          })
        })
    }
  }
}
</script>

<style scoped>
.login-bg {
  background-color: #ec6b61 !important;
}
</style>
