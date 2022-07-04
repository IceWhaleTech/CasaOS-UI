<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-04 14:20:08
 * @Description: The right bottom contact bar
 * @FilePath: /CasaOS-UI/src/components/ContactBar.vue
-->

<template>
  <div class="contact-bar is-flex is-align-items-center has-text-white">

    <a @click="showFeedback">
      <b-tooltip :label="$t('Bug report')" :append-to-body="!$store.state.isMobile">
        <b-icon pack="casa" icon="bug"></b-icon>
      </b-tooltip>
    </a>

    <a href="https://discord.gg/knqAbbBbeX" target="_blank">
      <b-tooltip :label="$t('Join Discord')" :append-to-body="!$store.state.isMobile">
        <b-icon pack="casa" icon="discord"></b-icon>
      </b-tooltip>
    </a>

    <a href="https://github.com/IceWhaleTech/CasaOS" target="_blank">
      <b-tooltip :label="$t('Visit our Github')" :append-to-body="!$store.state.isMobile">
        <b-icon pack="casa" icon="github"></b-icon>
      </b-tooltip>
    </a>

  </div>
</template>

<script>
import FeedbackPanel from './feedback/FeedbackPanel.vue'

export default {
  name: "contact-bar",
  methods: {
    showFeedback() {
      this.$buefy.modal.open({
        parent: this,
        component: FeedbackPanel,
        hasModalCard: true,
        customClass: 'feedback-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-in",
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.contact-bar {
  position: fixed;
  right: 0.875rem;
  bottom: 0.25rem;
  z-index: 10;

  a {
    color: #fff;
    margin: 0.625rem;
    display: flex;
    align-items: center;

    &:hover {
      color: #fff;
    }
  }
}

@media screen and (max-width: 480px) {
  .contact-bar {
    right: 0;
    bottom: 0rem;
    background-color: transparent;
    backdrop-filter: none;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
