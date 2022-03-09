<!--
 * @Author: JerryK
 * @Date: 2022-03-07 13:47:45
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 21:03:56
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\viewers\ImageViewer.vue
-->
<template>
  <div class="overlay" >
    <header class="modal-card-head">
      <div class="flex1 is-flex ">
        <!-- Title Start -->
        <h3 class="title is-5 one-line">{{item.name}}</h3>
        <!-- Title End -->
      </div>
      <div class="is-flex is-align-items-center">
        <!-- Download File Button Start -->
        <b-button icon-left="download" type="is-primary" size="is-small" :label="$t('Download')" class="mr-2" rounded
          @click="download" />
        <!-- Download File Button End -->

        <!-- Close Button Start -->
        <div class="is-flex is-align-items-center modal-close-container close-btn modal-close-container-line">
          <button type="button" class="delete" @click="close" />
        </div>
        <!-- Close File Button End -->
      </div>
    </header>

    <!-- Player Start -->
    <div class="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 v-container video">
      <div class="image-container" :style="{backgroundImage: 'url(' + bgUrl + ')'}"></div>
    </div>
    <!-- Player Start -->

    <!-- Player Footer Start -->
    <div class="v-footer is-flex is-justify-content-center">

    </div>
    <!-- Player Footer End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import svg64 from 'svg64'
export default {
  mixins: [mixin],
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          path: '/DATA/1.png',
          name: '1.png'
        }
      }
    },
  },
  components: {

  },
  data() {
    return {
      type: "",
      ext: "",
      bgUrl: "",
    }
  },
  mounted() {
    let ext = this.getFileExt(this.item)
    if (ext == "svg") {
      this.$api.file.download(this.item.path).then(res => {

        this.bgUrl = svg64(res.data)
        console.log(this.bgUrl);
      })
    } else {
      this.bgUrl = this.getFileUrl(this.item)
    }
  },
  methods: {
    download() {
      this.downloadFile(this.item);
    },
    close() {
      this.$emit("close");
    }
  }
}
</script>

<style>
</style>