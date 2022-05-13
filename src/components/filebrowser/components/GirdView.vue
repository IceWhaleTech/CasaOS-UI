<!--
 * @Author: JerryK
 * @Date: 2022-02-21 11:06:18
 * @LastEditors: 老竭力 jerrykuku@qq.com
 * @LastEditTime: 2022-05-07 23:08:36
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\GirdView.vue
-->
<template>
  <div class="scroll-container scrollbars-light is-relative" @contextmenu.prevent="openContextMenu">
    <!-- Empty Content Slot Start -->
    <div class="is-flex is-align-items-center is-justify-content-center empty-container" v-if="listData.length == 0 && !isLoading">
      <slot></slot>
    </div>
    <!-- Empty Content Slot End -->
    <div class="content-components">
      <div class="card-container" id="card-container">
        <div v-for="(item,index) in listData" :key="'list-'+index+item.name" class="grid-card rdata" :data-rel="index" :style="colStyle">
          <div class="file-card">
            <div class="file-card-item">
              <div class="node-card-container">
                <div class="outer-wrapper">
                  <!-- Action Button Start -->
                  <action-button :cols="cols" :index="index" :item="item" @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
                  <!-- Action Button End -->

                  <div class="node-card is-unselectable" :class="{'isCutting':getCardState(item)}" @click="clickItem($event,item)" @contextmenu.prevent="openContextMenu($event,item)">
                    <div class="cover">
                      <icon-container :item="item"></icon-container>
                      <!-- <div class="friendly-name" v-if="item.is_dir && item.type == 'application'">{{item.label}}</div> -->
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

    <!-- Context Menu Start -->
    <context-menu ref="ctxMenu" @reload="$emit('reload')"></context-menu>
    <!-- Context Menu End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import ActionButton from './ActionButton.vue';
import ContextMenu from './ContextMenu.vue'
import IconContainer from "./IconContainer.vue"
const cardWidth = 144;
export default {
  components: {
    ActionButton,
    ContextMenu,
    IconContainer,

  },
  mixins: [mixin],
  data() {
    return {
      items: [],
      min: 0,
      cols: 1,
      contextIsShow: false,
      colStyle: {
        width: '33.3333%'
      },

    }
  },
  model: {
    prop: 'listData',
  },
  props: {
    listData: Array,
    isLoading: Boolean
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
