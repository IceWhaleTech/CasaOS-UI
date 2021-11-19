<!--
 * @Author: JerryK
 * @Date: 2021-11-10 18:22:36
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-16 10:56:15
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/SyncPanel.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">Sync Guide</h3>
      </div>
      <div class="is-flex is-align-items-center">

        <div class="is-flex is-align-items-center modal-close-container">
          <button type="button" class="delete" @click="$emit('close')" />
        </div>

      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">
      <!-- Steps Start -->
      <div class="columns is-mobile">
        <div class="column is-8 is-offset-2">
          <div class="columns is-mobile steps">
            <div class="column has-text-centered">
              <span class="dot" :class="[{'active':step == 1},{'ok-dot':step > 1}]" data-title="1">Install</span>
            </div>
            <div class="column has-text-centered">
              <span class="dot " :class="[{'active':step == 2},{'ok-dot':step > 2}]" data-title="2">Config</span>
            </div>
            <div class="column has-text-centered">
              <span class="dot " :class="[{'active':step == 3},{'ok-dot':step > 2}]" data-title="3">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Steps End -->

      <div>
        <div class="step1 has-text-centered " v-if="step == 1">
          <h1 class="title is-5 has-text-weight-normal">Download Syncthing on the device you want to sync with CasaOS</h1>
          <div class="is-flex is-justify-content-center mt-6">
            <b-image :src="require(`@/assets/img/${icon}.svg`)" class="is-176x176"></b-image>
          </div>
          <template v-if="!showMore">
            <p class="control is-flex is-justify-content-center mt-5">
              <b-button type="is-dark" size="is-large" :label="`Get Syncthing for ${broswerUA.os.name}`" @click="downloadSyncthing(syncthingDownloadUrl)" rounded />
            </p>
            <p class="control is-flex is-justify-content-center" v-if="platform == 'android'">
              <b-button type="is-ghost" label="Download APK" @click="downloadSyncthing(syncthingAndroidDlUrl1)" rounded />
            </p>
          </template>
          <div class="columns is-mobile  mt-4" v-if="showMore">
            <div class="column is-8 is-offset-2">
              <div class="columns is-mobile ">
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Get Syncthing for Win x64" @click="downloadSyncthing(syncthingWindows64DlUrl)" rounded />
                  </p>
                </div>
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Get Syncthing for Win x32" @click="downloadSyncthing(syncthingWindows32DlUrl)" rounded />
                  </p>
                </div>

              </div>
              <div class="columns is-mobile">
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Get Syncthing for macOS" @click="downloadSyncthing(syncthingMacDlUrl)" rounded />
                  </p>
                </div>
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Get Syncthing for Andorid" @click="downloadSyncthing(syncthingAndroidDlUrl)" rounded />

                  </p>
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-ghost" label="Download APK" @click="downloadSyncthing(syncthingAndroidDlUrl1)" rounded />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p class="control is-flex is-justify-content-center mt-5 mb-5" v-if="!showMore">
            <b-button type="is-ghost" label="Show all Platforms" rounded @click="showMorePlatform" />
          </p>

          <p class="is-flex is-align-items-center is-size-65 is-justify-content-center">
            <b-icon icon="information" class="mr-2" style="color:#F8D149" /> Install and open the downloaded application, then click the "Next" button.
          </p>
        </div>
        <div class="step2" v-if="step == 2 ">
          <b-field label="Device ID" expanded>
            <b-input placeholder="Fill in your Device ID to continue" v-model="deviceId" @input="checkDeviceId" :disabled="isSubmited" expanded></b-input>
            <p class="control">
              <b-button type="is-primary" label="Submit" @click="submitNewDevice" :loading="isSubmiting" :disabled="!isValId || isSubmited" />
            </p>
          </b-field>

          <h3 class="title is-6 mt-5 mb-3">{{helpTitle}}</h3>
          <b-tabs v-model="platform">
            <b-tab-item label="Windows" icon="microsoft-windows" key="windows" value="windows">
              <div class="t-box">
                <div v-if="!isSubmited">
                  <ol>
                    <li>Open the SyncTrayzor</li>
                    <li>Find the Device ID
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-DefaultFolder-3.png`)" class="t-img"></b-image>
                    </li>
                    <li>Fill in the Device ID in the textbox below</li>

                  </ol>
                </div>
                <div v-if="isSubmited">
                  <ol>
                    <li>Add new device on your device</li>
                    <li>Add new folder on your device</li>
                    <li>Done!</li>
                  </ol>
                </div>
              </div>

            </b-tab-item>
            <b-tab-item label="macOS" icon="apple" key="macos" value="macos">
              <div class="t-box">
                <div v-if="!isSubmited">
                  <ol>
                    <li>Open Syncthing in the Launchpad</li>
                    <li>Find the Syncthing icon in the menu bar
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-DefaultFolder-3.png`)" class="t-img"></b-image>
                    </li>
                    <li>Remove the default folder</li>
                    <li>Find the Device ID</li>
                    <li>Fill in the Device ID in the textbox below</li>

                  </ol>
                </div>
                <div v-if="isSubmited">
                  <ol>
                    <li>Add new device on your device</li>
                    <li>Add new folder on your device</li>
                    <li>Done!</li>
                  </ol>
                </div>
              </div>
            </b-tab-item>
            <b-tab-item label="Android" icon="android" key="android" value="android">
              <div class="t-box">
                <div v-if="!isSubmited">
                  <ol>
                    <li>Open Syncthing in the Launchpad</li>
                    <li>Find the Syncthing icon in the menu bar
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-DefaultFolder-3.png`)" class="t-img"></b-image>
                    </li>
                    <li>Remove the default folder</li>
                    <li>Find the Device ID</li>
                    <li>Fill in the Device ID in the textbox below</li>

                  </ol>
                </div>
                <div v-if="isSubmited">
                  <ol>
                    <li>Add new device on your device</li>
                    <li>Add new folder on your device</li>
                    <li>Done!</li>
                  </ol>
                </div>
              </div>
            </b-tab-item>
            <!-- <b-tab-item label="Ubuntu" icon="ubuntu" key="ubuntu" value="ubuntu">
              <div class="t-box">
                dsadas
              </div>
            </b-tab-item> -->
          </b-tabs>

        </div>
        <div class="step3" v-if="step == 3">
          <div class="mt-6">
            <h3 class="title is-4 has-text-centered has-text-weight-normal">There you go!</h3>
            <h2 class="subtitle is-5 has-text-centered has-text-weight-light">Your data has started to sync.<br>
              It may take some minutes to fulfill synchronization.</h2>
            <div class="is-flex is-align-items-center is-justify-content-center">
              <lottie-animation class="animation" :animationData="require('@/assets/ani/sync.json')" :autoPlay="true" :loop="true"></lottie-animation>
            </div>
          </div>
        </div>
      </div>

    </section>
    <!-- Modal-Card Body End -->

    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center ">
      <div class="flex1 is-flex is-align-items-center is-justify-content-center " :class="{'pl-7':!(step == 2 && !isSubmited)}">
        <p class="is-size-7 has-text-grey	mr-2">Powered by</p>
        <b-image :src="require('@/assets/img/syncthing-logo.svg')" class="syncthing-logo"></b-image>
      </div>

      <div>
        <b-button v-show="step == 1 || (step == 2 && isSubmited)" label="Next" type="is-primary" @click="nextStep" rounded />
        <b-button v-show="step == 3" label="Close" type="is-primary" @click="$emit('close')" rounded />

      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import UAParser from 'ua-parser-js';
import LottieAnimation from "lottie-web-vue";
import smoothReflow from 'vue-smooth-reflow'
import axios from 'axios'
const syncXhr = axios.create({
  baseURL: 'http://192.168.2.217:8384'
});
syncXhr.defaults.headers.common['X-API-Key'] = `uZnepMtkYEfMaCGmJEeKRzCaHMjVzJq7`;

const SYNCTHING_GITURL = `https://api.github.com/repos/syncthing/syncthing/releases/latest`
const SYNCTHING_GIT_RELEASE_URL = "https://github.com/syncthing/syncthing/releases/download/"
export default {
  name: "sync-panel",
  components: {
    LottieAnimation
  },
  mixins: [smoothReflow],
  data() {
    return {
      isLoading: true,
      showMore: false,
      step: 1,
      broswerUA: {},
      icon: "casa",
      platform: "casa",
      osName: "",
      helpTitle: 'How to get Device ID',
      //helpTitle: 'Next actions on your device',
      syncthingDownloadUrl: "",
      syncthingMacDlUrl: "",
      syncthingWindows64DlUrl: "",
      syncthingWindows32DlUrl: "",
      syncthingAndroidDlUrl: "",
      syncthingAndroidDlUrl1: "",
      //Submit new device
      deviceId: "",
      syncConfig: {},
      isSubmiting: false,
      isSubmited: false,
      isValId: false
    }
  },

  created() {
    const parser = new UAParser();
    this.broswerUA = parser.getResult();
    axios.get(SYNCTHING_GITURL)
      .then(({ data }) => {
        this.isLoading = false;
        const tagName = data.tag_name;
        this.getOS(tagName)
        this.syncthingMacDlUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-macos-universal-${tagName}.zip`
        this.syncthingWindows64DlUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-windows-amd64-${tagName}.zip`
        this.syncthingWindows32DlUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-windows-386-${tagName}.zip`
        this.syncthingAndroidDlUrl = `https://play.google.com/store/apps/details?id=com.nutomic.syncthingandroid`
        this.syncthingAndroidDlUrl1 = `https://f-droid.org/repo/com.nutomic.syncthingandroid_4286.apk`
      })
      .catch((error) => {
        throw error
      })
      .finally(() => {
      })
  },
  mounted() {
    this.$smoothReflow({
      el: '.modal-card',
      property: ['height', 'width'],
      transition: 'height .25s ease, width .75s ease-out'
    })

  },

  methods: {
    getOS(tagName) {
      switch (this.broswerUA.os.name) {
        case "Mac OS":
          this.platform = this.icon = "macos";
          this.osName = "macOS"
          this.syncthingDownloadUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-${this.platform}-${this.getArchitecture()}-${tagName}.zip`
          break;
        case "Windows":
          this.platform = this.icon = "windows";
          this.osName = "Windows"
          this.syncthingDownloadUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-${this.platform}-${this.getArchitecture()}-${tagName}.zip`
          break;
        case "Android":
          this.platform = this.icon = "android";
          this.osName = "Android"
          this.syncthingDownloadUrl = `https://play.google.com/store/apps/details?id=com.nutomic.syncthingandroid`
          this.syncthingDownloadUrl1 = `https://f-droid.org/repo/com.nutomic.syncthingandroid_4286.apk`
          break;
        case "iOS":
          this.platform = this.icon = "ios";
          this.osName = "iOS"
          this.syncthingDownloadUrl = ``
          break;
        default:
          this.platform = this.icon = "linux";
          this.osName = "Linux";
          this.syncthingDownloadUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-${this.platform}-${this.getArchitecture()}-${tagName}.tar.gz`
          break;
      }
    },
    getArchitecture() {
      let arch = ""
      if (this.broswerUA.cpu.architecture == undefined) {
        arch = "universal"
      } else {
        arch = this.broswerUA.cpu.architecture
      }
      return arch
    },
    downloadSyncthing(url, isSelf = true) {
      let target = (isSelf) ? "_self" : "_blank"
      if (url == "https://play.google.com/store/apps/details?id=com.nutomic.syncthingandroid") {
        target = "_blank"
      }
      window.open(url, target);
    },
    showMorePlatform() {
      this.icon = "syncthing";
      this.showMore = true;
    },
    checkDeviceId() {
      syncXhr.get(`/rest/svc/deviceid?id=${this.deviceId}`).then(res => {
        if (res.data.id) {
          this.isValId = true;
        } else {
          this.isValId = false;
        }
      })
    },

    submitNewDevice() {
      this.isSubmiting = true
      syncXhr.get(`/rest/config`).then(res => {
        this.syncConfig = res.data
        let newDevice = this.genNewDevice(this.deviceId)
        this.syncConfig.devices.push(newDevice);
        this.syncConfig.folders = this.createShareFolder(this.syncConfig.folders)
        syncXhr.put(`/rest/config`, this.syncConfig).then(res => {
          this.isSubmiting = false;
          if (res.status == 200) {
            this.isSubmited = true;
            this.helpTitle = "Next actions on your device";
          }
        })
      })
    },
    // Create Share folder for new device
    createShareFolder(folders) {
      return folders.map(folder => {
        if (folder.id == "default") {
          folder.devices.push({ deviceID: this.deviceId })
        }
        return folder
      })
    },

    // Generate new Device with deviceId
    genNewDevice(deviceId) {
      return {
        deviceID: deviceId,
        addresses: [
          "dynamic"
        ],
        compression: "metadata",
        certName: "",
        introducer: false,
        skipIntroductionRemovals: false,
        introducedBy: "",
        paused: false,
        allowedNetworks: [],
        autoAcceptFolders: false,
        maxSendKbps: 0,
        maxRecvKbps: 0,
        ignoredFolders: [],
        maxRequestKiB: 0,
        untrusted: false,
        remoteGUIPort: 0
      }
    },

    nextStep() {
      this.step++;
    }
  },
}
</script>

<style>
.animation {
  width: 350px;
  height: 350px;
}
</style>