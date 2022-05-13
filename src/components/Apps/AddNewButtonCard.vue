<!--
 * @Author: 老竭力 jerrykuku@qq.com
 * @Date: 2022-05-07 17:06:30
 * @LastEditors: 老竭力 jerrykuku@qq.com
 * @LastEditTime: 2022-05-07 17:07:52
 * @FilePath: \CasaOS-UI\src\components\Apps\AddNewButtonCard.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by 老竭力 jerrykuku@qq.com, All Rights Reserved. 
-->
<template>
  <div class="column is-narrow is-3">
    <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card">
      <div class="blur-background"></div>
      <div class="cards-content">
        <!-- Card Content Start -->
        <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column p-55  img-c">
          <a class="is-flex is-justify-content-center" @click="emit('showInstall') ">
            <b-image :src="require('@/assets/img/app/add_button.svg')" class="is-72x72"></b-image>
          </a>
        </div>
        <!-- Card Content End -->
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>