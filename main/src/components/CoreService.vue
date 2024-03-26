<template>
	<swiper ref="mySwiper" :options="swiperOptions">
		<swiper-slide v-for="(noticeCard, key) in noticesData" :key="key" :class="{ _singleWidth: showFullCard }">
			<noticeBlock :noticeData="noticeCard" :noticeType="key" @deleteNotice="refreshNotice"></noticeBlock>
		</swiper-slide>
		<swiper-slide v-if="recommendShow">
			<sync-block></sync-block>
		</swiper-slide>
		<swiper-slide v-if="recommendShow">
			<smart-block></smart-block>
		</swiper-slide>
		<div v-show="recommendShow || noticeLength !== 0" slot="pagination" class="swiper-pagination">
		</div>
		<img slot="button-prev" :src="require('@/assets/img/widgets/swiper-left.svg')" alt="prev"
			class="swiper-button-prev" />
		<img slot="button-next" :src="require('@/assets/img/widgets/swiper-right.svg')" alt="next"
			class="swiper-button-next" />
	</swiper>
</template>

<script>
import noticeBlock from "@/components/noticBlock/noticeBlock";
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { mixin } from '@/mixins/mixin';
import sortBy from 'lodash/sortBy';
import SyncBlock from "@/components/syncthing/SyncBlock.vue";
import SmartBlock from "@/components/smartHome/SmartBlock.vue";
import events from "@/events/events";
import Business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import DiskLearnMore from "@/components/Storage/DiskLearnMore.vue";
import last from "lodash/last";
import { ice_i18n } from "@/mixins/base/common-i18n";


export default {
	components: { SmartBlock, SyncBlock, noticeBlock, Swiper, SwiperSlide },
	name: "core-service",
	mixins: [mixin, Business_ShowNewAppTag],
	computed: {
		recommendShow() {
			return this.$store.state.recommendSwitch
		},
		noticeLength() {
			return Object.keys(this.noticesData).length
		},
		// full width to show with single notice card
		showFullCard() {
			return this.noticeLength === 1 && !this.recommendShow
		}
	},
	watch: {
		noticeLength: {
			handler(val, oldValue) {
				if (val === oldValue) {
					return
				}
				if (val === 0) {
					this.$messageBus('youshouldknow_show', 'false');
				} else if (oldValue === 0) {
					this.$messageBus('youshouldknow_show', 'true');
				}
				// skip new notice card
				this.$nextTick(() => {
					this.$refs['mySwiper'].$swiper.slideTo(val - 1, 1000, true)
				})
			},
		}
	},
	data() {
		return {
			notice: "local-storage",
			isLoading: false,
			swiperOptions: {
				watchOverflow: true,
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
					clickable: true,
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
					disabledClass: 'swiper-button-disabled',
				},
				observer: true,
				on: {
					slideChangeTransitionStart: () => {
						this.$messageBus('youshouldknow_slide');
					},
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
					  title: 'Found a new drive',
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
			},
			dockerProgress: {},
			totalPercentage: 0,
		}
	},
	created() {
		this.getMessageFromLetter();
		this.initUIEventBus();
	},
	mounted() {
		this.WSHub = this.initMessageBus();
	},
	inject: ['homeShowFiles'],
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
				this.patchTransform(eventJson);
			}
			return socket
		},
		initUIEventBus() {
			this.$EventBus.$on('casaUI:openInFiles', (path) => {
				this.homeShowFiles(path);
			});

			this.$EventBus.$on('casaUI:openDiskLearnMore', () => {
				this.$buefy.modal.open({
					parent: this,
					component: DiskLearnMore,
					hasModalCard: true,
					customClass: 'storage-modal',
					trapFocus: true,
					canCancel: [],
					scroll: "keep",
					animation: "zoom-in",
				})
			});

			// this.$EventBus.$on('casaUI:openStorageManager', () => {
			//  this.showStorageSettingsModal();
			// });
		},
		destroyUIEventBus() {
			this.$EventBus.$off('casaUI:openInFiles');
			this.$EventBus.$off('casaUI:openDiskLearnMore');
			// this.$EventBus.$off('casaUI:openStorageManager');
		},
		triggerUIEventBus(event) {
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
		getMessageFromLetter() {
			this.$api.users.getLetter().then(res => {
				let sortedData = sortBy(res.data, ['timestamp']);
				sortedData.forEach(item => {
					let json = {
						...item,
						properties: JSON.parse(item.properties),
					}
					if (json.properties['tran'] !== 'usb') {
						this.patchTransform(json)
					}
				})
			})
		},
		refreshNotice(data, type) {
			// this.noticesData[type] = data
			this.$delete(this.noticesData, type)
		},
		patchTransform(eventJson) {
			// only show which is disk from local-storage
			let notShow = eventJson.name.split(':')[1] !== 'disk'
			if (notShow) {
				// delete letter which is partition!
				this.$api.users.delLetter(eventJson.uuid)
				return
			}
			// Business : whether formatting is required
			let eventType
			if (eventJson.properties['children:num'] > 0) {
				eventType = eventJson.properties['tran'];
			} else {
				eventType = '';
			}

			let operateType = eventJson.name.split(':')[2]
			let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];
			switch (eventType) {
				case 'usb':
					this.transformUSB(eventJson, operateType, entityUUID)
					break;
				case 'newDisk':
					this.transformNewDisk(eventJson, operateType, entityUUID)
					break;
				default:
					this.transformLocalStorage(eventJson, operateType, entityUUID)
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
						title: 'Found a new drive',
						icon: '',
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
				let percent = eventJson.properties['avail'] ? `${this.renderSize(eventJson.properties['size'] - eventJson.properties['avail'])} / ${this.renderSize(eventJson.properties['size'])}` : 'NaN';
				this.$set(this.noticesData[eventType]['content'], entityUUID, {
					title: eventJson.properties['model'] || 'Found a new drive',
					icon: '/storage/USB.png',
					color: 'is-primary',
					path: eventJson.properties['local-storage:path'],
					uuid: entityUUID,
					value: percent,
					messageUUID: eventJson.uuid
				})
				this.noticesData[eventType]['operate']['path'] = eventJson.properties['mount_point']
			} else if (operateType === 'removed') {
				// Delete according to the uuid with this.noticesData[eventType]['content'] from BackEnd-DB
				if (this.noticesData[eventType] && this.noticesData[eventType]['content'][entityUUID]) {
					this.$api.users.delLetter(this.noticesData[eventType]['content'][entityUUID].messageUUID)
					this.$delete(this.noticesData[eventType]['content'], entityUUID)
				}
				this.$api.users.delLetter(eventJson.uuid)
				if (Object.keys(this.noticesData[eventType]['content']).length === 0) {
					this.$delete(this.noticesData, eventType)
				}
			}
		},
		transformLocalStorage(eventJson, /*operateType*/) {
			// let eventType = eventJson.properties['tran']
			let operateType = eventJson.name.split(':')[2]
			let driveType = eventJson.name.split(':')[1]
			let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];
			if (!this.noticesData[driveType]) {
				this.$set(this.noticesData, driveType, {
					prelude: {
						title: 'Found a new drive',
						icon: '',
					},
					content: {},
					contentType: 'list',
					operate: {
						type: 'casaUI:eventBus',
						title: 'Storage Manager',
						event: 'casaUI:openStorageManager',
						path: '/Storage',
						icon: 'mdi-arrow-right',
					},
				})
			}
			if (operateType === 'added') {
				let availValue = eventJson.properties['avail'] > 0 ? this.renderSize(eventJson.properties['size'] - eventJson.properties['avail']) : 'NaN';
				let percent = `${availValue} / ${this.renderSize(eventJson.properties['size'])}`;
				// let percent = eventType.toUpperCase();
				this.$set(this.noticesData[driveType]['content'], entityUUID, {
					title: eventJson.properties['model'] || 'Found a new drive',
					icon: '/storage/storage.png',
					color: 'is-primary',
					path: eventJson.properties['local-storage:path'],
					uuid: entityUUID,
					value: percent,
					messageUUID: eventJson.uuid
				})
				this.noticesData[driveType]['operate']['path'] = eventJson.properties['mount_point']
			} else if (operateType === 'removed') {
				// Delete according to the uuid with this.noticesData[driveType]['content'] from BackEnd-DB
				if (this.noticesData[driveType] && this.noticesData[driveType]['content'][entityUUID]) {
					this.$api.users.delLetter(this.noticesData[driveType]['content'][entityUUID].messageUUID)
					this.$delete(this.noticesData[driveType]['content'], entityUUID)
				}
				this.$api.users.delLetter(eventJson.uuid)
				if (Object.keys(this.noticesData[driveType]['content']).length === 0) {
					this.$delete(this.noticesData, driveType)
				}
			}
		},
		transformNewDisk(eventJson, operateType) {
			let eventType = eventJson.properties['tran']
			let entityUUID = eventJson.properties['serial'] || eventJson.properties['local-storage:uuid'];
			if (!this.noticesData[eventType]) {
				this.$set(this.noticesData, eventType, {
					prelude: {
						title: 'Need to add a new disk',
						icon: '',
					},
					content: {},
					contentType: 'list',
					operate: {
						type: 'casaUI:eventBus',
						title: 'Learn more',
						event: 'casaUI:openDiskLearnMore',
						path: '/Storage',
						icon: 'mdi-arrow-right',
					},
				})
			}
			if (operateType === 'added') {
				let percent = eventJson.properties['avail'] ? `${this.renderSize(eventJson.properties['used'])} / ${this.renderSize(eventJson.properties['size'])}` : 'NaN';
				this.$set(this.noticesData[eventType]['content'], entityUUID, {
					title: eventJson.properties['model'] || 'Found a new drive',
					icon: '/storage/disk.png',
					color: 'is-primary',
					path: eventJson.properties['local-storage:path'],
					uuid: entityUUID,
					value: percent,
					messageUUID: eventJson.uuid
				})
				this.noticesData[eventType]['operate']['path'] = eventJson.properties['mount_point']
			} else if (operateType === 'removed') {
				// Delete according to the uuid with this.noticesData[eventType]['content'] from BackEnd-DB
				if (this.noticesData[eventType] && this.noticesData[eventType]['content'][entityUUID]) {
					this.$api.users.delLetter(this.noticesData[eventType]['content'][entityUUID].messageUUID)
					this.$delete(this.noticesData[eventType]['content'], entityUUID)
				}

				this.$api.users.delLetter(eventJson.uuid)
				if (Object.keys(this.noticesData[eventType]['content']).length === 0) {
					this.$delete(this.noticesData, eventType)
				}
			}
		},
		addNotice(Json, rootName) {
			this.$set(this.noticesData, rootName, {
				prelude: {
					title: Json.title,
					icon: Json.icon,
				},
				content: Json.content,
				contentType: Json.contentType,
				operate: Json.operate,
			})
		},
		removeNotice(rootName) {
			this.$delete(this.noticesData, rootName)
		},

		transformAppInstallationProgress(res) {
			if (res.finished) {
				if (this.noticesData[res.name]) {
					this.removeNotice(res.name);
				}
				this.$EventBus.$emit(events.RELOAD_APP_LIST);
				if (res.isNewTag) {
					this.addIdToSessionStorage(res.name);
				}
				return;
			}

			if (this.noticesData[res.name]) {
				if (res.message !== "") {
					try {
						let progress = Number(res.message);
						let currentInstallAppText = '';
						if (progress?.toString() === '0') {
							currentInstallAppText = 'Starting installation';
						} else if (progress?.toString() === '100') {
							currentInstallAppText = 'Installation completed';
						} else {
							currentInstallAppText = 'Installing ' + progress + '%';
						}
						this.$set(this.noticesData[res.name], 'content', {
							text: currentInstallAppText,
							value: progress
						});
					} catch (e) {
						console.log(e);
					}
				}
				return;
			}

			const data = {
				title: this.$t('Installing {title}', { title: res.title }),
				icon: res.icon,
				content: {
					text: res?.message,
					value: 0
				},
				contentType: 'progress',
				operate: false
			};
			this.addNotice(data, res.name);
		},

	},
	sockets: {
		"app:apply-changes-begin"(res) { 
			const title = ice_i18n(JSON.parse(res.Properties["app:title"]));
			this.transformAppInstallationProgress({
				finished: false,
				name: res.Properties["app:name"],
				title,
				id: res.Properties["app:name"],
				success: true,
				message: "Starting pulling image info",
				icon: res.Properties["app:icon"]
			});
		},
		"app:apply-changes-end"(res) {
			this.$buefy.toast.open({
				message: "The setting of " + res.Properties["app:name"] + " is complete",
				duration: 5000,
				type: "is-success"
			})
			this.transformAppInstallationProgress({
				finished: true,
				// First name. Second app:name.The name from CheckThenUpdate.The app:name from install.
				name: res.Properties["app:name"],
				message: res.Properties["message"],
				icon: res.Properties["app:icon"]
			});
		},
		"app:apply-changes-error"(res) {
			this.$buefy.toast.open({
				message: res.Properties.message,
				duration: 5000,
				type: "is-danger"
			})
			this.transformAppInstallationProgress({
				// Display error messages
				finished: false,
				// First name. Second app:name.The name from CheckThenUpdate.The app:name from install.
				name: res.Properties["app:name"] + "error",
				success: false,
				title: res.Properties["app:name"] + "Error Info",
				message: res.Properties["message"],
				icon: res.Properties["app:icon"]
			});
		},
		"app:install-begin"(res) {
			const title = ice_i18n(JSON.parse(res.Properties["app:title"]));
			this.transformAppInstallationProgress({
				finished: false,
				name: res.Properties["app:name"],
				title,
				id: res.Properties["app:name"],
				success: true,
				type: "install-begin",
				message: "Starting installation",
				icon: res.Properties["app:icon"]
			});
		},
		"app:install-end"(res) {
			this.transformAppInstallationProgress({
				finished: true,
				// First name. Second app:name.The name from CheckThenUpdate.The app:name from install.
				name: res.Properties["app:name"],
				id: res.Properties["app:name"],
				icon: res.Properties["app:icon"],
				isNewTag: true
			});
		},
		"app:install-error"(res) {
			this.transformAppInstallationProgress({
				// Display error messages
				finished: false,
				// First name. Second app:name.The name from CheckThenUpdate.The app:name from install.
				name: res.Properties["app:name"] + "error",
				success: false,
				title: res.Properties["app:name"] + " Error Info",
				message: res.Properties["message"],
				icon: res.Properties["app:icon"],
				isNewTag: true
			});
		},

		"app:update-begin"(res) {
			this.transformAppInstallationProgress({
				finished: false,
				name: res.Properties["name"],
				id: res.Properties["cid"],
				icon: ''
			});
		},
		"app:update-end"(res) {
			this.transformAppInstallationProgress({
				finished: true,
				name: res.Properties["name"],
				id: res.Properties["cid"],
				icon: '',
				isNewTag: res.Properties["docker:image:updated"] === "true"
			});
		},
		"app:install-progress"(res) {
			const title = ice_i18n(JSON.parse(res.Properties["app:title"]));
			this.transformAppInstallationProgress({
				finished: false,
				name: res.Properties["app:name"],
				title,
				id: res.Properties["app:name"],
				success: true,
				type: "pull",
				message: res.Properties["app:progress"],
				icon: res.Properties["app:icon"]
			});
		},
	},
	beforeDestroy() {
		for (let key in this.WSHub) {
			this.WSHub[key].close()
		}
		this.destroyUIEventBus();
	}
}
</script>

<style lang="scss" scoped>
// full width to show with single notice
._singleWidth {
	width: 100% !important;
}

.swiper-container {

	&:hover>.swiper-button-next:not(.swiper-button-disabled),
	&:hover>.swiper-button-prev:not(.swiper-button-disabled) {
		opacity: 1;
	}

	&>.swiper-button-disabled {
		opacity: 0;
	}
}

.swiper-button-prev,
.swiper-button-next {
	width: 2rem;
	height: 2rem;
	margin: 0 0.5rem;
	top: calc(50% - 2rem);
	z-index: 1;
	opacity: 0;
}

.swiper-pagination {
	position: relative;

	::v-deep span {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		width: 2rem;
		height: 0.25rem;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 0.125rem;
		display: inline-block;
		position: relative;

		&:after {
			display: block;
			width: 2rem;
			height: 2rem;
			position: absolute;
			content: '';
			background: rgba(255, 255, 255, 0);
			border-radius: 0.125rem;
			top: -0.875rem;
			left: 0;
		}
	}

	::v-deep .swiper-pagination-bullet-active {
		background: #FFFFFF;
	}
}
</style>
