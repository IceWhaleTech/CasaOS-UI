<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-01 20:06:46
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 20:29:48
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\OperationStatusItem.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="operation-status-item" v-if="!data.finished">
    <div class="task-info">
      <h4 class="title task-type is-size-7 mb-1 one-line has-text-weight-normal">{{$t(opType)}}: {{data.processing_path}}</h4>
      <b-progress type="is-primary" size="is-small" :value="Math.floor(progress*100)" show-value format="percent" class="mb-1"></b-progress>
    </div>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize'
export default {
  name: "operation-status-item",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          "finished": false,
          "processed_size": 257713736,
          "processing_path": "/DATA/Barry.S01.E01.720p.HMAX.WEB-DL.H264.DD5.1-HHHHH.mkv",
          "status": "PROCESSING",
          "total_size": 657713736,
          "id": "4f0477cf-d22a-4f59-81db-075d2fbbe870",
          "to": "/DATA/New Folder",
          "type": "copy"
        }
      }
    },
  },

  computed: {
    progress() {
      return this.data.processed_size / this.data.total_size
    },
    progressBarStyle() {
      return {
        width: (100 * this.progress).toString() + "%"
      }
    },
    opType() {
      return capitalize(this.data.type)
    }
  },

  filters: {
    toPercentText: function (value) {
      return (100 * value).toFixed(1) + "%";
    },

  }
}
</script>

<style>
</style>