<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-28 15:29:40
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-15 14:45:53
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/DropEntryButton.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
  <div>
    <div
      :class="{ active: active }"
      class="is-flex list-item new-list-item"
      @click.prevent="$emit('open');$messageBus('files_filesdrop_tab')"
    >
      <div
        slot="reference"
        class="cover mr-2 is-flex-shrink-0 is-flex is-align-items-center none-click"
      >
        <b-icon  icon="drop" pack="casa"></b-icon>
      </div>
      <div>
        <span>{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "drop-entry-button",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
