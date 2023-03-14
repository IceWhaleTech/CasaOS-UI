<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-14 16:38:46
 * @FilePath: \CasaOS-UI-0.4.2\src\components\filebrowser\components\ListView.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
  <div class="node-list fliebroswer">
    <!-- Table header Start -->
    <div class="table-thead">
      <div v-if="listData.length > 0" class="tr-wrapper">
        <div class="tr">
          <div class="th"></div>
          <div class="th one-line">{{ $t("File name") }}</div>
          <div v-if="!isMobile" class="th one-line">
            <div class="one-line">{{ $t("Date Modified") }}</div>
          </div>
          <div v-if="!isMobile" class="th one-line">
            <div class="one-line">{{ $t("Size") }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Table header End -->
    <!-- Table body Start -->
    <div class="tbody">
      <div
        id="select-container"
        class="scroll-container scrollbars-light is-relative"
        :class="containerHeight"
        @contextmenu.prevent="openContextMenu"
        @mousedown.stop="onDragSelectionStart"
      >
        <!-- Empty Content Slot Start -->
        <div
          v-if="listData.length == 0 && !isLoading"
          class="is-flex is-align-items-center is-justify-content-center empty-container"
        >
          <slot></slot>
        </div>
        <!-- Empty Content Slot End -->
        <div class="select-parent">
          <div class="card-container">
            <div
              v-for="(item, index) in listData"
              :key="'list-' + index + item.name"
              :data-rel="index"
              class="tr-wrapper rdata"
            >
              <div
                :class="{
                  isCutting: getCardState(item),
                  active: item.isSelected,
                }"
                class="tr is-unselectable"
                @click="onCardClick($event, item, index)"
                @contextmenu.prevent="openContextMenu($event, item)"
                @mousedown.stop=""
              >
                <div class="td">
                  <!-- CheckBox Start -->
                  <b-field
                    :class="{ show: isMobile || item.isSelected }"
                    class="checkbox-container is-flex mr-0 ml-2 mb-0"
                  >
                    <b-checkbox
                      v-model="item.isSelected"
                      size="is-small"
                      @input="handleCheckboxInput($event, index)"
                    ></b-checkbox>
                  </b-field>
                  <!-- CheckBox End -->
                </div>
                <div class="td">
                  <div class="cover">
                    <list-icon-container :item="item"></list-icon-container>
                  </div>
                  <p class="text">
                    {{ item.name }}
                    <span
                      v-if="isMobile"
                      class="is-size-7 is-block has-text-grey-light"
                      >{{ item.date | dateFmt }}</span
                    >
                  </p>
                  <div class="action-wrapper">
                    <!-- Action Button Start -->
                    <action-button
                      :class="{ show: isMobile }"
                      :cols="cols"
                      :index="index"
                      :item="item"
                      @reload="$emit('reload')"
                      @showDetailModal="$emit('showDetailModal', item)"
                    ></action-button>
                    <!-- Action Button End -->
                  </div>
                </div>
                <div v-if="!isMobile" class="td">
                  <div class="one-line">{{ item.date | dateFmt }}</div>
                </div>
                <div v-if="!isMobile" class="td">
                  <div v-if="!item.is_dir" class="one-line">
                    {{ item.size | renderSize }}
                  </div>
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
import { mixin } from "@/mixins/mixin";
import ListViewMixin from "@/mixins/ListViewMixin";
import VueBreakpointMixin from "vue-breakpoint-mixin";
import ActionButton from "./ActionButton.vue";
import ContextMenu from "./ContextMenu.vue";
import ListIconContainer from "./ListIconContainer.vue";

export default {
  name: "list-view",
  components: {
    ActionButton,
    ContextMenu,
    ListIconContainer,
  },
  mixins: [mixin, ListViewMixin, VueBreakpointMixin],
  data() {
    return {
      cols: 1000,
      colStyle: {
        width: "",
      },
      isGird: false,
    };
  },

  created() {
    this.SELECT_BOX = "selection";
    this.PARENT_BOX = "select-container";
    this.SELECT_ITEM = ".tr-wrapper";
    this.M_WIDTH = 768;
  },
  computed: {
    containerHeight() {
      return this.isMobile ? "mobile-list-height" : "";
    },
  },
};
</script>
