import { api } from './service.js'

const PREFIX = '/apps'
const PREFIX2 = '/v2/app_management'

const apps = {
  // get app list
  getAppList(data) {
    return api.get(`${PREFIX}`, data)
  },

  // v2:: get app list
  getAppListV2(data) {
    return api.get(`${PREFIX2}/apps`, data)
  },

  // Get app info
  getAppInfo(id) {
    return api.get(`${PREFIX}/${id}`)
  },

  // v2:: Get app info about store。
  getAppInfoV2(id) {
    return api.get(`${PREFIX2}/apps/${id}`)
  },

  // v2:: Get app info about config。
  getAppConfigV2(id) {
    return api.get(`${PREFIX2}/container/${id}`)
  },

  // Check app version
  checkAppVersion(id) {
    return api.patch(`${PREFIX2}/container/${id}`)
  },

  // Check port
  checkPort() {
    return api.get(`/v2/casaos/health/ports`)
  },

}

export default apps
