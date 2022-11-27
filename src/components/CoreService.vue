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
    <swiper-slide v-for="(noticeCard,key) in nocticeData" :key="key">
      <noticeBlock :data="noticeCard"></noticeBlock>
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
// import SmartBlock from './smartHome/SmartBlock.vue'
// import SyncBlock from './syncthing/SyncBlock.vue'
// import StorageBlock from "@/components/Storage/StorageBlock";
import noticeBlock from "@/components/noticBlock/noticeBlock";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'

export default {
  components: {noticeBlock, Swiper, SwiperSlide},
  name: "core-service",
  data() {
    return {
      notice: "local-storage",
      isLoading: false,
      swiperOptions: {
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        loop: true,
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
        'usb': {
          title: 'USB',
          icon: 'mdi-usb',
          content:[ {title:'Find New Drive',icon:'mdi-usb',color:'is-primary',path:'/storage'},
            {title:'Find New Drive',icon:'mdi-usb',color:'is-primary',path:'/storage'},],
          operate: {
            type: 'button',
            title: 'More',
            icon: 'mdi-dots-horizontal',
          },
          close: {
            type: 'button',
            title: 'Close',
            icon: 'mdi-close',
          },
        },
        'local-storage': {
          title: 'USB',
          icon: 'mdi-usb',
          conetentType: 'list',
          content:[ {title:'Find New Drive',icon:'mdi-usb',color:'is-primary',path:'/storage'},
            {title:'Find New Drive',icon:'mdi-usb',color:'is-primary',path:'/storage'},],
          operate: {
            type: 'button',
            title: 'More',
            icon: 'mdi-dots-horizontal',
          },
          close: {
            type: 'button',
            title: 'Close',
            icon: 'mdi-close',
          },
        },
        'app': {
          title: 'USB',
          icon: 'mdi-usb',
          conetentType: 'rate',
          content:[ 0.5 ],
          operate: {
            type: 'button',
            title: 'More',
            icon: 'mdi-dots-horizontal',
          },
          close: {
            type: 'button',
            title: 'Close',
            icon: 'mdi-close',
          },
        },
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
    getMessage(){
      this.$api.users.getLetter().then(res => {
        this.nocticeData = res.data
      })
    }
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
