<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-28 15:48:34
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-31 20:53:39
 * @FilePath: \CasaOS-UI\src\components\filebrowser\shared\ShareListPage.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="content is-flex-grow-1">
    <!-- Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1 is-flex breadcrumb-container" id="bread-container">
        <h3 class="title is-3 mb-0">{{ $t('Shared Folders') }}</h3>
      </div>
      <div class="is-flex is-align-items-center">
        <!--  Close Button Start -->
        <div class="is-flex is-align-items-center modal-close-container  ">
          <button type="button" class="delete" @click="$emit('close')" />
        </div>
        <!--  Close Button End -->
      </div>
    </header>
    <!-- Header End -->

    <share-list-view :listData="list" :isLoading="isLoading">
      <div>
        <div class="buttons is-justify-content-center">
          <b-image :src="require('@/assets/img/share/share-empty.svg')" class="is-160x160"></b-image>
        </div>
        {{ $t('Follow the guide to start sharing your files on the local network.') }}
        <div class="buttons is-justify-content-center pt-3">
          <b-button type="is-primary" rounded>{{ $t('Start') }}</b-button>
        </div>
      </div>
    </share-list-view>
    <b-loading v-model="isLoading"></b-loading>
  </div>
</template>

<script>

import ShareListView from './ShareListView.vue'

export default {
  data() {
    return {
      list: [],
      isLoading: true,
    }
  },

  components: {
    ShareListView,

  },

  mounted() {
    this.getSharedList()

    
    
  },

  methods: {
    async getSharedList() {
      this.isLoading = true
      try {
        const list = await this.$api.samba.getShares();
        this.isLoading = false
        this.list = list.data.data.map(item => {
          const name = item.path.split('/').pop()
          return {
            date: "",
            isSelected: false,
            is_dir: true,
            name: name,
            path: item.path,
            size: 0,
            write: false
          }
        })
      } catch (error) {
        this.isLoading = false
        this.list = []
      }
    },

    
    
  },
}
</script>

<style lang="scss" scoped>
.modal-card-head {
  height: 4.5rem;
}
</style>