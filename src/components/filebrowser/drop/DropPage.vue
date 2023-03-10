<template>
  <div
    class="content is-flex is-flex-direction-column is-flex-grow-1"
    id="drop-page"
  >
    <!-- Header Start -->
    <header class="modal-card-head is-flex-shrink-0">
      <div
        class="is-flex-grow-1 is-flex breadcrumb-container"
        id="bread-container"
      >
        <h3 class="title is-3 mb-0">{{ $t("FilesDrop") }}</h3>
      </div>
      <div class="is-flex is-align-items-center">
        <!--  Close Button Start -->
        <div class="close-button" @click="$emit('close')">
          <b-icon pack="casa" icon="close"></b-icon>
        </div>
        <!--  Close Button End -->
      </div>
    </header>
    <!-- Header End -->
    <!-- Contents Start -->
    <div
      class="action-area is-flex-grow-1 is-relative"
      :class="areaClass"
      :style="cssVariables"
    >
      <div class="contents">
        <!-- Cricle BG Start -->
        <drop-bg v-if="isDesktop" />
        <!-- Circle Bg End -->
        <transition-group name="list-complete" tag="div" class="contents">
          <drop-item
            v-for="(item, index) in peersArray"
            :key="item.id"
            :index="initIndexArray[index]"
            :center="centerPos"
            :showIndex="initIndexArray[index]"
            :radius="bigRadius"
            :isFloat="isDesktop"
            :customClass="areaClass"
            :device="item"
            @showed="
              isFirstIn = false;
              showAddButton = true;
            "
            class="list-complete-item"
          />
        </transition-group>
        <drop-add-button
          :index="peersArray.length"
          :showIndex="initIndexArray[peersArray.length]"
          :radius="bigRadius"
          :center="centerPos"
          :isFloat="isDesktop"
          v-if="showAddButton && peersArray.length == 1"
        />
      </div>
      <!-- Bottom Center Icons Start -->
      <drop-center-icon v-if="isNotMobile" />
      <!-- Bottom Center Icons End -->

      <drop-add-button
        :index="peersArray.length"
        :showIndex="initIndexArray[peersArray.length]"
        :radius="bigRadius"
        :center="centerPos"
        :isFloat="isDesktop"
        v-if="showAddButton && peersArray.length > 1"
      />
    </div>
    <!-- Contents End -->
    <drop-context-menu />
  </div>
</template>

<script>
import { ServerConnection, PeersManager, Events } from "./Network.js";
import { saveAs } from "file-saver";
// import { v4 as uuidv4 } from 'uuid';

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
      slefPeer: {},
      bigRadius: 100,
      bottomGap: 144,
      contentsWidth: 0,
      contentsHeight: 0,
      centerPos: {
        x: 0,
        y: 0,
      },
      progress: 0,
      deviceType: "desktop",
      peersArray: [],
      selfId: "",
      filesQueue: [],
      busy: false,
      showAddButton: false,
    };
  },
  computed: {
    cssVariables() {
      return {
        "--big-radius": this.bigRadius + "px",
        "--contents-width": this.contentsWidth + "px",
        "--contents-height": this.contentsHeight + "px",
      };
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
    },
    addButtonIndex() {
      if (this.isDesktop) {
        return this.peersArray.length;
      } else {
        return this.peersArray.length + 1;
      }
    },
    initIndexArray() {
      return this.isDesktop
        ? [8, 6, 2, 3, 1, 7, 4, 0, 9, 5]
        : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    },
  },
  created() {
    this.selfId = localStorage.getItem("peerid");
  },
  beforeDestroy() {
    Events.fire("pagehide");
    window.removeEventListener("resize", this.resize);
    document.ondragover = null; // 拖拽进入
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.resize();
    document.ondragover = function (e) {
      e.preventDefault();
    }; // 拖拽进入

    this.$nextTick(() => {
      setTimeout(() => {
        this.initServer();
      }, 1000);
    });
  },
  methods: {
    // Init Ws Server
    initServer() {
        
      const access_token = localStorage.getItem("access_token");
      // const url = `${this.$wsProtocol}//${this.$baseURL}/v1/file/ws?token=${access_token}&peer=${this.selfId}`;
      const url = `${this.$wsProtocol}//192.168.2.243/v1/file/ws?token=${access_token}&peer=${this.selfId}`;
    //   const url = `ws://localhost:3000/server/webrtc?peer=${this.selfId}`;
    console.log(url);
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

    // Handle file received (from other peer)
    handleFileReceived(e) {
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
      if (!this.filesQueue.length) {
        // nothing to do
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
        message: this.$t("{name} {size} is received.", {
          name: file.name,
          size: this.renderSize(file.size),
        }),
        type: "is-file",
        cancelText: this.$t("Ignore"),
        actionText: this.$t("Save"),
        position: "is-bottom",
        container: "#drop-page",
        onAction: () => {
          saveAs(file.blob, file.name);
          this.dequeueFile();
        },
      });
      document
        .querySelector("#drop-page .snackbar .is-cancel")
        .addEventListener("click", this.onSnackbarClose);
    },
    onSnackbarClose() {
      document
        .querySelector("#drop-page .snackbar .is-cancel")
        .removeEventListener("click", this.onSnackbarClose);
      this.dequeueFile();
    },

    // Handle notify user (for sender)
    handleNotifyUser(e) {
      const type = e.detail.indexOf("lost") > -1 ? "is-danger" : "is-success";
      this.$buefy.toast.open({
        duration: 2000,
        message: this.$t(e.detail),
        type: type,
        container: "#drop-page",
      });
    },

    // handelPeers
    handlePeers(peers) {
      this.peersArray = peers.detail;
      // Only listen to peer join event once
      Events.off("peers", this.handlePeers);
    },

    // Handle Self Joined
    handleSelfJoined(e) {
      const message = e.detail.message;
      const uuid = message.id || localStorage.getItem("peerid");
      localStorage.setItem("peerid", uuid);
      this.selfPeer = {
        id: uuid,
        name: {
          deviceName: message.deviceName,
          displayName: message.displayName,
        },
        rtcSupported: true,
      };
      const even = (element) => element.id === uuid;
      const isInlist = this.peersArray.some(even);
      if (!isInlist) {
        this.peersArray.push(this.selfPeer);
      }
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
      this.peersArray = this.peersArray.filter((peer) => {
        return peer.id !== e.detail;
      });
    },
    // handleResize
    resize() {
      const gap = 120;
      const cWidth = document.querySelector(".action-area").clientWidth - gap;
      const cHeight =
        document.querySelector(".action-area").clientHeight -
        gap / 2 -
        this.bottomGap;

      if (cWidth > cHeight * 2) {
        this.contentsWidth = cHeight * 2;
        this.contentsHeight = cHeight + this.bottomGap;
      } else {
        this.contentsWidth = cWidth;
        this.contentsHeight = cWidth / 2 + this.bottomGap;
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
        y: this.contentsHeight - this.bottomGap,
      };
    },
    renderSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      if (bytes === 0) return "0 Bytes";
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
      if (i === 0) return `${bytes} ${sizes[i]}`;
      return `${parseFloat((bytes / 1024 ** i).toFixed(2))} ${sizes[i]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.action-area {
  overflow: hidden;

  .is-full-width {
    width: 100%;
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

  &.tablet,
  &.mobile {
    display: flex;
    align-items: center;

    .contents {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      width: 100%;
    }
  }

  .list-complete-item {
    transition: opacity 0.6s;
  }

  .list-complete-enter,
  .list-complete-leave-to {
    opacity: 0;
  }
}
</style>
