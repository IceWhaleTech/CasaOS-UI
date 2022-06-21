<!--
 * @Author: JerryK
 * @Date: 2022-01-24 11:57:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 16:48:57
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\feedback\FeedbackPanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">

      <h2 class="title is-4">{{ $t('Bug report') }}</h2>
      <div class="close-container"><button type="button" class="delete" @click="$emit('close')" /></div>

      <div class="is-flex-grow-1 is-relative">
        <b-field :label="$t('Title')">
          <b-input maxlength="100" v-model="postTitle"></b-input>
        </b-field>
        <b-field :label="$t('Describe the bug')">
          <b-input maxlength="500" type="textarea" v-model="postBody" :placeholder="$t('A clear and concise description of what the bug is.')"></b-input>
        </b-field>
        <b-field :label="$t('System infomation')">
          <div class="feedback-info-container is-size-14px" v-html="markdownToHtml"></div>
        </b-field>
      </div>
    </section>

    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center ">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Submit')" type="is-primary" @click="submitIssue" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
    <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>

import browserInfo from 'browser-info'
import newGithubIssueUrl from 'new-github-issue-url';
import { marked } from 'marked'

export default {
  name: "feedback-panel",
  components: {

  },
  data() {
    return {
      isLoading: false,
      feedBody: "",
      postTitle: "",
      postBody: "",
    }
  },

  computed: {
    markdownToHtml() {
      return marked.parse(this.feedBody);
    }
  },

  mounted() {
    this.$api.info.getDebugInfo().then(res => {
      const browserInfos = browserInfo();
      this.feedBody = res.data.data.replace("$Browser$", browserInfos.name).replace("$Version$", browserInfos.fullVersion);
    })
  },
  methods: {
    submitIssue() {
      const url = newGithubIssueUrl({
        user: 'IceWhaleTech',
        repo: 'CasaOS',
        title: this.postTitle,
        body: "**Describe the bug**\n\n" + this.postBody + "\n\n**System infomation**\n\n" + this.feedBody
      });
      window.open(url, '_blank');
      this.$emit('close');
    }
  },
}
</script>

<style lang="scss" scoped>
.feedback-info-container {
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

.feedback-modal {
  .modal-card-body {
    overflow-y: hidden;
    transition: height 0.3s;
    padding: 2rem 2rem 2rem 2rem;
    position: relative;
  }

  .modal-card-foot {
    padding-top: 0;
  }

  .close-container {
    position: absolute;
    right: 2rem;
    top: 2rem;
  }
}
</style>