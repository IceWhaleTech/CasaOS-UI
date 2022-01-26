<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-26 10:57:24
 * @Description: The right bottom contact bar
 * @FilePath: /CasaOS-UI/src/components/ContactBar.vue
-->

<template>
  <div class="contact-bar is-flex is-align-items-center has-text-white pl-3 pr-3">
    <b-tooltip :label="$t('Bug report')">
      <a @click="showFeedback">
        <b-icon icon="bug" ></b-icon>
      </a>
    </b-tooltip>
    <b-tooltip :label="$t('Join Discord')">
      <a href="https://discord.gg/knqAbbBbeX" target="_blank">
        <b-icon icon="discord"></b-icon>
      </a>
    </b-tooltip>
    <b-tooltip :label="$t('Visit our Github')">
      <a href="https://github.com/IceWhaleTech/CasaOS" target="_blank">
        <b-icon icon="github"></b-icon>
      </a>
    </b-tooltip>
  </div>
</template>

<script>
import FeedbackPanel from '@/components/FeedbackPanel.vue'

export default {
  name: "contact-bar",

  methods: {
    showFeedback() {
      this.$buefy.modal.open({
        parent: this,
        component: FeedbackPanel,
        hasModalCard: true,
        customClass: 'storage-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-out",
      })
    }
  },
}
</script>
