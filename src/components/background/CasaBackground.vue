<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-21 19:03:39
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 22:42:53
 * @FilePath: \CasaOS-UI\src\components\background\CasaBackground.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div>
    <div id="background" v-animate-css="animate" :style="backgroundStyleObj"></div>
    <context-menu></context-menu>
  </div>

</template>

<script>
import ContextMenu from './ContextMenu.vue'
export default {
  name: "casa-background",
  components: {
    ContextMenu,
  },
  props: {
    animate: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      isWelcome: false,
      backgroundStyleObj: {
        backgroundImage: `url(${require('@/assets/background/background.png')})`
      },
    }
  },
}
</script>
<style lang="scss" scoped>
#background {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom center;
  overflow: hidden;
  transition: background-image 0.5s linear;
}
</style>