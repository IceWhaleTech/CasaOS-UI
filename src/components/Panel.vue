<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-03 19:17:12
 * @Description: Install Panel of Docker
 * @FilePath: /CasaOS-UI/src/components/Panel.vue
-->

<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{panelTitle}}</h3>
      </div>
      <div class="is-flex is-align-items-center">
        <b-tooltip label="Import" position="is-bottom" type="is-dark">
          <button type="button" class="icon-button mdi mdi-import" @click="showImportPanel" v-if="showImportButton" />
        </b-tooltip>

        <b-tooltip label="Terminal & Logs" position="is-bottom" type="is-dark">
          <button type="button" class="icon-button mdi mdi-console" @click="showTerminalPanel" v-if="showTerminalButton" />
        </b-tooltip>

        <b-tooltip label="Export AppFile" position="is-bottom" type="is-dark">
          <button type="button" class="icon-button mdi mdi-export-variant" @click="exportJSON" v-if="showExportButton" />
        </b-tooltip>
        <div v-if="currentSlide < 2" class="is-flex is-align-items-center modal-close-container" :class="{'modal-close-container-line':currentSlide == 1}">
          <button type="button" class="delete" @click="$emit('close')" />
        </div>
        
      </div>

    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">
      <!-- App Store List Start -->
      <section v-if="currentSlide == 0">

        <div v-for="(item,index) in pageList" :key="index+item.title+item.id" class="is-flex pt-5 pb-5 b-line is-align-items-center">
          <div class="list-icon mr-4">
            <b-image :src="item.icon" :src-fallback="require('@/assets/img/default.png')" webp-fallback=".jpg" class="is-72x72 icon-shadow"></b-image>
          </div>
          <div class="flex1 mr-4">
            <h6 class="title is-6 mb-2">{{item.title}}</h6>
            <p class="is-size-65 two-line">{{item.tagline}}</p>
          </div>
          <div>
            <b-button type="is-primary" size="is-small" rounded @click="qucikInstall(item.id)" :loading="item.id == currentInstallId">Install</b-button>
          </div>
        </div>

      </section>
      <!-- App Store List Start -->

      <!-- App Install Form Start -->
      <section v-if="currentSlide == 1">
        <ValidationObserver ref="ob1">
          <ValidationProvider rules="required" name="Image" v-slot="{ errors, valid }">
            <b-field label="Docker Image *" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input v-model="initData.image" placeholder="e.g.,hello-world:latest" :readonly="state == 'update'" @input="changeIcon"></b-input>
              <!-- <b-autocomplete :data="data" placeholder="e.g. hello-world:latest" field="image" :loading="isFetching" @typing="getAsyncData" @select="option => selected = option" v-model="initData.image" :readonly="state == 'update'"></b-autocomplete> -->
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required" name="Name" v-slot="{ errors, valid }">
            <b-field label="App name *" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input value="" v-model="initData.label" placeholder="Your custom App Name"></b-input>
            </b-field>
          </ValidationProvider>

          <b-field label="Icon URL">
            <b-input value="" v-model="initData.icon" placeholder="Your custom icon URL"></b-input>
          </b-field>

          <b-field label="Web UI">
            <p class="control">
              <span class="button is-static">{{baseUrl}}</span>
            </p>
            <b-input v-model="webui" placeholder="port[/path/to/index.html]" expanded></b-input>
          </b-field>

          <b-field label="Network">
            <b-select v-model="initData.network_model" placeholder="Select" expanded>
              <optgroup v-for="net in networks" :key="net.driver" :label="net.driver">
                <option v-for="(option,index) in net.networks" :value="option.name" :key="option.name+index">
                  {{ option.name}}
                </option>
              </optgroup>
            </b-select>
          </b-field>

          <ports v-model="initData.ports" :showHostPost="showHostPort" v-if="showPorts"></ports>
          <input-group v-model="initData.volumes" type="volume" label="Volumes" message="No volumes now, click “+” to add one."></input-group>
          <env-input-group v-model="initData.envs" label="Environment Variables" message="No environment variables now, click “+” to add one."></env-input-group>
          <input-group v-model="initData.devices" type="device" label="Devices" message="No devices now, click “+” to add one."></input-group>
          <b-field label="Memory Limit">
            <vue-slider :min="256" :max="totalMemory" v-model="initData.memory"></vue-slider>
          </b-field>

          <b-field label="CPU Shares">
            <b-select v-model="initData.cpu_shares" placeholder="Select" expanded>
              <option value="10">Low</option>
              <option value="50">Medium</option>
              <option value="90">High</option>
            </b-select>
          </b-field>

          <b-field label="Restart Policy">
            <b-select v-model="initData.restart" placeholder="Select" expanded>
              <option value="on-failure">on-failure</option>
              <option value="always">always</option>
              <option value="unless-stopped">unless-stopped</option>
            </b-select>
          </b-field>
          <b-field label="App Description">
            <b-input v-model="initData.description"></b-input>
          </b-field>

        </ValidationObserver>
      </section>
      <!-- App Install Form End -->

      <!-- App Install Process Start -->
      <section v-if="currentSlide == 2">
        <div class="installing-warpper">
          <div class="is-flex is-align-items-center is-justify-content-center">
            <lottie-animation class="install-animation" :animationData="require('@/assets/ani/rocket-launching.json')" :loop="true" :autoPlay="true"></lottie-animation>
          </div>
          <h3 class="title is-6 has-text-centered" :class="{'has-text-danger':errorType == 3,'has-text-black':errorType != 3}" v-html="installText"></h3>
        </div>
      </section>
      <!-- App Install Process End -->
      <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
    </section>
    <!-- Modal-Card Body End -->

    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center " :class="{'is-justify-content-center':currentSlide == 0}">
      <template>
        <div class="flex1">
          <div v-if="currentSlide == 0">
            <b-pagination v-if="listTotal > pageSize" :total="listTotal" v-model="pageIndex" range-before=1 range-after=1 order="is-centered" size="is-small" :simple="false" :rounded="true" :per-page="pageSize" icon-prev="chevron-left" icon-next="chevron-right" aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page">
            </b-pagination>
          </div>
        </div>
        <div>
          <!-- <b-button v-if="currentSlide < 2" label="Cancel" @click="$emit('close')"  rounded /> -->
          <b-button v-if="currentSlide == 0" label="Custom Install" @click="currentSlide = 1" type="is-primary" rounded />
          <b-button v-if="currentSlide == 2 && errorType == 3 " label="Back" @click="prevStep" rounded />
          <b-button v-if="currentSlide == 1 && state == 'install'" label="Install" type="is-primary" @click="installApp()" rounded />
          <b-button v-if="currentSlide == 1 && state == 'update'" label="Save" type="is-primary" @click="updateApp()" rounded />
          <b-button v-if="currentSlide == 2 && (errorType == 1 || errorType == 4)" :label="cancelButtonText" type="is-primary" @click="$emit('close')" rounded />
        </div>
      </template>

    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import axios from 'axios'
import InputGroup from './forms/InputGroup.vue';
import EnvInputGroup from './forms/EnvInputGroup.vue';
import Ports from './forms/Ports.vue'
import ImportPanel from './forms/ImportPanel.vue'
import AppTerminalPanel from './Apps/AppTerminalPanel.vue'
import LottieAnimation from "lottie-web-vue";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import debounce from 'lodash/debounce'
import find from 'lodash/find';
import uniq from 'lodash/uniq';
import upperFirst from 'lodash/upperFirst'
import isNull from 'lodash/isNull'
import orderBy from 'lodash/orderBy';
import FileSaver from 'file-saver';

export default {
  components: {
    Ports,
    InputGroup,
    EnvInputGroup,
    ValidationObserver,
    ValidationProvider,
    LottieAnimation,
    VueSlider
  },
  data() {
    return {
      timer: 0,
      data: [],
      isLoading: true,
      isFetching: false,
      errorType: 1,

      cancelButtonText: "Cancel",
      webui: "",
      baseUrl: "",
      totalMemory: 0,
      networks: [],
      tempNetworks: [],
      networkModes: [],
      installPercent: 0,
      installText: "",
      initData: {
        port_map: "",
        cpu_shares: 10,
        memory: 300,
        restart: "always",
        label: "",
        position: true,
        index: "",
        icon: "",
        network_model: "",
        image: "",
        description: "",
        origin: "custom",
        ports: [],
        volumes: [],
        envs: [],
        devices: [],
      },

      pageIndex: 1,
      pageSize: 5,
      listTotal: 0,
      pageList: {},
      currentSlide: 0,
      currentInstallId: 0
    }
  },
  props: {
    id: String,
    state: String,
    runningStatus: String,
    configData: Object,
    initDatas: {
      type: Object
    }
  },

  created() {
    // Set Front-end base url
    this.baseUrl = `${window.location.protocol}//${document.domain}:`;

    //Get Max memory info form device
    this.totalMemory = Math.floor(this.configData.memory.total / 1048576);
    this.initData.memory = this.totalMemory

    //Handling network types
    this.tempNetworks = this.configData.networks;
    this.networkModes = uniq(this.tempNetworks.map(item => {
      return item.driver
    }))
    this.networks = this.networkModes.map(item => {
      let tempitem = {}
      tempitem.driver = item
      tempitem.networks = this.tempNetworks.filter(net => {
        return net.driver == item
      })
      return tempitem
    })
    this.networks = orderBy(this.networks, ['driver'], ['asc']);

    //If it is edit, Init data
    if (this.initDatas != undefined) {
      this.isLoading = false
      this.initData = this.initDatas
      this.webui = this.initDatas.port_map + this.initDatas.index
      this.currentSlide = 1
    } else {

      let gg = find(this.tempNetworks, (o) => {
        return o.driver == "bridge"
      })
      this.initData.network_model = gg.length > 0 ? gg[0].name : "bridge";
      let appData = localStorage.getItem("app_data")
      if (!isNull(appData)) {
        this.initData = JSON.parse(appData)
      }
      this.getStoreList()
    }


  },
  computed: {

    showPorts() {
      if (this.initData.network_model.toLowerCase().indexOf("macvlan") > -1 || this.initData.network_model.indexOf("host") > -1) {
        return false
      } else {
        return true
      }
    },
    showHostPort() {
      if (this.initData.network_model.indexOf("host") > -1) {
        return false
      } else {
        return true
      }
    },
    showImportButton() {
      return this.currentSlide == 1 && this.state == 'install'
    },
    showExportButton() {
      return this.currentSlide == 1 && this.state == 'update'

    },
    showTerminalButton() {
      return this.currentSlide == 1 && this.state == 'update' && this.runningStatus == 'running'
    },
    panelTitle() {
      if (this.currentSlide == 0) {
        return "Featured Apps";
      } else if (this.currentSlide == 1) {
        return (this.initDatas != undefined) ? this.initData.label + " Setting" : "Install a new App manually"
      } else {
        return "Installing " + this.initData.image
      }
    }

  },
  methods: {
    /**
     * @description: Get App store list
     * @param {*}
     * @return {*} array
     */
    getStoreList() {
      this.isLoading = true
      this.$api.app.storeList({ index: this.pageIndex, size: this.pageSize }).then(res => {
        this.isLoading = false
        if (res.data.success == 200) {
          this.listTotal = res.data.data.count
          this.pageList = res.data.data.items
        }
      })
    },
    /**
         * @description: Quick Install App from app store
         * @param {*}
         * @return {*} void
         */
    qucikInstall(id) {
      this.currentInstallId = id
      this.$api.app.storeAppInfo(id).then(resp => {
        if (resp.data.success == 200) {
          let respData = resp.data.data
          this.initData.port_map = respData.port_map
          this.initData.cpu_shares = 50
          this.initData.memory = respData.max_memory
          this.initData.restart = "always"
          this.initData.label = upperFirst(respData.title)
          this.initData.position = true
          this.initData.index = respData.index
          this.initData.icon = respData.icon
          this.initData.network_model = respData.network_model
          this.initData.image = respData.image
          this.initData.description = respData.description
          this.initData.origin = respData.origin
          this.initData.ports = isNull(respData.ports) ? [] : respData.ports
          this.initData.volumes = isNull(respData.volumes) ? [] : respData.volumes
          this.initData.envs = isNull(respData.envs) ? [] : respData.envs
          this.initData.devices = isNull(respData.devices) ? [] : respData.devices
          this.currentInstallId = 0
          if (respData.tip !== "") {
            this.$buefy.dialog.confirm({
              title: 'Attention',
              message: respData.tip,
              type: 'is-dark',
              onConfirm: () => {
                this.installAppData(id)
              }
            })
          } else {
            this.installAppData(id)
          }
        }
      })
    },


    /**
     * @description: Process the datas before submit
     * @param {*}
     * @return {*} void
     */
    processData() {
      // GET port map and index
      if (this.webui != "") {
        let slashArr = this.webui.split("/")
        this.initData.port_map = slashArr[0]
        this.initData.index = "/" + slashArr.slice(1).join("/");

        console.log(this.initData.index);
      }

      let model = this.initData.network_model.split("-");
      this.initData.network_model = model[0]
    },

    /**
     * @description: Back to prev Step
     * @param {*}
     * @return {*} void
     */
    prevStep() {
      this.currentSlide--;
    },

    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean} 
     */
    async checkStep(ref) {
      let isValid = await ref.validate()
      return isValid
    },

    /**
     * @description: Submit datas after valid
     * @param {*}
     * @return {*} void
     */
    installApp() {
      this.checkStep(this.$refs.ob1).then(val => {
        if (val) {
          this.installAppData(this.id);
        }
      })
    },

    installAppData(id) {
      this.processData();
      this.isLoading = true;
      this.$api.app.install(id, this.initData).then((res) => {
        this.isLoading = false;
        if (res.data.success == 200) {
          this.currentSlide = 2;
          this.cancelButtonText = "Continue in background"
          this.checkInstallState(res.data.data)
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-warning'
          })
        }
      })
    },

    /**
     * @description: Check the installation process every 250 milliseconds
     * @param {String} appId
     * @return {*} void
     */
    checkInstallState(appId) {
      this.timer = setInterval(() => {
        this.updateInstallState(appId)
      }, 250)
    },

    /**
     * @description: Update the installation status to the UI
     * @param {String} appId
     * @return {*} void
     */
    updateInstallState(appId) {
      this.$api.app.state(appId).then((res) => {
        let resData = res.data.data;
        this.installPercent = resData.speed;
        this.errorType = resData.type;
        if (this.errorType == 4) {
          try {
            let info = JSON.parse(resData.message)
            let id = (info.id != undefined) ? info.id : "";
            let progress = ""
            if (info.progressDetail != undefined) {
              let progressDetail = info.progressDetail
              if (!isNaN(progressDetail.current / progressDetail.total)) {
                progress = `[ ${String(Math.floor((progressDetail.current / progressDetail.total) * 100))}% ]`
              }
            }
            let status = info.status
            this.installText = status + ":" + id + " " + progress
          } catch (error) {
            console.log(error);
          }
        } else {
          this.installText = resData.message
        }

        if (resData.message == "installed") {
          localStorage.removeItem("app_data")
          clearInterval(this.timer)
          let _this = this
          setTimeout(() => {
            _this.$emit('updateState')
            _this.$emit('close')
          }, 1000)
        }
      })
    },

    /**
     * @description: Save edit update
     * @return {*} void
     */
    updateApp() {
      this.processData();
      this.isLoading = true;
      this.$api.app.updateContainerSetting(this.id, this.initData).then((res) => {
        if (res.data.success == 200) {
          this.isLoading = false;
          this.$emit('updateState')
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-warning'
          })
        }
        this.$emit('close')
      })
    },

    /**
     * @description: Show import panel
     * @return {*} void
     */
    showImportPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: ImportPanel,
        hasModalCard: true,
        customClass: '',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-out",
        events: {
          'update': (e) => {
            //localStorage.removeItem("app_data")
            this.initData = e
            this.webui = this.initData.port_map + this.initData.index
            this.changeIcon(this.initData.image)
            this.$buefy.dialog.alert({
              title: '⚠️ Attention',
              message: `<div class="nobrk"><h4 class="title is-5">AutoFill only helps you to complete most of the configuration. </h4>
                        <p class="mb-3">Some configuration information such as:</p>
                        <ul>
                        <li>1. the port and path of the Web UI</li>
                        <li>2. the mount location of the volume or file</li>
                        <li>3. the port mapping of the Host</li>
                        <li>4. optional configuration items</li>
                        </ul>
                        <p class="mt-3">These include but are not limited to these cases and <b>still need to be confirmed or modified by you.</b></p>
                        <p class="mt-3">Feel free to suggest improvements to this feature in Discord Server!</p></div>`,
              type: 'is-dark'
            })
          }
        },
        props: {
          initData: this.initData,
          netWorks: this.networks,
          oriNetWorks: this.tempNetworks,
          deviceMemory: this.totalMemory
        }
      })
    },

    /**
     * @description: Get remote synchronization information
     * @param {*} function
     * @return {*} void
     */
    getAsyncData: debounce(function (name) {
      if (!name.length) {
        this.data = []
        return
      }
      this.isFetching = true
      axios.get(`https://hub.docker.com/api/content/v1/products/search?source=community&q=${name}&page=1&page_size=4`)
        .then(({ data }) => {
          this.data = []
          data.summaries.forEach((item) => this.data.push(item.name))
        })
        .catch((error) => {
          this.data = []
          throw error
        })
        .finally(() => {
          this.isFetching = false
        })
    }, 500),
    /**
       * @description: Export AppData to json file
       * @param {*} function
       * @return {*} void
       */
    exportJSON() {
      // 将json转换成字符串
      let exportData = { ...this.initData };
      exportData.network_model = this.getNetworkName(this.initData.network_model);
      exportData.version = "1.0"
      delete exportData.memory
      const data = JSON.stringify(exportData);
      const blob = new Blob([data], { type: '' });
      FileSaver.saveAs(blob, `${exportData.label}.json`);
    },

    /**
     * @description: Get Network name from network list
     * @param {*} 
     * @return {*} String
     */
    getNetworkName(netId) {
      if (netId == "") {
        return "bridge"
      } else {
        let network = this.tempNetworks.filter(net => {
          return net.name == netId
        })
        return network[0].name
      }
    },

    /**
     * @description: Change App icon when image changed
     * @param {*} function
     * @return {*} void
     */
    changeIcon(e) {
      if (e == "") {
        this.initData.icon = "";
      } else {
        let appIcon = e.split(":")[0].split("/").pop();
        this.initData.icon = `https://cdn.jsdelivr.net/gh/IceWhaleTech/AppIcon@main/all/${appIcon}.png`;
      }
    },

    /**
     * @description: Show Terminal & Logs panel
     * @return {*} void
     */

    showTerminalPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: AppTerminalPanel,
        hasModalCard: true,
        customClass: 'terminal-modal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-out",
        props: {
          appid: this.id,
          appName: this.initData.label
        }
      })
    },
  },
  watch: {
    pageIndex() {
      this.getStoreList()
    },
    initData: {
      handler(val) {
        if (this.state == 'install') {
          localStorage.setItem("app_data", JSON.stringify(val))
        }

      },
      deep: true
    }

  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>
