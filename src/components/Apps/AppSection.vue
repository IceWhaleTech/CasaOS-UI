<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-27 16:00:44
 * @FilePath: /CasaOS-UI/src/components/Apps/AppSection.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->

<template>
  <div class="home-section has-text-left">
    <!-- Title Bar Start -->
    <div class=" is-flex is-align-items-center mb-5">
      <h1 class="title is-4  has-text-white is-flex-shrink-1 is-flex-grow-1 mb-0 contextmenu-canvas">{{$t('Apps')}}
        <!-- <b-tooltip :label="$t(appHelpText)" type="is-dark" multilined v-if="showDragTip">
          <b-icon icon="help-circle-outline" custom-size="mdi-18px"></b-icon>
        </b-tooltip> -->
      </h1>
      <!-- <div class="buttons ">
        <b-button id="v-step-0" icon-left="apps" type="is-dark" size="is-small" :loading="isShowing" rounded @click="showInstall">{{$t('App Store')}}</b-button>
      </div> -->
    </div>
    <!-- Title Bar End -->

    <!-- App List Start -->
    <draggable class="columns is-variable is-2 is-multiline app-list contextmenu-canvas" tag="div" v-model="appList" v-bind="dragOptions" @start="drag = true" @end="onSortEnd" :draggable="draggable">
      <template v-if="!isLoading">

        <!-- App Icon Card Start -->
        <div class="column is-narrow is-3 handle" v-for="(item) in appList" :key="'app-'+item.name">
          <app-card :item="item" @updateState="getList" @configApp="showConfigPanel" :isCasa="true"></app-card>
        </div>
        <!-- App Icon Card End -->

      </template>

      <b-loading :is-full-page="false" v-model="isLoading" slot="footer"></b-loading>
    </draggable>
    <!-- App List End -->
    <template v-if="notImportedList.length > 0">
      <!-- Title Bar Start -->
      <div class="title-bar is-flex is-align-items-center mt-2rem">
        <h1 class="title is-4  has-text-white is-flex-shrink-1 is-flex-grow-1 mb-0 contextmenu-canvas">{{$t('Existing Docker Apps')}}
          <!-- <b-tooltip :label="$t(importHelpText)" type="is-dark" multilined>
            <b-icon icon="help-circle-outline" custom-size="mdi-18px"></b-icon>
          </b-tooltip> -->
        </h1>
      </div>
      <!-- Title Bar End -->

      <!-- App List Start -->
      <div class="columns is-variable is-2 is-multiline app-list contextmenu-canvas">
        <!-- Application not imported Start -->
        <div class="column is-narrow is-3" v-for="(item) in notImportedList" :key="'app-'+item.name">
          <app-card :item="item" @updateState="getList" @configApp="showConfigPanel" @importApp="showConfigPanel" :isCasa="false"></app-card>
        </div>
        <!-- Application not imported End -->
      </div>
      <!-- App List End -->
    </template>

  </div>
</template>

<script>
import AppCard from './AppCard.vue'
import AppPanel from './AppPanel.vue'
import draggable from 'vuedraggable'
import xor from 'lodash/xor'
import concat from 'lodash/concat'

const builtInApplications = [
  {
    id: "1",
    name: "App Store",
    icon: require(`@/assets/img/app/appstore.svg`),
    state: "0",
    custom_id: "1",
    type: "system"
  },
  {
    id: "2",
    name: "Files",
    icon: require(`@/assets/img/app/files.svg`),
    state: "0",
    custom_id: "2",
    type: "system"
  },
  {
    id: "3",
    name: "Connect",
    icon: require(`@/assets/img/share/folder-publicshare.svg`),
    state: "0",
    custom_id: "3",
    type: "system"
  },
]

const orderConfig = "app_order"

export default {
  data() {
    return {
      user_id: localStorage.getItem("user_id"),
      appList: [],
      notImportedList: [],
      appConfig: {},
      drag: false,
      isLoading: true,
      isShowing: false,
      importHelpText: "Click icon to import apps into CasaOS",
      appHelpText: 'Drag icons to sort',
      draggable: ".handle"
    }
  },
  components: {
    AppCard,
    draggable
  },
  provide() {
    return {
      openAppStore: this.showInstall,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    showDragTip() {
      return this.draggable == ".handle"
    }
  },
  created() {
    console.log(this.$store.state.userinfo.id);
    this.getList();
    this.draggable = this.isMobile() ? "" : ".handle"
  },
  methods: {
    onChange(e) {
      console.log(e);
    },
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    },
    /**
     * @description: Fetch the list of installed apps
     * @return {*} void
     */
    async getList() {
      let listRes = await this.$api.app.myAppList()
      if (listRes.data.success == 200) {
        const orgAppList = listRes.data.data.list
        let casaAppList = concat(builtInApplications, orgAppList)
        casaAppList.reverse()
        let sortRes = await this.$api.user.getCustomConfig(this.user_id, orderConfig)
        if (sortRes.data.success == 200) {
          let sortList = sortRes.data.data.data
          let newList = casaAppList.map((item) => {
            return item.custom_id
          })
          if (sortList != "") {
            // Resort list
            sortList = this.getNewSortList(sortList, newList)
            casaAppList.sort((a, b) => {
              return sortList.indexOf(a.custom_id) - sortList.indexOf(b.custom_id);
            });
          }
          this.appList = casaAppList;
          if (xor(sortList, newList).length > 0) {
            this.saveSortData()
          }
        } else {
          this.appList = casaAppList;
        }
        this.notImportedList = listRes.data.data.local
        this.isLoading = false;
      }
    },

    /**
     * @description: 
     * @param {Array} oriList
     * @param {Array} newList
     * @return {*}
     */
    getNewSortList(oriList, newList) {
      let xorList = xor(oriList, newList)
      xorList.reverse()
      return concat(oriList, xorList)
    },

    /**
     * @description: Save Sort Table
     * @param {*}
     * @return {*}
     */
    saveSortData() {
      let newList = this.appList.map((item) => {
        return item.custom_id
      })
      let data = {
        data: newList
      }
      this.$api.user.postCustomConfig(this.user_id, orderConfig, data)
    },
    /**
     * @description: Handle on Sort End
     * @param {*}
     * @return {*}
     */
    onSortEnd() {
      this.drag = false
      this.saveSortData()
    },

    /**
     * @description: Show Install Panel Programmatic
     * @return {*} void
     */
    showInstall() {
      this.isShowing = true
      this.$api.app.appConfig().then(res => {
        this.isShowing = false
        if (res.data.success == 200) {
          this.$buefy.modal.open({
            parent: this,
            component: AppPanel,
            hasModalCard: true,
            customClass: 'app-panel',
            trapFocus: true,
            canCancel: ['escape'],
            scroll: "keep",
            animation: "zoom-in",
            events: {
              'updateState': () => {
                this.getList()
              }
            },
            props: {
              id: "0",
              state: "install",
              configData: res.data.data
            }
          })
        }
      })
    },

    /**
     * @description: Show Settings Panel Programmatic
     * @param {String} id
     * @param {String} status
     * @param {Boolean} isCasa 
     * @return {*}
     */
    showConfigPanel(id, status, isCasa) {
      this.$api.app.getContainerSettingdata(id).then(ret => {
        console.log(ret.data.data);
        this.$api.app.appConfig().then(res => {
          if (res.data.success == 200) {
            this.$buefy.modal.open({
              parent: this,
              component: AppPanel,
              hasModalCard: true,
              customClass: '',
              trapFocus: true,
              canCancel: [''],
              scroll: "keep",
              animation: "zoom-in",
              events: {
                'updateState': () => {
                  this.getList()
                }
              },
              props: {
                id: id,
                state: "update",
                isCasa: isCasa,
                runningStatus: status,
                configData: res.data.data,
                settingData: ret.data.data
              }
            })
          }
        })
      })
    }
  },
  sockets: {
    app_install(res) {
      const data = res.body.data
      if (data.finished) {
        this.getList();
      }
    },
    app_uninstall() {
      this.getList();
    },
  }
}
</script>

<style lang="scss" scoped>
.app-list {
  position: relative;
}

@media screen and (max-width: 480px) {
  .app-list {
    display: flex;

    .column {
      flex: none;
      width: 50%;
    }
  }
}

@media screen and (min-width: $tablet) {
  .app-list {
    .column {
      flex: none;
      width: 50%;
    }
  }
}
@media screen and (min-width: $desktop) {
  .app-list {
    .column {
      flex: none;
      width: 33.333333%;
    }
  }
}
@media screen and (min-width: $widescreen) {
  .app-list {
    .column {
      flex: none;
      width: 25%;
    }
  }
}

@media screen and (min-width: $fullhd) {
  .app-list {
    .column {
      flex: none;
      width: 20%;
    }
  }
}
</style>