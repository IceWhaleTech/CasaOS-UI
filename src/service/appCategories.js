import { api } from './service.js'

const PREFIX = '/app-categories'

const appCategories = {
  // get app category
  getAppCategory() {
    return api.get(`${PREFIX}`)
  },
}

export default appCategories
