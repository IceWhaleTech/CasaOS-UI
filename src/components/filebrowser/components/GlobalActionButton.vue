<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-31 13:57:21
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 18:06:46
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\GlobalActionButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="action-btn">
    <b-dropdown aria-role="list" ref="moreBtn" :triggers="['click','context']" class="file-dropdown" position="is-bottom-right" animation="fade1" append-to-body :mobile-modal="false" close-on-click>
      <template #trigger>
        <b-button icon-left="book-arrow-up" size="is-small" type="is-primary" :label="$t('Upload or Create')" class="mr-2" rounded />
      </template>
      <b-dropdown-item id="upfile-btn" aria-role="menuitem" class="is-flex is-align-items-center">
        <b-icon icon="file-upload-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
        {{ $t('Upload Files') }}
      </b-dropdown-item>
      <b-dropdown-item id="upfolder-btn" aria-role="menuitem" class="is-flex is-align-items-center">
        <b-icon icon="folder-upload-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
        {{ $t('Upload Folder') }}
      </b-dropdown-item>
      <hr class="dropdown-divider">
      <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="showNewFileModal">
        <b-icon icon="file-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
        {{ $t('New File') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="showNewFolderModal">
        <b-icon icon="folder-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
        {{ $t('New Folder') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: "global-action-button",
  inject: ['filePanel'],
  mounted() {
    this.assignBtn();
  },
  methods: {
    showNewFileModal() {
      this.$emit('showNewFileModal')
    },
    showNewFolderModal() {
      this.$emit('showNewFolderModal')
    },
    assignBtn() {
      this.$nextTick(() => {
        this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfile-btn'))
        this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfolder-btn'), true)
      });
    },
  },
}
</script>

<style>
</style>