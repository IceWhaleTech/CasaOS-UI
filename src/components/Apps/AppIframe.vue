<template>
  <section
    aria-modal="true"
    class="app-iframe-overlay"
    role="dialog"
    :aria-label="appName"
  >
    <header class="app-iframe-header is-flex is-align-items-center">
      <h1 class="app-iframe-title is-flex-grow-1 mb-0">
        {{ appName }}
      </h1>
      <button
        class="app-iframe-close"
        type="button"
        :aria-label="$t('Close')"
        :title="$t('Close')"
        @click="$emit('close')"
      >
        <b-icon custom-size="casa-24px" icon="close-outline" pack="casa" />
      </button>
    </header>
    <div class="app-iframe-content">
      <iframe
        :src="url"
        :title="appName"
        allow="autoplay; fullscreen"
        allowfullscreen
        class="app-iframe"
      />
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppIframe',
  props: {
    appName: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.app-iframe-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.app-iframe-header {
  flex: 0 0 3.25rem;
  min-height: 3.25rem;
  padding: 0 1rem 0 1.25rem;
  color: #fff;
  background: #1e1e1e;
}

.app-iframe-title {
  overflow: hidden;
  color: inherit;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-iframe-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 0.25rem;
}

.app-iframe-close:hover,
.app-iframe-close:focus-visible {
  background: rgba(255, 255, 255, 0.12);
}

.app-iframe-close:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.app-iframe-content {
  flex: 1 1 auto;
  min-height: 0;
  background: #fff;
}

.app-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
