<template>
  <div class="{{ kebabCase role }}_{{ kebabCase name }}-list">
    <q-table
      ref="table"
      color="primary"
      title="{{ titleCase name }} List"
      :data="data"
      :columns="columns"
      :filter="filter"
      selection="single"
      :selected.sync="selected"
      row-key="_id"
      row="80px"
      :pagination.sync="pagination"
      @request="doFind"
      :loading="loading"
      :visible-columns="visibleColumns"
      >

      <template slot="top-selection" slot-scope="props">
        <q-btn color="positive" flat round icon="mode edit" @click="doEdit" />
        <q-btn color="negative" flat round icon="delete" @click="doDelete" />
      </template>
      <template slot="top-left" slot-scope="props">
        <div class="row items-center">
          <div class="col-auto q-px-xs">
            <q-btn @click="doEdit">New</q-btn>
            <q-btn @click="savePdf">PDF</q-btn>
            <download-excel
              :data   = "data"
              :fields = "excelFields"
              name    = "{{ kebabCase name }}.xls">
              Excel
            </download-excel>
          </div>
          <div class="col q-px-xs">
            <q-search hide-underline v-model="filter" />
          </div>
        </div>
      </template>
      <template slot="top-right" slot-scope="props">
        <q-table-columns
          color="secondary"
          class="q-mr-sm"
          v-model="visibleColumns"
          :visible-columns="visibleColumns"
          :columns="columns"
          />
      </template>
    </q-table>
  </div>
</template>

<script>
import { CrudList, CrudRemove } from 'src/components/crud.mixin.js'
import JsPDF from 'jspdf'
require('jspdf-autotable')
import DownloadExcel from 'src/components/DownloadExcel.vue'

const role = '{{ kebabCase role }}'
const resource = '{{ kebabCase name }}'
const baseRoute = `/${role}/${resource}`

export default {
  components: {
    DownloadExcel
  },
  mixins: [
    CrudList(resource, {}, true),
    CrudRemove(resource)
  ],
  created () {
    this.doFind().then(response => console.log('responses', response))
  },
  data () {
    return {
      baseRoute,
      limit: 5,
      aggregate: [],
      excelFields: {
        'Text': 'text'
      },
      pdfFields: [
        'Text'
      ],
      visibleColumns: ['text'],
      columns: [
        {
          name: 'text',
          label: 'Text',
          align: 'left',
          field: 'text',
          sortable: true
        }
      ]
    }
  },
  methods: {
    doEdit () {
      const id = this.selected.length ? this.selected[0]._id : ''
      this.$router.push(`${this.baseRoute}/edit/${id}`)
    },
    doDelete () {
      const id = this.selected.length ? this.selected[0]._id : ''
      this.doRemove(id).then(() => {
        this.selected = []
        this.$router.push('')
      })
    },
    filterHandler (filter) {
      return {
        $match: {
          text: {
            $regex: filter,
            $options: 'i'
          }
        }
      }
    },
    savePdf () {
      const doc = new JsPDF('l', 'pt')
      const rows = this.data.map(item => {
        return [item.text]
      })
      doc.autoTable(this.pdfFields, rows)
      doc.save('{{ kebabCase name }}.pdf')
    }
  }
}
</script>

<style>
.q-table tr {
  height: 80px;
  vertical-align: middle;
}
</style>
