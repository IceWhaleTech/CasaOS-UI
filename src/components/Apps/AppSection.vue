<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-14 14:04:27
 * @FilePath: \CasaOS-UI\src\components\Apps\AppSection.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->

<template>
  <div class="home-section has-text-left mt-6">
    <!-- Title Bar Start -->
    <div class="title-bar is-flex is-align-items-center">
      <h1 class="title is-4  has-text-white is-flex-shrink-1">{{$t('Apps')}}
        <!-- <b-tooltip :label="$t(appHelpText)" type="is-dark" multilined v-if="showDragTip">
          <b-icon icon="help-circle-outline" custom-size="mdi-18px"></b-icon>
        </b-tooltip> -->
      </h1>
      <div class="buttons ">
        <b-button id="v-step-0" icon-left="apps" type="is-dark" size="is-small" :loading="isShowing" rounded @click="showInstall">{{$t('App Store')}}</b-button>
      </div>
    </div>
    <!-- Title Bar End -->

    <!-- App List Start -->
    <draggable class="columns is-variable is-2 is-multiline app-list" tag="div" v-model="appList" v-bind="dragOptions" @start="drag = true" @end="onSortEnd" :draggable="draggable">
      <template v-if="!isLoading">

        <!-- App Icon Card Start -->
        <div class="column is-narrow is-3 handle" v-for="(item) in appList" :key="'app-'+item.name">
          <app-card :item="item" @updateState="getList" @configApp="showConfigPanel" :isCasa="true"></app-card>
        </div>
        <!-- App Icon Card End -->
        <!-- If None Apps Start -->
        <app-new-button-card v-if="appList.length == 0" slot="header" @showInstall="showInstall"></app-new-button-card>
        <!-- If None Apps End -->

      </template>

      <b-loading :is-full-page="false" v-model="isLoading" slot="footer"></b-loading>
    </draggable>
    <!-- App List End -->
    <template v-if="notImportedList.length > 0">
      <!-- Title Bar Start -->
      <div class="title-bar is-flex is-align-items-center mt-6">
        <h1 class="title is-4  has-text-white is-flex-shrink-1">{{$t('Existing Docker Apps')}}
          <!-- <b-tooltip :label="$t(importHelpText)" type="is-dark" multilined>
            <b-icon icon="help-circle-outline" custom-size="mdi-18px"></b-icon>
          </b-tooltip> -->
        </h1>
      </div>
      <!-- Title Bar End -->

      <!-- App List Start -->
      <div class="columns is-variable is-2 is-multiline app-list">
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
import AppNewButtonCard from './AddNewButtonCard.vue'
import xor from 'lodash/xor'
import concat from 'lodash/concat'
export default {
  data() {
    return {
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
    AppNewButtonCard,
    draggable
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
        let casaAppList = listRes.data.data.list
        let sortRes = await this.$api.app.getAppListOrder()
        if (sortRes.data.success == 200) {
          let sortList = sortRes.data.data
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
        data: JSON.stringify(newList)
      }
      this.$api.app.saveAppListOrder(data)
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

<style>
</style>