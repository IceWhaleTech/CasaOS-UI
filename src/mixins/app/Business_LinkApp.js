/* LinkApp mateData:
*  item.hostname
*  item.icon
*  item.name
*  item.app_type
*  item.status
*  item.id
* */
import { uniqWith } from 'lodash-es'

export default {
  methods: {
    async getLinkAppList() {
      try {
        // forecast null or String.
        let LinkAppList = await this.$api.users.getLinkAppDetail().then(v => v.data.data || [])
        LinkAppList = this.transferLinkAppList(LinkAppList)
        return LinkAppList
      }
      catch (e) {
        console.error('getLinkAppList', e)
      }
    },

    setLinkAppList(LinkAppList) {
      if (LinkAppList === '') {
        LinkAppList = []
      }
      const stringifyLinkAppList = JSON.stringify(LinkAppList)

      return this.$api.users.saveLinkAppDetail(stringifyLinkAppList).then((res) => {
        return res
      })
    },

    async deleteLinkAppByName(name) {
      let LinkAppList = await this.getLinkAppList()
      LinkAppList = LinkAppList.filter(item => item.name !== name)
      return this.setLinkAppList(LinkAppList)
    },

    // for former version.
    transferLinkAppList(LinkAppList) {
      LinkAppList = uniqWith(LinkAppList, (a, b) => {
        return a.name === b.name
      })
      LinkAppList.forEach((item) => {
        if (item.type) {
          item.app_type = item.type
          item.hostname = item.host
          item.status = item.state
          delete item.type
          delete item.host
          delete item.state
          delete item.custom_id
        }
      })
      return LinkAppList
    },
  },
}
