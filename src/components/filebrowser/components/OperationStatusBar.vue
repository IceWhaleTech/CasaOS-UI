<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-30 20:15:05
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 20:29:40
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\OperationStatusBar.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="mr-2 operation-status-bar" v-if="isShow" >
    <popper trigger="clickToOpen" enter-active-class="animated fadeIn" leave-active-class=" fadeOut" :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,5px' } }
    }">
      <div class="popper">
        <p class="card-header-title mb-0">{{$t('Current Tasks')}}</p>
        <operation-status-item v-for="task in taskList" :key="task.id" :data="task"></operation-status-item>
      </div>
      <b-button slot="reference" size="is-small" type="is-primary is-light" rounded>
        <b-icon icon="autorenew" custom-class="mdi-spin" custom-size=" mdi-18px"></b-icon>
      </b-button>
    </popper>
  </div>
</template>

<script>
import Popper from 'vue-popperjs';

import 'vue-popperjs/dist/vue-popper.css';
import OperationStatusItem from './OperationStatusItem.vue';
export default {
  name: "operation-status-bar",
  components: {
    Popper,
    OperationStatusItem,
  },
  data() {
    return {
      taskList: []
    }
  },
  computed: {
    isShow() {
      return this.taskList.length > 0
    }
  },
  sockets: {
    file_operate(data) {
      const taskList = data.body.file_operate.data
      this.taskList = taskList.filter(task => {
        return !task.finished
      })
    }
  }
}
</script>

<style>
</style>