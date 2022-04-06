<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:44:03
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 20:17:36
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\AcquaintanceEntryCard.vue
-->
<template>
  <div class="column is-narrow is-3">
    <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card">

      <div class="blur-background"></div>
      <div class="cards-content">
        <!-- Card Content Start -->
        <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3 img-c">
          <a class="is-flex is-justify-content-center" :href="url" target="share_window" @click="analyseShareClick">
            <b-image :src="require('@/assets/img/share/folder-publicshare.svg')" class="is-72x72"></b-image>
          </a>
          <p class="mt-4 one-line">
            <a class="one-line" :href="url" target="share_window" @click="analyseShareClick">
              {{ $t('Share module name') }}
            </a>
          </p>
        </div>
        <!-- Card Content End -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      url: `${window.location.origin}/ui/#/a-sharing`
    }
  },

  methods: {
    /**
   * @description: SHow FileBrowser Panel
   * @return {*} void
   */
    analyseShareClick() {
      try {
        const appName = "AcquaintanceShare"
        const action = "open"
        this.$api.analyse.analyseAppAction(appName, action)
        // eslint-disable-next-line no-empty
      } catch (err) { }
    }
  },
}
</script>

<style>
</style>