<!--
 * @Author: JerryK
 * @Date: 2022-01-20 13:21:23
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-20 14:17:37
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/Storage/DriveItem.vue
-->
<template>
  <div class="mb-5 mt-2">
    <div class="is-flex mb-2">
      <div class="header-icon">
        <b-image :src="require('@/assets/img/disk.png')" class="is-64x64"></b-image>
      </div>
      <div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
        <div>
          <h4 class="title is-size-6-5 mb-3 has-text-left one-line">{{item.name}}</h4>
          <p class="has-text-left is-size-7 ">{{item.model}}, {{renderSize(item.size)}} {{item.disk_type}}</p>
        </div>
      </div>
      <div class="is-flex is-align-items-center status">
        <div>
          <p class="has-text-left is-size-7 mb-3">{{ $t('Health') }}: <b class="has-text-success" v-if="item.health">{{ $t('Healthy') }}</b><b class="has-text-danger" v-if="!item.health">{{ $t('Damage') }}</b></p>
          <p class="has-text-left is-size-7 ">{{ $t('Temp') }}: <b v-if="item.temperature > 0">{{item.temperature}}°C / {{item.temperature | toFahrenheit}}°F</b> <b v-else>N/A</b></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  name: "drive-item",
  mixins: [mixin],
  props: {
    item: {
      type: Object,
      default: null
    },
  },
}
</script>

