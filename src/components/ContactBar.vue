<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-08 16:07:20
 * @Description: The right bottom contact bar
 * @FilePath: /CasaOS-UI/src/components/ContactBar.vue
-->

<template>
  <div class="contact-bar is-flex is-align-items-center has-text-white">

    <popper trigger="hover" transition='fade' enter-active-class="fade-enter-active" leave-active-class="" :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,4px' } }
    }">
      <div class="popper  tooltip-content">
        {{$t('Bug report')}}
      </div>
      <a @click="showFeedback" slot="reference">
        <b-icon pack="casa" icon="bug"></b-icon>
      </a>
    </popper>

    <popper trigger="hover" transition='fade' enter-active-class="fade-enter-active" leave-active-class="" :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,4px' } }
    }">
      <div class="popper  tooltip-content">
        {{$t('Join Discord')}}
      </div>
      <a href="https://discord.gg/knqAbbBbeX" target="_blank" slot="reference">
        <b-icon pack="casa" icon="discord"></b-icon>
      </a>
    </popper>

    <popper trigger="hover" transition='fade' enter-active-class="fade-enter-active" leave-active-class="" :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,4px' } }
    }">
      <div class="popper  tooltip-content">
        {{$t('Visit our Github')}}
      </div>
      <a href="https://github.com/IceWhaleTech/CasaOS" target="_blank" slot="reference">
        <b-icon pack="casa" icon="github"></b-icon>
      </a>
    </popper>

    <popper trigger="hover" transition='fade' enter-active-class="fade-enter-active" leave-active-class="" :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,4px' } }
    }">
      <div class="popper  tooltip-content">
        {{$t('Share CasaOS')}}
      </div>
      <a @click="showShareModal" slot="reference">
        <b-icon pack="casa" icon="social-share"></b-icon>
      </a>
    </popper>

  </div>
</template>

<script>
import FeedbackPanel from './feedback/FeedbackPanel.vue'
import ShareModal from '@/components/share/ShareModal.vue'
import Popper from 'vue-popperjs';



export default {
  name: "contact-bar",
  components: {
    Popper,
  },
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
    },

    showShareModal() {
      this.$buefy.modal.open({
        parent: this,
        component: ShareModal,
        hasModalCard: true,
        customClass: 'network-storage-modal',
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
  bottom: 0.35rem;
  z-index: 100;

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

.popper {
  background-color: $primary;
  padding: 0.35rem 0.75rem;
  box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
  border: none;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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

<style lang="scss">
.popper .popper__arrow {
  border-color: $primary transparent transparent transparent !important;
}
</style>
