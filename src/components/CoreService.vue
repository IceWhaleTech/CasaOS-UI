<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:50:18
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 10:48:52
 * @Description:
 * @FilePath: \CasaOS-UI\src\components\CoreService.vue
-->
<template>
  <!--  <div class=" home-section has-text-left mt-1 mb-2rem">
      <div class="columns is-variable is-2 is-multiline suggestion-list">
        <template v-if="!isLoading">
          <Sync-block></Sync-block>
          <smart-block></smart-block>
        </template>
        <b-loading v-model="isLoading" :is-full-page="false"></b-loading>
      </div>
    </div>-->

  <b-carousel
      :indicator="indicator"
      :indicator-background="indicatorBackground"
      :indicator-inside="indicatorInside"
      :indicator-mode="indicatorMode"
      :indicator-position="indicatorPosition"
      :indicator-style="indicatorStyle"
      :repeat="repeat">
    <!--    <b-carousel-list v-model="test" :data="carousels" :items-to-show="2">
          <template #item="list">
            <div class="columns is-variable is-2 is-multiline suggestion-list">
              <Sync-block></Sync-block>
              <smart-block></smart-block>
            </div>
          </template>
        </b-carousel-list>-->
    <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
      <section class="hero">
        <!--            <div class="hero-body has-text-centered">
                      <h1 class="title">{{ carousel.title }}</h1>
                    </div>-->
        <div class="columns is-variable is-2 is-multiline suggestion-list">
          <Sync-block></Sync-block>
          <smart-block></smart-block>
        </div>
      </section>
    </b-carousel-item>
  </b-carousel>

</template>

<script>
import SmartBlock from './smartHome/SmartBlock.vue'
import SyncBlock from './syncthing/SyncBlock.vue'
import StorageBlock from "@/components/Storage/StorageBlock";

export default {
  components: {SyncBlock, SmartBlock, StorageBlock},
  name: "core-service",
  data() {
    return {
      isLoading: false,
      indicator: true,
      indicatorBackground: false,
      indicatorInside: false,
      indicatorMode: 'hover',
      indicatorPosition: 'is-top',
      indicatorStyle: 'is-lines',
      repeat: true,
      carousels: [
        {title: 'Slide 1', color: 'info'},
        {title: 'Slide 2', color: 'success'},
        {title: 'Slide 3', color: 'warning'},
        {title: 'Slide 4', color: 'danger'}
      ]
    }
  },

}
</script>

<style>

</style>
