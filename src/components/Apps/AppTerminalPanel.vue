<!--
 * @Author: JerryK
 * @Date: 2021-10-29 15:38:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-15 18:01:25
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/Apps/AppTerminalPanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="close-container">
        <button type="button" class="delete" @click="$emit('close')"/>
      </div>
      <h3 class="title is-3">{{ appName }}</h3>
      <div class="is-flex-grow-1">
        <b-tabs :animated="false" @input="onInput">
          <b-tab-item :label="$t('Terminal')" value="terminal">
            <terminal-card ref="terminal" :initWsUrl="wsUrl"></terminal-card>
          </b-tab-item>
          <b-tab-item :label="$t('Logs')" value="logs">
            <logs-card ref="logs" :data="logData"></logs-card>
          </b-tab-item>
        </b-tabs>

      </div>

    </section>
    <!-- Modal-Card Body End -->

    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </div>
</template>

<script>
import TerminalCard from '@/components/logsAndTerminal/TerminalCard.vue';
import LogsCard from '@/components/logsAndTerminal/LogsCard.vue'

export default {
  name: 'app-terminal-panel',
  components: {
    TerminalCard,
    LogsCard
  },
  data() {
    return {
      isLoading: false,
      wsUrl: `ws://${this.$baseURL}/v1/container/${this.appid}/terminal?token=${this.$store.state.access_token}`,
      logData: ""
    }
  },
  props: {
    appid: String,
    appName: String
  },
  mounted() {
    this.getLogs();
  },
  methods: {
    getLogs() {
      this.$api.container.getLogs(this.appid).then((res) => {
        if (res.data.success == 200) {
          let data = res.data.data
          let replaceData = data.replace(/\n(.{8})/gu, '\n');
          this.logData = replaceData.substring(8, replaceData.length - 1);
        }
      })
    },
    onInput(e) {
      if (e == "terminal") {
        this.$refs.terminal.active(true)
        this.$refs.logs.active(false)
      } else {
        this.$refs.terminal.active(false)
        this.$refs.logs.active(true)
      }
    }
  },
}
</script>

<style>
</style>
