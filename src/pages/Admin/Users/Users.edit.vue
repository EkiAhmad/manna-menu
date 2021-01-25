<template>
  <div class="users-edit">
    <q-card class="q-mb-sm" flat color="blue-grey-1">
      <q-card-actions align="end">
        <q-btn color="secondary" @click="$router.replace(`${baseRoute}/list`)">Cancel</q-btn>
        <q-btn color="primary" :disable="$v.data.$invalid" @click="save">Save</q-btn>
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
            
            <div class="q-mt-lg">
              <p style="color:#979797;font-size:0.75rem">Tipe User</p>
              <q-radio class="q-mr-md" v-model="data.user_type" val="1" label="Internal" />
              <q-radio class="q-mr-md" v-model="data.user_type" val="2" label="Eksternal" />
              <q-radio v-model="data.user_type" val="3" label="Guest" />
            </div>
            
            <div class="q-mt-md" v-if="data.user_type==='2'">
              <q-select filter filter-placeholder="Cari nama instansi..." @blur="$v.data.instansi.$touch" stack-label="Instansi" v-model="data.ps_id" :options="sources" />
              <span class="form-group-error" v-if="$v.data.instansi.$error && !$v.data.instansi.isRequired">Instansi harus diisi</span>
            </div>
            <div class="q-mt-lg" v-else-if="data.user_type==='1'">
              <p style="color:#979797;font-size:0.75rem">Peneliti</p>
              <q-toggle true-value="1" false-value="0" v-model="data.user_peneliti" :label="statusYesNo" @input="changePeneliti" />
            </div>
            <div class="q-mt-md" v-show="data.user_peneliti==='1'">
              <q-select filter filter-placeholder="Cari kepakaran..." @blur="$v.data.pakar.$touch" stack-label="Kepakaran" v-model="data.pkr_id" :options="pakar" />
              <span class="form-group-error" v-if="$v.data.pakar.$error && !$v.data.pakar.isRequired">Kepakaran harus diisi</span>
            </div>
            <div class="q-mt-md" v-show="data.user_peneliti==='1'">
              <q-select filter filter-placeholder="Cari pangkat peneliti..." @blur="$v.data.pangkat.$touch" stack-label="Pangkat Peniliti" v-model="data.pkt_id" :options="pangkat" />
              <span class="form-group-error" v-if="$v.data.pangkat.$error && !$v.data.pangkat.isRequired">Pangkat Peneliti harus diisi</span>
            </div>
            <div class="q-mt-lg">
              <p style="color:#979797;font-size:0.75rem">Status</p>
              <q-toggle true-value="1" false-value="0" v-model="data.status" :label="statusLabel" />
            </div>
            
          </q-card-main>
        </q-card>
        <q-card class="q-mt-sm" v-if="!isEdit">
          <q-card-main>
            <q-input @blur="$v.data.user_password.$touch" type="password" stack-label="Password" v-model.trim="data.user_password" />
            <span class="form-group-error" v-if="$v.data.user_password.$error && !$v.data.user_password.required">Password can't be empty</span>
            <span class="form-group-error" v-if="$v.data.user_password.$error && !$v.data.user_password.minLength">Password min. 6 character</span>
            
            <q-input @blur="$v.data.repeatPassword.$touch" type="password" stack-label="Repeat Password" v-model.trim="data.repeatPassword" />
            <span class="form-group-error" v-if="$v.data.repeatPassword.$error && !$v.data.repeatPassword.sameAsPassword">Password does't match</span>
          </q-card-main>
        </q-card>
        <q-card class="q-mt-sm" v-else>
          <q-card-title class="q-caption text-faded">Reset Password</q-card-title>
          <q-card-main>
            <div class="q-mt-md">
              <q-input @blur="$v.data.user_password.$touch" type="password" stack-label="Password Baru" v-model.trim="data.user_password" />
              <span class="form-group-error" v-if="$v.data.user_password.$error && $v.data.user_password.isRequired && !$v.data.user_password.isMinLength">Password baru min. 6 karakter</span>
            </div>
            <div class="q-mt-md">
              <q-input @blur="$v.data.repeatPassword.$touch" type="password" stack-label="Ulangi Password Baru" v-model.trim="data.repeatPassword" />
              <span class="form-group-error" v-if="$v.data.repeatPassword.$error && !$v.data.repeatPassword.isSameAsPassword">Password baru tidak sama</span>
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <q-card class="q-mt-sm" color="blue-grey-1">
      <q-card-actions align="end">
        <q-btn color="secondary" @click="$router.replace(`${baseRoute}/list`)">Cancel</q-btn>
        <q-btn color="primary" :disable="$v.data.$invalid" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-modal v-model="loading" ref="modalLoading" minimized :content-css="{padding: '10px'}">
      <q-spinner :size="30"/><span style="margin-left:15px">Menyimpan data...</span>
    </q-modal>
  </div>
</template>

<script>

import { filter, find, findIndex, size, cloneDeep, orderBy } from 'lodash'
import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'

const role = 'admin'
const resource = 'users'
const baseRoute = `/${role}/${resource}`

export default {
  created() {
    this.$axios(`/productsource/select`)
      .then(({data}) => {
        this.sources = data.data
      })
      .catch(() => {
      })
    this.$axios(`/kepakaran/select`)
      .then(({data}) => {
        this.pakar = data.data
      })
      .catch(() => {
      })
    this.$axios(`/pangkat/select`)
      .then(({data}) => {
        this.pangkat = data.data
      })
      .catch(() => {
      })
      
    const id = this.$route.params.id
    if (id) {
      this.$axios.get(`${this.resource}/${id}`)
      .then(({data}) => {
        if (size(data.data)) {
          this.data = data.data
          this.data.user_password = ''
          this.$v.data.user_password.$reset()
        }
      })
      .catch(() => {
        this.errorGet()
      })
    }
    
    this.isEdit = this.$route.params.id ? true : false
  },
  mounted () {
    
  },
  validations() {
    if (this.isEdit) {
      return {
        data:{
          user_fullname:{ required },
          user_email: {required, email },
          user_password: {
            isRequired() {
              if (this.data.user_password || this.data.repeatPassword) {
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
            isMinLength() {
              if (this.data.user_password || this.data.repeatPassword) {
                if (this.data.user_password.length > 5) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          repeatPassword: {
            isSameAsPassword() {
              if (this.data.user_password || this.data.repeatPassword) {
                if (this.data.user_password === this.data.repeatPassword) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          instansi:{
            isRequired() {
              if (this.data.user_type === '2') {
                if (this.data.ps_id) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          pangkat:{
            isRequired() {
              if (this.data.user_peneliti === '1') {
                if (this.data.pkt_id) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          pakar:{
            isRequired() {
              if (this.data.user_peneliti === '1') {
                if (this.data.pkr_id) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
        }
      }
    }
    else {
      return {
        data:{
          user_fullname:{ required },
          user_email: { required, email },
          instansi:{
            isRequired() {
              if (this.data.user_type === '2') {
                if (this.data.ps_id) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          pangkat:{
            isRequired() {
              if (this.data.user_peneliti === '1') {
                if (this.data.pkt_id) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          pakar:{
            isRequired() {
              if (this.data.user_peneliti === '1') {
                if (this.data.pkr_id) {
                  return true
                }
                else {
                  return false
                }
              }
              else {
                return true
              }
            }
          },
          user_password: {
            required,
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
        user_type:'1',
        user_password: '',
        user_peneliti: '0',
        repeatPassword:'',
        status: '1',
        ps_id:null,
        pkt_id:null,
        pkr_id:null
      }
    }
  },
  methods: {
    changePeneliti() {
      if (this.data.user_peneliti === '1') {
        this.$v.data.pangkat.$touch()
        this.$v.data.pakar.$touch()
      }
    },
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
    async save () {
      await this.$refs.modalLoading.show()
      try {
        if (this.data.user_type !== '2') {
          this.data.ps_id = null
        }
        if (this.data.user_peneliti !== '1') {
          this.data.pkt_id = null
          this.data.pkr_id = null
        }
        if (this.$route.params.id) {
          this.data.updated_by = 1
          
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
          
          const id = this.$route.params.id
          const resp0 = await this.$axios.put(`${this.resource}/${id}`, this.data)
          if (resp0.status === 201 || resp0.status === 200) {
            await this.$refs.modalLoading.hide()
            this.$router.replace(`${this.baseRoute}/list`)
          }
          else {
            await this.$refs.modalLoading.hide()
            await this.errorSave()
          }
        } 
        else {
          this.data.created_by = 1
          
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
          
          const resp0 = await this.$axios.post(`${this.resource}/`, this.data)
          if (resp0.status === 201 || resp0.status === 200) {
            await this.$refs.modalLoading.hide()
            this.$router.replace(`${this.baseRoute}/list`)
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
          await this.errorSave()
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
