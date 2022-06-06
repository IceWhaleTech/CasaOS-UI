<!--
 * @Author: JerryK
 * @Date: 2021-12-06 18:29:48
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-25 16:44:15
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\settings\PortPanel.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Edit Web UI port')}}</h3>
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
      <div class="flex1"></div>
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
      this.$api.info.saveSystemPort({ port: this.port }).then(res => {

        if (res.data.success == 200) {
          this.errorType = "is-success";
          this.errors = "";
          this.$api.info.killSystem();
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
        const domain = (process.env.NODE_ENV === "dev") ? `http://${this.$baseIp}` : `http://${document.domain}`
        const checkUrl = `http://${domain}:${this.port}`
        this.$api.info.checkUiPort(checkUrl + '/v1/sys/port').then(res => {
          if (res.data.success == 200) {
            clearInterval(this.timer);
            const url = `http://${domain}:${res.data.data}`
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