import { api } from './service.js'

const PREFIX = '/cloud'
const cloud = {
  // get storage list
  list(data) {
    return api.get(`${PREFIX}`, data)
  },

  // delete storage
  umount(data) {
    return api.delete(`${PREFIX}`, data)
  },
}
export default cloud
