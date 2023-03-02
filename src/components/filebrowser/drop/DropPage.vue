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
                <drop-item v-for="(item, index) in peersArray" :key="item.id" :index="index" :center="centerPos"
                    :showIndex="isFirstIn ? initIndexArray[index] : 0" :radius="bigRadius" :isFloat="isDesktop"
                    :isSelf="item.id === selfId" :progress="progress" :customClass="areaClass" :device="item"
                    @showed="isFirstIn = false" />
                <!-- Cricle BG Start -->
                <drop-bg v-if="isDesktop" />
                <!-- Circle Bg End -->
            </div>
            <!-- Bottom Center Icons Start -->
            <drop-center-icon v-if="isNotMobile" />
            <!-- Bottom Center Icons End -->
        </div>
        <!-- Contents End -->
        <drop-context-menu />
    </div>
</template>

<script>
import { ServerConnection, PeersManager, Events } from "./Network.js"
import shuffle from "lodash/shuffle";

export default {
    name: "drop-page",
    components: {
        DropItem: () => import("./DropItem.vue"),
        DropContextMenu: () => import("./DropContextMenu.vue"),
        DropCenterIcon: () => import("./DropCenterIcon.vue"),
        DropBg: () => import("./DropBg.vue"),
    },
    data() {
        return {
            isFirstIn: true,
            bigRadius: 100,
            bottomGap: 144,
            contentsWidth: 0,
            contentsHeight: 0,
            centerPos: {
                x: 0,
                y: 0
            },
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
                "--contents-width": this.contentsWidth + "px",
                "--contents-height": this.contentsHeight + "px",
            }
        },
        isDesktop() {
            return this.deviceType === "desktop";
        },
        isNotMobile() {
            return this.deviceType !== "mobile";
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
        const access_token = localStorage.getItem("access_token");
        const url = `${this.$wsProtocol}//${this.$baseURL}/v1/file/ws?token=${access_token}&peer=${this.selfId}`;
        const server = new ServerConnection(url);
        // const peers = new PeersManager(server);
        new PeersManager(server);
        // 初始化列表
        Events.on("peers", this.handlePeers);
        // 获取我是我
        Events.on("display-name", this.handleSelfJoined);
        // 节点加入
        Events.on("peer-joined", this.handlePeerJoined);
        // 节点离开
        Events.on("peer-left", this.handlePeerleft);

    },
    methods: {
        // handelPeers
        handlePeers(peers) {
            this.peersArray = shuffle(peers.detail);
            // Only listen to peer join event once
            Events.off("peers", this.handlePeers);
        },

        // Handle Self Joined
        handleSelfJoined(e) {
            localStorage.setItem("peerid", e.detail.message.id);
        },

        // Handle peer joined
        handlePeerJoined(e) {
            const peer = e.detail;
            const even = (element) => element.id === peer.id;
            const isInlist = this.peersArray.some(even);
            if (!isInlist) {
                this.peersArray.push(peer);
            } else {
                this.peersArray.forEach((element) => {
                    if (element.id == peer.id) {
                        for (let key in element) {
                            element[key] = peer[key];
                        }
                    }
                });
            }
        },
        // Handle peer left
        handlePeerleft(e) {
            this.peersArray.forEach(element => {
                if (element.id == e.detail) {
                    element.offline = true;
                }
            });
        },
        // handleResize
        resize() {
            const gap = 120;
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

            const windowWidth = window.innerWidth;
            if (windowWidth < 768) {
                this.deviceType = "mobile";
            } else if (windowWidth < 1024 && windowWidth >= 768) {
                this.deviceType = "tablet";
            } else {
                this.deviceType = "desktop";
            }

            this.getCenterPos();
        },
        // get center position
        getCenterPos() {
            this.centerPos = {
                x: this.contentsWidth / 2,
                y: this.contentsHeight - this.bottomGap
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.action-area {
    overflow: hidden;

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

    &.tablet,
    &.mobile {
        display: flex;
        align-items: center;

        .contents {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
        }
    }
}
</style>