const CrudListQuery = (uri, options) => {
  return {
    data () {
      return {
        uri,
        query: options.query || {},
        data: [],
        pagination: {
          page: 1,
          rowsNumber: 0,
          rowsPerPage: 50
        },
        filter: '',
        selected: [],
        loading: false
      }
    },
    methods: {
      filterHandler (filter) { return {} },
      doFind (props) {
        const { pagination, filter } = props || this
        this.pagination = pagination

        let $limit = pagination.rowsPerPage
        let $skip = ((pagination.page > 0 ? pagination.page : 1) - 1) * pagination.rowsPerPage
        let $page = pagination.page

        let query = {
          $limit,
          $skip,
          ...this.query
        }

        let queryFilter = {}

        if (pagination.sortBy) {
          query.$sort = {
            [pagination.sortBy]: pagination.descending ? -1 : 1
          }
        }

        queryFilter = this.filterHandler(filter)

        let params = {
          ...query,
          ...queryFilter
        }

        this.loading = true
        return this
          .$axios
          .get(this.uri, { params })
          .then(resp => {
            const pack = resp.data

            this.pagination.rowsNumber = pack.total
            this.pagination.rowsPerPage = $limit
            this.pagination.page = $page
            this.data = pack.data

            this.loading = false
            return pack
          })
      }
    }
  }
}

const CrudListAggregate = (uri, options) => {
  return {
    data () {
      return {
        toObjectIdMap: [],
        toISODateMap: [],
        uri,
        aggregate: options.aggregate || [],
        data: [],
        pagination: {
          page: 1,
          rowsNumber: 0,
          rowsPerPage: 50
        },
        filter: '',
        selected: [],
        loading: false
      }
    },
    methods: {
      filterHandler (filter) { return {} },
      doFind (props) {
        const { pagination, filter } = props || this

        const aggregate = []

        aggregate.push(...this.aggregate)

        let $limit = pagination.rowsPerPage
        let $skip = ((pagination.page > 0 ? pagination.page : 1) - 1) * pagination.rowsPerPage
        let $page = pagination.page

        if (filter) {
          aggregate.push(this.filterHandler(filter))
        }

        if (pagination.sortBy) {
          aggregate.push({
            $sort: {
              [pagination.sortBy]: pagination.descending ? -1 : 1
            }
          })
        }

        let $facet = {
          total: [{
            $count: 'count'
          }],
          data: [{
            $skip
          }]
        }

        if (pagination.rowsPerPage) {
          $facet.data.push({
            $limit
          })
        }

        aggregate.push({
          $facet
        })

        aggregate.push(...[{
          $unwind: '$total'
        }, {
          $project: {
            data: 1,
            total: '$total.count'
          }
        }])

        this.loading = true
        const resource = this.uri

        console.log(aggregate)
        const toObjectIdMap = this.toObjectIdMap.length ? this.toObjectIdMap : []
        const toISODateMap = this.toISODateMap.length ? this.toISODateMap : []
        let postData = { resource, aggregate, toObjectIdMap, toISODateMap }

        return this
          .$axios
          .post('aggregate', postData)
          .then(resp => {
            const pack = resp.data[0]

            this.pagination = pagination

            this.pagination.rowsNumber = (pack && pack.total) ? pack.total : 0
            this.data = (pack && pack.data) ? pack.data : []
            this.pagination.rowsPerPage = $limit
            this.pagination.page = $page

            this.loading = false
            return pack
          })
      }
    }
  }
}

export const CrudList = (uri, options = {}, useAggregate = false) => {
  return useAggregate ? CrudListAggregate(uri, options) : CrudListQuery(uri, options)
}

export const CrudEdit = (uri) => {
  return {
    data () {
      return {
        uri,
        data: {}
      }
    },
    methods: {
      doGet (id, params) {
        return this
          .$axios
          .get(`${this.uri}/${id}`, params)
          .then(resp => {
            this.data = resp.data
            return resp
          })
      },
      doPost (params) {
        let data = this.data
        return this
          .$axios
          .post(this.uri, data, params)
          .then(resp => {
            return resp
          })
      },
      doPatch (id, params) {
        let data = this.data
        return this
          .$axios
          .patch(`${this.uri}/${id}`, data, params)
          .then(resp => {
            return resp
          })
      }
    }
  }
}

export const CrudRemove = (uri) => {
  return {
    data () {
      return {
        uri
      }
    },
    methods: {
      doRemove (id, params) {
        return this
          .$axios
          .delete(`${this.uri}/${id}`, params)
          .then(resp => {
            return resp
          })
      }
    }
  }
}
