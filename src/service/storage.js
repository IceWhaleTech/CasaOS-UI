import { api } from './service.js'

const PREFIX = '/storage'
const storage = {
  // get storage list
  list(data) {
    return api.get(`${PREFIX}`, data)
  },

  // create storage
  create(data) {
    return api.post(`${PREFIX}`, data)
  },

  // format storage
  format(data) {
    return api.put(`${PREFIX}`, data)
  },

  // delete storage
  delete(data) {
    return api.delete(`${PREFIX}`, data)
  },
}
export default storage
