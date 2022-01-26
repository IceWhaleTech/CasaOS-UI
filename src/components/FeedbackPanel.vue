<!--
 * @Author: JerryK
 * @Date: 2022-01-24 11:57:35
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-26 10:56:41
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/FeedbackPanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">

      <h2 class="title is-4">{{ $t('Bug report') }}</h2>
      <div class="close-container"><button type="button" class="delete" @click="$emit('close')" /></div>

      <div class="flex1 is-relative">
        <b-field :label="$t('Title')">
          <b-input maxlength="100" v-model="postTitle"></b-input>
        </b-field>
        <b-field :label="$t('Describe the bug')">
          <b-input maxlength="500" type="textarea" v-model="postBody" :placeholder="$t('A clear and concise description of what the bug is.')"></b-input>
        </b-field>
        <b-field :label="$t('System infomation')">
          <vue-markdown :source="feedBody"></vue-markdown>
        </b-field>
      </div>
    </section>

    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center ">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('Submit')" type="is-primary" @click="submitIssue" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
    <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import browserInfo from 'browser-info'
import newGithubIssueUrl from 'new-github-issue-url';

export default {
  name: "feedback-panel",
  components: {
    VueMarkdown,
  },
  data() {
    return {
      isLoading: false,
      feedBody: "",
      postTitle: "",
      postBody: "",
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

<style>
</style>