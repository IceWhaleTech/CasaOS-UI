<!--
 * @Author: JerryK
 * @Date: 2022-02-21 11:06:18
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-07 20:30:09
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\GirdView.vue
-->
<template>
  <div class="scroll-container scrollbars-light is-relative" id="select-container" @contextmenu.prevent="openContextMenu" @mousedown.left.prevent="onDragSelectionStart">
    <!-- Empty Content Slot Start -->
    <div class="is-flex is-align-items-center is-justify-content-center empty-container" v-if="listData.length == 0 && !isLoading">
      <slot></slot>
    </div>
    <!-- Empty Content Slot End -->
    <div class="content-components  select-parent">
      <div class="card-container" id="card-container">
        <div v-for="(item,index) in listData" :key="'list-'+index+item.name" class="grid-card rdata selectable" :data-rel="index" :style="colStyle">
          <div class="file-card">
            <div class="file-card-item" :data-rel="index" @mousedown.stop="">
              <div class="node-card-container">
                <div class="outer-wrapper" :class="{'active':item.isSelected}">
                  <div class="node-card is-unselectable" :class="{'isCutting':getCardState(item)}" @click.stop="onCardClick($event,item,index)" @contextmenu.prevent="openContextMenu($event,item)">
                    <div class="cover">
                      <icon-container :item="item"></icon-container>
                    </div>
                    <div class="info">
                      <p class="title">{{item.name}}</p>
                      <p class="desc">{{item.date | dateFmt}}</p>
                    </div>
                  </div>

                  <!-- CheckBox Start -->
                  <b-field class="checkbox-container is-flex" :class="{'show':isMobile || item.isSelected}">
                    <b-checkbox size="is-small" @input="handleCheckboxInput($event,index)" v-model="item.isSelected"></b-checkbox>
                  </b-field>
                  <!-- CheckBox End -->

                  <!-- Action Button Start -->
                  <action-button :cols="cols" :index="index" :item="item" :class="{'show':isMobile}" @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
                  <!-- Action Button End -->

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- SelectDivLayer Start -->
      <div v-show="isShowSeBox" id="selection"></div>
      <!-- SelectDivLayer End -->
    </div>

    <!-- Context Menu Start -->
    <context-menu ref="ctxMenu" @reload="$emit('reload')"></context-menu>
    <!-- Context Menu End -->

  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import ListViewMixin from '@/mixins/ListViewMixin'
import ActionButton from './ActionButton.vue';
import ContextMenu from './ContextMenu.vue'
import IconContainer from "./IconContainer.vue"


export default {
  name: "gird-view",
  mixins: [mixin, ListViewMixin],
  components: {
    ActionButton,
    ContextMenu,
    IconContainer,
  },
  data() {
    return {
      cols: 1,
      colStyle: {
        width: '33.3333%'
      },
      isGird: true,

    }
  },
  created() {
    this.CARD_CONTAINER = "card-container"
    this.SELECT_BOX = "selection"
    this.PARENT_BOX = "select-container"
    this.SELECT_ITEM = ".file-card-item"
    this.CARD_WIDTH = 144;
    this.M_WIDTH = 768;
  },

}
</script>
