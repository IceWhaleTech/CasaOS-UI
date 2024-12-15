<script>
export default {
  name: 'LogsCard',
  props: {
    data: String,
  },
  data() {
    return {
      fullscreen: false,
      state: true,
    }
  },
  computed: {
    buttonSzie() {
      return this.$store.state.device === 'mobile' ? 'is-small' : ''
    },
    buttonIcon() {
      return this.fullscreen ? 'fullscreen-exit' : 'fullscreen'
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  created() {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
  mounted() {
    this.onWindowResize()
  },
  methods: {

    toggleFullScreen() {
      this.fullscreen = !this.fullscreen
    },
    onWindowResize() {

    },
    getTop(e) {
      let offset = e.offsetTop
      if (e.offsetParent != null)
        offset += this.getTop(e.offsetParent)
      return offset
    },
    active(state) {
      this.state = state
      if (state) {
        this.onWindowResize()
        this.srcollToBottom()
      }
    },
    srcollToBottom() {
      const logs = document.getElementById('logs')
      const logsConetent = document.querySelector('#logs .content')
      this.$nextTick(() => {
        logs.scrollTo(0, logsConetent.clientHeight)
      })
    },
  },
}
</script>

<template>
  <fullscreen
    v-model="fullscreen" :class="{ 'mt-4': !fullscreen }" :page-only="true" :teleport="true"
    class="fullScreen  pl-2 pt-2 pb-2 fdark-bg" @change="onWindowResize"
  >
    <a class="fullscreen-button" @click="toggleFullScreen">
      <b-icon :icon="buttonIcon" />
    </a>
    <div id="logs" :class="[fullscreen ? 'fullheight' : 'sheight']" class="logs scrollbars">
      <div v-dompurify-html="data" contenteditable class="content" />
    </div>
  </fullscreen>
</template>

<style lang="scss" scoped>
.logs {
  white-space: pre-wrap;
  color: #fff;
  font-size: 13px;
  font-family: 'Monaco', 'Consolas', monospace !important;
  padding: 0 0.25rem;
  line-height: 1.5em;
  overflow-y: auto;
  overflow-x: hidden;

  > div {
    outline: none;
  }

  &.fullheight {
    height: 100%;
  }

  &.sheight {
    height: 35rem;
  }
}
</style>
