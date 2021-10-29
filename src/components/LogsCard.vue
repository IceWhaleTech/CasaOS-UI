<!--
 * @Author: JerryK
 * @Date: 2021-10-28 13:56:32
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-29 18:06:47
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/LogsCard.vue
-->
<template>
  <fullscreen class="fullScreen  pl-2 pt-2 pb-2" :class="{'mt-5':!fullscreen}" :fullscreen.sync="fullscreen" :teleport="true" :page-only="true" @change="onWindowResize">
    <a class="fullscreen-button" @click="toggleFullScreen">
      <b-icon :icon="buttonIcon"></b-icon>
    </a>
    <div id="logs" class="logs scrollbars">
      <div v-html="data"></div>
    </div>
  </fullscreen>

</template>

<script>
export default {
  name: "logs-card",
  data() {
    return {
      fullscreen: false,
      state: true
    }
  },
  props: {
    data: String,
  },
  computed: {
    buttonSzie() {
      return this.$store.state.device == "mobile" ? 'is-small' : ''
    },
    buttonIcon() {
      return this.fullscreen ? "fullscreen-exit" : "fullscreen"
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  created() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },
  mounted() {
    this.onWindowResize();
  },
  methods: {

    toggleFullScreen() {
      this.fullscreen = !this.fullscreen
    },
    onWindowResize() {
      this.$nextTick(() => {
        if (this.fullscreen) {
          document.getElementById('logs').style.height = window.innerHeight - this.getTop(document.getElementById('logs')) + 'px';
          document.body.style.overflow = "hidden";
        } else {
          document.getElementById('logs').style.height = window.innerHeight - this.getTop(document.getElementById('logs')) - 62 + 'px';
          document.body.style.overflow = "auto";
        }
      })

    },
    getTop(e) {
      var offset = e.offsetTop;
      if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
      return offset;
    },
    active(state) {
      this.state = state;
      if (state) {
        this.onWindowResize();
      }
    }
  },
}
</script>

<style>
</style>