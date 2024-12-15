<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/components/ActionButton.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->

<!--
 * @Author: JerryK
 * @Date: 2022-02-23 17:08:21
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-01 18:52:38
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/filebrowser/components/ActionButton.vue
-->
<script>
export default {
  emits: ['click'],
}
</script>

<template>
  <div class="action-btn" @click.stop="$emit('click', $event)">
    <p role="button">
      <b-icon custom-size="mdi-18px" icon="dots-horizontal" />
    </p>
  </div>
</template>
