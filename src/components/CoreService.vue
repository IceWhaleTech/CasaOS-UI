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
      <!--      <div class="hero-body has-text-centered has-background-white">
              {{ carousel.title }}
            </div>-->
      <noticeBlock></noticeBlock>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
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
      notice: "local_stroage",
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
          el: '.swiper-pagination'
        },
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
        // {
        //   title: 'Storage',
        //   icon: 'mdi-database',
        //   color: 'is-success',
        //   path: '/storage'
        // },
      ]
    }
  },
  computed: {
    // swiper() {
    //   return this.$refs.mySwiper.$swiper
    // }
  },
  mounted() {
    this.initMessageBus();
  },
  methods: {
    createWS() {
      let socket
      // reference:
      socket = new WebSocket(`ws://${this.$baseURL}/v2/message_bus/event/${this.notice}`);
      socket.onopen = () => {
        console.log('socket open')
      }
      socket.onclose = () => {
        console.log('close socket')
      }
      socket.onerror = (e) => {
        console.log('socket failure', e)
      }
      socket.onmessage = (event, data) => {
        debugger
        console.log('11111\n', event, '\n', data)
        // this.triggerUIEventBus(event)
        console.log('triggerEventBus', event)
        let eventJson = JSON.parse(event)
        this.$emit(eventJson.name, eventJson.propertyTypeList)
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
      let messageSourse = ['local_stroage']
      let messageSoruseWSHub = Object.create(null)
      messageSourse.forEach((item) => {
        messageSoruseWSHub[item] = this.createWS(item)
      })
    },
    // uiEventBusHub(eventName, data) {
    //   console.log('uiEventBusHub', eventName, data)
    //   this.triggerUIEventBus(eventName, data)
    // },
  }
}
</script>

<style scoped>
</style>
