<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2021-10-27 15:44:17
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-28 09:24:49
 * @FilePath: \CasaOS-UI\src\bak\Weather.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="widget has-text-white">
    <a class="weatherwidget-io" href="https://forecast7.com/en/31d23121d47/shanghai/" data-label_1="SHANGHAI" data-mode="Current" data-theme="original" data-basecolor=""></a>
  </div>
</template>

<script>
export default {
  name: "weather-widgets",
  icon: "white-balance-sunny",
  title: "Weather",
  initShow: false,
  mounted() {
    this.addJs()
  },
  methods: {
    addJs() {
      !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js'; fjs.parentNode.insertBefore(js, fjs); } }(document, 'script', 'weatherwidget-io-js');
    }
  },
}
</script>

<style>
</style>