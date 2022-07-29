<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-29 14:53:46
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-29 16:09:30
 * @FilePath: /CasaOS-UI/src/components/filebrowser/shared/ShareListView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="node-list fliebroswer">

    <!-- Table body Start -->
    <div class="tbody">
      <div class="scroll-container scrollbars-light is-relative " id="select-container">
        <!-- Empty Content Slot Start -->
        <div class="is-flex is-align-items-center is-justify-content-center empty-container" v-if="listData.length == 0 && !isLoading">
          <slot></slot>
        </div>
        <!-- Empty Content Slot End -->
        <div class="select-parent">
          <div class="card-container">
            <div class="tr-wrapper rdata" :data-rel="index" v-for="(item,index) in listData" :key="'list-'+index+item.path">
              <div class="tr is-unselectable" :class="{'active':item.isSelected}">

                <div class="td">
                  <!-- CheckBox Start -->
                  <b-field class="checkbox-container is-flex  mr-0 ml-2 mb-0">

                  </b-field>
                  <!-- CheckBox End -->
                </div>
                <div class="td">
                  <div class="cover">
                    <list-icon-container :item="item"></list-icon-container>
                  </div>
                  <p class="text ">
                    {{item.name}}
                  </p>
                  <div class="action-wrapper mr-3">
                    <!-- Action Button Start -->
                    <action-button :index="index" :item="item"></action-button>
                    <!-- Action Button End -->
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- Table body End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import ActionButton from './ActionButton.vue';
import ListIconContainer from "../components/ListIconContainer.vue"
export default {
  model: {
    prop: 'listData',
    event: 'change'
  },
  props: {
    listData: Array,
    isLoading: Boolean
  },
  components: {
    ActionButton,
    ListIconContainer
  },
  mixins: [mixin],

  data() {
    return {
      isMobile: false
    }
  },
  created() {
    this.M_WIDTH = 768;
  },

  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  methods: {
    /*************************************************
    * PART 1  Alignment Method
    **************************************************/
    /**
     * @description: Changes the arrangement of the list when the view size changes.
     * @return {*}
     */
    onResize() {
      const ww = document.body.clientWidth
      this.isMobile = ww <= this.M_WIDTH
    },
  },
}
</script>

<style>
</style>