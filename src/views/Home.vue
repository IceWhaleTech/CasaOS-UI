<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 20:51:13
 * @Description: 
 * @FilePath: \CasaOS-UI\src\views\Home.vue
-->
<template>
  <div v-if="!isLoading" class="out-container">
    <!-- NavBar Start -->
    <top-bar v-animate-css="topBarAni" @showSideBar="showSideBar"></top-bar>
    <!-- NavBar End -->

    <!-- Content Start -->
    <div class="contents  pt-55">
      <div class="container">
        <div class="is-flex">
          <!-- SideBar Start -->
          <side-bar v-if="!hardwareInfoLoading"></side-bar>
          <div class="dark-bg" :class="{'open':sidebarOpen}"></div>
          <!-- SideBar End -->

          <!-- MainContent Start -->
          <div class="main-content">
            <!-- SearchBar Start -->
            <section>
              <search-bar></search-bar>
            </section>
            <!-- SearchBar End -->

            <!-- Suggestions For You Start -->
            <section>
              <!-- <suggestion></suggestion> -->
              <core-service></core-service>
            </section>
            <!-- Suggestions For You End -->

            <!-- Apps Start -->
            <section>
              <app-section ref="apps"></app-section>
            </section>
            <!-- Apps End -->

            <!-- Shortcuts Start -->
            <!-- <section>
              <shortcuts></shortcuts>
            </section> -->
            <!-- Shortcuts End -->
          </div>
          <!-- MainContent End -->
        </div>
      </div>
    </div>
    <!-- Content End -->
    <!-- File Panel Start -->
    <b-modal v-model="isFileActive" has-modal-card :destroy-on-hide="false" animation="zoom-in" custom-class="file-panel" :can-cancel="[]" aria-modal full-screen>
      <template #default="props">
        <file-panel @close="props.close"></file-panel>
      </template>
    </b-modal>
    <!-- File Panel End -->
  </div>
</template>

<script>

import SearchBar from '@/components/SearchBar.vue'
import SideBar from '@/components/SideBar.vue'
// import Suggestion from '@/components/Suggestion.vue'
import TopBar from '@/components/TopBar.vue'
import CoreService from '../components/CoreService.vue'
import AppSection from '../components/Apps/AppSection.vue'
//import Shortcuts from '@/components/Shortcuts.vue'
import FilePanel from '@/components/filebrowser/FilePanel.vue'
export default {
  name: "home-page",
  components: {
    SideBar,
    SearchBar,
    // Suggestion,
    AppSection,
    TopBar,
    CoreService,
    //Shortcuts,
    FilePanel
  },
  data() {
    return {
      isLoading: true,
      hardwareInfoLoading: true,
      isFileActive: false,
      timer: 0,
      timeGap: 3,
      topBarAni: {
        classes: 'fadeInDown',
        duration: 800
      },
      wsUrl: (process.env.NODE_ENV === "'dev'") ? `ws://${this.$store.state.devIp}:${this.$store.state.devPort}/v1/notify/ws?token=${this.$store.state.token}` : `ws://${document.location.host}/v1/notify/ws?token=${this.$store.state.token}`,

    }
  },
  provide() {
    return {
      homeShowFiles: this.showFiles,
    };
  },

  computed: {
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    }
  },
  mounted() {
    this.isLoading = false
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.getHardwareInfo();
    this.timer = setInterval(() => {
      this.getHardwareInfo()
    }, 2000);


    window.addEventListener("resize", this.onResize);
    this.onResize()
    this.initWebSocket()
  },
  methods: {
    /**
     * @description: Show SideBar
     * @param {*}
     * @return {*} void
     */
    showSideBar() {
      console.log("showSidebar");
    },

    /**
     * @description: Show Files
     * @param {*}
     * @return {*} void
     */
    showFiles() {
      this.isFileActive = true
    },

    /**
     * @description: Window Resize Handler
     * @param {*}
     * @return {*} void
     */
    onResize() {
      if (window.innerWidth > 480 && this.sidebarOpen) {
        this.$store.commit('closeSideBar');
      }
    },

    /**
     * @description: Get Hardware info and save to store
     * @param {*}
     * @return {*} void
     */

    getHardwareInfo() {
      this.$api.info.allInfo().then(res => {
        if (res.data.success === 200) {
          this.hardwareInfoLoading = false
          this.$store.commit('changeHardwareInfo', res.data.data);
        }
      })
    },

    /**
     * @description: Handle applist change from websocket
     * @param {*}
     * @return {*} void
     */

    handleAppListChange() {
      this.$refs.apps.getList()
    },

    /**
     * @description: WebSocket group function
     * @param {*}
     * @return {*} void
     */

    initWebSocket() { //初始化weosocket
      this.websock = new WebSocket(this.wsUrl);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      console.log('connected');
      const sendData = { type: "app", data: "" }
      this.websocketsend(JSON.stringify(sendData))
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      const redata = JSON.parse(e.data);
      redata.forEach((item) => {
        if (item.message == "uninstalled" || item.message == "installed") {
          this.handleAppListChange()
        }
      })

    },
    websocketsend(Data) {//数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {  //关闭
      console.log('断开连接', e);
      this.initWebSocket();
    },


  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    clearInterval(this.timer);
  },
}
</script>

<style>
</style>