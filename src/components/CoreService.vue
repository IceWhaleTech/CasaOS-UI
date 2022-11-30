<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:50:18
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 10:48:52
 * @Description:
 * @FilePath: \CasaOS-UI\src\components\CoreService.vue
-->
<template>
  <swiper ref="mySwiper" :options="swiperOptions" v-if="Object.keys(noticesData).length > 0">
    <swiper-slide v-for="(noticeCard,key) in noticesData" :key="key">
      <noticeBlock :noticeData="noticeCard" @deleteNotice="refreshNotice" :noticeType="key"></noticeBlock>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination">
    </div>
    <img alt="prev" :src="require('@/assets/img/widgets/swiper-left.svg')" slot="button-prev"
         class="swiper-button-prev"/>
    <img alt="next" :src="require('@/assets/img/widgets/swiper-right.svg')" slot="button-next"
         class="swiper-button-next"/>
  </swiper>
</template>

<script>
import noticeBlock from "@/components/noticBlock/noticeBlock";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import {mixin} from '@/mixins/mixin';
import _ from 'lodash';

export default {
  components: {noticeBlock, Swiper, SwiperSlide},
  name: "core-service",
  mixins: [mixin],
  data() {
    return {
      notice: "local-storage",
      isLoading: false,
      swiperOptions: {
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        // loop: true,
        breakpoints: {
          450: {
            slidesPerView: 1
          },
          960: {
            slidesPerView: 2
          }
        },
        spaceBetween: 16,
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      noticesData: {
        // example data:
        /*'local-storage': {
          prelude: {
            title: 'local-storage',
            icon: 'mdi-usb',
          },
          content: {
            a: {
              title: 'Find New Drive',
              icon: '/storage/disk.png',
              color: 'is-primary',
              path: '/storage',
              uuid: '456',
              value: '100G/500G'
            },},
          contentType: 'list',
          operate: {
            type: 'button',
            title: 'More',
            path: '/storage',
            icon: 'mdi-arrow-right',
          },
        },*/
      }
    }
  },
  computed: {},
  created() {
    this.getMessage();
  },
  mounted() {
    this.WSHub = this.initMessageBus();
  },
  methods: {
    createWS(domain) {
      let socket
      // reference:
      socket = new WebSocket(`${this.$wsProtocol}//${this.$baseURL}/v2/message_bus/event/${domain}`);
      socket.onopen = () => {
        console.log('socket open')
      }
      socket.onclose = () => {
        console.log('close socket')
      }
      socket.onerror = (e) => {
        console.log('socket failure', e)
      }
      socket.onmessage = (event) => {
        let eventJson = JSON.parse(event.data)
        // let eventType = eventJson.properties['tran']
        // let operateType = eventJson.name.split(':')[2]
        // let show = eventJson.name.split(':')[1] === 'disk'
        // let entityUUID = eventJson.properties['serial']// || '010203';
        // if (eventType === 'usb' && show) {
        //   this.transformUSB(eventJson, operateType, entityUUID)
        // }
        this.patchTransform(eventJson);
      }
      return socket
    },
    initUIEventBus() {
      console.log('initEventBus')
    },
    triggerUIEventBus(event) {
      console.log('triggerEventBus', event)
      let eventJson = JSON.parse(event)
      this.$emit(eventJson.name, eventJson.propertyTypeList)
    },
    initMessageBus() {
      // config files
      let subscriptionMessageSourse = ['local-storage']
      let WSHub = Object.create(null)
      subscriptionMessageSourse.forEach((item) => {
        WSHub[item] = this.createWS(item)
      })
      return WSHub
    },
    getMessage() {
      this.$api.users.getLetter().then(res => {
        let sortedData = _.sortBy(res.data, ['timestamp']).reverse();
        sortedData.forEach(item => {
          this.patchTransform({
            ...item,
            properties: JSON.parse(item.properties),
          })
        })
      })
    },
    refreshNotice(data, type) {
      // this.noticesData[type] = data
      this.$delete(this.noticesData, type)
    },
    patchTransform(eventJson) {
      let notShow = eventJson.name.split(':')[1] !== 'disk'
      if (notShow) {
        return
      }
      // Business : Determine if formatting is required
      let eventType = eventJson.properties['children:num'] !== undefined ? eventJson.properties['tran'] : 'newDisk';

      let operateType = eventJson.name.split(':')[2]
      let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];

      switch (eventType) {
        case 'usb':
          this.transformUSB(eventJson, operateType, entityUUID)
          break;
        case 'sata':
          this.transformLocalStorage(eventJson, operateType, entityUUID)
          break;
        case 'app':
          this.transformApp(eventJson, operateType, entityUUID)
          break;
        case 'newDisk':
          this.transformNewDisk(eventJson, operateType, entityUUID)
          break;
        default:
          break;
      }
    },
    transformUSB(eventJson) {
      let eventType = eventJson.properties['tran']
      let operateType = eventJson.name.split(':')[2]
      let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];
      if (!this.noticesData[eventType]) {
        this.$set(this.noticesData, eventType, {
          prelude: {
            title: eventType,
            icon: 'mdi-usb',
          },
          content: {},
          contentType: 'list',
          operate: {
            type: 'casaUI:eventBus',
            title: 'Open in Files',
            event: 'casaUI:openInFiles',
            path: '/Storage',
            icon: 'mdi-arrow-right',
          },
        })
      }
      if (operateType === 'added') {
        let percent = eventJson.properties['used'] ? `${this.renderSize(eventJson.properties['used'])} / ${this.renderSize(eventJson.properties['size'])}` : 'NaN';
        this.$set(this.noticesData[eventType]['content'], entityUUID, {
          title: eventJson.properties['local-storage:title'] || 'Find New Drive',
          icon: '',
          color: 'is-primary',
          path: eventJson.properties['local-storage:path'],
          uuid: entityUUID,
          value: percent,
          messageUUID: eventJson.uuid
        })
        this.noticesData[eventType]['operate']['path'] = eventJson.properties['local-storage:path']
      } else if (operateType === 'removed') {
        this.$delete(this.noticesData[eventType]['content'], entityUUID)
        if (Object.keys(this.noticesData[eventType]['content']).length === 0) {
          this.$delete(this.noticesData, eventType)
          this.$api.users.delLetter(eventJson.uuid)
        }
      }
    },
    transformLocalStorage(eventJson, operateType) {
      console.log(eventJson)
      let eventType = eventJson.properties['tran']
      let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];
      if (!this.noticesData[eventType]) {
        this.$set(this.noticesData, eventType, {
          prelude: {
            title: eventType,
            icon: 'mdi-usb',
          },
          content: {},
          contentType: 'list',
          operate: {
            type: 'casaUI:eventBus',
            title: 'Open in Files',
            event: 'casaUI:openInStorageManager',
            path: '/Storage',
            icon: 'mdi-arrow-right',
          },
        })
      }
      if (operateType === 'added') {
        let percent = eventJson.properties['used'] ? `${this.renderSize(eventJson.properties['used'])} / ${this.renderSize(eventJson.properties['size'])}` : 'NaN';
        this.$set(this.noticesData[eventType]['content'], entityUUID, {
          title: eventJson.properties['local-storage:title'] || 'Find New Drive',
          icon: '/storage/disk.png',
          color: 'is-primary',
          path: eventJson.properties['local-storage:path'],
          uuid: entityUUID,
          value: percent,
          messageUUID: eventJson.uuid
        })
        this.noticesData[eventType]['operate']['path'] = eventJson.properties['mountpoint']
      } else if (operateType === 'removed') {
        this.$delete(this.noticesData[eventType]['content'], entityUUID)
        if (Object.keys(this.noticesData[eventType]['content']).length === 0) {
          this.$delete(this.noticesData, eventType)
          this.$api.users.delLetter(eventJson.uuid)
        }
      }
    },
    transformNewDisk(eventJson, operateType) {
      let eventType = eventJson.properties['tran']
      let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];
      if (!this.noticesData[eventType]) {
        this.$set(this.noticesData, eventType, {
          prelude: {
            title: eventType,
            icon: 'mdi-usb',
          },
          content: {},
          contentType: 'list',
          operate: {
            type: 'casaUI:eventBus',
            title: 'Open in Files',
            event: 'casaUI:openDiskLearnMore',
            path: '/Storage',
            icon: 'mdi-arrow-right',
          },
        })
      }
      if (operateType === 'added') {
        let percent = eventJson.properties['used'] ? `${this.renderSize(eventJson.properties['used'])} / ${this.renderSize(eventJson.properties['size'])}` : 'NaN';
        this.$set(this.noticesData[eventType]['content'], entityUUID, {
          title: eventJson.properties['local-storage:title'] || 'Find New Drive',
          icon: '/storage/disk.png',
          color: 'is-primary',
          path: eventJson.properties['local-storage:path'],
          uuid: entityUUID,
          value: percent,
          messageUUID: eventJson.uuid
        })
        this.noticesData[eventType]['operate']['path'] = eventJson.properties['mountpoint']
      } else if (operateType === 'removed') {
        this.$delete(this.noticesData[eventType]['content'], entityUUID)
        if (Object.keys(this.noticesData[eventType]['content']).length === 0) {
          this.$delete(this.noticesData, eventType)
          this.$api.users.delLetter(eventJson.uuid)
        }
      }
    },
  },
  beforeDestroy() {
    for (let key in this.WSHub) {
      this.WSHub[key].close()
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-button-prev, .swiper-button-next {
  width: 2rem;
  height: 2rem;
  margin: 0 0.5rem;
  top: calc(50% - 2rem);
  z-index: 20;
}

.swiper-pagination {
  position: relative;

  ::v-deep .swiper-pagination-bullet {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    width: 2rem;
    height: 0.25rem;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 0.125rem;
    display: inline-block;
  }

  ::v-deep .swiper-pagination-bullet-active {
    background: #FFFFFF;
  }
}

</style>
