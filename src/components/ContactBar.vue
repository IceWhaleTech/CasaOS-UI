<script>
import ShareModal from '@/components/share/ShareModal.vue'
import Popper from 'vue-popperjs'
import FeedbackPanel from './feedback/FeedbackPanel.vue'

export default {
  name: 'ContactBar',
  components: {
    Popper,
  },
  methods: {
    showFeedback() {
      // messageBus :: feedback
      this.$messageBus('connect_feedback')
      this.$buefy.modal.open({
        parent: this,
        component: FeedbackPanel,
        hasModalCard: true,
        customClass: 'feedback-modal',
        trapFocus: true,
        canCancel: [],
        scroll: 'keep',
        animation: 'zoom-in',
      })
    },

    showShareModal() {
      // messageBus :: share
      this.$messageBus('connect_sharecasaos')
      this.$buefy.modal.open({
        parent: this,
        component: ShareModal,
        hasModalCard: true,
        customClass: 'network-storage-modal',
        trapFocus: true,
        canCancel: [],
        scroll: 'keep',
        animation: 'zoom-in',
      })
    },
  },
}
</script>

<template>
  <div class="contact-bar is-flex is-align-items-center has-text-white">
    <Popper
      :options="{
        placement: 'top',
        modifiers: { offset: { offset: '0,4px' } },
      }" enter-active-class="fade-enter-active" leave-active-class="" transition="fade" trigger="hover"
    >
      <div class="popper  tooltip-content">
        {{ $t('Submit a feedback or report an issue') }}
      </div>
      <template #reference>
        <a @click="showFeedback">
          <b-icon icon="eedback" pack="casa" />
        </a>
      </template>
    </Popper>

    <Popper
      :options="{
        placement: 'top',
        modifiers: { offset: { offset: '0,4px' } },
      }" enter-active-class="fade-enter-active" leave-active-class="" transition="fade" trigger="hover"
    >
      <div class="popper  tooltip-content">
        {{ $t('Join Discord') }}
      </div>
      <template #reference>
        <a
          rel="noopener" href="https://discord.gg/knqAbbBbeX" target="_blank"
          @click="$messageBus('connect_discord')"
        >
          <b-icon icon="discord" pack="casa" />
        </a>
      </template>
    </Popper>

    <Popper
      :options="{
        placement: 'top',
        modifiers: { offset: { offset: '0,4px' } },
      }" enter-active-class="fade-enter-active" leave-active-class="" transition="fade" trigger="hover"
    >
      <div class="popper  tooltip-content">
        {{ $t('Visit our Github') }}
      </div>
      <template #reference>
        <a
          rel="noopener" href="https://github.com/IceWhaleTech/CasaOS" target="_blank"
          @click="$messageBus('connect_github')"
        >
          <b-icon icon="github" pack="casa" />
        </a>
      </template>
    </Popper>

    <Popper
      :options="{
        placement: 'top',
        modifiers: { offset: { offset: '0,4px' } },
      }" enter-active-class="fade-enter-active" leave-active-class="" transition="fade" trigger="hover"
    >
      <div class="popper  tooltip-content">
        {{ $t('Share CasaOS') }}
      </div>
      <template #reference>
        <a @click="showShareModal">
          <b-icon icon="chat" pack="casa" />
        </a>
      </template>
    </Popper>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/common/variables.module';

.contact-bar {
  position: fixed;
  right: 1.375rem;
  bottom: 0;
  //z-index: 10;

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
@import '@/assets/scss/common/variables.module';

.popper .popper__arrow {
  border-color: $primary transparent transparent transparent !important;
}
</style>
