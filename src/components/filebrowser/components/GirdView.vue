<script>
import ListViewMixin from '@/mixins/ListViewMixin'
import { mixin } from '@/mixins/mixin'
import ActionButton from './ActionButton.vue'
import ContextMenu from './ContextMenu.vue'
import IconContainer from './IconContainer.vue'

export default {
  name: 'GirdView',
  components: {
    ActionButton,
    ContextMenu,
    IconContainer,
  },
  mixins: [mixin, ListViewMixin],
  data() {
    return {
      cols: 1,
      colStyle: {
        width: '33.3333%',
      },
      isGird: true,
    }
  },
  computed: {
    containerHeight() {
      return this.isMobile ? 'mobile-height' : ''
    },
  },
  created() {
    this.CARD_CONTAINER = 'card-container'
    this.SELECT_BOX = 'selection'
    this.PARENT_BOX = 'select-container'
    this.SELECT_ITEM = '.file-card-item'
    this.CARD_WIDTH = 144
    this.M_WIDTH = 768
  },
}
</script>

<template>
  <div
    id="select-container"
    :class="containerHeight"
    class="scroll-container scrollbars-light is-relative w-full"
    @contextmenu.prevent="openContextMenu"
    @mousedown.left.prevent="onDragSelectionStart"
  >
    <!-- Empty Content Slot Start -->
    <div
      v-if="listData.length === 0 && !isLoading"
      class="is-flex is-align-items-center is-justify-content-center empty-container"
    >
      <slot />
    </div>
    <!-- Empty Content Slot End -->
    <div class="content-components select-parent">
      <div id="card-container" class="card-container">
        <div
          v-for="(item, index) in listData"
          :key="`list-${index}${item.name}`"
          :data-rel="index"
          :style="colStyle"
          class="grid-card rdata selectable"
        >
          <div class="file-card">
            <div :data-rel="index" class="file-card-item" @mousedown.stop="">
              <div class="node-card-container">
                <div :class="{ active: item.isSelected }" class="outer-wrapper">
                  <div
                    :class="{ isCutting: getCardState(item) }"
                    class="node-card is-unselectable"
                    @click.stop="onCardClick($event, item, index)"
                    @contextmenu.prevent="openContextMenu($event, item)"
                  >
                    <div class="cover">
                      <IconContainer :item="item" />
                    </div>
                    <div class="info">
                      <p class="title">
                        {{ item.name }}
                      </p>
                      <p class="desc">
                        {{ item.date | dateFmt }}
                      </p>
                    </div>
                  </div>

                  <!-- CheckBox Start -->
                  <b-field
                    :class="{ show: isMobile || item.isSelected }"
                    class="checkbox-container is-flex"
                  >
                    <b-checkbox
                      v-model="item.isSelected"
                      size="is-small"
                      @input="handleCheckboxInput($event, index)"
                    />
                  </b-field>
                  <!-- CheckBox End -->

                  <ActionButton :class="{ show: isMobile }" @click.stop="openContextMenu($event, item)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- SelectDivLayer Start -->
      <div v-show="isShowSeBox" id="selection" />
      <!-- SelectDivLayer End -->
    </div>

    <!-- Context Menu Start -->
    <ContextMenu @reload="$emit('reload')" />
    <!-- Context Menu End -->
  </div>
</template>
