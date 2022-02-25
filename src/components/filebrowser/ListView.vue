<!--
 * @Author: JerryK
 * @Date: 2022-02-21 11:06:26
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 18:28:00
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/ListView.vue
-->
<template>
  <div class="node-list">
    <div class="table-thead">
      <div class="tr-wrapper">
        <div class="tr">
          <div class="th">Name</div>
          <div class="th">Modify time</div>
          <div class="th">Size</div>
        </div>
      </div>
    </div>
    <div class="tbody">
      <div class="scroll-container scrollbars-light is-relative">
        <div class="tr-wrapper" v-for="(item,index) in listData" :key="'list-'+index+item.name">
          <div class="tr" @click.capture="clickItem($event,item)">
            <div class="td">
              <div class="cover">
                <div :class="item | coverType">
                  <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
                </div>
              </div>
              <p class="text">
                {{item.name}}
              </p>
              <div class="action-wrapper">
                <!-- Action Button Start -->
                <action-button :cols="cols" :index="index" :item="item" @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
                <!-- Action Button End -->
              </div>
            </div>
            <div class="td">{{item.date | dateFmt}}</div>
            <div class="td" v-if="!item.is_dir">{{item.size | renderSize}}</div>
            <div class="td" v-else></div>
          </div>
        </div>
        <context-menu></context-menu>
      </div>
    </div>
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
      isLoading: false,
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
  },
  mounted() {

  },

  methods: {


  },
}
</script>