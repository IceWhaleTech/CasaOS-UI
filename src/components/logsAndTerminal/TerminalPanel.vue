<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-15 17:58:36
 * @FilePath: /CasaOS-UI/src/components/logsAndTerminal/TerminalPanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body " style="overflow:hidden">
      <h3 class="title is-3">CasaOS</h3>
      <div class="close-container">
        <button class="delete" type="button" @click="$emit('close')"/>
      </div>
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

    <b-loading v-model="isLoading" :is-full-page="false"></b-loading>
  </div>
</template>

<script>
import TerminalCard from './TerminalCard.vue';
import LogsCard from './LogsCard.vue';

export default {
  name: 'terminal-panel',
  components: {
    TerminalCard,
    LogsCard
  },
  data() {
    return {
      isLoading: false,
      wsUrl: ``,
      logData: "",
      timer: '',
    }
  },
  mounted() {
    this.getLogs();
    this.timer = setInterval(() => {
      this.getLogs();
    }, 1000 * 5);
  },
  methods: {
    getLogs() {
      this.$api.sys.getLogs().then(res => {
        let data = res.data.data
        let replaceData = data.replace(/\n(.{8})/gu, '\n');
        this.logData = replaceData.substring(8, replaceData.length - 1);
      })
    },
    onInput(e) {
      if (e == "terminal") {
        this.$refs.terminal.active(true)
        this.$refs.logs.active(false)
        this.$messageBus('terminallogs_terminal')
      } else {
        this.$refs.terminal.active(false)
        this.$refs.logs.active(true)
        this.$messageBus('terminallogs_logs')
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>

</style>
