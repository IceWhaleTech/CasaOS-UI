<!--
 * @Author: JerryK
 * @Date: 2022-02-21 11:06:18
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 18:20:48
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/GirdView.vue
-->
<template>
  <div class="scroll-container scrollbars-light is-relative">
    <div class="content-components">
      <div class="card-container" id="card-container">
        <div v-for="(item,index) in listData" :key="'list-'+index+item.name" class="grid-card" :style="colStyle">
          <div class="file-card">
            <div class="file-card-item">
              <div class="node-card-container">
                <div class="outer-wrapper">
                  <!-- Action Button Start -->
                  <action-button :cols="cols" :index="index" :item="item" @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
                  <!-- Action Button End -->

                  <div class="node-card" @click="clickItem($event,item)">
                    <div class="cover">
                      <div :class="item | coverType">
                        <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
                      </div>
                    </div>
                    <div class="info">
                      <p class="title">{{item.name}}</p>
                      <p class="desc">{{item.date | dateFmt}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <context-menu></context-menu>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import ActionButton from './ActionButton.vue';
import ContextMenu from './ContextMenu.vue';
const cardWidth = 144;
export default {
  components: { 
    ActionButton,
    ContextMenu
     },
  mixins: [mixin],
  data() {
    return {
      isLoading: false,
      items: [],
      min: 0,
      cols: 1,
      colStyle: {
        width: '33.3333%'
      }
    }
  },
  model: {
    prop: 'listData',
  },
  props: {
    listData: Array,
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      let ww = document.getElementById("card-container").clientWidth
      this.cols = Math.floor(ww / cardWidth)
      this.colStyle.width = (100 / this.cols).toString() + "%"
    },

    

  },
}
</script>
