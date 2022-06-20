<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-19 21:22:17
 * @Description: The left bottom brand bar
 * @FilePath: \CasaOS-UI\src\components\BrandBar.vue
-->

<template>
  <div class="brand-bar is-flex is-align-items-center has-text-white">
    <figure class="image is-24x24">
      <img :src="require('@/assets/img/logo/casa-white.svg')">
    </figure>
    <span class="logo-text mr-3 ml-1">CasaOS</span>
    <span class="intro-text">Made by IceWhale with ❤ and you!️</span>
  </div>
</template>

<script>
export default {
  name: "brand-bar"
}
</script>

<style>
</style>
