<script>
import qs from 'qs'
import LogsCard from './LogsCard.vue'
import TerminalCard from './TerminalCard.vue'

export default {
  name: 'TerminalPanel',
  components: {
    TerminalCard,
    LogsCard,
  },
  data() {
    return {
      isLoading: false,
      wsUrl: ``,
      logData: '',
      timer: '',
      showTabName: 'terminal',
    }
  },
  mounted() {
    this.getLogs()
    this.timer = setInterval(() => {
      this.getLogs()
    }, 1000 * 5)
  },
  unmounted() {
    clearInterval(this.timer)
  },
  methods: {
    getLogs() {
      this.$api.sys.getLogs().then((res) => {
        const data = res.data.data
        const replaceData = data.replace(/\n(.{8})/gu, '\n')
        this.logData = replaceData.substring(8, replaceData.length - 1)
      })
    },
    onInput(e) {
      if (e === 'terminal') {
        this.showTabName = 'terminal'
        this.$refs.terminal.active(true)
        this.$refs.logs.active(false)
        this.$messageBus('terminallogs_terminal')
      }
      else {
        this.showTabName = 'logs'
        this.$refs.terminal.active(false)
        this.$refs.logs.active(true)
        this.$messageBus('terminallogs_logs')
      }
    },
    downloadSystemLog() {
      const parameters = {
        token: this.$store.state.access_token,
      }
      window.open(`/v2/casaos/health/logs?${qs.stringify(parameters)}`, '_self')
    },
  },
}
</script>

<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-header">
          CasaOS
        </h3>
      </div>
      <b-tooltip label="Download logs" position="is-bottom" size="is-small" type="is-black">
        <b-icon
          v-show="showTabName === 'logs'" class="close-button" icon="downloads-outline" pack="casa"
          @click.native="downloadSystemLog"
        />
      </b-tooltip>
      <b-icon class="close-button ml-2" icon="close-outline" pack="casa" @click.native="$emit('close');" />
    </header>
    <!-- Modal-Card Header End -->

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body " style="overflow:hidden">
      <div class="is-flex-grow-1">
        <b-tabs :animated="false" @input="onInput">
          <b-tab-item :label="$t('Terminal')" value="terminal">
            <TerminalCard ref="terminal" :init-ws-url="wsUrl" />
          </b-tab-item>
          <b-tab-item :label="$t('Logs')" value="logs">
            <LogsCard ref="logs" :data="logData" />
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
    <!-- Modal-Card Body End -->

    <b-loading v-model="isLoading" :is-full-page="false" />
  </div>
</template>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
