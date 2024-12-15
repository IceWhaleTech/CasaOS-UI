import { api } from './service.js'

const PREFIX = '/image'

const image = {
  // image thumbnail/original image
  getImage(path, type) {
    return api.get(`${PREFIX}`, {
      path,
      type,
    })
  },
}

export default image
