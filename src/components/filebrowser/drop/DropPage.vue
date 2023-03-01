<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-02-24 17:28:31
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-01 18:30:04
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/DropPage.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
    <div class="content is-flex is-flex-direction-column is-flex-grow-1 ">
        <!-- Header Start -->
        <header class="modal-card-head is-flex-shrink-0">
            <div class="is-flex-grow-1 is-flex breadcrumb-container" id="bread-container">
                <h3 class="title is-3 mb-0">{{ $t('FileDrop') }}</h3>
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
        <!-- Contents Start -->
        <div class="action-area is-flex-grow-1 is-relative" :class="areaClass" :style="cssVariables">
            <div class="contents">

                <!-- Bottom Center Icon End -->
                <drop-item v-for="(item, index) in peersArray" :key="index" :position="item.posistion" :isFloat="isDesktop"
                    :isSelf="item.id === selfId" :progress="progress" :customClass="areaClass" :device="item"></drop-item>
                <!-- Cricle BG Start -->
                <div class="bg is-absolute">
                    <div class="circle" style="animation-delay: -3s"></div>
                    <div class="circle" style="animation-delay: -2s"></div>
                    <div class="circle" style="animation-delay: -1s"></div>
                    <div class="circle" style="animation-delay: 0s"></div>
                </div>
                <!-- Circle Bg End -->
            </div>
            <!-- Bottom Center Icons Start -->
            <div class="center-icon">
                <div class="has-text-centered">
                    <b-image :src="require('@/assets/img/drop/drop_icon.svg')"
                        class="is-80x80 ml-auto mr-auto mb-2"></b-image>
                    <p class="has-text-emphasis-02 has-text-grey-800 mb-2">{{ $t("FileDorp") }}</p>
                    <p class="has-text-full-04 has-text-grey-600">{{ $t("Drop files to another device anytime,anywhere")
                    }}</p>
                </div>
            </div>

        </div>
        <!-- Contents End -->
        <drop-context-menu />
    </div>
</template>

<script>

import DropItem from "./DropItem.vue";
import DropContextMenu from "./DropContextMenu.vue";
import { ServerConnection, PeersManager, Events } from "./Network.js"
import shuffle from "lodash/shuffle";
// import { UAParser} from "ua-parser-js";
export default {
    name: "drop-page",
    components: {
        DropItem,
        DropContextMenu
    },
    data() {
        return {
            bigRadius: 100,
            smallRadius: 50,
            bottomGap: 144,
            contentsWidth: 0,
            contentsHeight: 0,
            centerPos: {
                x: 0,
                y: 0
            },
            posArray: [],
            progress: 0,
            deviceType: "desktop",
            initIndexArray: [],
            peersArray: [],
            selfId: "",
        }
    },
    computed: {
        cssVariables() {
            return {
                "--big-radius": this.bigRadius + "px",
                "--small-radius": this.smallRadius + "px",
                "--contents-width": this.contentsWidth + "px",
                "--contents-height": this.contentsHeight + "px",
                "--bottom-gap": this.bottomGap + "px",
                "--center-pos-x": this.centerPos.x + "px",
                "--center-pos-y": this.centerPos.y + "px",
            }
        },
        isDesktop() {
            return this.deviceType === "desktop";
        },
        areaClass() {
            if (this.deviceType === "desktop") {
                return "desktop";
            } else if (this.deviceType === "tablet") {
                return "tablet";
            } else {
                return "mobile";
            }
        }
    },
    created() {
        for (let index = 0; index < 10; index++) {
            this.initIndexArray.push(index)
        }
        this.initIndexArray = shuffle(this.initIndexArray);
        this.selfId = localStorage.getItem("peerid");
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
        document.ondragover = null; // 拖拽进入
    },
    mounted() {
        window.addEventListener('resize', this.resize);
        this.resize();
        document.ondragover = function (e) { e.preventDefault(); }; // 拖拽进入

        const url = (this.selfId == "") ? "ws://192.168.2.221/v1/file/ws?token=" + localStorage.getItem("access_token") : "ws://192.168.2.221/v1/file/ws?token=" + localStorage.getItem("access_token") + "&peer=" + this.selfId;
        const server = new ServerConnection(url);
        const peers = new PeersManager(server);

        // 初始化列表
        Events.on("peers", (e) => {
            this.peersArray = e.detail.map((item, index) => {
                item.posistion = this.posArray[this.initIndexArray[index]]
                return item
            })
            console.log(this.peersArray);
        });

        // 获取我是我
        Events.on("display-name", (e) => {
            console.log(e.detail);
            localStorage.setItem("peerid", e.detail.message.id);
        });

        // 节点离开
        Events.on("peer-left", (e) => {
            console.log(e.detail);
            this.peersArray = this.peersArray.filter(item => item.id !== e.detail.message.id)
            console.log(this.peersArray);
        });


    },
    methods: {
        // handleResize
        resize() {
            const gap = 120;
            const ratio = 1.86;
            const cWidth = document.querySelector('.action-area').clientWidth - gap;
            const cHeight = document.querySelector('.action-area').clientHeight - gap / 2 - this.bottomGap;

            if (cWidth > cHeight * 2) {
                this.contentsWidth = cHeight * 2
                this.contentsHeight = cHeight + this.bottomGap
            } else {
                this.contentsWidth = cWidth
                this.contentsHeight = cWidth / 2 + this.bottomGap
            }

            this.bigRadius = this.contentsWidth;
            this.smallRadius = this.contentsWidth / ratio;

            const windowWidth = window.innerWidth;
            if (windowWidth < 768) {
                this.deviceType = "mobile";
            } else if (windowWidth < 1024 && windowWidth >= 768) {
                this.deviceType = "tablet";
            } else {
                this.deviceType = "desktop";
            }

            this.getCenterPos();
            this.getPosArray();
        },
        // get center position
        getCenterPos() {
            this.centerPos = {
                x: this.contentsWidth / 2,
                y: this.contentsHeight - this.bottomGap
            }
        },
        // get position array
        getPosArray() {
            this.posArray = [];
            for (let index = 0; index < 5; index++) {
                const angel = 30 * (index + 1);
                const pos = {
                    x: this.centerPos.x + this.bigRadius / 2 * Math.cos(angel * Math.PI / 180),
                    y: this.centerPos.y - this.bigRadius / 2 * Math.sin(angel * Math.PI / 180),
                    first: (index === 4),
                    last: (index === 0)
                };
                this.posArray.push(pos);
            }
            for (let index = 0; index < 5; index++) {
                const angel = 45 * index;
                const pos = {
                    x: this.centerPos.x + this.smallRadius / 2 * Math.cos(angel * Math.PI / 180),
                    y: this.centerPos.y - this.smallRadius / 2 * Math.sin(angel * Math.PI / 180),
                    first: (index === 4),
                    last: (index === 0)
                }
                this.posArray.push(pos);
            }

        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes circle-scale {
    from {
        transform: scale(0.4);
        opacity: 1;
    }

    to {
        transform: scale(1.2);
        opacity: 0.5;
    }
}

.action-area {
    overflow: hidden;

    .center-icon {
        position: absolute;
        width: 100%;
        height: 11.5rem;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        z-index: 5;
        display: flex;
        justify-content: center;
        pointer-events: none;
    }

    .contents {


        .bg {
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;

            .circle {
                border-radius: 50%;
                width: var(--big-radius);
                height: var(--big-radius);
                background-color: rgba(15, 143, 255, 0.02);
                position: absolute;
                opacity: 0;
                animation: circle-scale 4s infinite linear;
            }

            // &::before {
            //     content: "";
            //     position: absolute;
            //     width: var(--big-radius);
            //     height: var(--big-radius);
            //     border-radius: 50%;
            //     background-color: rgba(15, 143, 255, 0.02);
            //     z-index: 1;
            //     left: 50%;
            //     top: calc(var(--contents-height) - var(--bottom-gap));
            //     transform-origin: center;
            //     pointer-events: none;
            //     animation-name: circle-scale;
            //     animation-duration: 2s;
            //     animation-iteration-count: infinite;
            //     animation-timing-function: ease-out;
            // }

            // &::after {
            //     content: "";
            //     position: absolute;
            //     width: var(--small-radius);
            //     height: var(--small-radius);
            //     border-radius: 50%;
            //     background-color: rgba(15, 143, 255, 0.03);
            //     z-index: 2;
            //     left: 50%;
            //     top: calc(var(--contents-height) - var(--bottom-gap));
            //     transform-origin: center;
            //     pointer-events: none;
            //     animation-name: circle-scale;
            //     animation-duration: 2s;
            //     animation-iteration-count: infinite;
            //     animation-timing-function: ease-out;
            //     animation-delay: 0.3s;
            // }
        }
    }

    &.desktop {
        .contents {
            position: absolute;
            width: var(--contents-width);
            height: var(--contents-height);
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
        }
    }

    &.tablet {
        display: flex;
        align-items: center;

        .contents {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;

            .bg {
                display: none;
            }

        }
    }

    &.mobile {
        display: flex;
        align-items: center;

        .contents {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;

            .bg {
                display: none;
            }
        }

        .center-icon {
            display: none;
        }
    }
}
</style>