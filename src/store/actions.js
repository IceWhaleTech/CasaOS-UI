import $api from '@/service/api.js'

const actions = {
  // GET_HARDWARE_INFO(context, val) {
  //     context.commit("GET_HARDWARE_INFO",val)
  // },
  // set shortcut data
  async SET_SHORTCUT_DATA(context, val) {
    try {
      // Changing the shortcut data structure
      val.forEach((item) => {
        item.icon = 'folder'
        item.pack = 'casa'
        item.visible = true
        item.selected = true
        item.extensions = null
      })
      const data = await $api.users.saveShutcutDetail(val).then(v => v.data.data)
      context.commit('SET_SHORTCUT_DATA', data)
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },

  // get shortcut data
  async GET_SHORTCUT_DATA(context, val) {
    try {
      let data = await $api.users.getShutcutDetail(val).then(v => v.data.data)
      if (!data) {
        data = []
      }
      context.commit('SET_SHORTCUT_DATA', data)
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },

}
export default actions
