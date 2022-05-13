<!--
 * @Author: JerryK
 * @Date: 2022-02-21 11:06:26
 * @LastEditors: 老竭力 jerrykuku@qq.com
 * @LastEditTime: 2022-05-11 15:28:12
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\ListView.vue
-->
<template>
  <div class="node-list">
    <!-- Table header Start -->
    <div class="table-thead" >
      <div class="tr-wrapper" v-if="listData.length > 0">
        <div class="tr">
          <div class="th">{{ $t('Name') }}</div>
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
        <div class="is-flex is-align-items-center is-justify-content-center empty-container"
          v-if="listData.length == 0 && !isLoading">
          <slot></slot>
        </div>
        <!-- Empty Content Slot End -->
        <div class="tr-wrapper rdata" :data-rel="index" v-for="(item,index) in listData" :key="'list-'+index+item.name">
          <div class="tr is-unselectable" :class="{'isCutting':getCardState(item)}"
            @click.capture="clickItem($event,item)" @contextmenu.prevent="openContextMenu($event,item)">
            <div class="td">
              <div class="cover">
                <list-icon-container :item="item"></list-icon-container>
                
              </div>
              <p class="text">
                {{item.name}}
                <b-tag v-if="item.is_dir && item.type == 'application'" type="is-primary is-light">{{item.label}}
                </b-tag>
              </p>
              <div class="action-wrapper">
                <!-- Action Button Start -->
                <action-button :cols="cols" :index="index" :item="item"
                  @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
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
import ListIconContainer from "./ListIconContainer.vue"
export default {
  components: { ActionButton, ContextMenu,ListIconContainer },
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
    isLoading:Boolean
  },
  mounted() {

  },

  methods: {


  },
}
</script>