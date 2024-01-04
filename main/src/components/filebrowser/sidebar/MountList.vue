<template>
	<div>
		<div class="ul">
			<!-- merge fs storage item -->
			<div class="li" v-if="hasMergerFunction">
				<div :class="{ active: isActived }" class="is-flex list-item new-list-item"
					@click="filePanel.getFileList('/DATA')">
					<div class="cover mr-2 is-flex-shrink-0 is-relative">
						<div class="icon" @click="warning" @mouseleave="hover = false" @mouseover="hover = true">
							<i :class="{
								'casa-storage-merger':
									(!dorpdown && !hover) || mergeStorageList.length === 0,
								'casa-expand':
									hover && !dorpdown && mergeStorageList.length !== 0,
								'casa-expand-down': dorpdown && mergeStorageList.length !== 0,
							}" class="casa casa-28px">
							</i>
						</div>
						<div v-show="!dorpdown && !hover && mergeStorageList.length !== 0" class="hint">
							{{ mergeStorageList.length }}
						</div>
					</div>
					<div class="is-flex-grow-1 one-line">CasaOS HD</div>
					<div v-if="testMergeMiss > 0" class="is-flex is-align-items-center">
						<b-icon class="warn" custom-size="casa-16px" icon="danger-outline" pack="casa"></b-icon>
					</div>
				</div>
				<ul v-show="dorpdown && mergeStorageList.length > 0">
					<tree-list-item v-for="item in mergeStorageList" :key="item.path" :isActive="isActive"
						:item="item"></tree-list-item>
				</ul>
			</div>

			<!-- Local Storage List Start -->
			<tree-list-item v-for="item in localStorageList" :key="item.path" :isActive="isActive"
				:item="item"></tree-list-item>
			<!-- Local Storage List End -->

			<!-- Network Storage List Start -->
			<tree-list-item v-for="item in networkStorageList" :key="item.path" :isActive="isActive" :item="item"
				iconName="eject" @rightIconClick="umountNetwork"></tree-list-item>
			<!-- Network Storage List End -->

			<!-- USB List Start -->
			<tree-list-item v-for="item in usbStorageList" :key="item.path" :isActive="isActive" :item="item"
				iconName="eject" @rightIconClick="umountUsb"></tree-list-item>
			<!-- USB List End -->

			<!-- Cloud List Start -->
			<tree-list-item v-for="item in cloudStorageList" :key="item.path" :iconType="item.icon_type"
				:isActive="isActive" :item="item" iconName="eject" @rightIconClick="umountCloud"></tree-list-item>
			<!-- Cloud List End -->
		</div>
		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
	</div>
</template>

<script>
import { mixin } from "@/mixins/mixin";
import events from "@/events/events";
import TreeListItem from "./TreeListItem.vue";

export default {
	components: { TreeListItem },
	mixins: [mixin],
	inject: ["filePanel"],

	props: {
		path: {
			type: String,
			default: "",
		},
		autoLoad: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		hasMergerFunction: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isLoading: false,
			usbStorageList: [],
			localStorageList: [],
			networkStorageList: [],
			cloudStorageList: [],
			dorpdown: false,
			mergeStorageList: [],
			testMergeMiss: 0,
			hover: false,
		};
	},
	computed: {
		isActived() {
			return "/DATA" === this.$store.state.currentPath;
		},
	},
	created() {
		this.getStorageList();
	},

	async mounted() {
		this.$EventBus.$on(events.RELOAD_MOUNT_LIST, this.getStorageList);
	},
	methods: {
		getStorageList() {
			this.getLocalStorage();
			// this.getUsbStorage()
			this.getNetworkStorage();
			this.getCloudStorage();
		},
		// Local Storage (include Mergerfs)
		async getLocalStorage() {
			let mergeRes;
			try {
				mergeRes = await this.$api.local_storage
					.getMergerfsInfo()
					.then((res) => res.data.data[0].source_volume_uuids);
			} catch (error) {
				mergeRes = [];
				console.log(error);
			}

			// Local Storage
			try {
				const storageRes = await this.$api.storage.list();
				const storageArray = [];
				const usbStorageArray = [];
				storageRes.data.data.forEach((item) => {
					item.children.forEach((part) => {
						if (!mergeRes.find((mp) => mp === part.uuid))
							if (item.type === "usb") {
								usbStorageArray.push(part);
							} else {
								storageArray.push(part);
							}
					});
				});
				this.localStorageList = storageArray.map((storage) => {
					return {
						name: storage.label,
						icon: "storage-other",
						pack: "casa",
						path: storage.mount_point,
						visible: true,
						selected: true,
						extensions: null,
					};
				});
				this.usbStorageList = usbStorageArray.map((storage) => {
					return {
						name: storage.label,
						icon: "storage-USB",
						pack: "casa",
						path: storage.mount_point,
						visible: true,
						selected: true,
						extensions: null,
					};
				});
			} catch (error) {
				this.isLoading = false;
				console.log(error.reponse.message);
			}

			// Merger Storage
			try {
				this.mergeStorageList = [];
				const storageRes = await this.$api.storage.list();
				let storageList = [];
				storageRes.data.data.forEach((item) => {
					item.children.forEach((part) => {
						part.disk = item.path;
						part.diskName = item.disk_name;
						storageList.push(part);
					});
				});
				mergeRes.forEach((item) => {
					let storage = storageList.find((storage) => {
						return storage.uuid === item;
					});
					if (storage) {
						this.mergeStorageList.push({
							uuid: storage.uuid,
							name: storage.label,
							icon: "",
							pack: "casa",
							path: storage.mount_point,
							visible: true,
							selected: true,
							extensions: null,
						});
					} else {
						this.testMergeMiss += 1;
						this.mergeStorageList.push({
							uuid: item,
							name: "undefined",
							icon: "danger",
							pack: "casa",
							path: "",
							visible: true,
							selected: true,
							extensions: null,
						});
					}
				});
			} catch (error) {
				this.isLoading = false;
				console.log(error.reponse.message);
			}
		},
		// Network Storage
		async getNetworkStorage() {
			try {
				const networkRes = await this.$api.samba.getConnections();
				this.networkStorageList = networkRes.data.data.map((storage) => {
					return {
						id: storage.id,
						name: storage.host,
						icon: "storage-network",
						pack: "casa",
						path: storage.mount_point,
						visible: true,
						selected: true,
						extensions: null,
					};
				});
			} catch (error) {
				this.isLoading = false;
				console.log(error.reponse.message);
			}
		},
		// USB Storage
		async getUsbStorage() {
			try {
				const usbListRes = await this.$api.disks.getUsbs();
				const usbStorageArray = [];
				usbListRes.data.data.forEach((item) => {
					item.children.forEach((part) => {
						usbStorageArray.push(part);
					});
				});
				this.usbStorageList = usbStorageArray.map((storage) => {
					return {
						name: storage.name,
						icon: "storage-USB",
						pack: "casa",
						path: storage.mount_point,
						visible: true,
						selected: true,
						extensions: null,
					};
				});
			} catch (error) {
				this.isLoading = false;
				console.log(error.reponse.message);
			}
		},
		// Cloud Storage
		async getCloudStorage() {
			try {
				const cloudRes = await this.$api.cloud.list();
				this.cloudStorageList = cloudRes.data.data.map((storage) => {
					return {
						id: storage.fs,
						name: storage.name,
						icon: storage.icon,
						icon_type: "svg",
						pack: "casa",
						path: storage.mount_point,
						visible: true,
						selected: true,
						extensions: null,
					};
				});
			} catch (error) {
				console.log(error.reponse.message);
			}
		},

		// umount cloud storage
		umountCloud(item) {
			this.$api.cloud
				.umount({ mount_point: item.path })
				.then(() => {
					this.getStorageList();
					this.goToDataFolder(item);
					this.$buefy.toast.open({
						message: this.$t("Eject Success"),
						type: "is-success",
					});
				})
				.catch(() => {
					this.$buefy.toast.open({
						message: this.$t("Eject Failed"),
						type: "is-danger",
					});
				});
		},

		// umount usb storage
		umountUsb(item) {
			this.$api.disks
				.umountUsb({ mount_point: item.path })
				.then(() => {
					this.getStorageList();
					this.goToDataFolder(item);
					this.$buefy.toast.open({
						message: this.$t("Eject Success"),
						type: "is-success",
					});
				})
				.catch(() => {
					this.$buefy.toast.open({
						message: this.$t("Eject Failed"),
						type: "is-danger",
					});
				});
		},

		// umount network storage
		umountNetwork(item) {
			this.$api.samba
				.deleteConnection(item.id)
				.then(() => {
					this.getStorageList();
					this.goToDataFolder(item);
					this.$buefy.toast.open({
						message: this.$t("Eject Success"),
						type: "is-success",
					});
				})
				.catch(() => {
					this.$buefy.toast.open({
						message: this.$t("Eject Failed"),
						type: "is-danger",
					});
				});
		},

		// go to DATA folder
		goToDataFolder(item) {
			if (this.$store.state.currentPath.startsWith(item.path)) {
				this.filePanel.getFileList("/DATA");
			}
		},

		async warning() {
			if (this.dorpdown) {
				this.dorpdown = false;
				return;
			}
			let notFirst = await this.$api.users
				.getCustomStorage("notFirstOpenMergerStorage")
				.then((res) => res.data.data);
			if (notFirst) {
				this.dorpdown = !this.dorpdown;
				return;
			}
			this.$buefy.dialog.confirm({
				title: this.$t("Data Protected"),
				message: this.$t(
					"Changing internal files may break the structure of the CasaOS HD"
				),
				confirmText: this.$t("Continue"),
				cancelText: this.$t("Cancel"),
				iconPack: "casa",
				icon: "danger",
				type: "is-danger",
				hasIcon: true,
				onConfirm: () => {
					this.dorpdown = !this.dorpdown;
					this.$api.users.setCustomStorage("notFirstOpenMergerStorage", true);
				},
			});
		},
	},
	sockets: {
		"local-storage:disk:added"() {
			setTimeout(() => {
				// this.getUsbStorage()
				this.getLocalStorage();
			}, 500);
		},
		"local-storage:disk:removed"() {
			setTimeout(() => {
				// this.getUsbStorage()
				this.getLocalStorage();
			}, 500);
		},
		storage_status() {
			setTimeout(() => {
				this.$api.storage
					.list()
					.then((res) => {
						const storageArray = [];
						res.data.data.forEach((item) => {
							item.children.forEach((part) => {
								storageArray.push(part);
							});
						});
						this.localStorageList = storageArray.map((storage) => {
							return {
								name: storage.label,
								icon: "storage-other",
								pack: "casa",
								path: storage.mount_point,
								visible: true,
								selected: true,
								extensions: null,
							};
						});
					})
					.catch((error) => {
						console.log(error.reponse.message);
					});
			}, 500);
		},
		"casaos:file:recover"(data) {
			data = data.Properties;
			let toastType;
			const reg = /^["|'](.*)["|']$/g;
			const status = data.status.replace(reg, "$1");
			const driver = data.driver.replace(reg, "$1");
			switch (status) {
				case "warn":
					toastType = "is-warning";
					this.getCloudStorage();
					break;
				case "fail":
					toastType = "is-danger";
					break;
				default:
					toastType = "is-success";
					if (driver === "Dropbox") {
						this.$messageBus("files_addlocation_dropbox");
					} else if (driver === "Google Drive") {
						this.$messageBus("files_addlocation_googledrive");
					} else if (driver === "OneDrive") {
						this.$messageBus("files_addlocation_onedrive");
					}
					this.getCloudStorage();
					break;
			}
			this.$buefy.toast.open({
				message: this.$t(data.message.replace(reg, "$1")),
				duration: 5000,
				type: toastType,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.overlay-layer {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;

	.icon {
		position: absolute;
		right: -0.15rem;
		bottom: -0.1rem;
	}
}

.warn {
	color: hsla(348, 86%, 61%, 1);
}

.hint {
	position: absolute;
	color: white;
	font-size: 10px;
	background-color: black;
	width: 15px;
	height: 15px;
	line-height: 13px;
	text-align: center;
	-webkit-border-radius: 24px;
	border-radius: 24px;
	border: 1px solid #ffffff;
	top: -0.5rem;
	left: 0.9rem;
}
</style>
