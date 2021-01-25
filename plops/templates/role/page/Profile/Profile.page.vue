<template>
  <div class="flex column">
    <h3 class="q-ma-none q-mb-md">My Profile</h3>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="q-mr-md">
          <q-card-media class="q-pa-md">
            <img :src="profilePicture">
          </q-card-media>
          <q-card-title>
            \{{ profile.fullName }}
          </q-card-title>
          <q-card-main>
            <p>\{{ profile.phoneNumber }}</p>
            <q-btn @click="updateProfile" color="primary" label="Update Profile" class="full-width"></q-btn>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-9">
        <q-tabs>
          <q-tab default slot="title" name="my-profile" icon="contact mail" label="My Profile"/>
          <q-tab slot="title" name="change-password" icon="phonelink lock" label="Change Password" />

          <q-tab-pane name="my-profile">
            <q-list>
              <q-list-header>
                \{{ $t('myPersonalInfo') }}
              </q-list-header>
              <q-item-separator/>
              <q-item>
                <q-item-main>
                  <q-uploader
                    :url="url"
                    :stack-label="$t('profilePicture')"
                    :hide-upload-button="true"
                    :auto-expand="true"
                    :multiple="false"
                    @add="pickProfilePicture"
                    @uploaded="profilePictureUploaded"
                    @fail="profilePictureUploadFail"
                    ref="profilePictureUploader"
                    />
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-field
                    :error="$v.profile.fullName.$error"
                    :error-label="$t('fieldRequired', { name: $t('fullName') })"
                    >
                    <q-input class="q-mb-md"
                             v-model="profile.fullName"
                             :stack-label="$t('fullName')"
                             @blur="$v.profile.fullName.$touch"
                             />
                  </q-field>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-input v-model="profile.phoneNumber" :stack-label="$t('phoneNumber')"></q-input>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-input v-model="profile.address" :stack-label="$t('address')"></q-input>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-input v-model="profile.city" :stack-label="$t('city')"></q-input>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-input v-model="profile.province" :stack-label="$t('province')"></q-input>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-input v-model="profile.country" :stack-label="$t('country')"></q-input>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-input v-model="profile.postalCode" :stack-label="$t('postalCode')"></q-input>
                </q-item-main>
              </q-item>
            </q-list>
          </q-tab-pane>
          <q-tab-pane name="change-password">
            <q-list>
              <q-list-header>
                \{{ $t('changePassword')}}
              </q-list-header>
              <q-item-separator/>
              <q-item>
                <q-item-main>
                  <q-field
                    :error="$v.cp.oldPassword.$error"
                    :error-label="$t('fieldRequired', { name: $t('oldPassword') })"
                    >
                    <q-input
                      v-model="cp.oldPassword"
                      type="password"
                      name="oldPassword"
                      :stack-label="$t('oldPassword')"
                      @blur="$v.cp.oldPassword.$touch"
                      />
                  </q-field>
                </q-item-main>
              </q-item>
              <q-item-separator/>
              <q-item>
                <q-item-main>
                  <q-field
                    :error="$v.cp.newPassword.$error"
                    :error-label="$t('fieldRequired', { name: $t('newPassword') })"
                    >
                    <q-input
                      v-model="cp.newPassword"
                      type="password"
                      name="newPassword"
                    :stack-label="$t('newPassword')"
                    @blur="$v.cp.newPassword.$touch"
                    />
                  </q-field>
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-main>
                  <q-field
                    :error="$v.cp.reNewPassword.$error"
                    :error-label="$t('notSame', { name: $t('newPassword') })"
                    >
                    <q-input
                      v-model="cp.reNewPassword"
                      type="password"
                      name="reNewPassword"
                      :stack-label="$t('reNewPassword')"
                      @blur="$v.cp.reNewPassword.$touch"
                      />
                  </q-field>
                </q-item-main>
              </q-item>
              <q-item class="justify-end">
                <q-btn @click="changePassword" color="primary" label="Change Password"></q-btn>
              </q-item>
            </q-list>
          </q-tab-pane>
        </q-tabs>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { required, sameAs } from 'vuelidate/lib/validators'
import types from 'store/types'
import { mapActions } from 'vuex'

export default {
  beforeCreate () {
    console.log('before create')
    axios
      .get(`account/profile/${this.$store.state.userId}`)
      .then(resp => {
        this.profile = resp.data
        this.profilePicture = this.profile.profilePicture ? `${axios.defaults.baseURL}/uploads/profile-pictures/${this.profile.profilePicture}` : 'assets/placeholder-pp.png'
      })
  },
  validations: {
    profile: {
      fullName: { required }
    },
    cp: {
      oldPassword: {
        required
      },
      newPassword: {
        required
      },
      reNewPassword: {
        sameAsPassword: sameAs('newPassword')
      }
    }
  },
  data () {
    return {
      url: `${axios.defaults.baseURL}/profile-pictures`,
      profilePicture: '',
      profile: {},
      selectedFiles: 0,
      cp: {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      }
    }
  },
  methods: {
    ...mapActions({
      doLogout: types.DO_LOGOUT
    }),
    pickProfilePicture (files) {
      console.log(files)
      this.selectedFiles = files.length
    },
    updateProfile () {
      this.$v.profile.$touch()
      if (this.$v.profile.$error) {
        this.$q.notify({
          message: this.$t('checkEntries'),
          position: 'top',
          type: 'negative'
        })
        return
      }

      if (this.selectedFiles) {
        this.$refs.profilePictureUploader.upload()
      } else {
        this.patchData()
      }
    },
    profilePictureUploaded (result) {
      const resp = JSON.parse(result.xhr.responseText)
      this.profile.profilePicture = resp.id
      this.patchData()
    },
    profilePictureUploadFail (result) {
      console.log(result.xhr.responseText)
      this.$q.notify({
        message: this.$t('generalError', { name: `Update ${this.$t('profilePicture')}` }),
        position: 'top',
        type: 'negative'
      })
    },
    patchData () {
      axios
        .patch(`account/profile/${this.$store.state.userId}`, this.profile)
        .then(resp => {
          this.profile = resp.data
          this.profilePicture = this.profile.profilePicture ? `${axios.defaults.baseURL}/uploads/profile-pictures/${this.profile.profilePicture}` : 'assets/placeholder-pp.png'
          this.$refs.profilePictureUploader.reset()
          this.$q.notify({
            message: this.$t('generalSuccess', {name: `Update ${this.$t('profile')}`}),
            position: 'top',
            type: 'positive'
          })
        })
        .catch(err => {
          console.log(err)
          this.$q.notify({
            message: this.$t('generalError', { name: `Update ${this.$t('profile')}` }),
            position: 'top',
            type: 'negative'
          })
        })
    },
    changePassword () {
      this.$v.cp.$touch()
      if (this.$v.cp.$error) {
        this.$q.notify({
          message: this.$t('checkEntries'),
          position: 'top',
          type: 'negative'
        })
        return
      }

      axios
        .post(`account/change-password`, {
          oldPassword: this.cp.oldPassword,
          password: this.cp.newPassword
        })
        .then(resp => {
          this.cp.oldPassword = ''
          this.cp.newPassword = ''
          this.cp.reNewPassword = ''
          this.$q.notify({
            message: this.$t('generalSuccess', {name: `${this.$t('changePassword')}`}),
            position: 'top',
            type: 'positive'
          })

          this.doLogout()
        })
        .catch(err => {
          console.log(err)
          this.$q.notify({
            message: this.$t('generalError', { name: this.$t('changePassword') }),
            position: 'top',
            type: 'negative'
          })
        })
    }
  }
}
</script>

<style>
.q-if-has-label {
  min-height: 61px;
}

.cp-pic {
  display: block;
  width: 200px;
  height: 200px;
}
</style>
