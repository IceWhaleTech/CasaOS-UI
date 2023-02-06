<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/2/6 下午4:47
  * @FilePath: /CasaOS-UI/src/widgets/Disks.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  -->
<template>
	<div>
		<!-- Disk Info Start -->
		<div class="widget has-text-white disk is-relative">
			<div class="blur-background"></div>
			<div class="widget-content">
				<!-- Header Start -->
				<div class="widget-header is-flex">
					<div class="widget-title is-flex-grow-1">
						{{ $t('Storage') }}
					</div>
					<div class="widget-icon-button is-flex-shrink-0" @click="showDiskManagement">
						<b-icon icon="setting" pack="casa" size="is-20"></b-icon>
					</div>
				</div>
				<!-- Header End -->
				<div class="columns is-mobile is-multiline pt-2 ">
					<div class="column is-full pb-1">
						<div class="is-flex is-align-items-center">
							<div class="header-icon">
								<b-image :src="require('@/assets/img/storage/storage.svg')" class="is-68x68"></b-image>
							</div>
							<div class="ml-3 is-flex-grow-1 ">
								<h4
										class="title is-size-14px mb-2 mt-1 has-text-left has-text-white one-line is-align-items-center is-flex">
									<b-tag v-if="health" type="is-success">{{ $t('Healthy') }}</b-tag>
									<b-tag v-else type="is-danger">{{ $t('Damage') }}</b-tag>
								</h4>
								<p class="has-text-left is-size-14px mt-1">
									<span class="op65">{{ $t('Used') }}: </span>{{ renderSize(totalUsed) }}<br>
									<span class="op65">{{ $t('Total') }}: </span>{{ renderSize(totalSize) }}
								</p>
							</div>
						</div>
						<b-progress :type="totalPercent | getProgressType" :value="totalPercent" class="mt-2"
						            size="is-small"></b-progress>
					</div>
				</div>
			</div>
		</div>
		<!-- Disk Info End -->
		<!-- Usb Disk List Start -->
		<div v-if="usbDisks.length > 0" class="widget has-text-white disk is-relative">
			<div class="blur-background"></div>
			<div class="widget-content">
				<div class="columns is-mobile is-multiline pt-2 ">
					<div v-for="(item) in usbDisks" :key="'usb_' + item.name" class="column is-full pb-1">
						<div class="is-flex">
							<div class="header-icon is-flex-shrink-0">
								<b-image :src="require('@/assets/img/storage/USB.svg')" class="is-68x68"></b-image>
							</div>
							<div class="ml-3 is-flex-grow-1 ">
								<h4 class="title is-size-14px mb-2 mt-1 has-text-left has-text-white one-line ">
									{{ item.model }}</h4>
								<p class="has-text-left is-size-14px mt-1 ">
									<span class="op65">{{ $t('Used') }}:</span> {{ renderSize(item.size - item.avail) }}
									<br>
									<span class="op65"> {{ $t('Total') }}:</span> {{ renderSize(item.size) }}
								</p>
							</div>
						</div>
						<b-progress :type="(Math.floor((item.size - item.avail) * 100 / item.size)) | getProgressType"
						            :value="Math.floor((item.size - item.avail) * 100 / item.size)" class="mt-2"
						            size="is-small"></b-progress>
					</div>
				</div>
			</div>
		</div>

		<!-- Usb Disk List End -->
	</div>

</template>

<script>
import StorageManagerPanel from '@/components/Storage/StorageManagerPanel.vue'
import {mixin} from '../mixins/mixin';

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'disks',
	icon: "harddisk",
	title: "Storage Status",
	initShow: true,
	mixins: [mixin],

	data() {
		return {
			totalSize: 0,
			totalUsed: 0,
			totalPercent: 0,
			health: "Healthy",
			usbDisks: []
		}
	},

	mounted() {
		this.getDiskInfo(this.$store.state.hardwareInfo.sys_disk)
		this.usbDisks = this.$store.state.hardwareInfo.sys_usb
	},
	methods: {
		getDiskInfo(diskInfo) {
			this.totalSize = diskInfo.size
			this.totalUsed = diskInfo.used
			this.totalPercent = 100 - Math.floor(diskInfo.avail * 100 / this.totalSize)
			this.health = diskInfo.health
		},

		showDiskManagement() {
			this.$messageBus('widget_storagemanager');
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
		},
	},
	sockets: {
		sys_disk(data) {
			this.getDiskInfo(data.data)
		},
		sys_usb(data) {
			this.usbDisks = data.data
		},
		"casaos:system:utilization"(res) {
			let data = res.Properties
			// DISK
			this.getDiskInfo(JSON.parse(data.sys_disk))
			// USB
			this.usbDisks = JSON.parse(data.sys_usb)
		}
	}
}
</script>

<style lang="scss">
.disk {
	.progress {
		border-radius: 6px;
		height: 12px;

		&::-webkit-progress-bar {
			background: rgba(172, 184, 195, 0.4);
		}

		&::-webkit-progress-value {
			opacity: 1;
		}
	}

	.tag {
		height: 1.125rem;
		border-radius: 2px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
}
</style>
