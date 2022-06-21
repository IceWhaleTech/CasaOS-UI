<!--
 * @Author: JerryK
 * @Date: 2022-03-08 11:09:50
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 11:29:23
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\viewers\PdfViewer.vue
-->
<template>
  <div class="overlay">
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    <header class="modal-card-head">
      <div class="is-flex-grow-1 is-flex ">
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
      <div class="pdf-container scrollbars-light">
        <pdf v-for="i in numPages" :key="i" :src="src" :page="i"></pdf>
      </div>
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
import pdf from 'vue-pdf'
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
    pdf
  },
  data() {
    return {
      type: "",
      ext: "",
      isLoading: true,
      src: pdf.createLoadingTask(this.getFileUrl(this.item)),
      numPages: undefined,
    }
  },
  mounted() {
    this.src.promise.then(pdf => {
      this.isLoading = false;
      this.numPages = pdf.numPages;
    }).catch(() => {
      this.isLoading = false;
    });
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