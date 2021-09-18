<template>
  <div class="has-text-left mt-6">
    <div class="title-bar is-flex is-align-items-center">
      <h1 class="title is-4  has-text-white is-flex-shrink-1">Apps</h1>
      <div class="buttons ">
        <b-button icon-left="plus" type="is-dark" size="is-small" rounded @click="showInstall">New App</b-button>
      </div>
    </div>
    <div class="columns is-variable is-2 is-multiline ">
      <div class="column is-narrow is-3" v-for="(item,index) in appList" :key="'app-'+index">
        <app-card :item="item" @updateState="updateState" @configApp="showConfigPanel"></app-card>
      </div>
    </div>
  </div>
</template>

<script>
import AppCard from './Apps/AppCard.vue'
import Panel from './Panel.vue'
export default {
  data() {
    return {
      appList: [],
      appConfig: {}
    }
  },
  components: {
    AppCard,
  },
  created() {
    this.getList();
  },
  methods: {
    // Show Install Panel Programmatic
    showInstall() {
      this.$api.app.appConfig().then(res => {
        if (res.data.success == 200) {
          this.$buefy.modal.open({
            parent: this,
            component: Panel,
            hasModalCard: true,
            customClass: '',
            trapFocus: true,
            canCancel: ['escape'],
            scroll: "keep",
            animation: "zoom-out",
            events: {
              'updateState': () => {
                this.getList()
              }
            },
            props: {
              id: "0",
              state:"install",
              configData: res.data.data
            }
          })
        }
      })
    },
    getList() {
      this.$api.app.myAppList().then(res => {
        this.appList = res.data.data;
      })
    },
    updateState() {
      this.getList()
    },
    showConfigPanel(id) {
      this.$api.app.getContainerSettingdata(id).then(ret => {
        this.$api.app.appConfig().then(res => {
          if (res.data.success == 200) {
            this.$buefy.modal.open({
              parent: this,
              component: Panel,
              hasModalCard: true,
              customClass: '',
              trapFocus: true,
              canCancel: ['escape'],
              scroll: "keep",
              animation: "zoom-out",
              events: {
                'updateState': () => {
                  this.getList()
                }
              },
              props: {
                id: id,
                state:"update",
                configData: res.data.data,
                initDatas: ret.data.data
              }
            })
          }
        })
      })
    },

    // Format External Link
    siteUrl(port, index) {
      return (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${port}${index}` : `http://${document.domain}:${port}${index}`
    },
  },
}
</script>

<style>
</style>