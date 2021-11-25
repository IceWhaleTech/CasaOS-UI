<!--
 * @Author: JerryK
 * @Date: 2021-11-10 18:22:36
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-25 17:09:01
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
        <div class="column is-8 is-offset-2 is-12-mobile is-offset-0-mobile">
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
              <b-button type="is-dark" size="is-large" :label="`Get Syncthing for ${broswerUA.os.name}`" :loading="isGettingUrl" @click="getDownloadUrl(osName)" rounded />
            </p>
            <p class="control is-flex is-justify-content-center" v-if="platform == 'android'">
              <b-button type="is-ghost" label="Download APK" @click="getDownloadUrl('Android','apk')" rounded />
            </p>
          </template>
          <div class="columns is-mobile  mt-4" v-if="showMore">
            <div class="column is-8 is-offset-2">
              <div class="columns is-mobile ">
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Syncthing Win x64" @click="getDownloadUrl('Windows','x64')" rounded />
                  </p>
                </div>
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Syncthing Win x32" @click="getDownloadUrl('Windows','x64')" rounded />
                  </p>
                </div>

              </div>
              <div class="columns is-mobile">
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Syncthing macOS" @click="getDownloadUrl('macOS')" rounded />
                  </p>
                </div>
                <div class="column has-text-centered">
                  <p class="control is-flex is-justify-content-center">
                    <b-button type="is-dark" label="Syncthing Andorid" @click="downloadSyncthing(syncthingAndroidDlUrl)" rounded />

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

          <p class="is-flex is-align-items-top is-size-65 is-justify-content-center">
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
                      <b-image :src="require(`@/assets/syncthing_tutorials/Windows-ShowID.png`)" class="t-img t-img-2"></b-image>
                      <b-image :src="require(`@/assets/syncthing_tutorials/Windows-DeviceID.png`)" class="t-img"></b-image>
                    </li>

                  </ol>
                </div>
                <div v-if="isSubmited">
                  <ol>
                    <li>Add new device on your device</li>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Windows-NewDevice.png`)" class="t-img"></b-image>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Windows-NewDeviceSave.png`)" class="t-img"></b-image>
                    <li>Add new folder on your device</li>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Windows-NewFolder.png`)" class="t-img"></b-image>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Windows-NewFolderSave.png`)" class="t-img"></b-image>
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
                    <li>Find the Syncthing icon in the menubar
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-icon.png`)" class="t-img t-img-1"></b-image>
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-Config.png`)" class="t-img t-img-2"></b-image>
                    </li>
                    <li>Find the Device ID
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-ShowID.png`)" class="t-img t-img-2"></b-image>
                      <b-image :src="require(`@/assets/syncthing_tutorials/macOS-DeviceID.png`)" class="t-img"></b-image>
                    </li>
                  </ol>
                </div>
                <div v-if="isSubmited">
                  <ol>
                    <li>Add new device on your device</li>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Windows-NewDevice.png`)" class="t-img"></b-image>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Windows-NewDeviceSave.png`)" class="t-img"></b-image>
                    <li>Add new folder on your device</li>
                    <b-image :src="require(`@/assets/syncthing_tutorials/macOS-NewFolder.png`)" class="t-img"></b-image>
                    <b-image :src="require(`@/assets/syncthing_tutorials/macOS-NewFolderSave.png`)" class="t-img"></b-image>
                    <li>Done!</li>
                  </ol>
                </div>
              </div>
            </b-tab-item>
            <b-tab-item label="Android" icon="android" key="android" value="android">
              <div class="t-box">
                <div v-if="!isSubmited">
                  <ol>
                    <li>Open Syncthing</li>
                    <li>Open the menu
                      <b-image :src="require(`@/assets/syncthing_tutorials/Android-Menu.png`)" class="t-img t-img-3"></b-image>
                    </li>
                    <li>Choose "Show device ID"
                      <b-image :src="require(`@/assets/syncthing_tutorials/Android-ShowDeviceID.png`)" class="t-img t-img-3"></b-image>
                    </li>
                    <li>Copy the Device ID
                      <b-image :src="require(`@/assets/syncthing_tutorials/Android-DeviceID.png`)" class="t-img t-img-3"></b-image>
                    </li>
                  </ol>
                </div>
                <div v-if="isSubmited">
                  <ol>
                    <li>Add new device on your device</li>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Android-NewDevice.png`)" class="t-img  t-img-3"></b-image>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Android-NewDeviceAdd.png`)" class="t-img  t-img-3"></b-image>
                    <li>Add new folder on your device</li>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Android-NewFolder.png`)" class="t-img  t-img-3"></b-image>
                    <b-image :src="require(`@/assets/syncthing_tutorials/Android-NewFolderCreate.png`)" class="t-img  t-img-3"></b-image>
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


const SYNCTHING_GOOGLEPLAY_URL = `https://play.google.com/store/apps/details?id=com.nutomic.syncthingandroid`
const SYNCTHING_APK_URL = `https://f-droid.org/repo/com.nutomic.syncthingandroid_4286.apk`

const SYNCTRAY_GITURL = `https://api.github.com/repos/canton7/SyncTrayzor/releases/latest`
const SYNCTRAY_GIT_RELEASE_URL = `https://github.com/canton7/SyncTrayzor/releases/download/`

const SYNCTHING_MAC_GITURL = `https://api.github.com/repos/syncthing/syncthing-macos/releases/latest`
const SYNCTHING_MAC_GIT_RELEASE_URL = `https://github.com/syncthing/syncthing-macos/releases/download/`

export default {
  name: "sync-panel",
  components: {
    LottieAnimation
  },
  mixins: [smoothReflow],
  data() {
    return {
      isLoading: true,
      isGettingUrl: false,
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
      isValId: false,
      syncXhr: Object,
      syncBaseURL: ""
    }
  },

  created() {
    this.syncBaseURL = (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${this.$store.state.syncthingPort}` : `${document.location.protocol}//${document.location.hostname}:${this.$store.state.syncthingPort}`
    this.syncXhr = axios.create({
      baseURL: this.syncBaseURL
    });
    this.syncXhr.defaults.headers.common['X-API-Key'] = this.$store.state.syncthingKey;

    const parser = new UAParser();
    this.broswerUA = parser.getResult();
    this.getOSIcon()
    // axios.get(SYNCTHING_GITURL)
    //   .then(({ data }) => {
    //     this.isLoading = false;
    //     const tagName = data.tag_name;
    //     this.getOS(tagName)
    //     this.syncthingMacDlUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-macos-universal-${tagName}.zip`
    //     this.syncthingWindows64DlUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-windows-amd64-${tagName}.zip`
    //     this.syncthingWindows32DlUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-windows-386-${tagName}.zip`
    //     this.syncthingAndroidDlUrl = SYNCTHING_GOOGLEPLAY_URL
    //     this.syncthingAndroidDlUrl1 = SYNCTHING_APK_URL
    //   })
    //   .catch((error) => {
    //     throw error
    //   })
    //   .finally(() => {
    //   })
  },
  mounted() {
    this.$smoothReflow({
      el: '.modal-card',
      property: ['height', 'width'],
      transition: 'height .25s ease, width .75s ease-out'
    })

  },

  methods: {
    getOSIcon() {
      switch (this.broswerUA.os.name) {
        case "Mac OS":
          this.platform = this.icon = "macos";
          this.osName = "macOS"

          break;
        case "Windows":
          this.platform = this.icon = "windows";
          this.osName = "Windows"

          break;
        case "Android":
          this.platform = this.icon = "android";
          this.osName = "Android"

          break;
        case "iOS":
          this.platform = this.icon = "syncthing";
          this.osName = "iOS"
          this.showMore = true;

          break;
        default:
          this.platform = this.icon = "linux";
          this.osName = "Linux";

          break;
      }
    },
    getDownloadUrl(os, arch = "") {
      console.log(os);
      this.isGettingUrl = true;
      switch (os) {
        case "macOS":
          axios.get(SYNCTHING_MAC_GITURL)
            .then(({ data }) => {
              const tagName = data.tag_name;
              const tagNameDl = tagName.replace('v', "")
              let url = `${SYNCTHING_MAC_GIT_RELEASE_URL}${tagName}/Syncthing-${tagNameDl}.dmg`
              this.downloadSyncthing(url)
            })
          break;
        case "Windows":
          axios.get(SYNCTRAY_GITURL)
            .then(({ data }) => {
              const tagName = data.tag_name;
              let url = (arch == "") ? `${SYNCTRAY_GIT_RELEASE_URL}${tagName}/SyncTrayzorSetup-x64.exe` : `${SYNCTRAY_GIT_RELEASE_URL}${tagName}/SyncTrayzorSetup-${arch}.exe`
              this.downloadSyncthing(url)
            })
          break;
        case "Android":
          if (arch == "google") {
            this.downloadSyncthing(SYNCTHING_GOOGLEPLAY_URL);
          } else if (arch == "apk") {
            this.downloadSyncthing(SYNCTHING_APK_URL);
          } else {
            this.downloadSyncthing(SYNCTHING_GOOGLEPLAY_URL);
          }
          break;
      }
    },
    // getOS(tagName) {
    //   switch (this.broswerUA.os.name) {
    //     case "Mac OS":
    //       this.syncthingDownloadUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-${this.platform}-${this.getArchitecture()}-${tagName}.zip`
    //       break;
    //     case "Windows":
    //       this.syncthingDownloadUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-${this.platform}-${this.getArchitecture()}-${tagName}.zip`
    //       break;
    //     case "Android":
    //       this.syncthingAndroidDlUrl = SYNCTHING_GOOGLEPLAY_URL
    //       this.syncthingAndroidDlUrl1 = SYNCTHING_APK_URL
    //       break;
    //     case "iOS":
    //       this.syncthingDownloadUrl = ``
    //       break;
    //     default:
    //       this.syncthingDownloadUrl = `${SYNCTHING_GIT_RELEASE_URL}${tagName}/syncthing-${this.platform}-${this.getArchitecture()}-${tagName}.tar.gz`
    //       break;
    //   }
    // },
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
      console.log(url);
      if (url == SYNCTHING_GOOGLEPLAY_URL) {
        target = "_blank"
      }
      this.isGettingUrl = false;
      window.open(url, target);
    },
    showMorePlatform() {
      this.icon = "syncthing";
      this.showMore = true;
    },
    checkDeviceId() {
      this.syncXhr.get(`/rest/svc/deviceid?id=${this.deviceId}`).then(res => {
        if (res.data.id) {
          this.isValId = true;
        } else {
          this.isValId = false;
        }
      })
    },
    submitNewDevice() {
      this.isSubmiting = true
      this.syncXhr.get(`/rest/config`).then(res => {
        this.syncConfig = res.data
        let newDevice = this.genNewDevice(this.deviceId)
        this.syncConfig.devices.push(newDevice);
        this.syncConfig.folders = this.createShareFolder(this.syncConfig.folders)
        this.syncXhr.put(`/rest/config`, this.syncConfig).then(res => {
          this.isSubmiting = false;
          if (res.status == 200) {
            this.isSubmited = true;
            this.helpTitle = "What do I need to do on my device?";
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