<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-18 12:51:39
 * @Description: App module
 * @FilePath: \CasaOS-UI\src\components\Apps.vue
-->

<template>
  <div class="home-section has-text-left mt-6">
    <!-- Title Bar Start -->
    <div class="title-bar is-flex is-align-items-center">
      <h1 class="title is-4  has-text-white is-flex-shrink-1">{{$t('Apps')}}</h1>
      <div class="buttons ">
        <b-button id="v-step-0" icon-left="apps" type="is-dark" size="is-small" :loading="isShowing" rounded @click="showInstall">{{$t('App Store')}}</b-button>
      </div>
    </div>
    <!-- Title Bar End -->

    <!-- App List Start -->
    <div class="columns is-variable is-2 is-multiline app-list ">
      <template v-if="!isLoading">
        <!-- If None Apps Start -->
        <div class="column is-narrow is-3" v-if="appList.length == 0">
          <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card">
            <!-- Card Content Start -->
            <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column p-55  img-c">
              <a class="is-flex is-justify-content-center" @click="showInstall">
                <b-image :src="require('@/assets/img/add_button.svg')" class="is-72x72"></b-image>
              </a>
            </div>
            <!-- Card Content End -->
          </div>
        </div>

        <!-- If None Apps End -->

        <!-- FileFrowser Entry Start -->
        <file-entry-card></file-entry-card>
        <!-- FileFrowser Entry  -->

        <div class="column is-narrow is-3" v-for="(item,index) in appList" :key="'app-'+index+item.icon+item.port">
          <app-card :item="item" @updateState="getList" @configApp="showConfigPanel"></app-card>
        </div>
      </template>
      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    </div>

    <!-- Title Bar End -->
  </div>
</template>

<script>
import AppCard from './Apps/AppCard.vue'
import Panel from './Panel.vue'
import FileEntryCard from './filebrowser/FileEntryCard.vue'
export default {
  data() {
    return {
      appList: [],
      appConfig: {},
      isLoading: true,
      isShowing: false
    }
  },
  components: {
    AppCard,
    FileEntryCard
  },
  created() {
    this.getList();
  },
  methods: {

    /**
     * @description: Fetch the list of installed apps
     * @return {*} void
     */
    getList() {
      this.$api.app.myAppList().then(res => {
        if (res.data.success == 200) {
          this.appList = res.data.data;
          this.isLoading = false;
        }
      })
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
            component: Panel,
            hasModalCard: true,
            customClass: 'app-panel',
            trapFocus: true,
            canCancel: ['escape'],
            scroll: "keep",
            animation: "zoom-out",
            events: {
              // 'updateState': () => {
              //   this.getList()
              // }
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
     * @return {*} void
     */
    showConfigPanel(id, status) {
      this.$api.app.getContainerSettingdata(id).then(ret => {
        console.log(ret.data.data);
        this.$api.app.appConfig().then(res => {
          if (res.data.success == 200) {
            this.$buefy.modal.open({
              parent: this,
              component: Panel,
              hasModalCard: true,
              customClass: '',
              trapFocus: true,
              canCancel: [''],
              scroll: "keep",
              animation: "zoom-out",
              events: {
                'updateState': () => {
                  this.getList()
                }
              },
              props: {
                id: id,
                state: "update",
                runningStatus: status,
                configData: res.data.data,
                initDatas: ret.data.data
              }
            })
          }
        })
      })
    }
  }
}
</script>

<style>
</style>