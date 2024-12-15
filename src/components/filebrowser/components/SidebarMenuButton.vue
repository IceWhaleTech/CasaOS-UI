<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-03-14 18:49:49
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-14 20:02:59
 * @FilePath: \CasaOS-UI-0.4.2\src\components\filebrowser\components\SidebarMenuButton.vue
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.
-->
<script>
import events from '@/events/events'
import VueBreakpointMixin from 'vue-breakpoint-mixin'

export default {
  name: 'SidebarButton',
  mixins: [VueBreakpointMixin],
  methods: {
    handleShowSideBar() {
      this.$EventBus.$emit(events.SHOW_FILES_SIDEBAR)
    },
  },
}
</script>

<template>
  <div
    v-if="isMobile"
    id="sidebar-btn"
    class="is-flex is-align-items-center mr-3"
    @click="handleShowSideBar"
  >
    <b-icon class="picon" icon="menu" />
  </div>
</template>
