<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-22 19:20:21
 * @FilePath: /CasaOS-UI/src/components/logsAndTerminal/TerminalPanel.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <h3 class="title is-3">CasaOS</h3>
      <div class="close-container"><button type="button" class="delete" @click="$emit('close')" /></div>
      <div class="is-flex-grow-1">
        <b-tabs :animated="false" @input="onInput">
          <b-tab-item :label="$t('Terminal')" value="terminal">
            <terminal-card ref="terminal" :wsUrl="wsUrl"></terminal-card>
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
      wsUrl: `ws://${this.$baseURL}/v1/sys/wsssh?token=${this.$store.state.token}`,
      logData: ""
    }
  },
  mounted() {
    this.getLogs();
  },
  methods: {
    getLogs() {
      this.$api.info.systemLogs().then(res => {
        this.logData = res.data.data;
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

<style lang="scss" scoped>

</style>
