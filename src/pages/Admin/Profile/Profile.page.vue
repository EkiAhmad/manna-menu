<template>
  <div class="users-edit">
    <h4 class="q-my-md">My Profile</h4>
    <q-card class="q-mb-sm" flat color="blue-grey-1">
      <q-card-actions align="end">
        <q-btn color="primary" :disable="$v.data.$invalid" @click="save">Update</q-btn>
      </q-card-actions>
    </q-card>
    <div class="row gutter-x-sm">
      <div class="col-xs-12 col-sm-4">
        <q-card>
          <q-card-media>
            <img :src="userPhotos">
          </q-card-media>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-8">
        <q-card>
          <q-card-main>
            <q-uploader :url="url" ref="profileImage" hide-upload-progress @remove:cancel="removeImage" @add="addImage" extensions=".jpg,.jpeg,.png" hide-upload-button auto-expand stack-label="Foto" />
            
            <div class="q-mt-md">
              <q-input @blur="$v.data.user_fullname.$touch" stack-label="Nama Lengkap" v-model.trim="data.user_fullname" />
              <span class="form-group-error" v-if="$v.data.user_fullname.$error && !$v.data.user_fullname.required">Nama Lengkap harus diisi</span>
            </div>
            
            <div class="q-mt-md">
              <q-input @blur="$v.data.user_email.$touch" stack-label="Email" v-model.trim="data.user_email" />
              <span class="form-group-error" v-if="$v.data.user_email.$error && (!$v.data.user_email.required || !$v.data.user_email.email)">Format email salah</span>
            </div>
                        
          </q-card-main>
        </q-card>
        <q-card class="q-mt-sm">
          <q-card-title class="q-caption text-faded">Ubah Password</q-card-title>
          <q-card-main>
            <q-input @blur="$v.data.user_oldpassword.$touch" type="password" stack-label="Password Lama" v-model.trim="data.user_oldpassword" />
            <span class="form-group-error" v-if="$v.data.user_password.$error && !$v.data.user_oldpassword.isRequired">Password lama harus diisi</span>
            <span class="form-group-error" v-if="$v.data.user_password.$error && $v.data.user_oldpassword.isRequired && !$v.data.user_oldpassword.minLength">Password lama min. 6 karakter</span>
            <div class="q-mt-md">
              <q-input @blur="$v.data.user_password.$touch" type="password" stack-label="Password Baru" v-model.trim="data.user_password" />
              <span class="form-group-error" v-if="$v.data.user_password.$error && !$v.data.user_password.isRequired">Password baru harus diisi</span>
              <span class="form-group-error" v-if="$v.data.user_password.$error && $v.data.user_password.isRequired && !$v.data.user_password.minLength">Password baru min. 6 karakter</span>
            </div>
            <div class="q-mt-md">
              <q-input @blur="$v.data.repeatPassword.$touch" type="password" stack-label="Ulangi Password Baru" v-model.trim="data.repeatPassword" />
              <span class="form-group-error" v-if="$v.data.repeatPassword.$error && !$v.data.repeatPassword.sameAsPassword">Password baru tidak sama</span>
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <q-card class="q-mt-sm" color="blue-grey-1">
      <q-card-actions align="end">
        <q-btn color="primary" :disable="$v.data.$invalid" @click="save">Update</q-btn>
      </q-card-actions>
    </q-card>
    <q-modal v-model="loading" ref="modalLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30"/><span style="margin-left:15px">Update data...</span>
    </q-modal>
  </div>
</template>

<script>

import { filter, find, findIndex, size, cloneDeep, orderBy } from 'lodash'
import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'

const role = 'admin'
const resource = 'users'
const baseRoute = `/${role}/${resource}`

export default {
  created() {
    //this.$axios(`/productsource/select`)
      //.then(({data}) => {
        //this.sources = data.data
      //})
      //.catch(() => {
      //})
    //this.$axios(`/kepakaran/select`)
      //.then(({data}) => {
        //this.pakar = data.data
      //})
      //.catch(() => {
      //})
    //this.$axios(`/pangkat/select`)
      //.then(({data}) => {
        //this.pangkat = data.data
      //})
      //.catch(() => {
      //})
  },
  mounted () {
    this.$axios.get(`${this.resource}/myprofile`)
    .then(({data}) => {
      if (size(data.data)) {
        this.data = data.data
      }
    })
    .catch(() => {
      this.errorGet()
    })
  },
  validations() {
    {
      return {
        data:{
          user_fullname:{ required },
          user_email: {required, email },
          user_password: {
            isRequired() {
              if (this.data.user_password || this.data.user_oldpassword || this.data.repeatPassword) {
                if (this.data.user_password) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            },
            minLength: minLength(6)
          },
          user_oldpassword: {
            isRequired() {
              if (this.data.user_password || this.data.user_oldpassword || this.data.repeatPassword) {
                if (this.data.user_oldpassword) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            },
            minLength: minLength(6)
          },
          repeatPassword: {
            sameAsPassword: sameAs('user_password')
          }
        }
      }
    }
  },
  computed: {
    ...mapState(['userId']),
    userPhotos() {
      if (this.data.user_photo) {
        const url = this.$axios.defaults.baseURL.replace("/index.php","")
        return `${url}/uploads/${this.data.user_photo}`
      }
      else {
        return 'statics/profile-default.png'
      }
    },
    statusLabel() {
      if (this.data.status === '1') {
        return 'Aktif'
      }
      else {
        return 'Tidak Aktif'
      }
    },
    statusYesNo() {
      if (this.data.user_peneliti === '1') {
        return 'Ya'
      }
      else {
        return 'Tidak'
      }
    }
  },
  data () {
    return {
      baseRoute,
      resource,
      url: `${this.$axios.defaults.baseURL}/upload/user`,
      sources:[],
      pangkat:[],
      pakar:[],
      isEdit:false,
      loading:false,
      isUpload:false,
      uploadData:null,
      fileData:null,
      uploadProcess:false,
      data: {
        user_fullname: '',
        user_photo:null,
        user_email:'',
        user_password: '',
        user_oldpassword: '',
        repeatPassword:'',
      }
    }
  },
  methods: {
    addImage(file) {
      console.log(file)
      this.isUpload = true
    },
    removeImage() {
      console.log('masuk')
      this.isUpload=false
    },
    errorGet() {
      this.$q.dialog({
        title: 'Error',
        message: 'Unknown request data',
        cancel: false,
        preventClose: true,
      }).then(() => {
        this.$router.replace(`${this.baseRoute}/list`)
      })
    },
    errorSave(msg) {
      const errMsg = (msg ? msg : 'Internal server error, please try again')
      this.$q.dialog({
        title: 'Error',
        message: errMsg
      })
    },
    save () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Yakin mengupdate data profile?',
        ok: 'YES',
        cancel: 'NO'
      }).then(() => {
        this.updateProfile()
      }).catch(() => {
        
      })
    },
    async updateProfile () {
      await this.$refs.modalLoading.show()
      try {
        if (this.userId) {
          this.data.updated_by = this.userId
          
          if (this.isUpload) {
            this.uploadProcess = true
            this.fileData = this.$refs.profileImage.files[0];
            this.uploadData = new FormData()
            this.uploadData.append('file', this.fileData)
            const respImg = await this.$axios.post('upload/user', this.uploadData)
            if (respImg.status === 200) {
              this.data.user_photo = respImg.data.data
              this.uploadProcess = false
            }
          }
          
          const resp0 = await this.$axios.put(`${this.resource}/myprofile`, this.data)
          if (resp0.status === 201 || resp0.status === 200) {
            this.$store.commit('setUsername', this.data.user_fullname)
            await this.$refs.modalLoading.hide()
            await this.$q.notify({
              color: 'positive',
              position: 'top',
              message: 'Profile berhasil diupdated',
              icon: 'done'
            })
          }
          else {
            await this.$refs.modalLoading.hide()
            await this.errorSave()
          }
        } 
      }
      catch (err) {
        await this.$refs.modalLoading.hide()
        if (this.uploadProcess) {
          await this.errorSave('Upload profile image failed')
        }
        else {
          await this.errorSave(err.response.data.message)
        }
      }
    }
  }
}
</script>

<style scoped>
.q-if-has-label {
  min-height: 61px;
}
.form-group-error {
  font-size: 12px;
  color: #db2828;
  margin-top:15px;
}
.q-table-container >>> .q-table tr {
  height: 45px !important;
}
</style>
