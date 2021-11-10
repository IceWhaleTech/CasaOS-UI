<!--
 * @Author: JerryK
 * @Date: 2021-11-10 18:14:56
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-10 18:16:25
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\SmartBlock.vue
-->
<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:48:25
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-10 18:14:42
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\SyncBlock.vue
-->
<template>
  <div class="column is-one-half">
    <div class="wuji-card">
      <h6 class="title is-6 mb-2 has-text-white">Smarten up your home</h6>
      <div class="is-flex is-align-items-center">
        <div class="info ">
          <div class="des two-line">
            Get started syncing your data.Get started syncing your data.
          </div>
        </div>
        <b-image :src="require('@/assets/img/smart_icon.png')" class="is-64x64"></b-image>
      </div>
      <div class="buttons">
        <!-- <b-button type="is-primary" size="is-small" rounded>Go!</b-button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "smart-block"
}
</script>

<style>
</style>