import { api } from './service.js'

const PREFIX = '/batch'

const batch = {
  // download
  download(format, files) {
    return api.get(`${PREFIX}`, {
      format,
      files,
    })
  },

  // File operate task TODO:wait for the api
  task(data) {
    return api.post(`${PREFIX}/task`, data)
  },

  // delete file operate task
  deleteTask(id) {
    return api.delete(`${PREFIX}/${id}/task`)
  },

  // delete file or folder
  delete(files) {
    return api.delete(`${PREFIX}`, files)
  },

}

export default batch
