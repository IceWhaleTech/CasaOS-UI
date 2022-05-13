<!--
 * @Author: JerryK
 * @Date: 2022-03-04 18:55:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-10 12:05:23
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\viewers\VideoPlayer.vue
-->
<template>
  <div class="overlay">
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
      <div class="video-container">
        <vue-plyr key="video-player" v-if="isVideo" ref="plyr" >
          <video controls crossorigin >
            <source :src="getFileUrl(item)" type="video/mp4" />
          </video>

        </vue-plyr>
        <vue-plyr key="audio-player" v-if="isAudio" ref="plyr" >
          <audio controls crossorigin playsinline>
            <source :src="getFileUrl(item)" :type="'audio/'+ext" />
          </audio>
        </vue-plyr>
      </div>
    </div>
    <!-- Player Start -->

    <!-- Player Footer Start -->
    <div class="v-footer is-flex is-justify-content-center">
      <!-- <div class="buttons video-footer" v-if="isVideo">
        <b-tooltip :label="$t('Play in IINA')" type="is-dark">
          <b-button type="is-iina" class="mr-1" rounded @click="playVideo(item,'iina://weblink?url=')">IINA</b-button>
        </b-tooltip>
        <b-tooltip :label="$t('Play in PotPlayer')" type="is-dark">
          <b-button type="is-potplayer" class="mr-1 ml-1" rounded @click="playVideo(item,'potplayer://')">PotPlayer
          </b-button>
        </b-tooltip>
        <b-tooltip :label="$t('Play in VLC')" type="is-dark">
          <b-button type="is-vlc" class=" ml-1" rounded @click="playVideo(item,'vlc://')">VLC</b-button>
        </b-tooltip>
      </div> -->
    </div>
    <!-- Player Footer End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

export default {
  mixins: [mixin],
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          path: '/DATA/5 Seconds Of Summer - Amnesia.mp4',
          name: '5 Seconds Of Summer - Amnesia.mp4'
        }
      }
    },
  },
  components: {
    VuePlyr
  },
  data() {
    return {
      type: "",
      ext: "",
      player: null
    }
  },
  computed: {
    isVideo() {
      return this.type == "video-x-generic"
    },
    isAudio() {
      return this.type == "audio-x-generic"
    }
  },
  mounted() {
    this.ext = this.getFileExt(this.item)
    Object.keys(this.typeMap).forEach((_type) => {
      const extensions = this.typeMap[_type]
      if (extensions.indexOf(this.ext.toLowerCase()) > -1) {
        this.type = _type
      }
    })
  },
  methods: {
    download() {
      this.downloadFile(this.item);
    },
    close() {
      this.$emit("close");
    }
  },
  beforeDestroy () {
    this.$refs.plyr.player.destroy();
  },
}
</script>

<style>
</style>