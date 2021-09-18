<template>

  <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card" @mouseover="hover = true" @mouseleave="hover = false">
    <div class="action-btn">
      <b-dropdown aria-role="list" position="is-bottom-left" class="ii" ref="dro" @active-change="getDropState">
        <template #trigger>
          <p role="button">
            <b-icon pack="fas" icon="ellipsis-v" size="is-small">
            </b-icon>
          </p>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom paddingless>
          <b-button type="is-text" tag="a" :target="(item.state == 'running') ?'_blank':'_self'" :href="(item.state == 'running') ? siteUrl(item.port,item.index) :'javascript:void(0)'" expanded>Open</b-button>
          <b-button type="is-text" @click="configApp" expanded>Setting</b-button>
          <b-button type="is-text" expanded @click="uninstallConfirm" :loading="isUninstalling">Unistall</b-button>
          <div class="columns is-gapless bbor">
            <div class="column is-flex is-justify-content-center is-align-items-center">
              <b-button icon-pack="fas" icon-left="sync" type="is-text" expanded :loading="isRestarting" @click="restartApp"></b-button>
            </div>
            <div class="column is-flex is-justify-content-center is-align-items-center">
              <b-button icon-pack="fas" icon-left="power-off" type="is-text" expanded @click="toggle(item)" :loading="isLoading" :class="item.state"></b-button>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3">
      <a :target="(item.state == 'running') ?'_blank':'_self'" class="is-flex is-justify-content-center" :href="(item.state == 'running') ? siteUrl(item.port,item.index) :'javascript:void(0)'">
        <!-- <figure class="image is-72x72 icon-img " :class="item.state | dotClass">
          <img :src="item.icon">
        </figure> -->
        <b-image
            :src="item.icon"
            :src-fallback="require('@/assets/img/default.png')"
            webp-fallback=".jpg"
            class="is-72x72"
            :class="item.state | dotClass"
        ></b-image>
      </a>
      <p class="mt-4 one-line">
        <a class="one-line" :target="(item.state == 'running') ?'_blank':'_self'" :href="(item.state == 'running') ? siteUrl(item.port,item.index) :'javascript:void(0)'">
          {{item.name}}
        </a>
      </p>

    </div>
    <b-loading :is-full-page="false" v-model="isUninstalling" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
      dropState: false,
      isLoading: false,
      isUninstalling: false,
      isRestarting: false,
      isStarting: false,
      isStoping: false,
      isSaving: false,
    }
  },
  props: {
    item: {
      type: Object
    },
  },
  mounted() {
    //console.log(this.item);
  },
  methods: {
    siteUrl(port, index) {
      return (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${port}${index}` : `http://${document.domain}:${port}${index}`
    },
    getDropState(e) {
      this.dropState = e
    },
    // Restart Application
    restartApp() {
      this.isRestarting = true
      this.$api.app.startContainer(this.item.custom_id, { state: "restart" }).then((res) => {
        console.log(res.data);
        if (res.data.success == 200) {
          this.updateState()
        }
        this.isRestarting = false;
      })
    },
    // Uninstall Application
    uninstallConfirm() {
      let _this = this
      this.$buefy.dialog.confirm({
        title: 'Attention',
        message: 'Data cannot be recovered after deletion! <br>Continue on to uninstall this application?',
        type: 'is-dark',
        confirmText: 'Uninstall',
        onConfirm: () => {
          _this.isUninstalling = true
          _this.uninstallApp()
        }
      })
    },
    uninstallApp() {
      this.isUninstalling = true
      this.$api.app.uninstall(this.item.custom_id).then((res) => {
        if (res.data.success == 200) {
          console.log(res.data.data);
          this.updateState()
        }
        this.isUninstalling = false;
      })
    },
    updateState() {
      this.$emit("updateState")
    },
    configApp() {
      this.$emit("configApp", this.item.custom_id)
    },
    // Start or Stop a Container

    toggle(item) {
      this.isLoading = true;
      let data = {
        state: item.state == "running" ? "stop" : "start"
      }
      this.$api.app.startContainer(item.custom_id, data).then((res) => {
        console.log(res.data);
        item.state = res.data.data
        this.isLoading = false
        this.updateState()
      })
    },

  },
  watch: {
    hover(val) {
      if (!val && this.dropState)
        this.$refs.dro.toggle();
    }
  },
  filters: {
    // Format Dot Class
    dotClass(state) {
      return state == 'running' ? 'start' : 'stop'
    },
  }
}
</script>

<style>
</style>