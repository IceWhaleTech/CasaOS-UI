<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-02 17:44:02
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-22 19:21:03
 * @FilePath: /CasaOS-UI/src/components/settings/UpdateModal.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Update')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" v-if="!isUpdating" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="update-info-container  is-size-14px" v-html="markdownToHtml"></div>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
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

<style lang="scss" scoped >
.update-info-container {
  border-radius: 4px;
  overflow: hidden;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: bold;
    margin-bottom: 0.4rem;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.17em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.83em;
  }

  h6 {
    font-size: 0.67em;
  }

  ul {
    margin-bottom: 0.5em;

    li {
      list-style: disc;
      margin-left: 1rem;
    }
  }
}
</style>