<!--
 * @Author: JerryK
 * @Date: 2021-12-06 18:29:48
 * @LastEditTime: 2022-07-12 21:53:02
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\settings\PortPanel.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Edit Web UI port')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <b-field class="mb-5 mt-5 has-text-light" :type="errorType" :message="errors" expanded>
        <b-input type="number" v-model="port" v-on:keyup.enter.native="savePort"></b-input>
      </b-field>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Cancel')" @click="$emit('close')" rounded />
        <b-button :label="$t('Submit')" type="is-primary" rounded expaned @click="savePort" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </div>
</template>

<script>

export default {
  name: "port-panel",
  data() {
    return {
      timer: 0,
      isLoading: false,
      confirmation: "",
      message: "",
      notificationShow: false,
      port: this.initPort,
      errorType: "is-success",
      errors: ""
    }
  },
  props: {
    initPort: {
      type: String,
      default: "0"
    },
  },

  methods: {
    savePort() {
      this.isLoading = true;
      this.$api.sys.editServerPort({ port: this.port }).then(res => {

        if (res.data.success == 200) {
          this.errorType = "is-success";
          this.errors = "";
          this.$api.sys.stopCasaOS();
          this.checkUpdate();
        } else {
          this.isLoading = false;
          this.errorType = "is-danger"
          this.errors = res.data.message

        }
      })
    },
    checkUpdate() {

      this.timer = setInterval(() => {
        const protocol = document.location.protocol
        const checkUrl = `${protocol}//${this.$baseIp}:${this.port}`
        this.$api.sys.checkUiPort(checkUrl + '/v1/sys/port').then(res => {
          if (res.data.success == 200) {
            clearInterval(this.timer);
            const url = `http://${this.$baseIp}:${res.data.data}`
            window.open(url, '_self');
          }
        })
      }, 1000)
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
}
</script>

<style>
</style>