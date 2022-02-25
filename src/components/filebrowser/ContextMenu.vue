<!--
 * @Author: JerryK
 * @Date: 2022-02-25 17:52:41
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 18:29:09
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/ContextMenu.vue
-->
<template>
  <div class="context-area" @contextmenu.prevent="$refs.menu.open">
      
    <!-- context -->
    <vue-context ref="menu">
      <li>
        dsadasdasd
      </li>
    </vue-context>
  </div>
</template>

<script>
import VueContext from 'vue-context';
export default {
  components: {
    VueContext,
  },
}
</script>

<style>
</style>