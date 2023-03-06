<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-02-24 17:28:31
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-06 19:30:28
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/DropPage.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
    <div class="content is-flex is-flex-direction-column is-flex-grow-1 " id="drop-page">
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
                <drop-item v-for="(item, index) in peersArray" :key="item.id" :index="initIndexArray[index]"
                    :center="centerPos" :showIndex="initIndexArray[index]" :radius="bigRadius" :isFloat="isDesktop"
                    :isSelf="item.id === selfId" :customClass="areaClass" :device="item" @showed="isFirstIn = false" />
                <drop-add-button :index="peersArray.length" :radius="bigRadius" :center="centerPos" :isFloat="isDesktop" />
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
import { saveAs } from "file-saver";
// import shuffle from "lodash/shuffle";
import csnackbar from "../components/snackbar/index.js";
export default {
    name: "drop-page",
    components: {
        DropItem: () => import("./DropItem.vue"),
        DropContextMenu: () => import("./DropContextMenu.vue"),
        DropCenterIcon: () => import("./DropCenterIcon.vue"),
        DropBg: () => import("./DropBg.vue"),
        DropAddButton: () => import("./DropAddButton.vue"),
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
            initIndexArray: [4, 0, 2, 3, 9, 1, 8, 5, 6, 7],
            peersArray: [],
            selfId: "",
            filesQueue: [],
            busy: false,
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
        console.log(this.initIndexArray);
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

        setTimeout(() => {
            this.initServer();
        }, 1000);
    },
    methods: {
        initServer() {
            // const access_token = localStorage.getItem("access_token");
            // const url = `${this.$wsProtocol}//${this.$baseURL}/v1/file/ws?token=${access_token}&peer=${this.selfId}`;
            const url = "";
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

            // 通知接收者一个文件接收完毕
            Events.on("file-received", this.handleFileReceived);

            // 通知发送者一个文件发送完毕
            Events.on("notify-user", this.handleNotifyUser);
        },

        // Handle file received
        handleFileReceived(e) {
            console.log("file-received", e.detail);
            this.nextFile(e.detail);
        },

        nextFile(nextFile) {
            if (nextFile) this.filesQueue.push(nextFile);
            if (this.busy) return;
            this.busy = true;
            const file = this.filesQueue.shift();
            this.displayFile(file);
        },
        dequeueFile() {
            if (!this.filesQueue.length) { // nothing to do
                this.busy = false;
                return;
            }
            // dequeue next file
            setTimeout(() => {
                this.busy = false;
                this.nextFile();
            }, 300);
        },

        displayFile(file) {

            this.$buefy.snackbar.open({
                indefinite: true,
                message: file.name + " is received.",
                type: 'is-white',
                cancelText: 'Ignore',
                actionText: 'Save',
                position: 'is-bottom',
                container: '#drop-page',
                onAction: () => {
                    saveAs(file.blob, file.name);
                    this.dequeueFile();
                }
            })
            document.querySelector("#drop-page .snackbar .is-cancel").addEventListener("click", this.onSnackbarClose);
        },
        onSnackbarClose() {
            document.querySelector("#drop-page .snackbar .is-cancel").removeEventListener("click", this.onSnackbarClose);
            this.dequeueFile();
        },


        // Handle notify user
        handleNotifyUser(e) {
            this.$buefy.toast.open({
                duration: 2000,
                message: e.detail,
                type: 'is-white',
                container: "#drop-page"
            })
        },

        // handelPeers
        handlePeers(peers) {
            this.peersArray = peers.detail;
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