<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:50:18
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 10:48:52
 * @Description:
 * @FilePath: \CasaOS-UI\src\components\CoreService.vue
-->
<template>
  <swiper ref="mySwiper" :options="swiperOptions">
    <swiper-slide v-for="(carousel,key) in carousels" :key="key">
      <noticeBlock></noticeBlock>
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
import SmartBlock from './smartHome/SmartBlock.vue'
import SyncBlock from './syncthing/SyncBlock.vue'
import StorageBlock from "@/components/Storage/StorageBlock";
import noticeBlock from "@/components/noticBlock/noticeBlock";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'

export default {
  components: {SyncBlock, SmartBlock, StorageBlock, noticeBlock, Swiper, SwiperSlide},
  name: "core-service",
  data() {
    return {
      notice: "local-storage",
      isLoading: false,
      swiperOptions: {
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
        // loop: true,
        slidesPerView: 2,
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
      carousels: [
        {
          title: 'Smart Home',
          icon: 'mdi-home',
          color: 'is-primary',
          path: '/smartHome'
        },
        {
          title: 'Syncthing',
          icon: 'mdi-sync',
          color: 'is-info',
          path: '/syncthing'
        },
        {
          title: 'Storage',
          icon: 'mdi-database',
          color: 'is-success',
          path: '/storage'
        },
      ],
      nocticeData: {
        'usb': {}
      }
    }
  },
  computed: {},
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
        console.log(eventJson)
        let analysisSource = eventJson.name.split(':');
        // this. = analysisSource[2]
        // this.$emit(eventJson.name, ventJson.propertyTypeList)
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
