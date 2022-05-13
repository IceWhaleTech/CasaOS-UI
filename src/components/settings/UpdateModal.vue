<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Update')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')"  v-if="!isUpdating"/></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="update-info-container" v-html="markdownToHtml"></div>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('Upgrade Now')" type="is-primary" rounded expaned :loading="isUpdating" @click="updateSystem" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { marked } from 'marked'
export default {
  props: {
    changeLog: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      timer: 0,
      isUpdating: false,
      markdown: ``,
    };
  },
  computed: {
    markdownToHtml() {
      return marked.parse(this.changeLog);
    }
  },
  methods: {
    /**
     * @description: Update System Version and check update state
     * @return {*} void
     */
    updateSystem() {
      this.isUpdating = true;
      this.$api.info.updateSystem().then(res => {
        if (res.data.success == 200) {
          console.log(res.data.data);
        }
      });
      this.checkUpdateState();
    },
    /**
     * @description: check update state if is_need is false then reload page
     * @return {*} void
     */
    checkUpdateState() {
      this.timer = setInterval(() => {
        this.$api.info.checkVersion().then(res => {
          if (res.data.success == 200) {
            if (!res.data.data.is_need) {
              clearInterval(this.timer);
              location.reload();
            }
          }
        })
      }, 3000)
    },
  },
}
</script>

<style>
</style>