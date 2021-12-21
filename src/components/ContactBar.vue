<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-14 16:37:12
 * @Description: The right bottom contact bar
 * @FilePath: /CasaOS-UI/src/components/ContactBar.vue
-->

<template>
  <div class="contact-bar is-flex is-align-items-center has-text-white pl-3 pr-3">
    <a href="#">
      <b-icon  icon="routes" ></b-icon>
    </a>
    <a href="https://discord.gg/knqAbbBbeX" target="_blank">
      <b-icon  icon="discord" ></b-icon>
    </a>
    <a href="https://github.com/IceWhaleTech/CasaOS" target="_blank">
      <b-icon  icon="github" ></b-icon>
    </a>
  </div>
</template>

<script>
export default {
  name: "contact-bar"
}
</script>
