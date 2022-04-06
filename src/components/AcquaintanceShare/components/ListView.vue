<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:14:29
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-11 22:14:29
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\components\ListView.vue
-->
<template>
  <div class="node-list">
    <!-- Table header Start -->
    <div class="table-thead">
      <div class="tr-wrapper" v-if="listData.length > 0">
        <div class="tr">
          <div class="th">{{ $t('File Name') }}</div>
          <div class="th">{{ $t('Date Modified') }}</div>
          <div class="th">{{ $t('Size') }}</div>
        </div>
      </div>
    </div>
    <!-- Table header End -->
    <!-- Table body Start -->
    <div class="tbody">
      <div class="scroll-container scrollbars-light is-relative" @contextmenu.prevent="openContextMenu">
        <!-- Empty Content Slot Start -->
        <div class="is-flex is-align-items-center is-justify-content-center empty-container" v-if="listData.length == 0 && !isLoading">
          <slot></slot>
        </div>
        <!-- Empty Content Slot End -->
        <div class="tr-wrapper rdata" :data-rel="index" v-for="(item,index) in listData" :key="'list-'+index+item.name">
          <div class="tr is-unselectable" :class="{'isCutting':getCardState(item)}" @click.capture="clickUserItem($event,item)" @contextmenu.prevent="openContextMenu($event,item)">
            <div class="td">
              <div class="cover">
                <div :class="item | coverType">
                  <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
                </div>
              </div>
              <p class="text">
                {{item.name}}
                <b-tag v-if="item.is_dir && item.type == 'application'" type="is-primary is-light">{{item.label}}
                </b-tag>
              </p>
              <div class="action-wrapper">
                <!-- Action Button Start -->
                <action-button :cols="cols" :index="index" :item="item" @showDetailModal="$emit('showDownloadModal',user, item)" @reload="$emit('reload')"></action-button>
                <!-- Action Button End -->
              </div>
            </div>
            <div class="td">{{item.date | dateFmt}}</div>
            <div class="td" v-if="!item.is_dir">{{item.size | renderSize}}</div>
            <div class="td" v-else></div>
          </div>
        </div>
      </div>
      <!-- Context Menu Start -->
      <context-menu ref="ctxMenu" @reload="$emit('reload')"></context-menu>
      <!-- Context Menu End -->
    </div>

    <!-- Table body End -->
  </div>

</template>

<script>
import { mixin } from '@/mixins/mixin';
import ActionButton from './ActionButton.vue';
import ContextMenu from './ContextMenu.vue';
export default {
  components: { ActionButton, ContextMenu },
  mixins: [mixin],

  data() {
    return {
      items: [],
      min: 0,
      cols: 1000,
      colStyle: {
        width: ''
      }
    }
  },
  model: {
    prop: 'listData',
  },
  props: {
    listData: Array,
    isLoading: Boolean,
    user: {}
  },
  mounted() {

  },

  methods: {
    /**
     * @description: Download File
     * @param {Object,Object} event item 
     * @return {void} 
     */
    clickUserItem(event, item) {
      let bounced = event.target.getAttribute('class').includes('mdi-dots')
      if (bounced) {
        return false
      }
      if (item.is_dir) {
        this.$emit('gotoFolder', this.user, item.path)
      } else {
        this.$emit('showDownloadModal', this.user, item)
      }
    },

  },
}
</script>