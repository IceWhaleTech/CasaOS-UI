<template>
	<div id="drop-page" class="content is-flex is-flex-direction-column is-flex-grow-1">
		<!-- Header Start -->
		<header class="modal-card-head is-flex-shrink-0">
			<!-- SideBar Button Start -->
			<sidebar-menu-button></sidebar-menu-button>
			<!-- SideBar Button End -->
			<div id="bread-container" class="is-flex-grow-1 is-flex breadcrumb-container">
				<h3 class="title is-header mb-0">{{ $t("FilesDrop") }}</h3>
			</div>
			<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
		</header>
		<!-- Header End -->
		<!-- Contents Start -->
		<div :class="areaClass" :style="cssVariables" class="action-area is-flex-grow-1 is-relative">
			<div class="contents">
				<!-- Cricle BG Start -->
				<drop-bg v-if="isDesktop" />
				<!-- Circle Bg End -->
				<transition-group class="contents" name="list-complete" tag="div">
					<drop-item v-for="(item, index) in peersArray" :key="item.id" :center="centerPos"
						:customClass="areaClass" :device="item" :index="initIndexArray[index]" :isFloat="isDesktop"
						:radius="bigRadius" :showIndex="initIndexArray[index]" class="list-complete-item" @showed="
							isFirstIn = false;
						showAddButton = true;
						" />
				</transition-group>
				<drop-add-button v-if="showAddButton && peersArray.length == 1 && isDesktop" :center="centerPos"
					:index="peersArray.length" :isFloat="isDesktop" :radius="bigRadius"
					:showIndex="initIndexArray[peersArray.length]" />
			</div>
			<!-- Bottom Center Icons Start -->
			<drop-center-icon v-if="!isMobile" />
			<!-- Bottom Center Icons End -->

			<drop-add-button v-if="isDesktop ? showAddButton && peersArray.length > 1 : true" :center="centerPos"
				:index="isDesktop ? peersArray.length : peersArray.length + 1" :isFloat="false" :radius="bigRadius"
				:showIndex="initIndexArray[peersArray.length]" />
		</div>
		<!-- Contents End -->
		<drop-context-menu />
	</div>
</template>

<script>
import { PeersManager, ServerConnection } from "./Network.js";
import { saveAs } from "file-saver";
import VueBreakpointMixin from "vue-breakpoint-mixin";
// import { v4 as uuidv4 } from "uuid";

export default {
	name: "drop-page",
	mixins: [VueBreakpointMixin],
	components: {
		DropItem: () => import("./DropItem.vue"),
		DropContextMenu: () => import("./DropContextMenu.vue"),
		DropCenterIcon: () => import("./DropCenterIcon.vue"),
		DropBg: () => import("./DropBg.vue"),
		DropAddButton: () => import("./DropAddButton.vue"),
		SidebarMenuButton: () => import("../components/SidebarMenuButton.vue"),
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
			peersArray: [],
			selfId: "",
			filesQueue: [],
			busy: false,
			showAddButton: false,
			webscoketServer: null,
			peersManager: null,
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

		areaClass() {
			if (this.isDesktop) {
				return "desktop";
			} else if (this.isTablet) {
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
		this.$EventBus.$emit("pagehide");
		window.removeEventListener("resize", this.resize);
		document.ondragover = null; // 拖拽进入

		this.peersManager.destory();
		this.peersManager = null;
		this.webscoketServer = null;
		this.peersArray = [];
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		this.resize();
		document.ondragover = function (e) {
			e.preventDefault();
		}; // 拖拽进入

		const delay = this.isMobile ? 0 : 1000;

		this.$nextTick(() => {
			setTimeout(() => {
				this.initServer();
			}, delay);
		});
	},
	methods: {
		// Init Ws Server
		initServer() {
			const access_token = localStorage.getItem("access_token");
			const url = `${this.$wsProtocol}//${this.$baseURL}/v1/file/ws?token=${access_token}&peer=${this.selfId}`;
			//   const url = `${this.$wsProtocol}//192.168.2.243/v1/file/ws?token=${access_token}&peer=${this.selfId}`;
			//   const url = `ws://localhost:3000/server/webrtc?peer=${this.selfId}`;
			this.webscoketServer = new ServerConnection(url, this.$EventBus);
			// const peers = new PeersManager(server);
			this.peersManager = new PeersManager(this.webscoketServer, this.$EventBus);
			// 初始化列表
			this.$EventBus.$on("peers", this.handlePeers);
			// 获取我是我
			this.$EventBus.$on("display-name", this.handleSelfJoined);
			// 节点加入
			this.$EventBus.$on("peer-joined", this.handlePeerJoined);
			// 节点离开
			this.$EventBus.$on("peer-left", this.handlePeerleft);

			// 通知接收者一个文件接收完毕
			this.$EventBus.$on("file-received", this.handleFileReceived);

			// 通知发送者一个文件发送完毕
			this.$EventBus.$on("notify-user", this.handleNotifyUser);
		},

		// Handle file received (from other peer)
		handleFileReceived(e) {
			this.nextFile(e);
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

		getDeviceNameFromPeerList(deviceId) {
			let deviceName = "";
			this.peersArray.forEach((peer) => {
				if (peer.id === deviceId) {
					deviceName = peer.name.displayName;
				}
			});
			return deviceName;
		},

		displayFile(file) {
			this.$buefy.snackbar.open({
				indefinite: true,
				message: this.$t("Save {name} {size} from {device}.", {
					name: file.file.name,
					size: this.renderSize(file.file.size),
					device: this.getDeviceNameFromPeerList(file.from),
				}),
				type: "is-file",
				cancelText: this.$t("Ignore"),
				actionText: this.$t("Save"),
				position: "is-bottom",
				container: "#drop-page",
				onAction: () => {
					saveAs(file.file.blob, file.file.name);
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
			const type = e.indexOf("lost") > -1 ? "is-danger" : "is-success";
			this.$buefy.toast.open({
				duration: 2000,
				message: this.$t(e),
				type: type,
				container: "#drop-page",
			});
		},

		// handelPeers
		handlePeers(peers) {
			this.peersArray = peers;
			// Only listen to peer join event once
			this.$EventBus.$off("peers");

		},

		// Handle Self Joined
		handleSelfJoined(e) {
			const message = e.message;
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
			const peer = e;
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
				return peer.id !== e;
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
		guid() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
				(
					c ^
					(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
				).toString(16)
			);
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
