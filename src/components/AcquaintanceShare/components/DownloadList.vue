<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:16:00
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-14 12:14:43
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\components\DownloadList.vue
-->
<template>
  <div class="is-flex-grow-1 is-flex-shrink-1 is-flex is-flex-direction-column is-relative download-area calc-height">
    <!-- Header Start -->
    <div class="content-head p-20-40 is-flex">
      <div class="is-flex-shrink-0 has-text-left mr-4">
        <h2 class="title is-4 has-text-weight-medium">Download list</h2>
      </div>
      <div class=" is-flex-shrink-0">
        <b-taglist>
          <b-tag class="primary-light-hover-btn download-tab-button">
            Downloading
            <span class="d-badge">10</span>
          </b-tag>
          <b-tag class="primary-light-hover-btn download-tab-button">Completed</b-tag>
        </b-taglist>
      </div>
    </div>
    <!-- Header End -->
    <div class="is-flex pl-40 pr-40 pb-3">
      <div class="is-flex-grow-1 has-text-left mr-4 is-flex is-align-items-center">
        <h2 class="title is-6 has-text-weight-normal">Total 6</h2>
      </div>
      <div class=" is-flex-shrink-0">
        <b-taglist>
          <b-tag icon="play" class="primary-light-hover-btn download-action-button">Start All</b-tag>
          <b-tag icon="pause" class="primary-light-hover-btn download-action-button">Pause All</b-tag>
          <b-tag icon="close" class="primary-light-hover-btn download-action-button">Cancel All</b-tag>
        </b-taglist>
      </div>
    </div>

    <!-- Table header Start -->
    <div class="table-thead ">
      <div class="tr-wrapper ">
        <div class="tr is-flex">
          <div class="th">Name</div>
          <div class="th">Size</div>
          <div class="th">Condition</div>
        </div>
      </div>
    </div>
    <!-- Table header End -->

    <!-- Table body Start -->
    <div class="tbody is-flex-grow-1 is-relative scrollbars-light-auto download-scroll-container">
      <div class="  is-relative">
        <div class="tr-wrapper rdata" :data-rel="index" v-for="(item,index) in listData" :key="'list-'+index+item.name">
          <div class="tr is-unselectable" :class="{'isCutting':getCardState(item)}"
            @click.capture="clickItem($event,item)">
            <div class="td">
              <div class="cover">
                <div :class="item | coverType">
                  <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
                </div>
              </div>
              <p class="text">
                {{item.name}}
                <b-tag v-if="item.is_dir && item.type == 'application'" type="is-primary is-light">{{item.label}}
                </b-tag>
              </p>
              <div class="action-wrapper">
                <!-- Action Button Start -->
                <action-button :cols="cols" :index="index" :item="item"
                  @showDetailModal="$emit('showDetailModal', item)" @reload="$emit('reload')"></action-button>
                <!-- Action Button End -->
              </div>
            </div>
            <div class="td">{{item.date | dateFmt}}</div>
            <div class="td" v-if="!item.is_dir">{{item.size | renderSize}}</div>
            <div class="td" v-else></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Table body End -->

  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  data() {
    return {
      cols: 1000,
      colStyle: {
        width: ''
      },
      listData: [
        {
          "name": "1.png",
          "path": "/DATA/1111李33/1.png",
          "is_dir": false,
          "date": "2022-03-08T09:50:37.211405841Z",
          "size": 11042649
        },
        {
          "name": "20210519-182407-47bc.png.jpeg",
          "path": "/DATA/1111李33/20210519-182407-47bc.png.jpeg",
          "is_dir": false,
          "date": "2022-03-08T08:26:43.552238942Z",
          "size": 270535
        },
        {
          "name": "BaiduNetdisk_mac_3.1.0.dmg",
          "path": "/DATA/1111李33/BaiduNetdisk_mac_3.1.0.dmg",
          "is_dir": false,
          "date": "2022-03-10T03:36:14.585235635Z",
          "size": 98225660
        },
        {
          "name": "DietPi_NativePC-BIOS-x86_64-Bullseye_Installer",
          "path": "/DATA/1111李33/DietPi_NativePC-BIOS-x86_64-Bullseye_Installer",
          "is_dir": true,
          "date": "2022-03-10T07:32:41.385181516Z",
          "size": 4096
        },
        {
          "name": "NatTypeTester-generic-6.0.0.7z",
          "path": "/DATA/1111李33/NatTypeTester-generic-6.0.0.7z",
          "is_dir": false,
          "date": "2022-03-09T11:14:48.417457951Z",
          "size": 6287267
        },
        {
          "name": "New File",
          "path": "/DATA/1111李33/New File",
          "is_dir": false,
          "date": "2022-03-09T02:29:47.145578119Z",
          "size": 0
        },
        {
          "name": "New Fol111gyg共和国",
          "path": "/DATA/1111李33/New Fol111gyg共和国",
          "is_dir": true,
          "date": "2022-03-08T10:31:28.235396491Z",
          "size": 4096
        },
        {
          "name": "Notion-2.0.17.dmg",
          "path": "/DATA/1111李33/Notion-2.0.17.dmg",
          "is_dir": false,
          "date": "2022-03-10T03:33:29.209236265Z",
          "size": 170425343
        },
        {
          "name": "Postman-osx-8.7.0.zip",
          "path": "/DATA/1111李33/Postman-osx-8.7.0.zip",
          "is_dir": false,
          "date": "2022-03-10T03:35:12.453235872Z",
          "size": 133920119
        },
        {
          "name": "SSokit_1.1.8.dmg.zip",
          "path": "/DATA/1111李33/SSokit_1.1.8.dmg.zip",
          "is_dir": false,
          "date": "2022-03-10T03:31:31.877236713Z",
          "size": 21716174
        },
        {
          "name": "WeCom_3.1.8.90228.dmg",
          "path": "/DATA/1111李33/WeCom_3.1.8.90228.dmg",
          "is_dir": false,
          "date": "2022-03-09T11:18:59.265456994Z",
          "size": 183389326
        },
        {
          "name": "ZimaBoard上架资料",
          "path": "/DATA/1111李33/ZimaBoard上架资料",
          "is_dir": true,
          "date": "2022-03-09T07:37:27.1055077Z",
          "size": 4096
        },
        {
          "name": "balenaEtcher-1.5.120.dmg",
          "path": "/DATA/1111李33/balenaEtcher-1.5.120.dmg",
          "is_dir": false,
          "date": "2022-03-09T11:15:30.265457792Z",
          "size": 183997110
        },
        {
          "name": "boot",
          "path": "/DATA/1111李33/boot",
          "is_dir": true,
          "date": "2022-03-10T07:32:24.985181579Z",
          "size": 4096
        },
        {
          "name": "casaos_banner_aldeyjarfoss.png",
          "path": "/DATA/1111李33/casaos_banner_aldeyjarfoss.png",
          "is_dir": false,
          "date": "2022-03-09T10:56:32.405462132Z",
          "size": 1746842
        },
        {
          "name": "images",
          "path": "/DATA/1111李33/images",
          "is_dir": true,
          "date": "2022-03-10T07:32:16.101181613Z",
          "size": 4096
        },
        {
          "name": "openwrt-x86-64-generic-squashfs-combined-efi.img.gz",
          "path": "/DATA/1111李33/openwrt-x86-64-generic-squashfs-combined-efi.img.gz",
          "is_dir": false,
          "date": "2022-03-10T03:31:18.197236765Z",
          "size": 162775472
        },
        {
          "name": "traefik",
          "path": "/DATA/1111李33/traefik",
          "is_dir": true,
          "date": "2022-03-10T07:32:35.885181537Z",
          "size": 4096
        },
        {
          "name": "ubuntu-20.04.3-live-server-amd64.iso",
          "path": "/DATA/1111李33/ubuntu-20.04.3-live-server-amd64.iso",
          "is_dir": false,
          "date": "2022-03-02T06:15:36.091733135Z",
          "size": 1261371392
        },
        {
          "name": "xbox",
          "path": "/DATA/1111李33/xbox",
          "is_dir": true,
          "date": "2022-03-09T02:26:16.229578924Z",
          "size": 4096
        },
        {
          "name": "前端学习文件夹",
          "path": "/DATA/1111李33/前端学习文件夹",
          "is_dir": true,
          "date": "2022-03-09T02:35:33.697576797Z",
          "size": 4096
        },
        {
          "name": "提供给William资料包.zip",
          "path": "/DATA/1111李33/提供给William资料包.zip",
          "is_dir": false,
          "date": "2022-03-09T02:36:15.585576637Z",
          "size": 7264891
        }
      ]
    }
  },
}
</script>

<style>
</style>