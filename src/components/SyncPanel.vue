<!--
 * @Author: JerryK
 * @Date: 2021-11-10 18:22:36
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-12 17:58:32
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
              <span class="dot" :class="{'active':step ==1}" data-title="1">Install</span>
            </div>
            <div class="column has-text-centered">
              <span class="dot " :class="{'active':step ==2}" data-title="2">Congifuration</span>
            </div>
            <div class="column has-text-centered">
              <span class="dot " :class="{'active':step ==3}" data-title="3">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Steps End -->

      <div>
        <div class="step1 has-text-centered " v-if="step == 1">
          <h1 class="title is-5 has-text-weight-normal">Download Syncthing on the device you want to sync with CasaOS</h1>
          <div class="is-flex is-justify-content-center mt-6">
            <b-image :src="require('@/assets/img/macos.svg')" class="is-176x176"></b-image>
          </div>
          <p class="control is-flex is-justify-content-center mt-5">
            <b-button type="is-dark" size="is-large" label="Get Syncthing for macOS" rounded />
          </p>
          <div class="columns is-mobile">
            <div class="column is-8 is-offset-2">
              <div class="columns is-mobile steps">
                <div class="column has-text-centered">
                  <b-button type="is-dark" label="Get Syncthing for Windows x64" rounded />
                </div>
                <div class="column has-text-centered">
                  <b-button type="is-dark" label="Get Syncthing for Windows x32" rounded />
                </div>

              </div>
              <div class="columns is-mobile steps">
                <div class="column has-text-centered">
                  <b-button type="is-dark" label="Get Syncthing for macOS" rounded />
                </div>
                <div class="column has-text-centered">
                  <b-button type="is-dark" label="Get Syncthing for Andorid" rounded />
                </div>
              </div>
            </div>
          </div>
          <p class="control is-flex is-justify-content-center mt-5 mb-5">
            <b-button type="is-ghost" label="Show all Platforms" rounded />
          </p>

          <p class="is-flex is-align-items-center is-size-65 is-justify-content-center">
            <b-icon icon="information" class="mr-2" style="color:#F8D149" /> Install and open the downloaded application, then click the "Next" button.
          </p>
        </div>
        <div class="step2" v-if="step == 2 ">
          <b-field label="Device ID" expanded>
            <b-input placeholder="Fill in your Device ID to continue" v-model="deviceId" expanded></b-input>
            <p class="control">
              <b-button type="is-primary" label="Submit" />
            </p>
          </b-field>

          <h3 class="title is-6 mt-5 mb-3">{{helpTitle}}</h3>
          <b-tabs v-model="activeTab">
            <b-tab-item label="Windows" icon="microsoft-windows" key="windows" value="windows">
              <div class="t-box">
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>
                Transforms text weight to light<br>

              </div>

            </b-tab-item>
            <b-tab-item label="macOS" icon="apple" key="macos" value="macos">
              <div class="t-box">
                dsadas
              </div>
            </b-tab-item>
            <b-tab-item label="Android" icon="android" key="android" value="android">
              <div class="t-box">
                dsadas
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
      <div class="flex1 is-flex is-align-items-center is-justify-content-center pl-7">
        <p class="mr-2 is-size-7 has-text-grey	">Powered by</p>
        <b-image :src="require('@/assets/img/syncthing.svg')" class="syncthing-logo"></b-image>
      </div>

      <div>
        <b-button label="Next" type="is-primary" @click="nextStep" rounded />
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

const SYNCTHING_GITURL = `https://api.github.com/repos/syncthing/syncthing/releases/latest`

export default {
  name: "sync-panel",
  components: {
    LottieAnimation
  },
  mixins: [smoothReflow],
  data() {
    return {
      step: 1,
      syncthingDownloadUrl: "",
      syncthingDownloadUrl1: "",
      broswerUA: {},
      zipType: ".zip",
      deviceId: "",
      activeTab: 'macos',
      //helpTitle: 'How to get Device ID',
      helpTitle: 'Next actions on your device',
    }
  },

  created() {
    const parser = new UAParser();
    console.log(parser.getResult());
    this.broswerUA = parser.getResult();
  },
  mounted() {
    this.$smoothReflow({
      el: '.modal-card',
      property: ['height', 'width'],
      transition: 'height .25s ease, width .75s ease-out'
    })
    axios.get(SYNCTHING_GITURL)
      .then(({ data }) => {
        const tagName = data.tag_name;
        switch (this.broswerUA.os.name) {
          case "Android":
            this.syncthingDownloadUrl = `https://play.google.com/store/apps/details?id=com.nutomic.syncthingandroid`
            this.syncthingDownloadUrl1 = `https://f-droid.org/repo/com.nutomic.syncthingandroid_4286.apk`
            break;
          case "iOS":
            this.syncthingDownloadUrl = ``
            break;
          default:
            this.syncthingDownloadUrl = `https://github.com/syncthing/syncthing/releases/download/${tagName}/syncthing-${this.getOS()}-${this.getArchitecture()}-${tagName}${this.zipType}`
            break;
        }

        console.log(this.syncthingDownloadUrl);
      })
      .catch((error) => {
        throw error
      })
      .finally(() => {
      })
  },

  methods: {
    getOS() {
      let finalOS = ""
      switch (this.broswerUA.os.name) {
        case "Mac OS":
          finalOS = "macos"
          this.zipType = ".zip"
          break;
        case "Windows":
          finalOS = "windows"
          this.zipType = ".zip"
          break;
        default:
          finalOS = "linux"
          this.zipType = ".tar.gz"
          break;
      }
      return finalOS;
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