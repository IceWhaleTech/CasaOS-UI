<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:48:25
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-12 14:02:22
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/SyncBlock.vue
-->
<template>
  <div class="column is-one-half">
    <div class="wuji-card">
      <!-- Init State Start -->
      <template v-if="state == 1">
        <h6 class="title is-6 mb-2 has-text-white">Sync your data</h6>
        <div class="is-flex is-align-items-center">
          <div class="info ">
            <div class="des two-line">
              Follow the guide to start syncing your files across multiple devices.
            </div>
          </div>
          <b-image :src="require('@/assets/img/sync_icon.png')" class="is-64x64"></b-image>
        </div>
        <div class="buttons">
          <b-button type="is-primary" size="is-small" rounded @click="openSyncPanel">Go !</b-button>
        </div>
      </template>
      <!-- Init State End -->

      <!-- Status State Start -->
      <template v-if="state == 2">
        <div class="is-flex is-align-items-center">
          <div class="flex1">
            <h6 class="title is-6 mb-2 has-text-white">Sync your data</h6>
          </div>
          <div class="is-flex is-align-items-center">
            <b-tooltip label="Add New Device" position="is-top" type="is-dark">
              <button type="button" class="icon-button-new mdi mdi-plus" />
            </b-tooltip>
            <b-tooltip label="Config" position="is-top" type="is-dark">
              <button type="button" class="icon-button-new mdi mdi-cog-outline" />
            </b-tooltip>
          </div>
        </div>

        <div class="columns mb-0 mt-2 is-mobile">
          <div class="column is-flex  is-align-items-center">
            <b-image :src="require('@/assets/img/device.png')" class="is-32x32"></b-image>
            <div class="flex1">
              <p class="is-size-65 ml-2 one-line">Up to Date {{activeDevice}}/{{totalDevice}}</p>
            </div>
          </div>
          <div class="column is-flex  is-align-items-center">
            <b-image :src="require('@/assets/img/folder1.png')" class="is-32x32"></b-image>
            <div class="flex1">
              <p class="is-size-65 ml-2 one-line">Up to Date 3/4</p>
            </div>
          </div>
        </div>

        <div class="columns mb-0 mt-1 is-mobile">
          <div class="column pt-0 pb-0 is-flex  is-align-items-center is-size-65">
            <b-icon icon="check-circle" class="mr-1"></b-icon>
            Synchronized
          </div>
          <div class="column pt-0 pb-0 is-flex  is-align-items-center is-size-65 is-justify-content-end ">
            <b class="one-line">Total：88.8 Mb</b>
          </div>
        </div>

      </template>
      <!-- Status State End -->

    </div>
  </div>
</template>

<script>
import SyncPanel from './SyncPanel.vue'
import axios from 'axios'
//axios.defaults.headers.common['X-API-Key'] = `uZnepMtkYEfMaCGmJEeKRzCaHMjVzJq7`;
const TEST_URL = "http://192.168.2.217:8384"
export default {
  name: "sync-block",
  components: {

  },
  data() {
    return {
      isLoading: false,
      state: 1,
      timer: 0,
      connection: {},
      devices: [],
      totalDevice: 1,
      activeDevice: 1
    }
  },

  mounted() {
    // this.$api.sync.getConfig().then(res => {
    //   console.log(res.data);
    // })

    if (this.timer) {
      clearInterval(this.timer)
    }
    this.getConnections();
    this.getStatus();
    this.getConfigs();

    // this.timer = setInterval(() => {
    //   this.getStatus();
    //   this.getConnections();
    //   this.getConfigs();
    // }, 5000);




    // Get Events
    // axios.get(`${TEST_URL}/rest/events`).then(res => {
    //   let eventId = res.data.pop().id
    //   this.getEvents(eventId);
    // })

  },
  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    openSyncPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: SyncPanel,
        hasModalCard: true,
        customClass: 'sync-panel',
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
          state: "install",
        }
      })
    },
    //Events Long polling 
    getEvents(ll) {
      let _this = this
      console.log("requesting...");
      axios.get(`${TEST_URL}/rest/events?since=${ll}`, { timeout: 60000 })
        .then(response => {
          console.log(response.data); // This will sometime be empty
          ll = Number(response.data[0].id) + 1
          _this.getEvents(ll)
        })
        .catch(error => {
          console.log('People we have an error!', error);
          _this.getEvents(ll)
        });
    },
    getStatus() {
      axios.get(`${TEST_URL}/rest/system/status`).then(res => {
        console.log(res.data);
      })
    },
    getConnections() {
      axios.get(`${TEST_URL}/rest/system/connections`).then(res => {

        this.connection = res.data.connections
        // this.totalDevice = res.data.connections.filter(item => {
        //   return item.type !== ""
        // }).length;
      })
    },
    getDbStatus: async (fid) => {
      let data
      await axios.get(`${TEST_URL}/rest/db/status?folder=${fid}`).then(res => {
        data = res.data
      })
      return data
    },
    getConfigs() {
      axios.get(`${TEST_URL}/rest/config`).then(res => {
        console.log('configs', res.data);
        this.state = (res.data.devices.length > 0) ? 1 : 1;
        this.devices = res.data.devices.map(item => {
          item.fullData = this.connection[item.deviceID]
          return item
        });
        this.totalDevice = this.devices.filter(item => {
          return item.fullData.type !== ""
        }).length;

        this.activeDevice = this.devices.filter(item => {
          return item.fullData.type !== "" && item.fullData.connected
        }).length;
        res.data.folders.map(folder => {
          this.getDbStatus(folder.id).then(res => {
            folder.status = res
          })
          //folder.status = this.getDbStatus(folder.id)
          console.log(folder);
        })
      })
    },
  },
}
</script>

<style>
</style>