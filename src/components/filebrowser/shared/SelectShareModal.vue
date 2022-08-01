<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-31 20:24:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-31 21:20:56
 * @FilePath: \CasaOS-UI\src\components\filebrowser\shared\SelectShareModal.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Select Shared Folder')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">

      <ul class="folder-list scrollbars-light mt-5 mb-5">
        <li v-for="(item,index) in initFolders" :key="'s'+index">
          <div class="is-flex list-item new-list-item" v-if="item.visible">
            <div class="cover mr-4 is-flex-shrink-0">
              <b-icon :icon="item.icon"></b-icon>
            </div>
            <div class=" is-flex-grow-1">{{item.name}}</div>
            <div class=" is-flex-shrink-0">
              <b-checkbox :value="item.selected"></b-checkbox>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Submit')" type="is-primary" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rootDataList: [
        {
          name: 'Root',
          icon: 'folder-home-outline',
          path: '/'
        },
      ],

      initFolders: [
        {
          name: 'DATA',
          icon: 'folder-pound-outline',
          path: '/DATA',
          visible: true,
          selected: true
        },
        {
          name: 'Documents',
          icon: 'folder-text-outline',
          path: '/DATA/Documents',
          visible: true,
          selected: true
        },
        {
          name: 'Downloads',
          icon: 'folder-download-outline',
          path: '/DATA/Downloads',
          visible: true,
          selected: true
        },
        {
          name: 'Gallery',
          icon: 'folder-star-outline',
          path: '/DATA/Gallery',
          visible: true,
          selected: true
        },
        {
          name: 'Media',
          icon: 'folder-music-outline',
          path: '/DATA/Media',
          visible: true,
          selected: true
        },

      ],
    }
  },
  created() {
    this.getNewList()
  },
  methods: {
    async getNewList() {
      const newList = await this.$api.folder.getList(this.rootDataList[0].path)
      const dataList = await this.$api.folder.getList(this.initFolders[0].path)
      const contactList = []
      contactList.push(...newList.data.data, ...dataList.data.data)
      this.initFolders.forEach(dir => {
        dir.visible = contactList.some(item => item.path == dir.path && item.is_dir)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.folder-list {
  background: #f8f8f8;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;

  .list-item {
    font-size: 0.875rem;
  }
}
</style>