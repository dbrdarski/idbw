export const createPagination = ({ pagination } = {}) => ({
  data () {
    return {
      [pagination]: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 3
      }      
    }
  }
})

export const getOffsetAndLimit = ({ page, rowsPerPage: limit }) => ({
  offset: (page - 1) * limit,
  limit: limit
})
