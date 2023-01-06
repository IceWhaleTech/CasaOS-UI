<!--
   *
   * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
   * @LastEditTime: 2022/12/1 下午1:51
   * @FilePath: /CasaOS-UI/src/components/CoreService.vue
   * @Description:
   *
   * Copyright (c) 2022 by IceWhale, All Rights Reserved.
   *
  -->

<template>
	<swiper ref="mySwiper" :options="swiperOptions">
		<swiper-slide v-for="(noticeCard,key) in noticesData" :key="key" :class="{_singleWidth:showFullCard}">
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
		     class="swiper-button-prev"/>
		<img slot="button-next" :src="require('@/assets/img/widgets/swiper-right.svg')" alt="next"
		     class="swiper-button-next"/>
	</swiper>
</template>

<script>
import noticeBlock from "@/components/noticBlock/noticeBlock";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import {mixin} from '@/mixins/mixin';
import _ from 'lodash';
import SyncBlock from "@/components/syncthing/SyncBlock.vue";
import SmartBlock from "@/components/smartHome/SmartBlock.vue";
import first from "lodash/first";
import events from "@/events/events";
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import StorageManagerPanel from "@/components/Storage/StorageManagerPanel.vue";
import DiskLearnMore from "@/components/Storage/DiskLearnMore.vue";

export default {
	components: {SmartBlock, SyncBlock, noticeBlock, Swiper, SwiperSlide},
	name: "core-service",
	mixins: [mixin, business_ShowNewAppTag],
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
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
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
			}
		}
	},
	created() {
		this.getMessageFromLetter();
		this.initUIEventBus();
	},
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
				this.patchTransform(eventJson);
			}
			return socket
		},
		initUIEventBus() {
			this.$EventBus.$on('casaUI:openInFiles', (path) => {
				this.homeShowFiles(path);
			});
			this.$EventBus.$on('casaUI:openInStorageManager', () => {
				this.$buefy.modal.open({
					parent: this,
					component: StorageManagerPanel,
					hasModalCard: true,
					customClass: 'storage-modal',
					trapFocus: true,
					canCancel: [],
					scroll: "keep",
					animation: "zoom-in",
				})
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
				let sortedData = _.sortBy(res.data, ['timestamp']);
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
			} else if (false) {
				// TODO: notice user to add disk.
				eventType = 'newDisk';
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
			let eventType = eventJson.properties['tran']
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
						title: 'Set MainStorage',
						event: 'casaUI:openInStorageManager',
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
			if (this.noticesData[res.name]) {
				// update progress
				if (res.finished) {
					this.removeNotice(res.name)
					// business :: Tagging of new app / scrollIntoView
					this.addIdToLocalStorage(res.properties['app-management:app:id'])

				} else if (res.message !== "") {
					console.log(res.message);
					const messageArray = res.message.split(/[(\r\n)\r\n]+/);
					messageArray.forEach((item, index) => {
						if (!item) {
							messageArray.splice(index, 1);
						}
					})
					const noticeMessage = messageArray.join(' ');
					if (/Err/.test(noticeMessage)) {
						this.$buefy.toast.open({
							message: noticeMessage,
							type: 'is-danger',
							duration: 5000,
							position: 'is-top',
							queue: false,
						})
						console.error(noticeMessage);
						return;
					}
					const info = JSON.parse(noticeMessage)
					const id = (info.id != undefined) ? info.id : "";
					let progress = ""
					if (info.progressDetail != undefined) {
						let progressDetail = info.progressDetail
						if (!isNaN(progressDetail.current / progressDetail.total)) {
							progress = `[ ${String(Math.floor((progressDetail.current / progressDetail.total) * 100))}% ]`
						}
					}
					let status = info.status
					let currentInstallAppText = status + ":" + id + " " + progress
					this.$set(this.noticesData[res.name], 'content', currentInstallAppText)
				}
				return
			}
			// add new app install notice
			const data = {
				title: 'Installing app',
				icon: res.icon,
				content: res.message || "",
				// show progress
				contentType: 'progress',
				// show Cancel button
				operate: false,
			}
			this.addNotice(data, res.name)
			// this.$emit('updateState')
			this.$EventBus.$emit(events.RELOAD_APP_LIST)
		}
	},
	sockets: {
		'app_install': function (res) {
			this.transformAppInstallationProgress(res)
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
// full width to show with single notice
._singleWidth {
	width: 100% !important;
}

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
