<template>
  <fullscreen class="fullScreen  p-2" :class="{'mt-6':!fullscreen}" :fullscreen.sync="fullscreen" :teleport="true" :page-only="true" @change="onWindowResize">
    <a class="fullscreen-button" @click="toggleFullScreen">
      <b-icon :icon="buttonIcon"></b-icon>
    </a>
    <div id="xterm" class="xterm"></div>
  </fullscreen>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'

const fitAddon = new FitAddon();
export default {
  name: "terminal-card",
  props: {
    id: String,
    // wsUrl: String,
    label: String
  },
  data() {
    return {
      fullscreen: false,
      term: "",
      user: "",
      password: "",
      wsUrl: (process.env.NODE_ENV === "'dev'") ? `ws://${this.$store.state.devIp}:8089/v1/sys/wsssh?token=${this.$store.state.token}&user=${this.user}&password=${this.password}` : `ws://${document.location.host}/v1/sys/wsssh?token=${this.$store.state.token}&user=${this.user}&password=${this.password}`
    }
  },
  computed: {
    buttonSzie() {
      return this.$store.state.device == "mobile" ? 'is-small' : ''
    },
    buttonIcon() {
      return this.fullscreen ? "fullscreen-exit" : "fullscreen"
    }
  },
  mounted() {
    this.initSocket();

  },
  beforeDestroy() {
    this.socket.close()
    if (this.term != "") this.term.dispose()
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    toggleFullScreen() {
      this.fullscreen = !this.fullscreen
    },
    initTerm() {
      const term = new Terminal({
        fontSize: 14,
        cursorBlink: true,
        theme: { background: '#1E1E1E' }
      });
      const attachAddon = new AttachAddon(this.socket);

      term.loadAddon(attachAddon);
      term.loadAddon(fitAddon);
      term.open(document.getElementById('xterm'));
      fitAddon.fit();
      term.focus();
      this.term = term
      window.addEventListener('resize', this.onWindowResize)
      this.onWindowResize()

    },
    initSocket() {

      this.socket = new WebSocket(this.wsUrl);
      this.socketOnClose();
      this.socketOnOpen();
      this.socketOnError();
    },
    socketOnOpen() {
      this.socket.onopen = () => {
        this.initTerm()
      }
    },
    socketOnClose() {
      this.socket.onclose = () => {
        // console.log('close socket')
      }
    },
    socketOnError() {
      this.socket.onerror = () => {
        // console.log('socket 链接失败')
      }
    },
    onWindowResize() {
      this.$nextTick(() => {
        if (this.fullscreen) {
          document.getElementById('xterm').style.height = window.innerHeight - this.getTop(document.getElementById('xterm')) + 'px';
          document.body.style.overflow = "hidden";
        } else {
          document.getElementById('xterm').style.height = window.innerHeight - this.getTop(document.getElementById('xterm')) - 62 + 'px';
          document.body.style.overflow = "auto";
        }
        console.log(this.getTop(document.getElementById('xterm')));
        fitAddon.fit();
        this.socket.send(JSON.stringify({
          type: "resize",
          cols: this.term.cols,
          rows: this.term.rows
        }))
      })

    },
    getTop(e) {
      var offset = e.offsetTop;
      if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
      return offset;
    }
  },
  watch: {
    fullscreen() {
      this.onWindowResize()
    }
  }
}
</script>

<style>
</style>