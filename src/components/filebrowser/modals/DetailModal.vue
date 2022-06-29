<!--
 * @Author: JerryK
 * @Date: 2022-02-24 14:20:01
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 11:27:16
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\modals\DetailModal.vue
-->

<template>
  <div class="modal-card">
    <!-- Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1 is-flex ">
      </div>
      <div class="is-flex is-align-items-center">
        <div class="is-flex is-align-items-center modal-close-container ">
          <button type="button" class="delete" @click="$emit('close')" />
        </div>

      </div>
    </header>
    <!-- Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body is-flex is-justify-content-center is-align-items-center">
      <div class="node-card ">
        <div class="cover is-unselectable">
          <div :class="item | coverType">
            <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
          </div>
        </div>
        <div class="info mt-3 is-flex is-flex-direction-column is-justify-content-center">
          <p class="title">{{item.name}}</p>
          <div class="buttons is-justify-content-center">
            <b-button type="is-primary" @click="download">{{ $t('Download') }} {{ item.size | renderSize}}</b-button>
          </div>
        </div>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center ">

    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  props: {
    item: Object
  },
  data() {
    return {

    }
  },
  methods: {
    download() {
      this.downloadFile(this.item);
      this.$emit('close')
      // this.$parent.fullScreen = true
      // console.log(this.$parent);
    }
  },
}
</script>