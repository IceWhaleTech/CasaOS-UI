<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:16:00
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 20:14:17
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\components\DownloadList.vue
-->
<template>
  <div class="is-flex-grow-1 is-flex-shrink-1 is-flex is-flex-direction-column is-relative download-area calc-height">
    <!-- Header Start -->
    <div class="content-head p-20-40 is-flex">
      <div class="is-flex-shrink-0 has-text-left mr-4 is-flex is-align-items-center">
        <h2 class="title is-4 has-text-weight-medium">{{ $t('Downloads') }}</h2>
      </div>
      <div class=" is-flex-shrink-0">
        <b-taglist>
          <b-tag class="primary-light-hover-btn download-tab-button" @click.prevent=" page='downloading'" :type="downTabActive" rounded>
            {{ $t('Downloading') }}
            <span class="d-badge">{{downloadingList.length}}</span>
          </b-tag>
          <b-tag class="primary-light-hover-btn download-tab-button" @click.prevent=" page='completed'" :type="completeTabActive" rounded>
            {{ $t('D-Completed') }}
          </b-tag>
        </b-taglist>
      </div>
    </div>
    <!-- Header End -->
    <div class="is-flex pl-40 pr-40 pb-3">
      <div class="is-flex-grow-1 has-text-left mr-4 is-flex is-align-items-center">
        <h2 class="title is-6 has-text-weight-normal">{{ $t('D-Total') }} {{page=='downloading'?downloadingList.length:completedList.length}}</h2>
      </div>
      <div class=" is-flex-shrink-0">
        <!-- <b-taglist>
          <b-tag icon="play" class="primary-light-hover-btn download-action-button">Start All</b-tag>
          <b-tag icon="pause" class="primary-light-hover-btn download-action-button">Pause All</b-tag>
          <b-tag icon="close" class="primary-light-hover-btn download-action-button">Cancel All</b-tag>
        </b-taglist> -->
      </div>
    </div>
    <div v-if="page == 'downloading'">
      <!-- Table header Start -->
      <div class="table-thead ">
        <div class="tr-wrapper ">
          <div class="tr is-flex">
            <div class="th">{{ $t('D-Name') }}</div>
            <div class="th">{{ $t('D-Size') }}</div>
            <div class="th">{{ $t('D-Progress') }}</div>
          </div>
        </div>
      </div>
      <!-- Table header End -->

      <!-- Table body Start -->
      <div class="tbody is-flex-grow-1 is-relative scrollbars-light-auto download-scroll-container ">
        <div class="  is-relative">
          <download-list-item v-for="(item,index) in downloadingList" :item="item" :isDownloading="true" :data-rel="index" :key="'list-'+index+item.name" @deleteItem="onDeleteItem"></download-list-item>
        </div>
      </div>
      <!-- Table body End -->
    </div>

    <div v-if="page == 'completed'">
      <!-- Table header Start -->
      <div class="table-thead ">
        <div class="tr-wrapper ">
          <div class="tr is-flex">
            <div class="th">{{ $t('D-Name') }}</div>
            <div class="th">{{ $t('D-Size') }}</div>
            <div class="th action-td">{{ $t('D-Progress') }}</div>
          </div>
        </div>
      </div>
      <!-- Table header End -->

      <!-- Table body Start -->
      <div class="tbody is-flex-grow-1 is-relative scrollbars-light-auto download-scroll-container ">
        <div class="  is-relative">
          <download-list-item v-for="(item,index) in completedList" :item="item" :isDownloading="false" :data-rel="index" :key="'dlist-'+index+item.name" @deleteItem="onDeleteItem"></download-list-item>
        </div>
      </div>
      <!-- Table body End -->
    </div>

  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import DownloadListItem from './DownloadListItem.vue';
export default {
  components: { DownloadListItem },
  mixins: [mixin],
  data() {
    return {
      cols: 1000,
      colStyle: {
        width: ''
      },
      timer: 0,
      timeGap: 1,
      listData: [],
      downloadingList: [],
      completedList: [],
      page: "downloading"
    }
  },
  computed: {
    downTabActive() {
      return this.page == "downloading" ? "is-primary" : ""
    },
    completeTabActive() {
      return this.page == "completed" ? "is-primary" : ""
    }
  },
  mounted() {
    if (this.timer)
      clearInterval(this.timer)
    this.getDownloadList()
    this.timer = setInterval(() => {
      this.getDownloadList()
    }, this.timeGap * 1000)
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    getDownloadList() {
      this.$api.person.getDownloadList().then(res => {
        if (res.data.success == 200) {
          this.listData = res.data.data
          this.downloadingList = res.data.data.filter(item => {
            return item.state != 5
          })
          this.completedList = res.data.data.filter(item => {
            return item.state == 5
          })
          this.$emit('updateListLen', this.downloadingList.length)
        }

      })
    },
    onDeleteItem() {
      this.getDownloadList()
    }
  },
}
</script>

<style>
</style>