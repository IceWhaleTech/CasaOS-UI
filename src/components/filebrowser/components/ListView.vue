<!--
 * @Author: JerryK
 * @Date: 2022-02-21 11:06:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-31 14:51:58
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\ListView.vue
-->
<template>
  <div class="node-list fliebroswer">
    <!-- Table header Start -->
    <div class="table-thead">
      <div class="tr-wrapper" v-if="listData.length > 0">
        <div class="tr">
          <div class="th"></div>
          <div class="th one-line">{{ $t('Name') }}</div>
          <div class="th one-line" v-if="!isMobile">
            <div class="one-line">{{ $t('Date Modified') }}</div>
          </div>
          <div class="th one-line" v-if="!isMobile">
            <div class="one-line">{{ $t('Size') }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Table header End -->
    <!-- Table body Start -->
    <div class="tbody">
      <div class="scroll-container scrollbars-light is-relative " id="select-container" @contextmenu.prevent="openContextMenu" @mousedown.stop="onDragSelectionStart">
        <!-- Empty Content Slot Start -->
        <div class="is-flex is-align-items-center is-justify-content-center empty-container" v-if="listData.length == 0 && !isLoading">
          <slot></slot>
        </div>
        <!-- Empty Content Slot End -->
        <div class="select-parent">
          <div class="card-container">
            <div class="tr-wrapper rdata" :data-rel="index" v-for="(item,index) in listData" :key="'list-'+index+item.name">
              <div class="tr is-unselectable" :class="{'isCutting':getCardState(item),'active':item.isSelected}" @click="onCardClick($event,item,index)" @contextmenu.prevent="openContextMenu($event,item)">

                <div class="td">
                  <!-- CheckBox Start -->
                  <b-field class="checkbox-container is-flex  mr-0 ml-2 mb-0" :class="{'show':isMobile || item.isSelected}">
                    <b-checkbox size="is-small" @input="handleCheckboxInput($event,index)" v-model="item.isSelected"></b-checkbox>
                  </b-field>
                  <!-- CheckBox End -->
                </div>
                <div class="td">
                  <div class="cover">
                    <list-icon-container :item="item"></list-icon-container>
                  </div>
                  <p class="text ">
                    {{item.name}}
                    <span v-if="isMobile" class="is-size-7 is-block has-text-grey-light">{{item.date | dateFmt}}</span>
                  </p>
                  <div class="action-wrapper">
                    <!-- Action Button Start -->
                    <action-button :cols="cols" :class="{'show':isMobile}" :index="index" :item="item" @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
                    <!-- Action Button End -->
                  </div>
                </div>
                <div class="td " v-if="!isMobile">
                  <div class="one-line">{{item.date | dateFmt}}</div>
                </div>
                <div class="td" v-if="!isMobile">
                  <div class="one-line" v-if="!item.is_dir">{{item.size | renderSize}}</div>
                </div>

              </div>
            </div>
          </div>

          <!-- SelectDivLayer Start -->
          <div v-show="isShowSeBox" id="selection"></div>
          <!-- SelectDivLayer End -->

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
import ListViewMixin from '@/mixins/ListViewMixin'
import ActionButton from './ActionButton.vue';
import ContextMenu from './ContextMenu.vue';
import ListIconContainer from "./ListIconContainer.vue"



export default {
  name: 'list-view',
  components: {
    ActionButton,
    ContextMenu,
    ListIconContainer
  },
  mixins: [mixin, ListViewMixin],
  data() {
    return {
      cols: 1000,
      colStyle: {
        width: ''
      },
      isGird: false
    }
  },

  created() {
    this.SELECT_BOX = "selection"
    this.PARENT_BOX = "select-container"
    this.SELECT_ITEM = ".tr-wrapper"
    this.M_WIDTH = 768;
  },
}
</script>