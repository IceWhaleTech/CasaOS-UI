<!--
 * @Author: JerryK
 * @Date: 2022-03-07 17:10:25
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-09 16:02:39
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\EmptyHolder.vue
-->
<template>
  <div class="has-text-centered">

    <h5 class="title is-65">{{ $t('Drop your files here to upload') }}</h5>
    <p class="is-size-7">{{ $t('or') }}</p>
    <ul class="is-flex upload-btns">
      <li class="e-btn" @click="$emit('newFile')">
        <span>{{ $t('New File') }}</span>
        <b-image :src="require('@/assets/img/filebrowser/newFile.svg')"></b-image>
      </li>
      <li class="e-btn" @click="$emit('newFolder')">
        <span>{{ $t('New Folder') }}</span>
        <b-image :src="require('@/assets/img/filebrowser/newFolder.svg')"></b-image>
      </li>
      <li class="e-btn" id="eUpFileBtn">
        <span>{{ $t('Upload Files') }}</span>
        <b-image :src="require('@/assets/img/filebrowser/upfile.svg')"></b-image>
      </li>
      <li class="e-btn" id="eUpFolderBtn">
        <span>{{ $t('Upload Folder') }}</span>
        <b-image :src="require('@/assets/img/filebrowser/upfolder.svg')"></b-image>
      </li>
    </ul>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  inject: ['filePanel'],
  mounted() {
    this.$nextTick(() => {
      this.filePanel.uploaderInstance.assignBrowse(document.getElementById('eUpFileBtn'))
      this.filePanel.uploaderInstance.assignBrowse(document.getElementById('eUpFolderBtn'), true)
    });
  },
}
</script>

<style>
</style>